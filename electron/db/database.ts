import { app } from "electron";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export function createDatabase() {
  const Database = require("better-sqlite3");

  const dbPath = path.join(app.getPath("userData"), "inventory.db");

  const db = new Database(dbPath);
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      brand TEXT,
      category TEXT,
      stock INTEGER DEFAULT 0,
      price REAL DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      transaction_num TEXT NOT NULL,

      product_id INTEGER NOT NULL,
      customer_id INTEGER NOT NULL,

      quantity INTEGER NOT NULL,
      price_at_purchase REAL NOT NULL,
      total REAL NOT NULL,

      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,

      UNIQUE(transaction_num, product_id)
    );

    CREATE INDEX IF NOT EXISTS idx_transactions_transaction_num
    ON transactions(transaction_num);
  `);
    // status TEXT NOT NULL CHECK(status IN ('pending','delivered','cancelled')),
  return db;
}
