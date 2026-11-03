// import { TransactionStatusEnum } from "./common";

export type TransactionFormProduct = {
  product: string;
  quantity: any;
  // status: TransactionStatusEnum;
};

export type TransactionForm = {
  customer: string;
  products: TransactionFormProduct[];
};

