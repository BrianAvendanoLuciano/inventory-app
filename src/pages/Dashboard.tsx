import { useEffect, useMemo, useState } from "react";
import { Product, Transaction } from "../types/common";
import { formatCurrency } from "../utils/mathUtils";
import { formatDateTime } from "../utils/datesUtil";
import { Column } from "../utils/commonUtil";
import Table from "../components/table/Table";

type DashboardStats = {
  totalSales: number;
  totalTransactions: number;
  totalProducts: number;
  lowStockCount: number;
};

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

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
      return `${year}-${month}` === selectedMonth;
    });
  }, [transactions, selectedMonth]);

  const stats: DashboardStats = {
    totalSales: filteredTransactions.reduce(
      (sum, transaction) => sum + Number(transaction.grandTotal ?? 0),
      0,
    ),
    totalTransactions: filteredTransactions.length,
    totalProducts: products.length,
    lowStockCount: products.filter((product) => Number(product.stock ?? 0) <= 5)
      .length,
  };

  const lowStockProducts = products
    .filter((product) => Number(product.stock ?? 0) <= 5)
    .slice(0, 5);

  const recentTransactions = filteredTransactions.slice(0, 5);

  const transactionColumns: Column<Transaction>[] = [
    {
      id: "transactionNum",
      header: "Transaction #",
      accessor: (transaction: Transaction) => (
        <span className="font-medium text-gray-900">
          {transaction.transactionNum}
        </span>
      ),
    },
    {
      id: "customer",
      header: "Customer",
      accessor: (transaction: Transaction) => transaction.customer,
    },
    {
      id: "date",
      header: "Date",
      accessor: (transaction: Transaction) =>
        formatDateTime(transaction.createdAt),
    },
    {
      id: "total",
      header: "Total",
      headerClassName: "text-right",
      className: "text-right font-medium text-gray-900",
      accessor: (transaction: Transaction) =>
        formatCurrency(transaction.grandTotal ?? 0),
    },
  ];

  const productColumns: Column<Product>[] = [
    {
      id: "name",
      header: "Product",
      accessor: (product) => (
        <span className="font-medium text-gray-900">{product.name}</span>
      ),
    },
    {
      id: "stock",
      header: "Stock",
      accessor: (product) => product.stock,
    },
    {
      id: "price",
      header: "Price",
      headerClassName: "text-right",
      className: "text-right",
      accessor: (product) => formatCurrency(Number(product.price ?? 0)),
    },
  ];

  return (
    <div className="h-full w-full">
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Overview of your inventory and transaction activity.
              </p>
            </div>

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
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Monthly Sales"
            value={formatCurrency(stats.totalSales)}
            subtitle="Total sales for selected month"
          />
          <StatCard
            title="Transactions"
            value={String(stats.totalTransactions)}
            subtitle="Transactions for selected month"
          />
          <StatCard
            title="Products"
            value={String(stats.totalProducts)}
            subtitle="Products in inventory"
          />
          {/* <StatCard
            title="Low Stock"
            value={String(stats.lowStockCount)}
            subtitle="Products with 5 or less stock"
          /> */}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Transactions
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Latest transactions for the selected month.
                </p>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-xl border border-gray-200">
              <Table
                data={recentTransactions}
                columns={transactionColumns}
                getRowKey={(transaction, index) =>
                  transaction.transactionNum ?? index
                }
                emptyMessage="No transactions found for this month."
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Low Stock Alerts
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Products that may need restocking soon.
            </p>

            <div className="mt-4 space-y-3">
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((product, index) => (
                  <div
                    key={product.id ?? index}
                    className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        SKU: {product.id ?? "-"}
                      </p>
                    </div>

                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                      {product.stock} left
                    </span>
                  </div>
                ))
              ) : (
                <div className="rounded-xl bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                  No low stock products.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Inventory</h2>
          <p className="mt-1 text-sm text-gray-500">
            Quick look at your current product list.
          </p>

          <div className="mt-5 overflow-hidden rounded-xl border border-gray-200">
            <Table
              data={products.slice(0, 5)}
              columns={productColumns}
              getRowKey={(product, index) => product.id ?? index}
              emptyMessage="No products found."
            />
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
