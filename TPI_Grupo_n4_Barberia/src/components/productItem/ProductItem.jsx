import { useState } from 'react';
import { useNavigate } from 'react-router';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ConfirmDeleteModal from '../ui/ConfirmDeleteModal';
import { useAuth } from '../../context/AuthContext'; 

const ProductItem = ({ item, onDelete }) => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth(); 

    const handleClick = () => {
        navigate(`${item.id}`, {
            state: {
                product: item 
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
        onDelete(item.id);
    };

    return (
        <>
            <Card className="mx-3 mb-4" style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>{item.name || item.nombre}</Card.Title>
                    <Card.Img variant="top" style={{width: "6rem", height: "5rem"}} src={item.imageUrl} />
                    <div>
                        <p>{item.stock > 0 ? "Disponible" : "Sin Stock"}</p>
                    </div>
                    <div className="d-flex gap-2">
                        <Button variant="primary" onClick={handleClick}>
                            Seleccionar producto
                        </Button>
                        
                        {user?.rol === 'superadmin' && (
                            <Button variant="danger" onClick={handleDeleteClick}>
                                Eliminar
                            </Button>
                        )}
                    </div>
                </Card.Body>
            </Card>
            <ConfirmDeleteModal
                show={showModal}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
                productName={item.name || item.nombre}
            />
        </>
    );
};

export default ProductItem;