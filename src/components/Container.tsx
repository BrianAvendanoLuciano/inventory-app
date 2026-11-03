// import { useEffect, useState } from "react";
// import TransactionHistory from "./transaction/TransactionHistory";
// import DateRangePicker from "../components/input/DateRangePicker";
// import SlideOver from "../components/panels/SlideOver";
// import Input from "../components/input/Input";

// import {
//   Customer,
//   Product,
//   Transaction,
//   TRANSACTION_STATUS,
//   TransactionStatusEnum,
// } from "../types/common";

// type CustomerProduct = {
//   product: string;
//   quantity: number;
//   status: TransactionStatusEnum;
// };

// type TransactionForm = {
//   customer: string;
//   products: CustomerProduct[];
// };

// export default function Transactions() {
//   const [open, setOpen] = useState(false);
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [errors, setErrors] = useState<string[]>([]);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [from, setFrom] = useState("");
//   const [to, setTo] = useState("");

//   const [form, setForm] = useState<TransactionForm>({
//     customer: "",
//     products: [],
//   });

//   useEffect(() => {
//     load();
//   }, []);

//   const load = async () => {
//     const data = await window.api.transactions.getAll();
//     const customers = await window.api.customers.getAll();
//     const products = await window.api.products.getAll();

//     setTransactions(data);
//     setCustomers(customers);
//     setProducts(products);
//   };

//   const updateForm = (field: keyof TransactionForm, value: any) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const addItem = () => {
//     setForm((prev) => ({
//       ...prev,
//       products: [
//         ...prev.products,
//         { product: "", quantity: 1, status: "pending" },
//       ],
//     }));
//   };

//   const removeItem = (index: number) => {
//     setForm((prev) => ({
//       ...prev,
//       products: prev.products.filter((_, i) => i !== index),
//     }));
//   };

//   const updateItem = (
//     index: number,
//     field: keyof CustomerProduct,
//     value: any
//   ) => {
//     setForm((prev) => {
//       const items = [...prev.products];
//       items[index] = { ...items[index], [field]: value };
//       return { ...prev, products: items };
//     });
//   };

//   const validate = () => {
//     const errs: string[] = [];

//     if (!form.customer) {
//       errs.push("Customer is required");
//     }

//     if (form.products.length === 0) {
//       errs.push("Add at least one product");
//     }

//     form.products.forEach((p, i) => {
//       if (!p.product) errs.push(`Product ${i + 1} is required`);
//       if (!p.quantity) errs.push(`Quantity ${i + 1} is required`);
//     });

//     setErrors(errs);

//     return errs.length === 0;
//   };

//   const createTransaction = async () => {
//     if (!validate()) return;

//     await window.api.transactions.create(form);

//     await load();

//     setForm({
//       customer: "",
//       products: [],
//     });

//     setOpen(false);
//   };

//   return (
//     <>
//       <div className="w-full h-full">
//         <div className="rounded-xl border border-slate-200 shadow-sm mb-3 p-3 bg-white">
//           <div className="flex items-center justify-between mb-4">
//             <h1 className="text-xl font-bold text-gray-900">
//               Transaction Management
//             </h1>

//             <button
//               onClick={() => setOpen(true)}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg"
//             >
//               New Transaction
//             </button>
//           </div>

//           <DateRangePicker
//             from={from}
//             to={to}
//             onFromChange={setFrom}
//             onToChange={setTo}
//           />

//           <div className="mt-4">
//             <input
//               type="text"
//               placeholder="Search Customer Name..."
//               className="w-full border rounded-lg px-3 py-2"
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <TransactionHistory transactions={transactions} />
//         </div>
//       </div>

//       <SlideOver
//         isOpen={open}
//         onClose={() => {
//           setOpen(false);
//           setForm({ customer: "", products: [] });
//         }}
//         title="Add Transaction"
//       >
//         <form className="space-y-4">

//           <Input
//             label="Customer"
//             variant="select"
//             value={form.customer}
//             onChange={(v) => updateForm("customer", v)}
//             options={customers.map((c) => ({
//               label: c.name,
//               value: c.id!,
//             }))}
//           />

//           {form.products.map((item, index) => (
//             <div
//               key={index}
//               className="border rounded-lg p-4 bg-gray-50 space-y-2"
//             >
//               <Input
//                 label="Product"
//                 variant="select"
//                 value={item.product}
//                 onChange={(v) => updateItem(index, "product", v)}
//                 options={products.map((p) => ({
//                   label: p.name,
//                   value: p.id!,
//                 }))}
//               />

//               <Input
//                 label="Status"
//                 variant="select"
//                 value={item.status}
//                 onChange={(v) => updateItem(index, "status", v)}
//                 options={TRANSACTION_STATUS.map((s) => ({
//                   label: s,
//                   value: s,
//                 }))}
//               />

//               <Input
//                 label="Quantity"
//                 type="number"
//                 value={item.quantity}
//                 onChange={(v) =>
//                   updateItem(index, "quantity", Number(v))
//                 }
//               />

//               <button
//                 type="button"
//                 onClick={() => removeItem(index)}
//                 className="text-red-500 text-sm"
//               >
//                 Remove
//               </button>
//             </div>
//           ))}

//           <button
//             type="button"
//             onClick={addItem}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg"
//           >
//             Add Product
//           </button>

//           {errors.length > 0 && (
//             <div className="text-red-500 text-sm">
//               {errors.map((e, i) => (
//                 <div key={i}>{e}</div>
//               ))}
//             </div>
//           )}

//           <div className="flex justify-end">
//             <button
//               type="button"
//               onClick={createTransaction}
//               className="bg-green-600 text-white px-5 py-2 rounded-lg"
//             >
//               Save Transaction
//             </button>
//           </div>

//         </form>
//       </SlideOver>
//     </>
//   );
// }