import { useState } from 'react';
import { useNavigate } from 'react-router';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ConfirmDeleteModal from '../ui/ConfirmDeleteModal';
import { useAuth } from '../../context/AuthContext'; 
import "./ProductItem.css"; // Importamos su hoja de estilos dedicada

// Recibimos 'item' (el objeto completo de la DB) enviado por el padre (Product.jsx)
const ProductItem = ({ item, onDelete }) => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth(); // Traemos el usuario logueado para verificar su rol

    // Función que se activa al tocar "Ver Detalles / Reservar"
    const handleClick = () => {
        // Viajamos a la pantalla de detalle usando el ID del producto en la URL
        navigate(`${item.id}`, {
            state: {
                product: item // Mandamos el 'item' completo para la pantalla de detalles
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
        onDelete(item.id); // Avisamos al padre que borre este ID de la lista
    };

    return (
        <>
            <Card className="barber-item-card shadow">
                <div className="barber-item-img-wrapper d-flex align-items-center justify-content-center">
                    <Card.Img 
                        variant="top" 
                        src={item.imageUrl || "https://via.placeholder.com/150?text=Barber+Shop"} 
                        className="barber-item-img"
                    />
                </div>
                
                <Card.Body className="d-flex flex-column justify-content-between p-3">
                    <div>
                        <Card.Title className="barber-item-title text-center mb-2">
                            {item.name}
                        </Card.Title>
                        
                        {!item.isService && (
                            <div className="text-center mb-3">
                                {/* Validación visual rápida de disponibilidad */}
                                <span className={`barber-stock-badge ${item.stock > 0 ? "stock-available" : "stock-empty"}`}>
                                    {item.stock > 0 ? "Disponible" : "Sin Stock"}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="d-flex flex-column gap-2 mt-2">
                        <Button className="btn-barber-select w-100" onClick={handleClick}>
                            {item.isService ? "Reservar Turno" : "Ver Producto"}
                        </Button>
                        
                                            {/* 📝 BOTÓN DE EDICIÓN ESTILIZADO */}
                        {(user?.rol === 'admin' || user?.rol === 'superadmin') && (
                            <Button 
                                className="btn-barber-edit w-100"
                                onClick={() => navigate("edit-product", { state: { editItem: item } })}
                            >
                                Editar
                            </Button>
                        )}
                        
                        {/* Solo el dueño de la barbería (superadmin) puede ver este botón de borrar */}
                        {user?.rol === 'superadmin' && (
                            <Button className="btn-barber-delete w-100" onClick={handleDeleteClick}>
                                Eliminar Ítem
                            </Button>
                        )}
                    </div>
    
                </Card.Body>
            </Card>

            {/* Modal flotante que salta para confirmar la eliminación */}
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