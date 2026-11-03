import { useMemo, useState } from "react";
import { Customer } from "../../types/common";

type CustomerTableProps = {
  customers: Array<Customer>;
  deleteCustomer: (id: number) => void;
  editCustomer: (customer: Customer) => void;
};

export default function CustomerTable({
  customers,
  deleteCustomer,
  editCustomer,
}: CustomerTableProps) {
  const headers = ["Name", "Phone", "Address", "Actions"];

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalPages = Math.ceil(customers.length / rowsPerPage);

  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return customers.slice(startIndex, endIndex);
  }, [customers, currentPage, rowsPerPage]);

  const handleRowsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

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
            {paginatedCustomers.length > 0 ? (
              paginatedCustomers.map((item) => (
                <tr className="transition hover:bg-slate-50" key={item.id}>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{item.phone}</td>
                  <td className="px-6 py-4 text-slate-600">{item.address}</td>
                  <td className="space-x-2 px-6 py-4 text-right">
                    <button
                      onClick={() => editCustomer(item)}
                      className="rounded-lg border border-slate-300 px-3 py-1 text-slate-600 hover:bg-slate-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCustomer(item.id!)}
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
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="rounded-lg border border-slate-300 px-2 py-1"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="rounded-lg border border-slate-300 px-3 py-1 text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-slate-600">
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="rounded-lg border border-slate-300 px-3 py-1 text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}