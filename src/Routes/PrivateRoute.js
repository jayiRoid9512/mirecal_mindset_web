import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../Auth/Auth";

function PrivateRoutes() {
    const token = useAuth();
    return token ? <>
        {/* <HomePage /> */}
        <Outlet />
    </> : <Navigate to="/" />;
}

export default PrivateRoutes;