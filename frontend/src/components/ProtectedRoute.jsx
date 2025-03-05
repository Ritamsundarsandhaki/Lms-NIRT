import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType"); // "admin", "librarian", "student"

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
