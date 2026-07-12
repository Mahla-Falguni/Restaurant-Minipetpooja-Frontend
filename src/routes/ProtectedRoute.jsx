import { Navigate, Outlet } from "react-router-dom";

/*
=========================================================
PROTECTED ROUTE
=========================================================
*/

const ProtectedRoute = ({ children, allowedRoles }) => {

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {

    const storedUser = localStorage.getItem("user");

    let role = null;

    try {
      role = storedUser ? JSON.parse(storedUser).role : null;
    } catch (err) {
      role = null;
    }

    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/unauthorized" replace />;
    }

  }

  if (!children) {
    return <Outlet />;
  }

  return children;

};

export default ProtectedRoute;