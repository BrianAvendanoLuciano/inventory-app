export type Product = {
  name: string;
  brand: string;
  category: string;
  stock: number;
  price: number;
};

let db: any;

export function initProductRepo(database: any) {
  db = database;
}

export const ProductRepo = {
  getAll() {
    return db.prepare("SELECT * FROM products").all();
  },

  create(product: Product) {
    return db
      .prepare(
        `
      INSERT INTO products (name, brand, category, stock, price)
      VALUES (@name, @brand, @category, @stock, @price)
    `,
      )
      .run(product);
  },

  update(id: number, product: Product) {
    return db
      .prepare(
        `
      UPDATE products
      SET name = @name,
          brand = @brand,
          category = @category,
          stock = @stock,
          price = @price
      WHERE id = @id
    `,
      )
      .run({ ...product, id });
  },

  delete(id: number) {
    return db.prepare("DELETE FROM products WHERE id = ?").run(id);
  },
};
