import { useEffect, useState } from "react";
import { Table, Button, Container, Row, Col, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import "./Cart.css"; // Importamos su hoja de estilos premium

const CartList = () => {
    const [cartItems, setCartItems] = useState([]);
    const [idItemAConfirmar, setIdItemAConfirmar] = useState(null);
    
    // Estados para la simulación de la instancia de pago
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("Tarjeta de Crédito (Simulada)");
    const navigate = useNavigate();

    const loadCart = () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(`http://localhost:3000/cart`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("No se pudieron cargar los productos del carro");
                return res.json();
            })
            .then(data => setCartItems(data))
            .catch(err => console.error("Error al cargar carro:", err));
    };

    useEffect(() => {
        loadCart();
    }, []);

    const handleConfirmDelete = (id) => {
        const token = localStorage.getItem("token");

        fetch(`http://localhost:3000/cart/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("No se pudo eliminar el producto del carro.");
                toast.success("Producto eliminado correctamente.");
                setIdItemAConfirmar(null);
                loadCart();
            })
            .catch(err => {
                toast.error(err.message);
                setIdItemAConfirmar(null);
            });
    };

    // Calcula el total leyendo el objeto Product que incluyó Sequelize
    const totalCart = cartItems.reduce((acc, item) => {
        const precio = item.Product?.price || 0;
        return acc + (precio * item.quantity);
    }, 0);

    // Procesar el pago definitivo e impactar stock en Backend
    const handleProcessPayment = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        fetch(`http://localhost:3000/cart/checkout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(async res => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Hubo un error al procesar el pago.");
            
            toast.success(`¡Pago confirmado mediante ${paymentMethod}! Tu pedido está en preparación.`);
            setShowCheckoutModal(false);
            setCartItems([]); // Limpiamos el carro localmente
            navigate("/library"); // Redirige al catálogo
        })
        .catch(err => toast.error(err.message));
    };

    return (
        <Container className="cart-container mt-5 p-4 rounded shadow">
            <h2 className="cart-title mb-4 text-center">Mi Carro de Compras</h2>

            {cartItems.length === 0 ? (
                <div className="text-center p-5 empty-cart-box">
                    <p className="fs-5 mb-4">Tu carro está vacío actualmente.</p>
                    <Button className="btn-gold-outline" onClick={() => navigate("/library")}>Ir a la Tienda</Button>
                </div>
            ) : (
                <>
                    <Table responsive className="cart-table align-middle">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th className="text-center">Cantidad</th>
                                <th>Precio Unitario</th>
                                <th>Subtotal</th>
                                <th style={{ width: '200px' }} className="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => {
                                const productoData = item.Product || {};
                                const precioUnitario = productoData.price || 0;

                                return (
                                    <tr key={item.id}>
                                        <td className="product-name">{productoData.name || "Producto no disponible"}</td>
                                        <td className="text-center fw-bold product-qty">{item.quantity}</td>
                                        <td>${precioUnitario}</td>
                                        <td className="price-highlight">${precioUnitario * item.quantity}</td>
                                        <td className="text-center">
                                            {idItemAConfirmar === item.id ? (
                                                <div className="d-flex gap-2 justify-content-center">
                                                    <Button className="btn-danger-custom" size="sm" onClick={() => handleConfirmDelete(item.id)}>
                                                        Confirmar
                                                    </Button>
                                                    <Button className="btn-secondary-custom" size="sm" onClick={() => setIdItemAConfirmar(null)}>
                                                        Volver
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button className="btn-danger-outline" size="sm" onClick={() => setIdItemAConfirmar(item.id)}>
                                                    Eliminar
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>

                    <Row className="mt-4 pt-4 border-top-barber align-items-center">
                        <Col xs={12} md={6} className="text-center text-md-start mb-3 mb-md-0">
                            <h4 className="total-label">Total de la orden: <span className="price-highlight">${totalCart}</span></h4>
                        </Col>
                        <Col xs={12} md={6} className="text-center text-md-end">
                            <Button className="btn-gold px-5 py-2 fs-5" onClick={() => setShowCheckoutModal(true)}>
                                Proceder al Pago
                            </Button>
                        </Col>
                    </Row>
                </>
            )}

            {/* Modal de checkout */}
            <Modal 
                show={showCheckoutModal} 
                onHide={() => setShowCheckoutModal(false)} 
                centered 
                dialogClassName="barber-modal"
            >
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>Instancia de Pago - Checkout</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleProcessPayment}>
                    <Modal.Body>
                        <p className="modal-description">Estás a punto de confirmar la compra de tus insumos de barbería.</p>
                        <h5 className="mb-4 modal-total">Monto Final a Abonar: <span className="price-highlight">${totalCart}</span></h5>
                        
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold label-custom">Seleccioná un método de simulación:</Form.Label>
                            <Form.Select 
                                className="select-custom"
                                value={paymentMethod}
                                onChange={e => setPaymentMethod(e.target.value)}
                            >
                                <option value="Tarjeta de Crédito (Simulada)">Tarjeta de Crédito / Débito (Mock)</option>
                                <option value="Mercado Pago (Simulado)">Mercado Pago (Alias/CVU Mock)</option>
                                <option value="Efectivo en el Local">Abonar en el local al retirar</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Text className="text-muted-custom d-block mt-3">
                            *La confirmación vaciará tu carro mediante el servicio del Backend actualizando el stock real en la Base de Datos.
                        </Form.Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="btn-secondary-custom" onClick={() => setShowCheckoutModal(false)}>Cancelar</Button>
                        <Button className="btn-gold" type="submit">Confirmar Pago</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default CartList;