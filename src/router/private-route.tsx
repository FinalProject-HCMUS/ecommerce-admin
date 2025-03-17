import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const PrivateRoute = ({ element: Component, ...rest }: any) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};