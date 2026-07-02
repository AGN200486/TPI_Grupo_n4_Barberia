import { useState, useEffect } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext"; 
import { toast } from "react-toastify";
import "./NewProduct.css"; 

const NewProduct = ({ onProductAdded }) => {
    const navigate = useNavigate();
    const { state } = useLocation(); 
    const { user } = useAuth(); 

    // Verificamos si existe un objeto para editar en el state
    const isEditMode = !!(state && state.editItem);
    const itemToEdit = state?.editItem || null;

    // ESTADOS: Capturan las propiedades de tu modelo Sequelize
    const [name, setName] = useState(itemToEdit ? (itemToEdit.name || "") : "");
    const [description, setDescription] = useState(itemToEdit ? (itemToEdit.description || "") : ""); 
    const [price, setPrice] = useState(itemToEdit ? itemToEdit.price : "");
    const [stock, setStock] = useState(itemToEdit ? itemToEdit.stock : "");
    const [imageUrl, setImageUrl] = useState(itemToEdit ? (itemToEdit.imageUrl || "") : "");
    const [isService, setIsService] = useState(itemToEdit ? (itemToEdit.isService === true || itemToEdit.isService === 1) : false); 

    useEffect(() => {
        if (user?.rol !== "admin" && user?.rol !== "superadmin") {
            toast.warn("No tenés permisos para acceder a esta sección.");
            navigate("/library", { replace: true });
        }
    }, [user, navigate]);

    const handleNameChange = (event) => setName(event.target.value);
    const handleDescriptionChange = (event) => setDescription(event.target.value);
    const handlePriceChange = (event) => setPrice(event.target.value);
    const handleStockChange = (event) => setStock(event.target.value);
    const handleImageUrlChange = (event) => setImageUrl(event.target.value);
    const handleTypeChange = (event) => setIsService(event.target.value === "servicio");

    const handleSaveProduct = (event) => {
        event.preventDefault();

        const productData = {
            name: name,
            description: description,
            price: Number(price), 
            stock: Number(stock), 
            imageUrl: imageUrl,
            isService: isService 
        };

        const url = isEditMode 
            ? `http://localhost:3000/products/${itemToEdit.id}` 
            : 'http://localhost:3000/products';
            
        const method = isEditMode ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        })
            .then((res) => {
                if (!res.ok) {
                    // Si falla, intentamos leer el error como texto
                    return res.text().then((text) => { throw new Error(text) });
                }
                //Si es PUT (edición) usamos text() para el string plano del backend. Si es POST usamos json()
                return isEditMode ? res.text() : res.json();
            })
            .then(() => {
                toast.success(isEditMode ? "¡Ítem modificado correctamente!" : "¡Ítem agregado correctamente!");
                if (onProductAdded) onProductAdded(); 
                navigate("/library");
            })
            .catch((err) => {
                console.error("Error detallado:", err);
                toast.error(err.message || "No se pudo guardar el ítem en el servidor.");
            });
    };

    return (
        <div className="barber-new-product-page new-product-container d-flex align-items-center justify-content-center">
            <Card className="new-product-card shadow">
                <Card.Body className="p-4">
                    <h4 className="new-product-title mb-4 text-center">
                        {isEditMode ? `Modificar Datos: ${itemToEdit.name}` : "Agregar Nuevo Ítem"}
                    </h4>
                    
                    <Form onSubmit={handleSaveProduct}>
                        
                        <Form.Group className="mb-3" controlId="tipo">
                            <Form.Label className="new-product-label">Tipo de Ítem</Form.Label>
                            <Form.Select 
                                className="new-product-select" 
                                onChange={handleTypeChange}
                                value={isService ? "servicio" : "producto"}
                                disabled={isEditMode} 
                            >
                                <option value="producto">Producto Físico (Venta/Carrito)</option>
                                <option value="servicio">Servicio de Barbería (Para Reserva)</option>
                            </Form.Select>
                            {isEditMode && (
                                <Form.Text className="text-muted">
                                    No se puede alterar la naturaleza de un ítem existente.
                                </Form.Text>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label className="new-product-label">Nombre</Form.Label>
                            <Form.Control className="new-product-input" type="text" placeholder="Ej: Cera / Corte Facha" value={name} onChange={handleNameChange} required />
                        </Form.Group>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="price">
                                <Form.Label className="new-product-label">Precio ($)</Form.Label>
                                <Form.Control className="new-product-input" type="number" placeholder="Ej: 2500" value={price} onChange={handlePriceChange} required />
                            </Form.Group>

                            <Form.Group as={Col} controlId="stock">
                                <Form.Label className="new-product-label">{isService ? "Turnos por día" : "Stock disponible"}</Form.Label>
                                <Form.Control className="new-product-input" type="number" placeholder="Ej: 10" value={stock} onChange={handleStockChange} required />
                            </Form.Group>
                        </Row>
                        
                        <Form.Group className="mb-3" controlId="imageUrl">
                            <Form.Label className="new-product-label">URL de la Imagen</Form.Label>
                            <Form.Control className="new-product-input" type="text" placeholder="https://..." value={imageUrl} onChange={handleImageUrlChange} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="description">
                            <Form.Label className="new-product-label">Descripción</Form.Label>
                            <Form.Control className="new-product-input" as="textarea" rows={3} placeholder="Detalles del producto o servicio..." value={description} onChange={handleDescriptionChange} />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button className="btn-new-product-cancel" onClick={() => navigate("/library")}>
                                Volver
                            </Button>
                            <Button className="btn-new-product-submit" type="submit">
                                {isEditMode ? "Actualizar Cambios" : "Guardar en Servidor"}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default NewProduct;