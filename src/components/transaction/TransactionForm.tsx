import { Customer, Product } from "../../types/common";
import {
  TransactionFormProduct,
  TransactionForm as TransactionFormType,
} from "../../types/transaction";
import { AddIcon, DeleteIcon } from "../icons/Svg";
import Input from "../input/Input";

import React from "react";

type TransactionFormProps = {
  form: TransactionFormType;
  customers: Customer[];
  products: Product[];
  errors: string[];
  children?: React.ReactNode;
  addItem: () => void;
  removeItem: (index: number) => void;
  updateItem: (
    index: number,
    field: keyof TransactionFormProduct,
    value: string | number,
  ) => void;
  updateForm: <K extends keyof TransactionFormType>(
    field: K,
    value: TransactionFormType[K],
  ) => void;
};

export default function TransactionFormComponent({
  form,
  customers,
  products,
  addItem,
  updateItem,
  removeItem,
  updateForm,
  errors,
  children,
}: TransactionFormProps) {
  return (
    <form className="flex h-full w-full flex-col">
      <div className="flex-1 space-y-6 overflow-y-auto px-1 py-1">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900">
              Transaction Details
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Select a customer and add one or more products.
            </p>
          </div>

          <Input
            label="Customer"
            icon="item"
            required
            value={form.customer}
            onChange={(value) => updateForm("customer", value)}
            variant="select"
            options={customers.map((customer) => ({
              label: customer.name,
              value: customer.id!,
            }))}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="pl-2">
              <h3 className="text-base font-semibold text-gray-900">
                Products
              </h3>
              <p className="text-sm text-gray-500">
                Add the items included in this transaction.
              </p>
            </div>

            <button
              type="button"
              onClick={addItem}
              className="rounded-lg p-2 text-blue-500 transition hover:bg-blue-50 hover:text-blue-600"
            >
              <AddIcon className="w-4 h-4" />
            </button>
          </div>

          {form.products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center">
              <p className="text-sm font-medium text-gray-700">
                No products added yet
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Click “+” to start building this transaction.
              </p>
            </div>
          ) : (
            form.products.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      Product {index + 1}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Fill in the item details below.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <DeleteIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <Input
                    icon="brand"
                    label="Product"
                    variant="select"
                    value={item.product}
                    onChange={(value) => updateItem(index, "product", value)}
                    options={products.map((product) => ({
                      label: `${product.name}-${product.brand}`,
                      value: product.id!,
                    }))}
                  />
{/* 
                  <Input
                    icon="brand"
                    label="Status"
                    variant="select"
                    value={item.status}
                    onChange={(value) => updateItem(index, "status", value)}
                    options={TRANSACTION_STATUS.map((status) => ({
                      label: status,
                      value: status,
                    }))}
                  /> */}

                  <Input
                    icon="stock"
                    label="Quantity"
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(value) => {
                      if (value === "") {
                        updateItem(index, "quantity", "");
                        return;
                      }

                      const num = Number(value);

                      if (num < 0) return;

                      updateItem(index, "quantity", num);
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {errors.length > 0 && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-semibold text-red-700">
              Please fix the following:
            </p>
            <div className="mt-2 space-y-1">
              {errors.map((error, index) => (
                <div key={index} className="text-sm text-red-600">
                  • {error}
                </div>
              ))}
            </div>
          </div>
        )}
        {children}
      </div>
    </form>
  );
}
