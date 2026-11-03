import { useEffect, useMemo, useState } from "react";
import TransactionHistory from "../components/transaction/TransactionHistory";
import DateRangePicker from "../components/input/DateRangePicker";
import { Customer, Product, Transaction } from "../types/common";
import SlideOver from "../components/panels/SlideOver";
import ConfirmModal from "../components/modal/ConfirmModal";
import TransactionModal from "../components/modal/TransactionModal";
import { TransactionForm, TransactionFormProduct } from "../types/transaction";
import TransactionFormComponent from "../components/transaction/TransactionForm";
import { handlePreview } from "../html/printTransaction";
import { handlePreviewThermal } from "../html/thermalTransaction";

const initialForm: TransactionForm = {
  customer: "",
  products: [],
};

export default function Transactions() {
  const [open, setOpen] = useState(false);
  const [openTransaction, setOpenTransaction] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [errors, setErrors] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [form, setForm] = useState<TransactionForm>(initialForm);

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setErrors([]);
    setIsEditing(false);
    setSelectedTransactionId(null);
  };

  const handleCloseSlideOver = () => {
    setOpen(false);
    resetForm();
  };

  const openSlideOver = () => {
    setOpen(true);
  };

  const onDeleteClick = (id: string) => {
    setSelectedTransactionId(id);
    setConfirmOpen(true);
  };

  const onViewClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setOpenTransaction(true);
  };

  const handleCancelView = () => {
    setOpenTransaction(false);
    setSelectedTransaction(null);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setSelectedTransactionId(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTransactionId) return;

    await window.api.transactions.delete(selectedTransactionId);
    setConfirmOpen(false);
    setSelectedTransactionId(null);
    load();
  };

  const updateForm = <K extends keyof TransactionForm>(
    field: K,
    value: TransactionForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          product: "",
          quantity: "",
          status: "pending",
        },
      ],
    }));
  };

  const removeItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const updateItem = (
    index: number,
    field: keyof TransactionFormProduct,
    value: string | number,
  ) => {
    setForm((prev) => {
      const nextProducts = [...prev.products];
      nextProducts[index] = {
        ...nextProducts[index],
        [field]: value,
      } as TransactionFormProduct;

      return {
        ...prev,
        products: nextProducts,
      };
    });
  };

  const validate = () => {
    const nextErrors: string[] = [];

    if (!form.customer) {
      nextErrors.push("Customer is required");
    }

    if (form.products.length === 0) {
      nextErrors.push("Add at least one product");
    }

    form.products.forEach((item, index) => {
      if (!item.product) nextErrors.push(`Product ${index + 1} is required`);
      if (!item.quantity) nextErrors.push(`Quantity ${index + 1} is required`);
    });

    setErrors(nextErrors);
    return nextErrors.length === 0;
  };

  const createTransaction = async () => {
    if (!validate()) return;

    const payload = {
      customer_id: Number(form.customer),
      products: form.products.map((item) => ({
        product_id: Number(item.product),
        quantity: item.quantity,
        // status: item.status,
      })),
    };

    try {
      setErrors([]);

      await window.api.transactions.createBulk(payload);
      await load();
      handleCloseSlideOver();
    } catch (error: any) {
      const descriptiveError = error?.message?.split(':')[3]
      let message = descriptiveError || error?.message || "Error: Unable to update transaction";


      setErrors([message]);
    }
  };

  const updateTransaction = async (form: TransactionForm) => {
    const payload = {
      transaction_num: selectedTransaction?.transactionNum,
      customer_id: Number(form.customer),
      products: form.products.map((item) => ({
        product_id: Number(item.product),
        quantity: item.quantity,
        // status: item.status,
      })),
    };

    try {
      setErrors([]);

      await window.api.transactions.updateBulk(payload);
      await load();

      const updatedTransactions = await window.api.transactions.getAll();
      setTransactions(updatedTransactions);

      const updatedSelectedTransaction =
        updatedTransactions.find(
          (t: Transaction) =>
            t.transactionNum === selectedTransaction?.transactionNum,
        ) ?? null;

      setSelectedTransaction(updatedSelectedTransaction);
    } catch (error: any) {
      const descriptiveError = error?.message?.split(':')[3]
      let message = descriptiveError || error?.message || "Error: Unable to update transaction";

      setErrors([message]);
    }
  };

  const load = async () => {
    const [transactionData, customerData, productData] = await Promise.all([
      window.api.transactions.getAll(),
      window.api.customers.getAll(),
      window.api.products.getAll(),
    ]);

    setTransactions(transactionData);
    setCustomers(customerData);
    setProducts(productData);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const customerName = (transaction.customer || "").toLowerCase();
      const keyword = searchTerm.trim().toLowerCase();

      const matchesCustomer = !keyword || customerName.includes(keyword);

      const transactionDate = new Date(transaction.createdAt!);
      const transactionTime = transactionDate.getTime();

      const fromTime = from ? new Date(`${from}T00:00:00`).getTime() : null;
      const toTime = to ? new Date(`${to}T23:59:59.999`).getTime() : null;

      const matchesFrom = fromTime === null || transactionTime >= fromTime;
      const matchesTo = toTime === null || transactionTime <= toTime;

      return matchesCustomer && matchesFrom && matchesTo;
    });
  }, [transactions, searchTerm, from, to]);

  return (
    <>
      <div className="h-full w-full">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Transaction Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and review all transaction records.
              </p>
            </div>

            <button
              type="button"
              onClick={openSlideOver}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Transaction
            </button>
          </div>

          <div className="space-y-4">
            <DateRangePicker
              from={from}
              to={to}
              onFromChange={setFrom}
              onToChange={setTo}
            />

            <div className="relative w-full">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m1.6-4.65a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search customer name..."
                className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <TransactionHistory
              transactions={filteredTransactions}
              onDelete={onDeleteClick}
              onView={onViewClick}
              onPrint={handlePreview}
              onPrintThermal={handlePreviewThermal}
            />
          </div>
        </div>
      </div>

      <SlideOver
        padding="2"
        isOpen={open}
        onClose={handleCloseSlideOver}
        title={isEditing ? "Edit Transaction" : "Add Transaction"}
      >
        <TransactionFormComponent
          form={form}
          customers={customers}
          products={products}
          addItem={addItem}
          updateItem={updateItem}
          removeItem={removeItem}
          updateForm={updateForm}
          errors={errors}
        >
          <div className="mt-2 border-t border-gray-200 py-2">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseSlideOver}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={createTransaction}
                className="rounded-xl bg-green-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-green-700"
              >
                {isEditing ? "Save Changes" : "Save Transaction"}
              </button>
            </div>
          </div>
        </TransactionFormComponent>
      </SlideOver>

      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <TransactionModal
        isOpen={openTransaction}
        title="Transaction Information"
        transaction={selectedTransaction}
        customers={customers}
        products={products}
        onSave={updateTransaction}
        onCancel={handleCancelView}
        errors={errors}
      />
    </>
  );
}
