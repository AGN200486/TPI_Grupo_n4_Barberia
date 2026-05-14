import React from 'react'
import { Button } from 'react-bootstrap'
import { replace, useNavigate } from 'react-router'

const NotFound = () => {
    const navigate = useNavigate();
    
    const handleBackToLogin = () => {
        navigate("/login"); 
    }

    return (
        <div>
            <h1>ERROR: ¡Página no encontrada!</h1>
            <Button onClick={handleBackToLogin}>
                Volver al inicio de sesión
            </Button>
        </div>
    )
}

export default NotFound