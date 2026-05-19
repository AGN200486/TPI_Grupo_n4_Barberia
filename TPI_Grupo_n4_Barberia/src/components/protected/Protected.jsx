import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext"; //Importamos nuestro hook

const Protected = () => {
    const { isSignedIn } = useAuth(); //Leemos el estado global de autenticación

    if (!isSignedIn) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default Protected;