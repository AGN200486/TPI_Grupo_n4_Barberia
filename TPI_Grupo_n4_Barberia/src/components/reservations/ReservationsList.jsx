import { useEffect, useState } from "react";
import { Table, Button, Container } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const ReservationsList = () => {
    const { user } = useAuth();
    const [reservations, setReservations] = useState([]);
    
    // Estado para guardar el ID de la reserva que se está queriendo cancelar
    const [idReservaAConfirmar, setIdReservaAConfirmar] = useState(null);

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

    // Ejecuta la baja física en la base de datos mandando el Token obligatorio
    const handleConfirmDelete = (id) => {
        const token = localStorage.getItem("token");

        fetch(`http://localhost:3000/reservations/${id}`, { 
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}` // Llave maestra para verifyToken
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("No se pudo cancelar la reserva en el servidor.");
                toast.success("Reserva cancelada correctamente.");
                setIdReservaAConfirmar(null); // Limpiamos el estado del menú interno
                loadReservations(); // Recargamos la lista desde SQLite
            })
            .catch(err => {
                toast.error(err.message);
                setIdReservaAConfirmar(null);
            });
    };

    // Evaluamos si el rol guardado en el token es administrativo
    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin' || user?.rol === 'admin' || user?.rol === 'superadmin';

    return (
        <Container className="mt-4 p-4 bg-dark text-white rounded border border-secondary shadow">
            <h2 className="mb-4 text-center">{isAdmin ? "Panel de Turnos del Día (Barberos)" : "Mis Reservas Agendadas"}</h2>
            
            {reservations.length === 0 ? (
                <p className="text-center text-muted">No hay turnos registrados en este momento.</p>
            ) : (
                <Table striped bordered hover variant="dark" responsive className="align-middle">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Hora</th>
                            {isAdmin && <th>Cliente</th>}
                            <th>Servicio</th>
                            <th>Barbero Asignado</th>
                            <th style={{ width: '200px' }} className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map((res) => (
                            <tr key={res.id}>
                                <td>{res.date}</td>
                                <td>{res.time} hs</td>
                                {isAdmin && <td>{res.clientName || res.clientEmail}</td>}
                                <td className="text-success fw-bold">{res.serviceName}</td>
                                <td>{res.barberName}</td>
                                <td className="text-center">
                                    {/* MENÚ INTERNO DE CONFIRMACIÓN */}
                                    {idReservaAConfirmar === res.id ? (
                                        <div className="d-flex gap-2 justify-content-center animate__animated animate__fadeIn">
                                            <Button 
                                                variant="danger" 
                                                size="sm" 
                                                onClick={() => handleConfirmDelete(res.id)}
                                            >
                                                Confirmar
                                            </Button>
                                            <Button 
                                                variant="secondary" 
                                                size="sm" 
                                                onClick={() => setIdReservaAConfirmar(null)}
                                            >
                                                Volver
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button 
                                            variant="outline-danger" 
                                            size="sm" 
                                            onClick={() => setIdReservaAConfirmar(res.id)}
                                        >
                                            {isAdmin ? "Dar de Baja" : "Cancelar Turno"}
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

export default ReservationsList;