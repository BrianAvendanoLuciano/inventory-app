import { Column } from "../../utils/commonUtil";

type TableProps<T> = {
  data: T[];
  columns: Column<T>[];
  getRowKey: (row: T, index: number) => React.Key;
  emptyMessage?: string;
  tableClassName?: string;
};

export default function Table<T>({
  data,
  columns,
  getRowKey,
  emptyMessage = "No data found.",
  tableClassName = "",
}: TableProps<T>) {
  return (
    <table className={`w-full ${tableClassName}`}>
      <thead className="bg-gray-50">
        <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
          {columns.map((column) => (
            <th
              key={column.id}
              className={`px-4 py-3 ${column.headerClassName ?? ""}`}
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.length > 0 ? (
          data.map((row, rowIndex) => (
            <tr
              key={getRowKey(row, rowIndex)}
              className="border-t border-gray-200 text-sm text-gray-700"
            >
              {columns.map((column) => (
                <td
                  key={column.id}
                  className={`px-4 py-3 ${column.className ?? ""}`}
                >
                  {column.accessor(row)}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={columns.length}
              className="px-4 py-8 text-center text-sm text-gray-500"
            >
              {emptyMessage}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}