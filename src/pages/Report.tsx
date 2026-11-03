import { useEffect, useMemo, useState } from "react";
import { Product, Transaction } from "../types/common";
import { formatCurrency } from "../utils/mathUtils";
import { formatDateTime } from "../utils/datesUtil";
import * as XLSX from "xlsx";

type DashboardStats = {
  totalSales: number;
  totalTransactions: number;
  totalProducts: number;
  lowStockCount: number;
};

export default function Report() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [customerFilter, setCustomerFilter] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const [transactionData, productData] = await Promise.all([
      window.api.transactions.getAll(),
      window.api.products.getAll(),
    ]);

    setTransactions(transactionData);
    setProducts(productData);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      if (!transaction.createdAt) return false;

      const date = new Date(transaction.createdAt);
      if (Number.isNaN(date.getTime())) return false;

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const matchesMonth = `${year}-${month}` === selectedMonth;

      const matchesCustomer = customerFilter.trim()
        ? transaction.customer
            ?.toLowerCase()
            .includes(customerFilter.trim().toLowerCase())
        : true;

      return matchesMonth && matchesCustomer;
    });
  }, [transactions, selectedMonth, customerFilter]);

  const stats: DashboardStats = useMemo(() => {
    const totalSales = filteredTransactions.reduce(
      (sum, transaction) => sum + Number(transaction.grandTotal ?? 0),
      0,
    );
    console.log('filteredTransactions', filteredTransactions)
    const lowStockProducts = products.filter(
      (product) => Number(product.stock ?? 0) <= 5,
    );

    return {
      totalSales,
      totalTransactions: filteredTransactions.length,
      totalProducts: products.length,
      lowStockCount: lowStockProducts.length,
    };
  }, [filteredTransactions, products]);

  // const lowStockProducts = useMemo(() => {
  //   return products
  //     .filter((product) => Number(product.stock ?? 0) <= 5)
  //     .slice(0, 5);
  // }, [products]);

  const customerOptions = useMemo(() => {
    const unique = new Set(transactions.map((t) => t.customer).filter(Boolean));
    return Array.from(unique);
  }, [transactions]);

  const filteredCustomerOptions = useMemo(() => {
    return customerOptions.filter((customer) =>
      customer.toLowerCase().includes(customerFilter.toLowerCase()),
    );
  }, [customerOptions, customerFilter]);

  const reportRows = useMemo(() => {
    console.log("filteredTransactions", filteredTransactions);
    return filteredTransactions.flatMap((transaction) =>
      (transaction.items ?? []).map((item) => ({
        transactionNum: transaction.transactionNum,
        customer: transaction.customer,
        address: transaction.customerAddress,
        createdAt: transaction.createdAt,
        product: item.product,
        brand: item.brand,
        quantity: item.quantity,
        price: Number(item.priceAtPurchase ?? 0),
        total: Number(item.total ?? 0),
      })),
    );
  }, [filteredTransactions]);

 const exportToExcel = () => {
  const rows = reportRows.map((row) => ({
    "Transaction #": row.transactionNum,
    Customer: row.customer ?? "",
    Address: row.address ?? "",
    Product: row.product ?? "",
    Brand: row.brand ?? "",
    Quantity: row.quantity,
    Price: row.price,
    Total: row.total,
    Date: row.createdAt ? formatDateTime(row.createdAt) : "",
  }));

  const worksheet = XLSX.utils.json_to_sheet([]);

  // Header
  XLSX.utils.sheet_add_aoa(worksheet, [
  ["TRANSACTION REPORT"],
  [],
  ["MONTH", selectedMonth, "", "", "", "TOTAL SALES", formatCurrency(stats.totalSales)],
  [
    "CUSTOMER",
    customerFilter || "All Customers",
    "",
    "",
    "",
    "TRANSACTIONS",
    stats.totalTransactions,
  ],
  [
    "GENERATED",
    formatDateTime(new Date().toISOString()),
  ],
  [],
]);
  // Table starts at row 7
  XLSX.utils.sheet_add_json(worksheet, rows, {
  origin: "A8",
});

  worksheet["!cols"] = [
    { wch: 18 },
    { wch: 25 },
    { wch: 40 },
    { wch: 25 },
    { wch: 18 },
    { wch: 10 },
    { wch: 12 },
    { wch: 12 },
    { wch: 20 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

  XLSX.writeFile(
    workbook,
    `Transaction_Report_${selectedMonth}.xlsx`
  );
};

  return (
    <div className="h-full w-full">
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
              <p className="mt-1 text-sm text-gray-500">
                View inventory and transaction reports.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
              <div className="w-full md:w-64">
                <label
                  htmlFor="monthFilter"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Filter by month
                </label>
                <input
                  id="monthFilter"
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="relative w-full md:w-64">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Filter by customer
                </label>

                <input
                  type="text"
                  value={customerFilter}
                  onChange={(e) => {
                    setCustomerFilter(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Search or select customer..."
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                />

                {showDropdown && (
                  <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl border bg-white shadow">
                    {filteredCustomerOptions.length > 0 ? (
                      filteredCustomerOptions.map((customer, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setCustomerFilter(customer);
                            setShowDropdown(false);
                          }}
                          className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
                        >
                          {customer}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        No results
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <label className="mb-2 invisible text-sm font-medium">
                  Export
                </label>

                <button
                  onClick={exportToExcel}
                  className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  Export Excel
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          <StatCard
            title="Sales"
            value={formatCurrency(stats.totalSales)}
            subtitle="Total sales based on filters"
          />
          <StatCard
            title="Transactions"
            value={String(stats.totalTransactions)}
            subtitle="Transactions based on filters"
          />
        </div>

        <div className="grid grid-cols-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Transaction Reports
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                All transactions based on the selected filters.
              </p>
            </div>

            <div className="mt-5 overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full min-w-[700px]">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-4 py-3">Transaction #</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Address</th>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Brand</th>
                    <th className="px-4 py-3 text-right">Qty</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {reportRows.length > 0 ? (
                    reportRows.map((row, index) => (
                      <tr
                        key={`${row.transactionNum}-${row.product}-${index}`}
                        className="border-t border-gray-200 text-sm text-gray-700"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {row.transactionNum}
                        </td>
                        <td className="px-4 py-3">{row.customer ?? "-"}</td>
                        <td className="px-4 py-3">{row.address ?? "-"}</td>
                        <td className="px-4 py-3">{row.product ?? "-"}</td>
                        <td className="px-4 py-3">{row.brand ?? "-"}</td>
                        <td className="px-4 py-3 text-right">{row.quantity}</td>
                        <td className="px-4 py-3 text-right">
                          {formatCurrency(row.price)}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900">
                          {formatCurrency(row.total)}
                        </td>
                        <td className="px-4 py-3">
                          {row.createdAt ? formatDateTime(row.createdAt) : "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-8 text-center text-sm text-gray-500"
                      >
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: string;
  subtitle: string;
};

function StatCard({ title, value, subtitle }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
    </div>
  );
}

function getCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}
