import { useState } from 'react';
import { useNavigate } from 'react-router';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ConfirmDeleteModal from '../ui/ConfirmDeleteModal';
import { useAuth } from '../../context/AuthContext'; 

//Recibimos 'item' (el objeto completo de la DB) enviado por el padre (Product.jsx)
const ProductItem = ({ item, onDelete }) => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth(); //Traemos el usuario logueado para verificar su rol

    //Función que se activa al tocar "Seleccionar producto"
    const handleClick = () => {
        //Viajamos a la pantalla de detalle usando el ID del producto en la URL
        navigate(`${item.id}`, {
            state: {
                product: item //Mandamos el 'item' completo, para que la pantalla de detalles tenga toda la info de entrada
            },
        });
    };

    const handleDeleteClick = () => {
        setShowModal(true);
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    const handleConfirmDelete = () => {
        setShowModal(false);
        onDelete(item.id); //Avisamos al padre que borre este ID de la lista
    };

    return (
        <>
            <Card className="mx-3 mb-4" style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Img variant="top" style={{width: "6rem", height: "5rem"}} src={item.imageUrl} />
                    <div>
                        {/*Validación visual rápida de stock para el cliente*/}
                        <p>{item.stock > 0 ? "Disponible" : "Sin Stock"}</p>
                    </div>
                    <div className="d-flex gap-2">
                        <Button variant="primary" onClick={handleClick}>
                            Seleccionar producto
                        </Button>
                        {/*Solo el dueño de la barbería (superadmin) puede ver este botón de borrar*/}
                        {user?.rol === 'superadmin' && (
                            <Button variant="danger" onClick={handleDeleteClick}>
                                Eliminar
                            </Button>
                        )}
                    </div>
                </Card.Body>
            </Card>
            {/*Modal flotante que salta para confirmar la eliminación*/}
            <ConfirmDeleteModal
                show={showModal}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
                productName={item.name}
            />
        </>
    );
};

export default ProductItem;