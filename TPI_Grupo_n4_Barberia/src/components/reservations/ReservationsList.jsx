import { useEffect, useState } from "react";
import { Table, Button, Container } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./ReservationsList.css"; // 🔑 Integración de la hoja de estilos dedicada

const ReservationsList = () => {
    const { user } = useAuth();
    const [reservations, setReservations] = useState([]);
    
    // Estado para guardar el ID de la reserva que se está queriendo cancelar
    const [idReservaAConfirmar, setIdReservaAConfirmar] = useState(null);

    // Validación del rol
    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin' || user?.rol === 'admin' || user?.rol === 'superadmin';

    const loadReservations = () => {
        const token = localStorage.getItem("token"); 
        if (!token) return;
        
        fetch(`http://localhost:3000/reservations`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("No se pudieron cargar las reservas");
                return res.json();
            })
            .then(data => setReservations(data))
            .catch(err => console.error("Error al cargar reservas:", err));
    };

    useEffect(() => {
        loadReservations();
    }, [user]);

    const handleConfirmDelete = (id) => {
        const token = localStorage.getItem("token");

        fetch(`http://localhost:3000/reservations/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("No se pudo cancelar la reserva.");
                toast.success("Reserva cancelada correctamente.");
                setIdReservaAConfirmar(null);
                loadReservations(); // Recargamos la grilla limpia
            })
            .catch(err => {
                toast.error(err.message);
                setIdReservaAConfirmar(null);
            });
    };

    return (
        <Container className="barber-reservations-container shadow my-5 p-4">
            <h2 className="barber-reservations-title mb-4 text-center">Gestión de Turnos y Reservas</h2>
            
            {reservations.length === 0 ? (
                <p className="barber-no-reservations text-center fs-5 my-4">
                    No hay reservas registradas en este momento.
                </p>
            ) : (
                <Table responsive bordered className="barber-table align-middle">
                    <thead>
                        <tr>
                            {/* Si es Admin, mostramos de qué cliente es el turno */}
                            {isAdmin && <th>Cliente</th>}
                            {isAdmin && <th>Email Cliente</th>}
                            <th>Barbero Asignado</th>
                            <th>Servicio / Corte</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th className="barber-actions-header text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map((res) => {
                            // Mapeo dinámico de los datos incluidos por Sequelize
                            const clienteData = res.client || {};
                            const barberoData = res.barber || {};
                            const productoData = res.Product || {};

                            return (
                                <tr key={res.id}>
                                    {/* Renderiza desde los objetos incluidos */}
                                    {isAdmin && (
                                        <td>
                                            {`${clienteData.name || 'Cliente'} ${clienteData.surname || ''}`.trim()}
                                        </td>
                                    )}
                                    {isAdmin && (
                                        <td className="barber-table-muted">
                                            {clienteData.email || "Sin email"}
                                        </td>
                                    )}
                                    
                                    <td>
                                        {`Barbero ${barberoData.name || 'Asignado'} ${barberoData.surname || ''}`.trim()}
                                    </td>
                                    <td className="barber-service-name">
                                        {productoData.name || "Servicio no disponible"}
                                    </td>
                                    <td>{res.date}</td>
                                    <td>{res.time} hs</td>
                                    <td className="text-center">
                                        {idReservaAConfirmar === res.id ? (
                                            <div className="d-flex gap-2 justify-content-center">
                                                <Button 
                                                    className="btn-barber-confirm-delete" 
                                                    size="sm" 
                                                    onClick={() => handleConfirmDelete(res.id)}
                                                >
                                                    Confirmar
                                                </Button>
                                                <Button 
                                                    className="btn-barber-cancel-back" 
                                                    size="sm" 
                                                    onClick={() => setIdReservaAConfirmar(null)}
                                                >
                                                    Volver
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button 
                                                className="btn-barber-action-trigger" 
                                                size="sm" 
                                                onClick={() => setIdReservaAConfirmar(res.id)}
                                            >
                                                {isAdmin ? "Dar de Baja" : "Cancelar Turno"}
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default ReservationsList;