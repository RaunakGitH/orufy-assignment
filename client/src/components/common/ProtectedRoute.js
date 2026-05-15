import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!token) return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute;
