import { useEffect, useState } from "react";
import ProductTable from "../components/ProductTable";
import SlideOver from "../components/panels/SlideOver";
import ConfirmModal from "../components/modal/ConfirmModal";
import Input from "../components/input/Input";
import { Product } from "../types/common";

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const load = async () => {
    const data = await window.api.products.getAll();
    setProducts(data);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedProductId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedProductId === null) return;

    await window.api.products.delete(selectedProductId); // your Electron API
    setConfirmOpen(false);
    setSelectedProductId(null);
    load(); // refresh products
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setSelectedProductId(null);
  };

  const openSlideOver = () => {
    setOpen(true);
  };

  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    stock: "",
    price: "",
  });

  // Update any field dynamically
  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addProduct = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]); // clear errors

    try {
      await window.api.products.create({
        name: form.name,
        brand: form.brand,
        category: form.category,
        stock: Number(form.stock),
        price: Number(form.price),
      });
      await load();
      setOpen(false); // Close the slide-over
      // Reset form if needed
      setForm({
        name: "",
        brand: "",
        category: "",
        stock: "",
        price: "",
      });
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Failed to add product. See console for details.");
    }
  };

  const handleEditClick = (product: Product) => {
    setForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      stock: product.stock.toString(),
      price: product.price.toString(),
    });
    setSelectedProductId(product.id!);
    setIsEditing(true);
    setOpen(true); // open the SlideOver
  };

  const updateProduct = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);

    if (selectedProductId === null) return;

    try {
      await window.api.products.update(selectedProductId, {
        name: form.name,
        brand: form.brand,
        category: form.category,
        stock: Number(form.stock),
        price: Number(form.price),
      });

      await load(); // refresh table
      setOpen(false);
      setIsEditing(false);
      setSelectedProductId(null);
      setForm({ name: "", brand: "", category: "", stock: "", price: "" });
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Failed to update product. See console for details.");
    }
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!form.name.trim()) errors.push("Name is required");
    if (!form.brand.trim()) errors.push("Brand is required");
    if (!form.category.trim()) errors.push("Category is required");
    if (!form.stock.trim()) errors.push("Stock is required");
    if (!form.price.trim()) errors.push("Price is required");

    return errors;
  };

  useEffect(() => {
    load();
    console.log("products", products);
  }, []);

  // return <TransactionHistory />
  return (
    <div className="w-full h-full">
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm mb-3 p-3 bg-white">
        {/* <h1 className="font-sans text-xl font-bold">List of Products</h1> */}
        {/* <button onClick={addProduct}>Add Product</button> */}

        <div className="flex items-center justify-between">
          {/* Left: Title */}
          <h1 className="text-xl font-bold text-gray-900">
            Product Management
          </h1>
          {/* Right: Search + Buttons */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
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
                placeholder="Search product..."
                className="w-64 rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-800 shadow-sm transition
         placeholder:text-gray-400
         focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Search Button */}
            {/* <button
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition
       hover:bg-gray-100 hover:border-gray-400
       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              <svg
                className="h-4 w-4 text-gray-500"
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
              Search
            </button> */}
            {/* Add Button */}
            <button
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition
       hover:bg-blue-700 hover:shadow-lg
       active:scale-95
       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              onClick={openSlideOver}
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
              Add Item
            </button>
          </div>
        </div>
      </div>

      <ProductTable
        products={filteredProducts}
        deleteProduct={handleDeleteClick}
        editProduct={handleEditClick}
      />
      {/* Sliding Panel */}
      <SlideOver
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setIsEditing(false);
          setForm({ name: "", brand: "", category: "", stock: "", price: "" });
          setSelectedProductId(null);
        }}
        title={isEditing ? "Edit Product" : "Add Product"}
      >
        {/* Your form */}
        <form className="space-y-3">
          <Input
            label="Name"
            icon="item"
            required={true}
            value={form.name}
            onChange={(v) => handleChange("name", v)}
          />
          <Input
            label="Brand"
            icon="brand"
            required={true}
            value={form.brand}
            onChange={(v) => handleChange("brand", v)}
          />
          <Input
            label="Category"
            icon="category"
            required={true}
            value={form.category}
            onChange={(v) => handleChange("category", v)}
          />
          <Input
            label="Stock"
            icon="stock"
            required={true}
            type="number"
            value={form.stock}
            onChange={(v) => handleChange("stock", v)}
          />
          <Input
            label="Price"
            icon="price"
            required={true}
            type="number"
            value={form.price}
            onChange={(v) => handleChange("price", v)}
          />

          {errors.length > 0 && (
            <ul className="text-red-500 text-sm">
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          )}

          {/* Button container */}
          <div className="flex justify-end">
            <div className="flex justify-end">
              <button
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition
      hover:bg-blue-700 hover:shadow-lg
      active:scale-95
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                onClick={isEditing ? updateProduct : addProduct}
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
                {isEditing ? "Update" : "Add"} Item
              </button>
            </div>
          </div>
        </form>
      </SlideOver>

      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
