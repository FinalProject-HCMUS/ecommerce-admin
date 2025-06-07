import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const PrivateRoute = ({ element }: { element: JSX.Element }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return null; // or a spinner
    return isAuthenticated ? element : <Navigate to="/login" />;
};