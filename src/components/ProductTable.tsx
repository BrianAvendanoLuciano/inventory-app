import { useMemo, useState } from "react";
import { Product } from "../types/common";
import Stock from "./product/Stock";

type ProductTableProps = {
  products: Array<Product>;
  deleteProduct: (id: number) => void;
  editProduct: (product: Product) => void;
};

export default function ProductTable({
  products,
  deleteProduct,
  editProduct,
}: ProductTableProps) {
  const headers = [
    "SKU",
    "Item",
    "Brand",
    "Category",
    "Stock",
    "Price",
    "Status",
    "Actions",
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalPages = Math.ceil(products.length / rowsPerPage);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return products.slice(start, start + rowsPerPage);
  }, [products, currentPage, rowsPerPage]);

  function formatPrice(value: number) {
    if (value === null || value === undefined) return "₱0";

    const number = Number(value);
    if (isNaN(number)) return "₱0";

    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(number);
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
        <table className="min-w-full border-collapse bg-white text-sm">
          <thead className="sticky top-0 z-10 bg-slate-100">
            <tr className="text-left text-slate-700">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={`px-6 py-4 font-semibold ${
                    header === "Actions" ? "text-right" : ""
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((item) => (
                <tr key={item.id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{item.brand}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {item.category}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-900">
                      {item.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {formatPrice(item.price)}
                  </td>
                  <td className="px-6 py-4">
                    <Stock stock={item.stock} />
                  </td>
                  <td className="space-x-2 px-6 py-4 text-right">
                    <button
                      onClick={() => editProduct(item)}
                      className="rounded-lg border border-slate-300 px-3 py-1 text-slate-600 hover:bg-slate-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(item.id!)}
                      className="rounded-lg border border-red-300 px-3 py-1 text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-6 py-6 text-center text-slate-500"
                >
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-300 px-2 py-1"
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
            className="rounded-lg border border-slate-300 px-3 py-1 text-slate-600 disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-slate-600">
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages))
            }
            disabled={currentPage === totalPages || totalPages === 0}
            className="rounded-lg border border-slate-300 px-3 py-1 text-slate-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}