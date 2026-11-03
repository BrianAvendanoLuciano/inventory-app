import React, { useEffect, useMemo, useState } from "react";
import { Transaction, TransactionItem } from "../../types/common";
import {
  TagIcon,
  ListIcon,
  ProductIcon,
  DeleteIcon,
  PrintIcon,
} from "../icons/Svg";
import { formatDateTime } from "../../utils/datesUtil";
import { formatCurrency } from "../../utils/mathUtils";

type TransactionTableProps = {
  transactions: Transaction[];
  onView: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onPrint: (transaction: Transaction) => void;
  onPrintThermal: (transaction: Transaction) => void;
};

export default function TransactionHistory({
  transactions,
  onView,
  onDelete,
  onPrint,
  onPrintThermal,
}: TransactionTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [transactions]);

  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return transactions.slice(start, start + rowsPerPage);
  }, [transactions, currentPage, rowsPerPage]);

  const transactionTitle = (items: TransactionItem[]) => {
    return items.length ? items.map((item) => `${item.product} ${item.brand}`).join(", ") : "-";
  };

  return (
    <div className="mt-5">
      <table className="w-full whitespace-nowrap">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
            <th className="py-3 pl-5">Items</th>
            <th className="py-3 pl-24">Customer</th>
            <th className="py-3 pl-5">Date</th>
            <th className="py-3 pl-5">Total</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedTransactions.length > 0 ? (
            paginatedTransactions.map((transaction) => (
              <React.Fragment key={transaction.transactionNum}>
                <tr
                  className="h-16 cursor-pointer rounded border border-gray-100 hover:bg-gray-50"
                  onClick={() => onView(transaction)}
                >
                  <td className="pl-5">
                    <div className="flex items-center">
                      <ProductIcon />
                      <p className="m-2 text-base font-medium text-gray-700">
                        {transactionTitle(transaction.items)}
                      </p>
                    </div>
                  </td>

                  <td className="pl-24">
                    <div className="flex items-center">
                      <TagIcon />
                      <p className="m-2 text-sm text-gray-600">
                        {transaction.customer}
                      </p>
                    </div>
                  </td>

                  <td className="pl-5">
                    <div className="flex items-center">
                      <ListIcon />
                      <p className="m-2 text-sm text-gray-600">
                        {formatDateTime(transaction.createdAt)}
                      </p>
                    </div>
                  </td>

                  <td className="pl-5">
                    <p className="m-2 text-sm text-gray-600">
                      {formatCurrency(transaction.grandTotal)}
                    </p>
                  </td>

                  <td className="px-5 pt-2">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPrint(transaction);
                        }}
                        className="rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                        title="Print"
                      >
                        <PrintIcon />
                      </button>
                       <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPrintThermal(transaction);
                        }}
                        className="rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                        title="Print"
                      >
                        <PrintIcon />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(transaction.transactionNum);
                        }}
                        className="rounded-lg text-red-500 transition hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </td>
                </tr>

                <tr className="h-3" />
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-6 text-center text-gray-500">
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-lg border border-gray-300 px-2 py-1"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-gray-300 px-3 py-1 text-gray-600 disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-gray-600">
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="rounded-lg border border-gray-300 px-3 py-1 text-gray-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

