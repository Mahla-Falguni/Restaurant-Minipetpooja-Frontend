import { Navigate, Outlet } from "react-router-dom";

/*
=========================================================
SUPER ADMIN PROTECTED ROUTE
Checks the "superAdminToken" key — completely separate from the
restaurant-scoped "token" key used by ProtectedRoute. A restaurant
staff login can never grant access to the platform admin panel.
=========================================================
*/

const SuperAdminProtectedRoute = ({ children }) => {

  const token = localStorage.getItem("superAdminToken");

  if (!token) {
    return <Navigate to="/super-admin/login" replace />;
  }

  if (!children) {
    return <Outlet />;
  }

  return children;

};

export default SuperAdminProtectedRoute;