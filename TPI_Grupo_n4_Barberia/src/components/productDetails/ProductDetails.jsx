import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Button, Card, Form, Row, Col } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const ProductDetails = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [barber, setBarber] = useState("Franco");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("09:00");

    // 1. Validamos que el viaje haya existido
    if (!state || !state.product) {
        return <p className="text-center text-white mt-5">No se seleccionó ningún ítem válido.</p>;
    }

    // 2. EXTRAEMOS LOS DATOS REALES (Buscándolos adentro de state.product)
    const itemReal = state.product;

    const handleBooking = (e) => {
    e.preventDefault();
    if (!user) {
        toast.warn("Debés iniciar sesión para reservar un turno.");
        return navigate("/login");
    }

    // 🔑 LEEMOS EL TOKEN QUE GUARDÓ EL LOGIN
    const token = localStorage.getItem("token"); 

    const bookingData = {
    barberName: barber,
    serviceName: itemReal.nombre || itemReal.name,
    date: date,
    time: time
    };

    fetch('http://localhost:3000/reservations', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // 👈 LE PASAMOS EL TOKEN AL BACKEND
        },
        body: JSON.stringify(bookingData)
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(err => { throw new Error(err.message) });
        }
        return res.json();
    })
    .then(() => {
        toast.success("¡Turno reservado exitosamente!");
        navigate("/library");
    })
    .catch(err => {
        toast.error(err.message || "No se pudo agendar el turno.");
    });
};

    // Generar horarios cada 30 minutos de 09:00 a 20:00 hs
    const timeSlots = [];
    for (let hour = 9; hour <= 19; hour++) {
        const strHour = hour < 10 ? `0${hour}` : `${hour}`;
        timeSlots.push(`${strHour}:00`);
        timeSlots.push(`${strHour}:30`);
    }

    return (
        <Card className="m-4 w-50 mx-auto bg-dark text-white border border-secondary shadow">
            {/* Si imageUrl viene vacío, le ponemos un marcador de posición o null para evitar el warning de la consola */}
            <Card.Img variant="top" src={itemReal.imageUrl || itemReal.imagen || null} style={{ maxHeight: '350px', objectFit: 'cover' }} />
            <Card.Body>
                <h2>{itemReal.nombre || itemReal.name}</h2>
                <p className="text-muted">{itemReal.summary || itemReal.description}</p>
                
                {/* ⚡ CONDICIONAL REFORZADO CON LA RUTA REAL DEL OBJETO ⚡ */}
                {itemReal.isService === true || 
                 itemReal.isService === 1 || 
                 (itemReal.nombre && itemReal.nombre.toLowerCase().includes("corte")) || 
                 (itemReal.name && itemReal.name.toLowerCase().includes("corte")) ||
                 (itemReal.nombre && itemReal.nombre.toLowerCase().includes("barba")) || 
                 (itemReal.name && itemReal.name.toLowerCase().includes("barba")) ? (
                    
                    <Form onSubmit={handleBooking} className="mt-4 border-top border-secondary pt-3">
                        <h4 className="text-success mb-3">Reservar Turno (Duración: 30 min)</h4>
                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>Elegí tu Barbero</Form.Label>
                                <Form.Select className="bg-secondary text-white border-0" value={barber} onChange={e => setBarber(e.target.value)}>
                                    <option value="Franco">Franco (Estilo Urbano/Fade)</option>
                                    <option value="Ezequiel">Ezequiel (Cortes Clásicos/Navaja)</option>
                                    <option value="Mateo">Mateo (Barbas y Perfilados)</option>
                                </Form.Select>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>Fecha</Form.Label>
                                <Form.Control type="date" value={date} onChange={e => setDate(e.target.value)} required />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Hora disponible</Form.Label>
                                <Form.Select className="bg-secondary text-white border-0" value={time} onChange={e => setTime(e.target.value)}>
                                    {timeSlots.map(slot => <option key={slot} value={slot}>{slot} hs</option>)}
                                </Form.Select>
                            </Form.Group>
                        </Row>
                        <Button variant="success" type="submit" className="w-100 mt-2">Confirmar Turno</Button>
                    </Form>
                    
                ) : (
                    <div className="alert alert-info mt-3">
                        Este es un producto de venta en góndola. Adquirilo en nuestra sucursal.
                    </div>
                )}
                
                <Button variant="secondary" className="mt-3" onClick={() => navigate("/library")}>Volver al Catálogo</Button>
            </Card.Body>
        </Card>
    );
};

export default ProductDetails;