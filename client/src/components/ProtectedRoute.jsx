import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user) {
    // not logged in
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // logged in but not allowed
    return <Navigate to="/" replace />;
  }

  // allowed
  return children;
};

export default ProtectedRoute;
