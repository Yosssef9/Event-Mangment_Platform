import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ blockedRoles = [], children }) => {
  const { user } = useAuth();

  // if logged in and role is in blockedRoles, redirect them
  if (user && blockedRoles.includes(user.role)) {
    return <Navigate to="/organizerDashboard" replace />;
  }

  // otherwise, allow access
  return children;
};

export default PublicRoute;
