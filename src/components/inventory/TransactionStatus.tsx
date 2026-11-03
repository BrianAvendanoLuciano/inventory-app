import { status } from "../../types/product";

type TransactionStatusProps = {
    status: status
}

const TransactionStatus = ({ status }: TransactionStatusProps) => {
  if (status === 'delivered') {
    return (
      <span className="inline-flex items-center rounded-md bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
        Delivered
      </span>
    );
  }

  if (status === 'cancelled') {
    return (
      <span className="inline-flex items-center rounded-md bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
        Cancelled
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-md bg-amber-100 p-3 py-1 text-xs font-medium text-amber-700">
        Pending
    </span>
  );
};

export default TransactionStatus;