export type IconEnum =
  | "item"
  | "brand"
  | "category"
  | "stock"
  | "price"
  | "phone"
  | "address";
export type TransactionStatusEnum = "pending" | "delivered" | "cancelled";
export type TransactionData = {
  customer_id: number;
  products: {
    product_id: number;
    quantity: number;
    // status: "pending" | "delivered" | "cancelled";
  }[];
};

export const TRANSACTION_STATUS = ["pending", "delivered", "cancelled"];

export interface Product {
  id?: number;
  name: string;
  brand: string;
  category: string;
  stock: number;
  price: number;
}

export interface Customer {
  id?: number;
  name: string;
  phone: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransactionItem {
  product: string;
  productId?: string;
  quantity: number;
  brand: string;
  // status: TransactionStatusEnum;
  priceAtPurchase: string;
  total: number;
}

export interface Transaction {
  id?: number;
  transactionNum: string;
  items: TransactionItem[]
  customer: string;
  customerPhone?: string | null;
  customerAddress?: string | null;
  customerId?: string;
  grandTotal?: number;
  createdAt?: string;
  updatedAt?: string;
}
