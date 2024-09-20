import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../Auth/Auth";
import Header from "../componant/Header/Header";

function PrivateRoutes() {
    const token = useAuth();
    return token ? <>
        <div className="container">
            <Header />
            <Outlet />
        </div>
    </> : <Navigate to="/" />;
}

export default PrivateRoutes;