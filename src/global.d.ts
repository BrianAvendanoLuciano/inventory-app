import { Customer, Product, Transaction, TransactionData } from "./types/common";

declare global {
  interface Window {
    api: {
      products: {
        getAll: () => Promise<Product[]>;
        create: (product: Product) => Promise<void>;
        update: (id: number, product: Product) => Promise<void>;
        delete: (id: number) => Promise<void>;
      };
      customers: {
        getAll: () => Promise<Customer[]>;
        create: (customer: Customer) => Promise<void>;
        update: (id: number, customer: Customer) => Promise<void>;
        delete: (id: number) => Promise<void>;
      };
      transactions: {
        getAll: () => Promise<Transaction[]>;
        createBulk: (data: TransactionData) => Promise<{ transaction_num: number }>;
        updateBulk: (data: TransactionData) => Promise<{ transaction_num: number }>;
        updateStatus: (
          id: number,
          status: "pending" | "delivered" | "cancelled",
        ) => Promise<void>;

        delete: (id: string) => Promise<void>;
      };
    };
  }
}
