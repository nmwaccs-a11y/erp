import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Purchase from "./pages/procurement/Purchase";
import Production from "./pages/production/Production";
import EnamelProduction from "./pages/production/EnamelProduction";
import DrawingProduction from "./pages/production/DrawingProduction";
import Inventory from "./pages/inventory/Inventory";
import Financials from "./pages/financials/Financials";
import Sales from "./pages/sales/Sales";
import Reports from "./pages/reports/Reports";
import Alerts from "./pages/alerts/Alerts";
import SystemAudit from "./pages/admin/SystemAudit";
import MarketIntelligence from "./pages/market/MarketIntelligence";
import Login from "./pages/auth/Login";
import TwoFactor from "./pages/auth/TwoFactor";
import ForgotPassword from "./pages/auth/ForgotPassword";
import TenantSelection from "./pages/auth/TenantSelection";
import UserManagement from "./pages/admin/UserManagement";
import SystemConfig from "./pages/masters/SystemConfig";
import ChartOfAccounts from "./pages/masters/ChartOfAccounts";
import ItemMaster from "./pages/masters/ItemMaster";
import PartyMaster from "./pages/masters/PartyMaster";
import LaborRateMatrix from "./pages/masters/LaborRateMatrix";
import RateManagement from "./pages/ratemanagement/RateManagement";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/2fa" element={<TwoFactor />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/tenant-selection" element={<TenantSelection />} />
        <Route path="/admin/users" element={<UserManagement />} />

        {/* Masters Routes */}
        <Route path="/masters/config" element={<SystemConfig />} />
        <Route path="/masters/coa" element={<ChartOfAccounts />} />
        <Route path="/masters/items" element={<ItemMaster />} />
        <Route path="/masters/parties" element={<PartyMaster />} />
        <Route path="/masters/labor-rates" element={<LaborRateMatrix />} />

        {/* Transaction Routes */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/rate-management" element={<RateManagement />} />
        <Route path="/production" element={<Production />} />
        <Route path="/production/enamel" element={<EnamelProduction />} />
        <Route path="/production/drawing" element={<DrawingProduction />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/financials" element={<Financials />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/audit" element={<SystemAudit />} />
        <Route path="/market" element={<MarketIntelligence />} />
      </Routes>
    </Router>
  );
}

export default App;
