import React from 'react';
import logo from '../../imagenes/iconoP.png';
import tijera from '../../imagenes/tijera.png';
import './Header.css';


function Header() {
  return (
    <header className="header">
      <img src={logo} alt="Logo Barbería" className="logo" />
      <h1>Barbería TPI Grupo N4</h1>
      <nav>
        <ul>
          <li><img src={tijera} className='tijera' ></img><a href="#inicio">Inicio</a></li>
          <li><img src={tijera} className='tijera' ></img><a href="#servicios">Servicios</a></li>
          <li><img src={tijera} className='tijera' ></img><a href="#contacto">Contacto</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
