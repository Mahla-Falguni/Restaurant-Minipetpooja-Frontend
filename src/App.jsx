import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import FeatureRoute from "./routes/FeatureRoute";
import Unauthorized from "./pages/misc/Unauthorized";
import ComingSoon from "./components/common/ComingSoon";

import TableList from "./pages/tables/TableList";
import CategoryList from "./pages/categories/CategoryList";
import MenuList from "./pages/menu/MenuList";
import RestaurantSettings from "./pages/settings/RestaurantSettings";
import CreateTable from "./pages/tables/CreateTable";
import CreateCategory from "./pages/categories/CreateCategory";
import CreateMenuItem from "./pages/menu/CreateMenuItem";

import WaiterDashboard from "./pages/waiter/WaiterDashboard";
import WaiterTables from "./pages/waiter/WaiterTables";
import WaiterTableDetail from "./pages/waiter/WaiterTableDetail";
import WaiterOrders from "./pages/waiter/WaiterOrder";

import KitchenDashboard from "./pages/kitchen/KitchenDashboard";
import CashierDashboard from "./pages/cashier/CashierDashboard";
import CheckoutQueue from "./pages/cashier/CheckoutQueue";
import Refunds from "./pages/cashier/Refunds";
import CashDrawerPage from "./pages/cashier/CashDrawer";
import QRManagement from "./pages/qr/QRManagement";
import QRPreview from "./pages/qr/QRPreview";
import Orders from "./pages/orders/Orders";
import OrderDetails from "./pages/orders/OrderDetails";
import Customers from "./pages/customers/Customers";
import Reservations from "./pages/reservations/Reservations";
import Staff from "./pages/staff/Staff";
import Attendance from "./pages/staff/Attendance";
import CustomerMenu from "./pages/customers/CustomerMenu";
import Subscription from "./pages/settings/Subscription";

import SuperAdminProtectedRoute from "./routes/SuperAdminProtectedRoute";
import SuperAdminLogin from "./pages/superAdmin/SuperAdminLogin";
import SuperAdminForgotPassword from "./pages/superAdmin/SuperAdminForgotPassword";
import SuperAdminResetPassword from "./pages/superAdmin/SuperAdminResetPassword";
import SuperAdminDashboard from "./pages/superAdmin/SuperAdminDashboard";
import RestaurantsList from "./pages/superAdmin/RestaurantsList";
import RestaurantDetail from "./pages/superAdmin/RestaurantDetail";
import PlansList from "./pages/superAdmin/PlansList";
import ActivityLog from "./pages/superAdmin/ActivityLog";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* ============================
            PUBLIC — CUSTOMER QR MENU
            No auth. This is what a table's QR code actually points to.
        ============================ */}
        <Route path="/menu/:tableCode" element={<CustomerMenu />} />

        {/* ============================
            ANY LOGGED-IN USER
            No role restriction — just needs to be authenticated.
        ============================ */}

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />

          <Route element={<FeatureRoute feature="Staff & Payroll" />}>
            <Route path="/attendance" element={<Attendance />} />
          </Route>
        </Route>

        {/* ============================
            MANAGER / ADMIN ONLY
            Menu, category, table, and settings management.
        ============================ */}

        <Route element={<ProtectedRoute allowedRoles={["Admin", "Manager"]} />}>

          <Route path="/tables" element={<TableList />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/menu" element={<MenuList />} />
          <Route path="/settings" element={<RestaurantSettings />} />
          <Route path="/tables/create" element={<CreateTable />} />
          <Route path="/categories/create" element={<CreateCategory />} />
          <Route path="/menu/create" element={<CreateMenuItem />} />

          <Route element={<FeatureRoute feature="QR Menu" />}>
            <Route path="/qr" element={<QRManagement />} />
            <Route path="/qr/:tableId" element={<QRPreview />} />
          </Route> 

          <Route element={<FeatureRoute feature="Staff & Payroll" />}>
            <Route path="/staff" element={<Staff />} />
          </Route>

          <Route path="/reports" element={<ComingSoon title="Reports" subtitle="Sales, item performance, and export" />} />
          <Route path="/branches" element={<ComingSoon title="Branches" subtitle="Multi-location management" />} />

          {/* Billing itself is never feature-gated — it's how a restaurant upgrades */}
          <Route path="/billing" element={<Subscription />} />

        </Route>

        {/* ============================
            WAITER MODULE
            Waiter, plus Manager/Admin who may need to check the floor.
        ============================ */}

        <Route element={<ProtectedRoute allowedRoles={["Waiter", "Manager", "Admin"]} />}>

          <Route path="/waiter" element={<WaiterDashboard />} />
          <Route path="/waiter/tables" element={<WaiterTables />} />
          <Route path="/waiter/tables/:tableId" element={<WaiterTableDetail />} />
          <Route path="/waiter/orders" element={<WaiterOrders />} />

        </Route>

        {/* ============================
            KITCHEN
        ============================ */}

        <Route element={<ProtectedRoute allowedRoles={["Kitchen", "Manager", "Admin"]} />}>
          <Route element={<FeatureRoute feature="KDS" />}>
            <Route path="/kitchen" element={<KitchenDashboard />} />
          </Route>
        </Route>

        {/* ============================
            CASHIER
        ============================ */}

        <Route element={<ProtectedRoute allowedRoles={["Cashier", "Manager", "Admin"]} />}>
          <Route path="/cashier" element={<CashierDashboard />} />
          <Route path="/cashier/checkout" element={<CheckoutQueue />} />
          <Route path="/cashier/refunds" element={<Refunds />} />
          <Route path="/cashier/drawer" element={<CashDrawerPage />} />
        </Route>

        {/* ============================
            ORDERS
            Viewable by anyone running the floor/counter.
        ============================ */}

        <Route element={<ProtectedRoute allowedRoles={["Admin", "Manager", "Cashier"]} />}>
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
        </Route>

        {/* ============================
            FLOOR — Reservations & Customers
            Everyone who touches the floor can see these.
        ============================ */}

        <Route element={<ProtectedRoute allowedRoles={["Admin", "Manager", "Cashier", "Waiter"]} />}>

          <Route element={<FeatureRoute feature="Reservations" />}>
            <Route path="/reservations" element={<Reservations />} />
          </Route>

          <Route element={<FeatureRoute feature="Customer CRM" />}>
            <Route path="/customers" element={<Customers />} />
          </Route>

        </Route>

        {/* ============================
            SUPER ADMIN — PLATFORM PANEL
        ============================ */}

        <Route path="/super-admin/login" element={<SuperAdminLogin />} />
        <Route path="/super-admin/forgot-password" element={<SuperAdminForgotPassword />} />
        <Route path="/super-admin/reset-password/:token" element={<SuperAdminResetPassword />} />

        <Route element={<SuperAdminProtectedRoute />}>
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
          <Route path="/super-admin/restaurants" element={<RestaurantsList />} />
          <Route path="/super-admin/restaurants/:id" element={<RestaurantDetail />} />
          <Route path="/super-admin/plans" element={<PlansList />} />
          <Route path="/super-admin/activity-log" element={<ActivityLog />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;