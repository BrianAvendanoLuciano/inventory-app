export type Transaction = {
  product_id: number;
  customer_id: number;
  quantity: number;
  price_at_purchase: number;
  total: number;
};

export type TransactionItem = {
  product_id: number;
  quantity: number;
};

export type TransactionCreate = {
  customer_id: number;
  products: TransactionItem[];
};

export type TransactionUpdateItem = {
  product_id: number;
  quantity: number;
};

export type TransactionUpdate = {
  transaction_num: string;
  customer_id: number;
  products: TransactionUpdateItem[];
};

let db: any;

export function initTransactionRepo(database: any) {
  db = database;
}

export const TransactionRepo = {
  getAll() {
    const rows = db
      .prepare(
        `
        SELECT
          t.transaction_num as transactionNum,
          t.customer_id as customerId,
          c.name as customer,
          c.phone as customerPhone,
          c.address as customerAddress,
          MIN(t.created_at) as createdAt,
          MAX(t.updated_at) as updatedAt,
          SUM(t.total) as grandTotal,

          json_group_array(
            json_object(
              'productId', t.product_id,
              'product', p.name,
              'brand', p.brand,
              'quantity', t.quantity,
              'priceAtPurchase', t.price_at_purchase,
              'total', t.total
            )
          ) as items

        FROM transactions t
        JOIN products p ON p.id = t.product_id
        JOIN customers c ON c.id = t.customer_id

        GROUP BY t.transaction_num, t.customer_id, c.name
        ORDER BY createdAt DESC
        `
      )
      .all();

    return rows.map((row: any) => ({
      ...row,
      items: JSON.parse(row.items),
    }));
  },

  createBulk(data: TransactionCreate) {
    const transactionNum = Date.now().toString();

    const insert = db.prepare(`
      INSERT INTO transactions
      (
        transaction_num,
        product_id,
        customer_id,
        quantity,
        price_at_purchase,
        total
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const getProduct = db.prepare(`
      SELECT price, name, stock
      FROM products
      WHERE id = ?
    `);

    const updateStock = db.prepare(`
      UPDATE products
      SET stock = stock - ?,
          updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const trx = db.transaction((products: TransactionItem[]) => {
      for (const item of products) {
        const product = getProduct.get(item.product_id);

        if (!product) {
          throw new Error("Product not found");
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product "${product.name}"`);
        }

        const price = Number(product.price);
        const total = price * item.quantity;

        updateStock.run(item.quantity, item.product_id);

        insert.run(
          transactionNum,
          item.product_id,
          data.customer_id,
          item.quantity,
          price,
          total
        );
      }
    });

    trx(data.products);

    return { transaction_num: transactionNum };
  },

  updateBulk(data: TransactionUpdate) {
    const getExisting = db.prepare(`
      SELECT product_id, quantity
      FROM transactions
      WHERE transaction_num = ?
    `);

    const getOriginalCreatedAt = db.prepare(`
      SELECT MIN(created_at) as createdAt
      FROM transactions
      WHERE transaction_num = ?
    `);

    const restoreStock = db.prepare(`
      UPDATE products
      SET stock = stock + ?,
          updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const deleteExisting = db.prepare(`
      DELETE FROM transactions
      WHERE transaction_num = ?
    `);

    const getProduct = db.prepare(`
      SELECT price, stock, name
      FROM products
      WHERE id = ?
    `);

    const deductStock = db.prepare(`
      UPDATE products
      SET stock = stock - ?,
          updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const insert = db.prepare(`
      INSERT INTO transactions
      (
        transaction_num,
        product_id,
        customer_id,
        quantity,
        price_at_purchase,
        total,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    const trx = db.transaction(() => {
      const existingRows = getExisting.all(data.transaction_num);

      if (!existingRows.length) {
        throw new Error("Transaction not found");
      }

      const originalCreatedAt =
        getOriginalCreatedAt.get(data.transaction_num)?.createdAt;

      if (!originalCreatedAt) {
        throw new Error("Original created_at not found");
      }

      for (const row of existingRows) {
        restoreStock.run(row.quantity, row.product_id);
      }

      deleteExisting.run(data.transaction_num);

      for (const item of data.products) {
        const product = getProduct.get(item.product_id);

        if (!product) {
          throw new Error(`Product ${item.product_id} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product "${product.name}"`);
        }

        const price = Number(product.price);
        const total = price * item.quantity;

        deductStock.run(item.quantity, item.product_id);

        insert.run(
          data.transaction_num,
          item.product_id,
          data.customer_id,
          item.quantity,
          price,
          total,
          originalCreatedAt
        );
      }
    });

    trx();

    return { transaction_num: data.transaction_num };
  },

  delete(id: string) {
    return db
      .prepare("DELETE FROM transactions WHERE transaction_num = ?")
      .run(id);
  },
};