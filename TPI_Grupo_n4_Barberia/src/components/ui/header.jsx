import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext"; // 👈 Importamos el contexto para saber quién está logueado
import logo from '../../imagenes/iconoP.png';
import tijera from '../../imagenes/tijera.png';
import carro from '../../imagenes/carro.png';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); // 👈 Traemos al usuario activo

    // Evaluamos si el rol es administrativo para cambiar el texto del botón
    const isAdmin = user?.rol === 'admin' || user?.rol === 'superadmin';

    return (
        <header className="header">
            {/* Agrupamos logo y título para que queden juntos a la izquierda */}
            <div className="header-left">
                <img src={logo} alt="Logo Barbería" className="logo" />
                <h1>Barbería TPI Grupo N4</h1>
            </div>

            {/* El nav se va a ir por completo a la derecha gracias al flexbox */}
            <nav>
                <div className="d-flex gap-4 align-items-center">
                    {user && (
                    <span className="text-white text-decoration-none nav-item fw-bold" onClick={() => navigate("/library")}>
                        <img src={tijera} alt="tijera" className="tijera-icon" />
                        Inicio
                    </span>
                    )}

                    {user && (
                    <span className="text-white text-decoration-none nav-item fw-bold" onClick={() => navigate("/library?tipo=servicios")}>
                        <img src={tijera} alt="tijera" className="tijera-icon" />
                        Servicios
                    </span>
                    )}

                    {user && (
                    <span className="text-white text-decoration-none nav-item fw-bold" onClick={() => navigate("/library?tipo=productos")}>
                        <img src={tijera} alt="tijera" className="tijera-icon" />
                        Productos
                    </span>
                    )}

                    {/* 📅 NUEVOS BOTONES: Solo se renderizan si hay un usuario logueado en el sistema */}
                    {user && (
                        <span className="text-white text-decoration-none nav-item fw-bold" onClick={() => navigate("/reservations")}>
                            <img src={carro} alt="carro" className="carro-icon" />
                            Reservas {isAdmin ? "(Panel)" : ""}
                        </span>
                    )}

                    {user && (
                        <span className="text-white text-decoration-none nav-item fw-bold" onClick={() => navigate("/cart")}>
                            <img src={carro} alt="carro" className="carro-icon" />
                            Carro {isAdmin ? "(Panel)" : ""}
                        </span>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;