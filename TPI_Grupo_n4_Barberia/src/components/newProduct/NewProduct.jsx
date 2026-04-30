import { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router";

const NewProduct = ({ onProductAdded }) => {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [available, setAvailable] = useState(false);

    const handleNombreChange = (event) => {
        setNombre(event.target.value);
    };

    const handleImageUrlChange = (event) => {
        setImageUrl(event.target.value);
    };

    const handleAvailabilityChange = (event) => {
        setAvailable(event.target.checked);
    };

    const handleAddProduct = (event) => {
        event.preventDefault();

        const productData = {
            "nombre": nombre,
            "imageUrl": imageUrl,
            "available": available
        };

        onProductAdded(productData);

        setNombre("");
        setImageUrl("");
        setAvailable(false);
    };

    return (
        <Card className="m-4 w-50" bg="success">
            <Card.Body>
                <Form className="text-white" onSubmit={handleAddProduct}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="nombre">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingresar Nombre"
                                    value={nombre}
                                    onChange={handleNombreChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>    
                    <Row className="justify-content-between">
                        <Form.Group className="mb-3" controlId="imageUrl">
                            <Form.Label>URL de imagen</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresar url de imagen"
                                value={imageUrl}
                                onChange={handleImageUrlChange}
                            />
                        </Form.Group>
                    </Row>
                    <Row className="justify-content-end">
                        <Col md={3} className="d-flex flex-column justify-content-end align-items-end">
                            <Form.Check
                                type="switch"
                                id="available"
                                className="mb-3"
                                label="¿Disponible?"
                                checked={available}
                                onChange={handleAvailabilityChange}
                            />
                            <div className="d-flex gap-2">
                                <Button variant="secondary" onClick={() => navigate("/library")}>
                                    Volver
                                </Button>
                                <Button variant="primary" type="submit">
                                    Agregar
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default NewProduct;