import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";

interface PrivateRouteProps {
    element: React.ComponentType<Record<string, unknown>>;
    [key: string]: unknown;
}

export const PrivateRoute = ({ element: Component, ...rest }: PrivateRouteProps) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};