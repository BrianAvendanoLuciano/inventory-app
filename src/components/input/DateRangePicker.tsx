type Props = {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
};

export default function DateRangePicker({
  from,
  to,
  onFromChange,
  onToChange,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row items-end gap-4 bg-white pt-4 ">
      {/* FROM */}
      <div className="flex flex-col w-full">
        <label className="mb-1 text-sm font-medium text-gray-600">From</label>
        <input
          type="date"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm text-gray-800 shadow-sm transition
         placeholder:text-gray-400
         focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
         max={to || undefined}
        />
      </div>

      {/* TO */}
      <div className="flex flex-col w-full">
        <label className="mb-1 text-sm font-medium text-gray-600">To</label>
        <input
          type="date"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm text-gray-800 shadow-sm transition
         placeholder:text-gray-400
         focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
         min={from || undefined}
        />
      </div>
    </div>
  );
}
