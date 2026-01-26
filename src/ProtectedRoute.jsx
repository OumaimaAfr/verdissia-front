import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }) {
    const { token } = useContext(AuthContext);

    if (!token) return <Navigate to="/backoffice/login" replace />;

    return children;
}
