import { Navbar } from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";

import { HashRouter, Routes, Route } from "react-router-dom";
import Transactions from "./pages/Transaction";
import CustomerPage from "./pages/CustomerPage";
import Report from "./pages/Report";

export default function App() {
  return (
    <HashRouter>
    <div className="min-h-screen flex">
      <Navbar />
      <main className="flex-1 bg-gray-100 m-4">
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/customers" element={<CustomerPage />} />
            <Route path="/reports" element={<Report />} />
          </Routes>
      </main>
    </div>
    </HashRouter>
  );
}