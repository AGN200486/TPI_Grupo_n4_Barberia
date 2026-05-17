import { useState, useEffect } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext"; 
import { toast } from "react-toastify";

const NewProduct = ({ onProductAdded }) => {
    const navigate = useNavigate();
    const { user } = useAuth(); 
    
    const [nombre, setNombre] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [summary, setSummary] = useState(""); 
    const [available, setAvailable] = useState(false);
    const [isService, setIsService] = useState(false); //Campo para diferenciar tipo de Item (Producto o Servicio)

    useEffect(() => {
        if (user?.rol !== "admin" && user?.rol !== "superadmin") {
            toast.warn("No tenés permisos para agregar elementos.");
            navigate("/library", { replace: true });
        }
    }, [user, navigate]);

    const handleNombreChange = (event) => setNombre(event.target.value);
    const handleImageUrlChange = (event) => setImageUrl(event.target.value);
    const handleSummaryChange = (event) => setSummary(event.target.value);
    const handleAvailabilityChange = (event) => setAvailable(event.target.checked);
    const handleTypeChange = (event) => setIsService(event.target.value === "servicio");

    const handleAddProduct = (event) => {
        event.preventDefault();

        const productData = {
            nombre: nombre,
            imageUrl: imageUrl,
            summary: summary,
            available: available,
            isService: isService //Se manda la bandera al dashboard
        };

        onProductAdded(productData);
        navigate("/library"); 
    };

    return (
        <Card className="m-4 w-50 mx-auto bg-dark text-white border border-secondary">
            <Card.Body>
                <h4 className="mb-4 text-center">Agregar Nuevo Ítem</h4>
                <Form onSubmit={handleAddProduct}>
                    {/*SELECTOR: Define a qué pestaña irá a parar */}
                    <Form.Group className="mb-3" controlId="tipo">
                        <Form.Label>Tipo de Ítem</Form.Label>
                        <Form.Select className="bg-secondary text-white border-0" onChange={handleTypeChange}>
                            <option value="producto">Producto Físico (Venta/Carrito)</option>
                            <option value="servicio">Servicio de Barbería (Para Reserva)</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="nombre">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type="text" placeholder="Ej: Cera / Corte Facha" value={nombre} onChange={handleNombreChange} required />
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="imageUrl">
                        <Form.Label>URL de la Imagen</Form.Label>
                        <Form.Control type="text" placeholder="https://..." value={imageUrl} onChange={handleImageUrlChange} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="summary">
                        <Form.Label>Descripción Corta</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Detalles..." value={summary} onChange={handleSummaryChange} />
                    </Form.Group>

                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <Form.Check type="switch" id="available" label="¿Disponible / Con Stock?" checked={available} onChange={handleAvailabilityChange} />
                        <div className="d-flex gap-2">
                            <Button variant="secondary" onClick={() => navigate("/library")}>Volver</Button>
                            <Button variant="success" type="submit">Guardar</Button>
                        </div>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default NewProduct;