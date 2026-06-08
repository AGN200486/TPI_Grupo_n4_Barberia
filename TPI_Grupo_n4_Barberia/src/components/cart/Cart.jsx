import { useEffect, useState } from "react";
import { Table, Button, Container } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const CartList = () => {
    const [cartItems, setCartItems] = useState([]);
    const [idItemAConfirmar, setIdItemAConfirmar] = useState(null);

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

    return (
        <Container className="mt-4 p-4 bg-dark text-white rounded border border-secondary shadow">
            <h2 className="mb-4 text-center">Mi Carro de Compras</h2>

            {cartItems.length === 0 ? (
                <p className="text-center text-muted">Tu carro está vacío.</p>
            ) : (
                <Table striped bordered hover variant="dark" responsive className="align-middle">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th style={{ width: '200px' }} className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item) => (
                            <tr key={item.id}>
                                <td>{item.productName}</td>
                                <td>{item.quantity}</td>
                                <td>${item.price}</td>
                                <td className="text-center">
                                    {idItemAConfirmar === item.id ? (
                                        <div className="d-flex gap-2 justify-content-center animate__animated animate__fadeIn">
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleConfirmDelete(item.id)}
                                            >
                                                Confirmar
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => setIdItemAConfirmar(null)}
                                            >
                                                Volver
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => setIdItemAConfirmar(item.id)}
                                        >
                                            Eliminar
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default CartList;
//