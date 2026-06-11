import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Button, Card, Form, Row, Col, Alert } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const ProductDetails = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    // 1. Validamos que el viaje haya existido antes de declarar otros estados
    if (!state || !state.product) {
        return <p className="text-center text-white mt-5">No se seleccionó ningún ítem válido.</p>;
    }

    // --- ESTADOS ---
    const [date, setDate] = useState("");
    const [time, setTime] = useState("09:00");
    const [barbersList, setBarbersList] = useState([]); 
    const [barber, setBarber] = useState("");
    const [dateError, setDateError] = useState("");      
    const [productQuantity, setProductQuantity] = useState(1); 
    const [timeSlots, setTimeSlots] = useState([]); 
    
    // El estado se inicializa con los datos del viaje
    const [itemReal, setItemReal] = useState(state.product);

    // --- EFFECT: TRAER LOS DATOS FRESCOS DEL PRODUCTO DESDE EL BACKEND ---
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

    // --- EFFECT: CARGA DINÁMICA DE BARBEROS ---
    useEffect(() => {
        fetch("http://localhost:3000/barbers")
            .then(res => {
                if (!res.ok) throw new Error("No se pudieron cargar los barberos.");
                return res.json();
            })
            .then(data => {
                setBarbersList(data);
                if (data.length > 0) {
                    const primerBarbero = `${data[0].name || ''} ${data[0].surname || ''}`.trim() || data[0].email;
                    setBarber(primerBarbero);
                }
            })
            .catch(err => console.error("Error al cargar barberos:", err));
    }, []);

    // --- CONTROLADOR DE CAMBIO DE FECHA Y HORARIOS DINÁMICOS ---
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

    // --- FUNCIÓN PARA AGENDAR EL TURNO ---
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
            barberName: barber,
            serviceName: itemReal.name,
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

    // --- FUNCIÓN PARA AGREGAR AL CARRITO ---
    const handleAddToCart = () => {
        if (!user) {
            toast.warn("Debés iniciar sesión para agregar productos al carro.");
            return navigate("/login");
        }

        const token = localStorage.getItem("token");
        const cartData = {
            productName: itemReal.name,
            quantity: productQuantity,
            price: itemReal.price 
        };

        fetch('http://localhost:3000/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(cartData)
        })
        .then(res => {
            if (!res.ok) throw new Error("No se pudo agregar al carrito");
            return res.json();
        })
        .then(() => {
            toast.success(`¡${productQuantity}x ${cartData.productName} agregado/s al carro!`);
            navigate("/cart");
        })
        .catch(err => toast.error(err.message));
    };

    // Validación de tipo de ítem
    const isServiceItem = itemReal.isService === true || 
                          itemReal.isService === 1 ||  
                          (itemReal.name && itemReal.name.toLowerCase().includes("corte")) || 
                          (itemReal.name && itemReal.name.toLowerCase().includes("barba"));

    return (
        <Card className="m-4 w-50 mx-auto bg-dark text-white border border-secondary shadow">
            <Card.Img variant="top" src={itemReal.imageUrl || itemReal.imagen || null} style={{ maxHeight: '350px', objectFit: 'cover' }} />
            <Card.Body>
                <h2>{itemReal.name}</h2>
                <p className="text-muted">{itemReal.description || itemReal.summary}</p>
                
                {isServiceItem ? (
                    /* 💈 SECCIÓN PARA RESERVAR TURNOS */
                    <Form onSubmit={handleBooking} className="mt-4 border-top border-secondary pt-3">
                        <h4 className="text-success mb-3">Reservar Turno (Duración: 30 min)</h4>
                        
                        {barbersList.length === 0 && (
                            <Alert variant="danger">
                                ⚠️ No hay barberos registrados con el rol 'admin' en la base de datos.
                            </Alert>
                        )}

                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>Elegí tu Barbero</Form.Label>
                                <Form.Select 
                                    className="bg-secondary text-white border-0" 
                                    value={barber} 
                                    onChange={e => setBarber(e.target.value)}
                                    required
                                    disabled={barbersList.length === 0}
                                >
                                    {barbersList.length === 0 ? (
                                        <option value="">No hay barberos registrados...</option>
                                    ) : (
                                        barbersList.map((b) => {
                                            const nombreCompleto = `${b.name || ''} ${b.surname || ''}`.trim() || b.email;
                                            return (
                                                <option key={b.id} value={nombreCompleto}>
                                                    {nombreCompleto}
                                                </option>
                                            );
                                        })
                                    )}
                                </Form.Select>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>Fecha</Form.Label>
                                <Form.Control 
                                    type="date" 
                                    value={date} 
                                    onChange={handleDateChange} 
                                    required 
                                    isInvalid={!!dateError}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {dateError}
                                </Form.Control.Feedback>
                            </Form.Group>
                            
                            <Form.Group as={Col}>
                                <Form.Label>Hora disponible</Form.Label>
                                <Form.Select 
                                    className="bg-secondary text-white border-0" 
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
                            variant="success" 
                            type="submit" 
                            className="w-100 mt-2"
                            disabled={!!dateError || barbersList.length === 0 || !date}
                        >
                            Confirmar Turno
                        </Button>
                    </Form>
                    
                ) : (
                    /* 🛒 SECCIÓN PARA COMPRAR PRODUCTOS EN GÓNDOLA */
                    <div className="mt-4 border-top border-secondary pt-3">
                        <h4 className="text-warning mb-3">Comprar Producto (Unidades en Góndola)</h4>
                        
                        <p className="text-info fs-5 mb-1">
                            Stock disponible: <span className="fw-bold">{itemReal.stock !== undefined ? itemReal.stock : 0} unidades</span>
                        </p>
                        <p className="text-success fw-bold fs-4">
                            Precio Unitario: ${itemReal.price !== undefined ? itemReal.price : "0.00"}
                        </p>
                        
                        <Row className="mb-3 align-items-end">
                            <Form.Group as={Col} xs={4}>
                                <Form.Label>Cantidad:</Form.Label>
                                <Form.Select 
                                    className="bg-secondary text-white border-0"
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
                                        <option value={0}>Sin stock</option>
                                    )}
                                </Form.Select>
                            </Form.Group>
                            
                            <Col>
                                <Button 
                                    variant="warning" 
                                    className="w-100 fw-bold text-dark" 
                                    onClick={handleAddToCart}
                                    disabled={!itemReal.stock || itemReal.stock <= 0}
                                >
                                    {itemReal.stock && itemReal.stock > 0 ? "Añadir al Carrito" : "Agotado Temporalmente"}
                                </Button>
                            </Col>
                        </Row>
                    </div>
                )}
                
                <Button variant="secondary" className="mt-3" onClick={() => navigate("/library")}>Volver al Catálogo</Button>
            </Card.Body>
        </Card>
    );
};

export default ProductDetails;