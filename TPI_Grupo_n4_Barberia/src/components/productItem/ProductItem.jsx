import { useState } from 'react';
import { useNavigate } from 'react-router';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ConfirmDeleteModal from '../ui/ConfirmDeleteModal';
import { useAuth } from '../../context/AuthContext'; 

const ProductItem = ({ id, nombre, imageUrl, available, summary, onDelete }) => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth(); 

    const handleClick = () => {
        navigate(`${id}`, {
            state: {
                product: {
                    nombre,
                    summary,
                    imageUrl,
                    available,
                },
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
        onDelete(id);
    };

    return (
        <>
            <Card className="mx-3 mb-4" style={{ width: '18rem' }}>
                
                <Card.Body>
                    <Card.Title>{nombre}</Card.Title>
                    <Card.Img variant="top" style={{width: "6rem", height: "5rem"}} src={imageUrl} />
                    <div>
                        <p>{available ? "Disponible" : "Sin Stock"}</p>
                    </div>
                    <div className="d-flex gap-2">
                        <Button variant="primary" onClick={handleClick}>
                            Seleccionar producto
                        </Button>
                        
                        {/*Solo el Dueño (superadmin) puede ver y clickear para borrar */}
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
                productName={nombre}
            />
        </>
    );
};

export default ProductItem;