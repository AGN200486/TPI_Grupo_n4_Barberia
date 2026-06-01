import { useState, useEffect } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext"; 
import { toast } from "react-toastify";

const NewProduct = ({ onProductAdded }) => {
    const navigate = useNavigate();
    const { user } = useAuth(); 

    const [name, setName] = useState("");
    const [description, setDescription] = useState(""); 
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isService, setIsService] = useState(false); 

    useEffect(() => {
        if (user?.rol !== "admin" && user?.rol !== "superadmin") {
            toast.warn("No tenés permisos para agregar elementos.");
            navigate("/library", { replace: true });
        }
    }, [user, navigate]);

    const handleNameChange = (event) => setName(event.target.value);
    const handleDescriptionChange = (event) => setDescription(event.target.value);
    const handlePriceChange = (event) => setPrice(event.target.value);
    const handleStockChange = (event) => setStock(event.target.value);
    const handleImageUrlChange = (event) => setImageUrl(event.target.value);
    const handleTypeChange = (event) => setIsService(event.target.value === "servicio");

    const handleAddProduct = (event) => {
        event.preventDefault();

        const productData = {
            name: name,
            description: description,
            price: Number(price), 
            stock: Number(stock), 
            imageUrl: imageUrl,
            isService: isService 
        };

        fetch('http://localhost:3000/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().then((errorData) => {
                        throw new Error(errorData.message || 'Error al guardar el elemento');
                    });
                }
                return res.json();
            })
            .then(() => {
                toast.success("¡Ítem agregado correctamente!");
                onProductAdded();
                navigate("/library");
            })
            .catch((err) => {
                console.error("Error detallado:", err);
                toast.error(err.message || "No se pudo guardar el ítem en el servidor.");
            });
    };

    return (
        <Card className="m-4 w-50 mx-auto bg-dark text-white border border-secondary shadow">
            <Card.Body>
                <h4 className="mb-4 text-center">Agregar Nuevo Ítem</h4>
                <Form onSubmit={handleAddProduct}>
                    
                    <Form.Group className="mb-3" controlId="tipo">
                        <Form.Label>Tipo de Ítem</Form.Label>
                        <Form.Select className="bg-secondary text-white border-0" onChange={handleTypeChange}>
                            <option value="producto">Producto Físico (Venta/Carrito)</option>
                            <option value="servicio">Servicio de Barbería (Para Reserva)</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type="text" placeholder="Ej: Cera / Corte Facha" value={name} onChange={handleNameChange} required />
                    </Form.Group>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="price">
                            <Form.Label>Precio ($)</Form.Label>
                            <Form.Control type="number" placeholder="Ej: 2500" value={price} onChange={handlePriceChange} required />
                        </Form.Group>

                        <Form.Group as={Col} controlId="stock">
                            <Form.Label>{isService ? "Turnos por día" : "Stock disponible"}</Form.Label>
                            <Form.Control type="number" placeholder="Ej: 10" value={stock} onChange={handleStockChange} required />
                        </Form.Group>
                    </Row>
                    
                    <Form.Group className="mb-3" controlId="imageUrl">
                        <Form.Label>URL de la Imagen</Form.Label>
                        <Form.Control type="text" placeholder="https://..." value={imageUrl} onChange={handleImageUrlChange} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Detalles del producto o servicio..." value={description} onChange={handleDescriptionChange} />
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <Button variant="secondary" onClick={() => navigate("/library")}>Volver</Button>
                        <Button variant="success" type="submit">Guardar en Servidor</Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default NewProduct;