import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Customer, Product, Transaction } from "../../types/common";
import type {
  TransactionForm as TransactionFormType,
  TransactionFormProduct,
} from "../../types/transaction";
import TransactionFormComponent from "../transaction/TransactionForm";
import { formatDateTime } from "../../utils/datesUtil";
import { formatCurrency, mapSum } from "../../utils/mathUtils";
import { handlePreview } from "../../html/printTransaction";
import { ADDRESS, APP_NAME, CONTACT } from "../../utils/commonUtil";

type TransactionModalProps = {
  isOpen: boolean;
  transaction: Transaction | null;
  title?: string;
  customers?: Customer[];
  products?: Product[];
  errors: string[];
  onSave: (updatedTransaction: TransactionFormType) => void;
  onCancel: () => void;
};

export default function TransactionModal({
  isOpen,
  transaction,
  title = "Transaction Information",
  customers = [],
  products = [],
  errors: updateError,
  onSave,
  onCancel,
}: TransactionModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState<TransactionFormType>({
    customer: "",
    products: [],
  });

  const toFormData = (transaction: Transaction | null): TransactionFormType => {
    if (!transaction) {
      return {
        customer: "",
        products: [],
      };
    }

    return {
      customer: String(transaction.customerId),
      products: transaction.items.map((item) => ({
        product: String(item.productId),
        quantity: item.quantity,
        // status: item.status,
      })),
    };
  };

  useEffect(() => {
    setFormData(toFormData(transaction));
    setErrors([]);
    setIsEditing(false);
  }, [transaction, isOpen]);

  const updateForm = <K extends keyof TransactionFormType>(
    field: K,
    value: TransactionFormType[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        { product: "", quantity: 0, status: "pending" },
      ],
    }));
  };

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const updateItem = (
    index: number,
    field: keyof TransactionFormProduct,
    value: string | number
  ) => {
    setFormData((prev) => {
      const nextProducts = [...prev.products];
      nextProducts[index] = {
        ...nextProducts[index],
        [field]: value,
      };

      return {
        ...prev,
        products: nextProducts,
      };
    });
  };

  const handleCancelEdit = () => {
    setFormData(toFormData(transaction));
    setErrors([]);
    setIsEditing(false);
  };

  const validate = () => {
    const nextErrors: string[] = [];

    if (!formData.customer) nextErrors.push("Customer is required");
    if (formData.products.length === 0) {
      nextErrors.push("Add at least one product");
    }

    formData.products.forEach((item, index) => {
      if (!item.product) nextErrors.push(`Product ${index + 1} is required`);
      if (!item.quantity) nextErrors.push(`Quantity ${index + 1} is required`);
    });

    setErrors(nextErrors);
    return nextErrors.length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    await onSave(formData);
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <div
              className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between border-b border-gray-100 bg-gray-50/80 px-6 py-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {isEditing
                      ? "Edit the transaction details below."
                      : "Review the transaction receipt below."}
                  </p>
                </div>

                {!isEditing ? (
                  <button
                    type="button"
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </button>
                ) : (
                  <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600">
                    Editing
                  </span>
                )}
              </div>

              {isEditing ? (
                <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
                  <TransactionFormComponent
                    form={formData}
                    customers={customers}
                    products={products}
                    errors={[...errors, ...updateError]}
                    addItem={addItem}
                    removeItem={removeItem}
                    updateItem={updateItem}
                    updateForm={updateForm}
                  />
                </div>
              ) : (
                <div className="max-h-[70vh] overflow-y-auto bg-[#f8f5ee] px-6 py-5">
                  <div className="mx-auto w-full max-w-xl rounded-2xl border border-[#e7dcc7] bg-white p-6 shadow-sm">
                    <div className="border-b border-dashed border-black-300 pb-4 text-center">
                      <h2 className="text-xl font-bold tracking-wide text-gray-900">
                        {APP_NAME}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {ADDRESS}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {CONTACT}
                      </p>
                    </div>

                    <div className="mt-4 space-y-3 border-b border-dashed border-black-300 pb-4 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-500">Transaction #</span>
                        <span className="text-right font-medium text-gray-900">
                          {transaction?.transactionNum || "-"}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-gray-500">Date</span>
                        <span className="text-right font-medium text-gray-900">
                          {transaction?.createdAt ? formatDateTime(transaction?.createdAt) : "-"}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-gray-500">Customer</span>
                        <span className="text-right font-medium text-gray-900">
                          {transaction?.customer || "-"}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-gray-500">Contact</span>
                        <span className="text-right font-medium text-gray-900">
                          {transaction?.customerPhone || "-"}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-gray-500">Address</span>
                        <span className="text-right font-medium text-gray-900">
                          {transaction?.customerAddress || "-"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="mb-2 grid grid-cols-12 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        <div className="col-span-5">Item</div>
                        <div className="col-span-2 text-center">Qty</div>
                        <div className="col-span-2 text-right">Price</div>
                        <div className="col-span-3 text-right">Total</div>
                      </div>

                      <div className="space-y-3">
                        {transaction?.items?.map((item, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-12 items-start border-b border-dotted border-gray-200 pb-3 text-sm"
                          >
                            <div className="col-span-5 pr-2">
                              <p className="font-medium text-gray-900">
                                {`${item.product} ${item.brand}` || "-"}
                              </p>
                              {/* <p className="mt-1 text-xs capitalize text-gray-500">
                                Status: {item.status || "-"}
                              </p> */}
                            </div>

                            <div className="col-span-2 text-center text-gray-700">
                              {item.quantity ?? "-"}
                            </div>

                            <div className="col-span-2 text-right text-gray-700">
                              {formatCurrency(+item.priceAtPurchase)}
                            </div>

                            <div className="col-span-3 text-right font-medium text-gray-900">
                              {formatCurrency(item.total)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 border-t border-dashed border-black-300 pt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Total Items</span>
                        <span className="font-medium text-gray-900">
                          {mapSum(transaction?.items, 'quantity')}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-lg font-bold text-gray-900">
                        <span>Total Amount</span>
                        <span>{formatCurrency(transaction?.grandTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 border-t border-gray-100 bg-white px-6 py-4">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                      onClick={handleCancelEdit}
                    >
                      Cancel Edit
                    </button>
                    <button
                      type="button"
                      className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                      onClick={handleSave}
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                      onClick={onCancel}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePreview(transaction)}
                      className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                      Preview
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}