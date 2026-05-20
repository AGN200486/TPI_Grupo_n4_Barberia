import { useNavigate } from "react-router";
import logo from '../../imagenes/iconoP.png';
import tijera from '../../imagenes/tijera.png';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="header">
            {/* Agrupamos logo y título para que queden juntos a la izquierda */}
            <div className="header-left">
                <img src={logo} alt="Logo Barbería" className="logo" />
                <h1>Barbería TPI Grupo N4</h1>
            </div>

            {/* El nav se va a ir por completo a la derecha gracias al flexbox */}
            <nav>
                <div className="d-flex gap-4">
                    <span className="text-white text-decoration-none nav-item" onClick={() => navigate("/library")}>
                        <img src={tijera} alt="tijera" className="tijera-icon" />
                        Inicio
                    </span>
                    <span className="text-white text-decoration-none nav-item" onClick={() => navigate("/library?tipo=servicios")}>
                        <img src={tijera} alt="tijera" className="tijera-icon" />
                        Servicios
                    </span>
                    <span className="text-white text-decoration-none nav-item" onClick={() => navigate("/library?tipo=productos")}>
                        <img src={tijera} alt="tijera" className="tijera-icon" />
                        Productos
                    </span>
                </div>
            </nav>
        </header>
    );
};

export default Header;
