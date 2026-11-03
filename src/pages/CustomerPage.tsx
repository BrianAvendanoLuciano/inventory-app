import { useEffect, useState } from "react";


import SlideOver from "../components/panels/SlideOver";

import ConfirmModal from "../components/modal/ConfirmModal";
import CustomerTable from "../components/customer/CustomerTable";
import Input from "../components/input/Input";
import { Customer } from "../types/common";


export default function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null,
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const load = async () => {
    const data = await window.api.customers.getAll();
    setCustomers(data);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedCustomerId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedCustomerId === null) return;

    await window.api.customers.delete(selectedCustomerId); // your Electron API
    setConfirmOpen(false);
    setSelectedCustomerId(null);
    load(); // refresh customers
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setSelectedCustomerId(null);
  };

  const openSlideOver = () => {
    setOpen(true);
  };

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // Update any field dynamically
  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addCustomer = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]); // clear errors

    try {
      await window.api.customers.create({
        name: form.name,
        phone: form.phone,
        address: form.address,
      });
      await load();
      setOpen(false); // Close the slide-over
      // Reset form if needed
      setForm({
        name: "",
        phone: "",
        address: "",
      });
    } catch (err) {
      console.error("Error adding customer:", err);
      alert("Failed to add customer. See console for details.");
    }
  };

  const handleEditClick = (customer: Customer) => {
    setForm({
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
    });
    setSelectedCustomerId(customer.id!);
    setIsEditing(true);
    setOpen(true); // open the SlideOver
  };

  const updateCustomer = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);

    if (selectedCustomerId === null) return;

    try {
      await window.api.customers.update(selectedCustomerId, {
        name: form.name,
        phone: form.phone,
        address: form.address,
      });

      await load(); // refresh table
      setOpen(false);
      setIsEditing(false);
      setSelectedCustomerId(null);
      setForm({ name: "", phone: "", address: "" });
    } catch (err) {
      console.error("Error updating customer:", err);
      alert("Failed to update customer. See console for details.");
    }
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!form.name.trim()) errors.push("Name is required");
    if (!form.phone.trim()) errors.push("Brand is required");
    if (!form.address.trim()) errors.push("Category is required");

    return errors;
  };

  useEffect(() => {
    load();
    console.log("customers", customers);
  }, []);

  // return <TransactionHistory />
  return (
    <div className="w-full h-full">
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm mb-3 p-3 bg-white">
        {/* <h1 className="font-sans text-xl font-bold">List of Customers</h1> */}
        {/* <button onClick={addCustomer}>Add Customer</button> */}

        <div className="flex items-center justify-between">
          {/* Left: Title */}
          <h1 className="text-xl font-bold text-gray-900">
            Customer Management
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
                placeholder="Search customer..."
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
              Add New Customer
            </button>
          </div>
        </div>
      </div>

      <CustomerTable
        customers={filteredCustomers}
        deleteCustomer={handleDeleteClick}
        editCustomer={handleEditClick}
      />
      {/* Sliding Panel */}
      <SlideOver
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setIsEditing(false);
          setForm({ name: "", phone: "", address: "" });
          setSelectedCustomerId(null);
        }}
        title={isEditing ? "Edit Customer" : "Add Customer"}
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
            label="Phone"
            icon="phone"
            required={true}
            value={form.phone}
            onChange={(v) => handleChange("phone", v)}
          />
          <Input
            label="Address"
            icon="address"
            required={true}
            value={form.address}
            onChange={(v) => handleChange("address", v)}
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
                onClick={isEditing ? updateCustomer : addCustomer}
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
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
