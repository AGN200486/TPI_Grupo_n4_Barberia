import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Button, Card, Form, Row, Col, Alert } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./ProductDetails.css"; // Importamos su hoja de estilos dedicada

const ProductDetails = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Validamos que el viaje haya existido antes de declarar otros estados
    if (!state || !state.product) {
        return <p className="text-center text-white mt-5">No se seleccionó ningún ítem válido.</p>;
    }

    // ESTADOS
    const [date, setDate] = useState("");
    const [time, setTime] = useState("09:00");
    const [barbersList, setBarbersList] = useState([]);
    const [barber, setBarber] = useState("");
    const [dateError, setDateError] = useState("");
    const [productQuantity, setProductQuantity] = useState(1);
    const [timeSlots, setTimeSlots] = useState([]);

    // El estado se inicializa con los datos del viaje
    const [itemReal, setItemReal] = useState(state.product);

    // Traer los datos del producto desde el backend
    useEffect(() => {
        if (!state.product.id) return;

        fetch(`http://localhost:3000/products/${state.product.id}`)
            .then(res => {
                if (!res.ok) throw new Error("No se pudo actualizar el producto.");
                return res.json();
            })
            .then(data => {
                // Sincronizamos tipos numéricos limpios desde SQLite
                data.stock = data.stock !== undefined ? parseInt(data.stock, 10) : 0;
                data.price = data.price !== undefined ? parseFloat(data.price) : 0;
                setItemReal(data);
            })
            .catch(err => console.error("Error al sincronizar producto:", err));
    }, [state.product.id]);

    // Carga dinámica de barberos
    useEffect(() => {
        fetch("http://localhost:3000/barbers")
            .then(res => {
                if (!res.ok) throw new Error("No se pudieron cargar los barberos.");
                return res.json();
            })
            .then(data => {
                setBarbersList(data);
                if (data.length > 0) {
                    setBarber(data[0].id); // Guardamos el ID del primer barbero
                }
            })
            .catch(err => console.error("Error al cargar barberos:", err));
    }, []);

    // Controlador de cambio de fecha y horarios dinámicos
    const handleDateChange = (e) => {
        const selectedDateStr = e.target.value;
        setDate(selectedDateStr);

        if (!selectedDateStr) {
            setDateError("");
            setTimeSlots([]);
            return;
        }

        const selectedDate = new Date((selectedDateStr + "T00:00"));
        const dayOfWeek = selectedDate.getDay();

        if (dayOfWeek === 0 || dayOfWeek === 1) {
            setDateError("La barbería trabaja únicamente de Martes a Sábados. Por favor, seleccioná otro día.");
            setTimeSlots([]);
            return;
        }

        setDateError("");

        const slots = [];
        let endHour = 16;

        if (dayOfWeek === 6) {
            endHour = 12;
        }

        for (let hour = 9; hour <= endHour; hour++) {
            const strHour = hour < 10 ? `0${hour}` : `${hour}`;
            slots.push(`${strHour}:00`);
            slots.push(`${strHour}:30`);
        }

        setTimeSlots(slots);

        if (slots.length > 0) {
            setTime(slots[0]);
        }
    };

    // Función para agendar el turno
    const handleBooking = (e) => {
        e.preventDefault();

        if (!user) {
            toast.warn("Debés iniciar sesión para reservar un turno.");
            return navigate("/login");
        }

        if (dateError) {
            toast.error("No se puede reservar: El día seleccionado está cerrado.");
            return;
        }

        if (!barber || barbersList.length === 0) {
            toast.error("No se puede reservar: No hay ningún barbero seleccionado o disponible.");
            return;
        }

        const token = localStorage.getItem("token");

        const bookingData = {
            barberId: parseInt(barber, 10),
            productId: itemReal.id,
            date: date,
            time: time
        };

        fetch('http://localhost:3000/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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

    // Función para agregar al carrito
    const handleAddToCart = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Debes iniciar sesión para añadir productos al carro.");
            return;
        }

        const bodyPayload = {
            productId: itemReal.id,
            quantity: parseInt(productQuantity, 10)
        };

        fetch(`http://localhost:3000/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bodyPayload)
        })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || "No se pudo añadir el producto al carro.");
                }
                toast.success("¡Producto añadido al carro con éxito!");
                navigate("/cart");
            })
            .catch((err) => {
                toast.error(err.message);
            });
    };

    // Validación de tipo de ítem
    const isServiceItem = itemReal.isService === true ||
        itemReal.isService === 1 ||
        (itemReal.name && itemReal.name.toLowerCase().includes("corte")) ||
        (itemReal.name && itemReal.name.toLowerCase().includes("barba"));

    return (
        <Card className="barber-details-card shadow my-4 mx-auto">
            <div className="barber-details-img-wrapper">
                <Card.Img 
                    variant="top" 
                    src={itemReal.imageUrl || itemReal.imagen || "https://via.placeholder.com/600x350?text=Barber+Shop"} 
                    className="barber-details-img"
                />
            </div>
            
            <Card.Body className="p-4">
                <h2 className="barber-details-title">{itemReal.name}</h2>
                <p className="barber-details-desc">{itemReal.description || itemReal.summary}</p>

                {isServiceItem ? (
                    /* Sección para reservar turnos */
                    <Form onSubmit={handleBooking} className="barber-section-flow mt-4 pt-3">
                        <h4 className="flow-section-subtitle service-theme mb-3">
                            Agendar Turno Premium <span className="duration-tag">(30 min)</span>
                        </h4>

                        {barbersList.length === 0 && (
                            <Alert variant="danger" className="barber-alert-danger">
                                No hay profesionales disponibles en este momento.
                            </Alert>
                        )}

                        <Row className="mb-3">
                            <Form.Group as={Col} xs={12}>
                                <Form.Label className="barber-form-label">Elegí tu Barbero</Form.Label>
                                <Form.Select
                                    className="barber-form-select"
                                    value={barber}
                                    onChange={e => setBarber(e.target.value)}
                                    required
                                    disabled={barbersList.length === 0}
                                >
                                    {barbersList.length === 0 ? (
                                        <option value="">No hay barberos registrados...</option>
                                    ) : (
                                        barbersList.map((b) => (
                                            <option key={b.id} value={b.id}>
                                                {`${b.name || ''} ${b.surname || ''}`.trim() || b.email}
                                            </option>
                                        ))
                                    )}
                                </Form.Select>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} sm={6} xs={12} className="mb-3 mb-sm-0">
                                <Form.Label className="barber-form-label">Fecha del Turno</Form.Label>
                                <Form.Control
                                    type="date"
                                    className="barber-form-control"
                                    value={date}
                                    onChange={handleDateChange}
                                    required
                                    isInvalid={!!dateError}
                                />
                                <Form.Control.Feedback type="invalid" className="barber-feedback-invalid">
                                    {dateError}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} sm={6} xs={12}>
                                <Form.Label className="barber-form-label">Hora Disponible</Form.Label>
                                <Form.Select
                                    className="barber-form-select"
                                    value={time}
                                    onChange={e => setTime(e.target.value)}
                                    required
                                    disabled={!!dateError || timeSlots.length === 0}
                                >
                                    {timeSlots.length === 0 ? (
                                        <option value="">Elegí una fecha primero...</option>
                                    ) : (
                                        timeSlots.map(slot => <option key={slot} value={slot}>{slot} hs</option>)
                                    )}
                                </Form.Select>
                            </Form.Group>
                        </Row>

                        <Button
                            type="submit"
                            className="btn-barber-action confirm-theme w-100 mt-2"
                            disabled={!!dateError || barbersList.length === 0 || !date}
                        >
                            Confirmar Reserva de Turno
                        </Button>
                    </Form>

                ) : (
                    /* Sección para comprar productos en góndola */
                    <div className="barber-section-flow mt-4 pt-3">
                        <h4 className="flow-section-subtitle product-theme mb-3">
                            Adquirir Producto Profesional
                        </h4>

                        <div className="barber-product-pricing mb-3 p-3 rounded">
                            <p className="pricing-stock mb-1">
                                Disponibilidad en Góndola: <span className="fw-bold">{itemReal.stock !== undefined ? itemReal.stock : 0} uds.</span>
                            </p>
                            <p className="pricing-value mb-0">
                                Valor Unitario: <span>${itemReal.price !== undefined ? itemReal.price.toFixed(2) : "0.00"}</span>
                            </p>
                        </div>

                        <Row className="mb-3 align-items-end">
                            <Form.Group as={Col} xs={12} sm={4} className="mb-3 sm-0">
                                <Form.Label className="barber-form-label">Cantidad:</Form.Label>
                                <Form.Select
                                    className="barber-form-select"
                                    value={productQuantity}
                                    onChange={e => setProductQuantity(Number(e.target.value))}
                                    disabled={!itemReal.stock || itemReal.stock <= 0}
                                >
                                    {itemReal.stock && itemReal.stock > 0 ? (
                                        Array.from({ length: itemReal.stock }, (_, i) => i + 1).map(num => (
                                            <option key={num} value={num}>
                                                {num} {num === 1 ? 'unidad' : 'unidades'}
                                            </option>
                                        ))
                                    ) : (
                                        <option value={0}>Agotado</option>
                                    )}
                                </Form.Select>
                            </Form.Group>

                            <Col xs={12} sm={8}>
                                <Button
                                    className="btn-barber-action product-theme-btn w-100"
                                    onClick={handleAddToCart}
                                    disabled={!itemReal.stock || itemReal.stock <= 0}
                                >
                                    {itemReal.stock && itemReal.stock > 0 ? "Añadir al Carrito" : "Agotado Temporalmente"}
                                </Button>
                            </Col>
                        </Row>
                    </div>
                )}

                <Button className="btn-barber-back w-100 mt-3" onClick={() => navigate("/library")}>
                    Volver al Catálogo
                </Button>
            </Card.Body>
        </Card>
    );
};

export default ProductDetails;