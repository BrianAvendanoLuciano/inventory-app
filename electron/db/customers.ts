export type Customer = {
  name: string;
  phone: string;
  address: string;
};

let db: any;

export function initCustomerRepo(database: any) {
  db = database;
}

export const CustomerRepo = {
  getAll() {
    return db.prepare("SELECT * FROM customers").all();
  },

  create(product: Customer) {
    return db
      .prepare(
        `
      INSERT INTO customers (name, phone, address)
      VALUES (@name, @phone, @address)
    `,
      )
      .run(product);
  },

  update(id: number, product: Customer) {
    return db
      .prepare(
        `
      UPDATE customers
      SET name = @name,
          phone = @phone,
          address = @address
      WHERE id = @id
    `,
      )
      .run({ ...product, id });
  },

  delete(id: number) {
    return db.prepare("DELETE FROM customers WHERE id = ?").run(id);
  },
};
