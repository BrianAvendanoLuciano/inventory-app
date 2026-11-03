type StockProps = {
  stock: number;
};

const Stock = ({ stock }: StockProps) => {
  if (stock > 10) {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
        In Stock
      </span>
    );
  }

  if (stock === 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
        Out of Stock
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
        Low Stock
    </span>
  );
};

export default Stock;