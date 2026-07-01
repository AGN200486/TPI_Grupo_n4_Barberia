import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext"; // Importamos el contexto para saber quién está logueado
import logo from '../../imagenes/iconoP.png';
import tijera from '../../imagenes/tijera.png';
import carro from '../../imagenes/carro.png';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth(); //Traemos al usuario activo y la función de logout
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const isAdmin = user?.rol === 'admin' || user?.rol === 'superadmin';
    const isSuperAdmin = user?.rol === 'superadmin';

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    //Si el usuario no está logueado, mostramos el Header limpio (Solo Logo y Título)
    if (!user) {
        return (
            <header className="header">
                <div className="header-left">
                    <img src={logo} alt="Logo Barbería" className="logo" />
                    <h1>Barbería TPI Grupo N4</h1>
                </div>
            </header>
        );
    }

    return (
        <header className="header" style={{ position: 'relative' }}>
            {/*Agrupamos logo y título para que queden juntos a la izquierda*/}
            <div className="header-left">
                <img src={logo} alt="Logo Barbería" className="logo" />
                <h1>Barbería TPI Grupo N4</h1>
            </div>

            {/*El nav se va a ir por completo a la derecha gracias al flexbox*/}
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

                    {/*Menu Desplegable: "Mi Cuenta"*/}
                    {user && (
                        <div className="dropdown-container" style={{ position: 'relative' }}>
                            <span
                                className="text-white text-decoration-none nav-item fw-bold dropdown-toggle-btn"
                                onClick={toggleDropdown}
                                style={{ cursor: 'pointer', color: '#d4af37' }}
                            >
                                Mi Cuenta ▼
                            </span>

                            {/*Contenido del Dropdown*/}
                            {dropdownOpen && (
                                <div className="header-dropdown-menu" style={{
                                    position: 'absolute', right: 0, top: '35px', backgroundColor: '#1a1a1a',
                                    border: '1px solid #d4af37', borderRadius: '4px', width: '220px', zIndex: 1000,
                                    display: 'flex', flexDirection: 'column', padding: '8px'
                                }}>
                                    <span className="dropdown-link" onClick={() => { navigate("/reservations"); setDropdownOpen(false); }}>
                                        <img src={carro} alt="carro" className="carro-icon" />
                                        Reservas {isAdmin ? "(Panel)" : ""}
                                    </span>

                                    <span className="dropdown-link" onClick={() => { navigate("/cart"); setDropdownOpen(false); }}>
                                        <img src={carro} alt="carro" className="carro-icon" />
                                        Carro {isAdmin ? "(Panel)" : ""}
                                    </span>

                                    {/*Integracion exclusiva para el superadmin*/}
                                    {isSuperAdmin && (
                                        <span
                                            className="dropdown-link admin-special-link"
                                            onClick={() => { navigate("/admin-panel"); setDropdownOpen(false); }}
                                            style={{ color: '#ff4444', fontWeight: 'bold', borderTop: '1px solid #333', marginTop: '5px', paddingTop: '8px' }}
                                        >
                                            Panel Usuarios
                                        </span>
                                    )}

                                    {/*Botón de Cerrar Sesión*/}
                                    {logout && (
                                        <span
                                            className="dropdown-link"
                                            onClick={() => {
                                                logout();                //Borra el estado del usuario y el token
                                                setDropdownOpen(false);  //Cierra el menú desplegable
                                                navigate("/login");      //Fuerza el viaje inmediato al Login
                                            }}
                                            style={{ borderTop: '1px solid #333', marginTop: '5px', paddingTop: '8px', color: '#bbb' }}
                                        >
                                            Cerrar Sesión
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;