//  const transactions: Transaction[] = [
//   {
//     customer: {
//       name: "Brian Luciano",
//       phone: "1",
//       address: "2",
//     },
//     product: {
//       id: 23,
//       name: "11kg Regular",
//       brand: "string",
//       category: "string",
//       stock: 2,
//       price: 2,
//     } as Product,
//     quantity: 1,
//     status: "pending",
//     createdAt: "2026-02-08 4:00 pm",
//   },
//   {
//     customer: {
//       name: "Brian Luciano",
//       phone: "1",
//       address: "2",
//     },
//     product: {
//       id: 23,
//       name: "11kg Regular",
//       brand: "string",
//       category: "string",
//       stock: 2,
//       price: 2,
//     } as Product,
//     quantity: 1,
//     status: "delivered",
//     createdAt: "2026-02-08 4:00 pm",
//   },
//   {
//     customer: {
//       name: "Brian Luciano",
//       phone: "1",
//       address: "2",
//     },
//     product: {
//       id: 23,
//       name: "11kg Regular",
//       brand: "string",
//       category: "string",
//       stock: 2,
//       price: 2,
//     } as Product,
//     quantity: 1,
//     status: "cancelled",
//     createdAt: "2026-02-08 4:00 pm",
//   },
//    {
//     customer: {
//       name: "Brian Luciano",
//       phone: "1",
//       address: "2",
//     },
//     product: {
//       id: 23,
//       name: "11kg Regular",
//       brand: "string",
//       category: "string",
//       stock: 2,
//       price: 2,
//     } as Product,
//     quantity: 1,
//     status: "pending",
//     createdAt: "2026-02-08 4:00 pm",
//   },
//   {
//     customer: {
//       name: "Brian Luciano",
//       phone: "1",
//       address: "2",
//     },
//     product: {
//       id: 23,
//       name: "11kg Regular",
//       brand: "string",
//       category: "string",
//       stock: 2,
//       price: 2,
//     } as Product,
//     quantity: 1,
//     status: "delivered",
//     createdAt: "2026-02-08 4:00 pm",
//   },
//   {
//     customer: {
//       name: "Brian Luciano",
//       phone: "1",
//       address: "2",
//     },
//     product: {
//       id: 23,
//       name: "11kg Regular",
//       brand: "string",
//       category: "string",
//       stock: 2,
//       price: 2,
//     } as Product,
//     quantity: 1,
//     status: "cancelled",
//     createdAt: "2026-02-08 4:00 pm",
//   },
//    {
//     customer: {
//       name: "Brian Luciano",
//       phone: "1",
//       address: "2",
//     },
//     product: {
//       id: 23,
//       name: "11kg Regular",
//       brand: "string",
//       category: "string",
//       stock: 2,
//       price: 2,
//     } as Product,
//     quantity: 1,
//     status: "pending",
//     createdAt: "2026-02-08 4:00 pm",
//   },
//   {
//     customer: {
//       name: "Brian Luciano",
//       phone: "1",
//       address: "2",
//     },
//     product: {
//       id: 23,
//       name: "11kg Regular",
//       brand: "string",
//       category: "string",
//       stock: 2,
//       price: 2,
//     } as Product,
//     quantity: 1,
//     status: "delivered",
//     createdAt: "2026-02-08 4:00 pm",
//   },
//   {
//     customer: {
//       name: "Brian Luciano",
//       phone: "1",
//       address: "2",
//     },
//     product: {
//       id: 23,
//       name: "11kg Regular",
//       brand: "string",
//       category: "string",
//       stock: 2,
//       price: 2,
//     } as Product,
//     quantity: 1,
//     status: "cancelled",
//     createdAt: "2026-02-08 4:00 pm",
//   },
//    {
//     customer: {
//       name: "Brian Luciano",
//       phone: "1",
//       address: "2",
//     },
//     product: {
//       id: 23,
//       name: "11kg Regular",
//       brand: "string",
//       category: "string",
//       stock: 2,
//       price: 2,
//     } as Product,
//     quantity: 1,
//     status: "pending",
//     createdAt: "2026-02-08 4:00 pm",
//   },
//   {
//     customer: {
//       name: "Brian Luciano",
//       phone: "1",
//       address: "2",
//     },
//     product: {
//       id: 23,
//       name: "11kg Regular",
//       brand: "string",
//       category: "string",
//       stock: 2,
//       price: 2,
//     } as Product,
//     quantity: 1,
//     status: "delivered",
//     createdAt: "2026-02-08 4:00 pm",
//   },
//   {
//     customer: {
//       name: "Brian Luciano",
//       phone: "1",
//       address: "2",
//     },
//     product: {
//       id: 23,
//       name: "11kg Regular",
//       brand: "string",
//       category: "string",
//       stock: 2,
//       price: 2,
//     } as Product,
//     quantity: 1,
//     status: "cancelled",
//     createdAt: "2026-02-08 4:00 pm",
//   },
//    {
//     customer: {
//       name: "Brian Luciano",
//       phone: "1",
//       address: "2",
//     },
//     product: {
//       id: 23,
//       name: "11kg Regular",
//       brand: "string",
//       category: "string",
//       stock: 2,
//       price: 2,
//     } as Product,
//     quantity: 1,
//     status: "pending",
//     createdAt: "2026-02-08 4:00 pm",
//   },
//   {
//     customer: {
//       name: "Brian Luciano",
//       phone: "1",
//       address: "2",
//     },
//     product: {
//       id: 23,
//       name: "11kg Regular",
//       brand: "string",
//       category: "string",
//       stock: 2,
//       price: 2,
//     } as Product,
//     quantity: 1,
//     status: "delivered",
//     createdAt: "2026-02-08 4:00 pm",
//   },
//   {
//     customer: {
//       name: "Brian Luciano",
//       phone: "1",
//       address: "2",
//     },
//     product: {
//       id: 23,
//       name: "11kg Regular",
//       brand: "string",
//       category: "string",
//       stock: 2,
//       price: 2,
//     } as Product,
//     quantity: 1,
//     status: "cancelled",
//     createdAt: "2026-02-08 4:00 pm",
//   },
//    {
//     customer: {
//       name: "Brian Luciano",
//       phone: "1",
//       address: "2",
//     },
//     product: {
//       id: 23,
//       name: "11kg Regular",
//       brand: "string",
//       category: "string",
//       stock: 2,
//       price: 2,
//     } as Product,
//     quantity: 1,
//     status: "pending",
//     createdAt: "2026-02-08 4:00 pm",
//   },
//   {
//     customer: {
//       name: "Brian Luciano",
//       phone: "1",
//       address: "2",
//     },
//     product: {
//       id: 23,
//       name: "11kg Regular",
//       brand: "string",
//       category: "string",
//       stock: 2,
//       price: 2,
//     } as Product,
//     quantity: 1,
//     status: "delivered",
//     createdAt: "2026-02-08 4:00 pm",
//   },
//   {
//     customer: {
//       name: "Brian Luciano",
//       phone: "1",
//       address: "2",
//     },
//     product: {
//       id: 23,
//       name: "11kg Regular",
//       brand: "string",
//       category: "string",
//       stock: 2,
//       price: 2,
//     } as Product,
//     quantity: 1,
//     status: "cancelled",
//     createdAt: "2026-02-08 4:00 pm",
//   },
//    {
//     customer: {
//       name: "Brian Luciano",
//       phone: "1",
//       address: "2",
//     },
//     product: {
//       id: 23,
//       name: "11kg Regular",
//       brand: "string",
//       category: "string",
//       stock: 2,
//       price: 2,
//     } as Product,
//     quantity: 1,
//     status: "pending",
//     createdAt: "2026-02-08 4:00 pm",
//   },
//   {
//     customer: {
//       name: "Brian Luciano",
//       phone: "1",
//       address: "2",
//     },
//     product: {
//       id: 23,
//       name: "11kg Regular",
//       brand: "string",
//       category: "string",
//       stock: 2,
//       price: 2,
//     } as Product,
//     quantity: 1,
//     status: "delivered",
//     createdAt: "2026-02-08 4:00 pm",
//   },
//   {
//     customer: {
//       name: "Brian Luciano",
//       phone: "1",
//       address: "2",
//     },
//     product: {
//       id: 23,
//       name: "11kg Regular",
//       brand: "string",
//       category: "string",
//       stock: 2,
//       price: 2,
//     } as Product,
//     quantity: 1,
//     status: "cancelled",
//     createdAt: "2026-02-08 4:00 pm",
//   },
//    {
//     customer: {
//       name: "Brian Luciano",
//       phone: "1",
//       address: "2",
//     },
//     product: {
//       id: 23,
//       name: "11kg Regular",
//       brand: "string",
//       category: "string",
//       stock: 2,
//       price: 2,
//     } as Product,
//     quantity: 1,
//     status: "pending",
//     createdAt: "2026-02-08 4:00 pm",
//   },
//   {
//     customer: {
//       name: "Brian Luciano",
//       phone: "1",
//       address: "2",
//     },
//     product: {
//       id: 23,
//       name: "11kg Regular",
//       brand: "string",
//       category: "string",
//       stock: 2,
//       price: 2,
//     } as Product,
//     quantity: 1,
//     status: "delivered",
//     createdAt: "2026-02-08 4:00 pm",
//   },
//   {
//     customer: {
//       name: "Brian Luciano",
//       phone: "1",
//       address: "2",
//     },
//     product: {
//       id: 23,
//       name: "11kg Regular",
//       brand: "string",
//       category: "string",
//       stock: 2,
//       price: 2,
//     } as Product,
//     quantity: 1,
//     status: "cancelled",
//     createdAt: "2026-02-08 4:00 pm",
//   },
// ];
