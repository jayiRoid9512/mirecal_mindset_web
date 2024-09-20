import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../Auth/Auth";

function PublicRoutes() {
    const token = useAuth();
    return token ? (
        <Navigate to="/your-matras" />
    ) : (
        <>
            <Outlet />
        </>
    );
}

export default PublicRoutes;
