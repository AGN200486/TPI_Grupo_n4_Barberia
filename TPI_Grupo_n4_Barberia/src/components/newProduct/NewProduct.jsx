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

    //Bloqueo de seguridad: si NO es admin Y TAMPOCO es superadmin, No puede agregar servicios
    useEffect(() => {
        if (user?.rol !== "admin" && user?.rol !== "superadmin") {
            toast.warn("No tenés permisos para agregar servicios.");
            navigate("/library", { replace: true });
        }
    }, [user, navigate]);

    const handleNombreChange = (event) => setNombre(event.target.value);
    const handleImageUrlChange = (event) => setImageUrl(event.target.value);
    const handleSummaryChange = (event) => setSummary(event.target.value);
    const handleAvailabilityChange = (event) => setAvailable(event.target.checked);

    const handleAddProduct = (event) => {
        event.preventDefault();

        const productData = {
            nombre: nombre,
            imageUrl: imageUrl,
            summary: summary,
            available: available
        };

        onProductAdded(productData);
        navigate("/library"); 
    };

    return (
        <Card className="m-4 w-50 mx-auto bg-dark text-white border border-secondary">
            <Card.Body>
                <h4 className="mb-4 text-center">Agregar Nuevo Servicio</h4>
                <Form onSubmit={handleAddProduct}>
                    <Form.Group className="mb-3" controlId="nombre">
                        <Form.Label>Nombre del Servicio</Form.Label>
                        <Form.Control type="text" placeholder="Ej: Corte + Barba" value={nombre} onChange={handleNombreChange} required />
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="imageUrl">
                        <Form.Label>URL de la Imagen</Form.Label>
                        <Form.Control type="text" placeholder="https://..." value={imageUrl} onChange={handleImageUrlChange} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="summary">
                        <Form.Label>Descripción Corta</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Detalles del servicio..." value={summary} onChange={handleSummaryChange} />
                    </Form.Group>

                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <Form.Check type="switch" id="available" label="¿Disponible?" checked={available} onChange={handleAvailabilityChange} />
                        <div className="d-flex gap-2">
                            <Button variant="secondary" onClick={() => navigate("/library")}>Volver</Button>
                            <Button variant="success" type="submit">Agregar</Button>
                        </div>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default NewProduct;