import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import "./NotFound.css"; // Importamos su hoja de estilos dedicada

const NotFound = () => {
    const navigate = useNavigate();
    
    const handleBackToInicio = () => {
        navigate("/library"); 
    };

    return (
        <div className="notfound-container d-flex align-items-center justify-content-center">
            <div className="notfound-card text-center p-5 shadow">
                {/* Ícono conceptual: Un sillón vacío o unas tijeras cruzadas en el CSS */}
                <div className="notfound-icon-wrapper mb-4">
                    <span className="barber-pole-divider"></span>
                </div>
                
                <h1 className="notfound-code">404</h1>
                <h2 className="notfound-title mb-3">¡Corte Equivocado!</h2>
                
                <p className="notfound-text mx-auto mb-4">
                    La página que estás buscando no existe en nuestro catálogo o se la llevó la navaja. 
                    No te preocupes, todavía podemos arreglar este look.
                </p>
                
                <Button className="btn-notfound-recover" onClick={handleBackToInicio}>
                    Volver a la Barbería
                </Button>
            </div>
        </div>
    );
};

export default NotFound;