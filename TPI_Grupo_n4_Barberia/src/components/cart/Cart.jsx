import { useEffect, useState } from "react";
import { Table, Button, Container, Row, Col, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const CartList = () => {
    const [cartItems, setCartItems] = useState([]);
    const [idItemAConfirmar, setIdItemAConfirmar] = useState(null);
    
    //Estados para la simulación de la instancia de pago
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

    // Calcular el total general sumando (precio * cantidad) de cada fila
    const totalCart = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

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
        <Container className="mt-4 p-4 bg-dark text-white rounded border border-secondary shadow">
            <h2 className="mb-4 text-center">Mi Carro de Compras</h2>

            {cartItems.length === 0 ? (
                <div className="text-center p-4">
                    <p className="text-muted fs-5">Tu carro está vacío actualmente.</p>
                    <Button variant="outline-success" onClick={() => navigate("/library")}>Ir a la Tienda</Button>
                </div>
            ) : (
                <>
                    <Table striped bordered hover variant="dark" responsive className="align-middle">
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
                            {cartItems.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.productName}</td>
                                    <td className="text-center fw-bold">{item.quantity}</td>
                                    <td>${item.price}</td>
                                    <td className="text-success fw-bold">${item.price * item.quantity}</td>
                                    <td className="text-center">
                                        {idItemAConfirmar === item.id ? (
                                            <div className="d-flex gap-2 justify-content-center">
                                                <Button variant="danger" size="sm" onClick={() => handleConfirmDelete(item.id)}>
                                                    Confirmar
                                                </Button>
                                                <Button variant="secondary" size="sm" onClick={() => setIdItemAConfirmar(null)}>
                                                    Volver
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button variant="outline-danger" size="sm" onClick={() => setIdItemAConfirmar(item.id)}>
                                                Eliminar
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Row className="mt-4 pt-3 border-top border-secondary align-items-center">
                        <Col>
                            <h4 className="text-muted">Total de la orden: <span className="text-success fw-bold">${totalCart}</span></h4>
                        </Col>
                        <Col className="text-end">
                            <Button variant="success" size="lg" className="fw-bold px-5" onClick={() => setShowCheckoutModal(true)}>
                                Proceder al Pago
                            </Button>
                        </Col>
                    </Row>
                </>
            )}

            <Modal show={showCheckoutModal} onHide={() => setShowCheckoutModal(false)} centered contentClassName="bg-dark text-white border border-secondary">
                <Modal.Header closeButton closeVariant="white" className="border-secondary">
                    <Modal.Title className="text-success">Instancia de Pago - Checkout</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleProcessPayment}>
                    <Modal.Body>
                        <p>Estás a punto de confirmar la compra de tus insumos de barbería.</p>
                        <h5 className="mb-4">Monto Final a Abonar: <span className="text-success fw-bold">${totalCart}</span></h5>
                        
                        <Form.Group className="mb-3">
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Seleccioná un método de simulación:</Form.Label>
                                <Form.Select 
                                    className="bg-secondary text-white border-0"
                                    value={paymentMethod}
                                    onChange={e => setPaymentMethod(e.target.value)}
                                >
                                    <option value="Tarjeta de Crédito (Simulada)">Tarjeta de Crédito / Débito (Mock)</option>
                                    <option value="Mercado Pago (Simulado)">Mercado Pago (Alias/CVU Mock)</option>
                                    <option value="Efectivo en el Local">Abonar en el local al retirar</option>
                                </Form.Select>
                            </Form.Group>
                        </Form.Group>
                        <Form.Text className="text-muted d-block mt-2">
                            *La confirmación vaciará tu carro mediante el servicio del Backend actualizando el stock.
                        </Form.Text>
                    </Modal.Body>
                    <Modal.Footer className="border-secondary">
                        <Button variant="secondary" onClick={() => setShowCheckoutModal(false)}>Cancelar</Button>
                        <Button variant="success" type="submit" className="fw-bold">Confirmar Pago</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default CartList;