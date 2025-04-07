// ProtectedRoute.js
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { token, userType } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
