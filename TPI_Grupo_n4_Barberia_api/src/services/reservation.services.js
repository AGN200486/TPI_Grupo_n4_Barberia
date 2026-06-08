import Reservation from '../models/Reservation.js'

// 1. Crear una nueva reserva con validación
export const createReservation = async (req, res) => {
    try {
        const { barberName, serviceName, date, time } = req.body;
        
        // 🔑 EXTRAEMOS EL EMAIL DIRECTAMENTE DEL TOKEN DECODIFICADO POR EL MIDDLEWARE
        const clientEmail = req.user.email; 
        // Como el token no tiene el nombre, usamos la primera parte del email o "Cliente Registrado"
        const clientName = req.user.email.split('@')[0]; 

        // VALIDACIÓN CRÍTICA
        const existingReservation = await Reservation.findOne({
            where: { barberName, date, time }
        });

        if (existingReservation) {
            return res.status(400).json({ 
                message: `El barbero ${barberName} ya tiene un turno asignado para el día ${date} a las ${time} hs.` 
            });
        }

        // Creamos la reserva usando los datos seguros extraídos del Token
        const newReservation = await Reservation.create({
            clientEmail, 
            clientName, 
            barberName, 
            serviceName, 
            date, 
            time
        });

        res.status(201).json({ message: "¡Reserva confirmada con éxito!", newReservation });
    } catch (error) {
        res.status(500).json({ message: "Error al crear la reserva: " + error.message });
    }
};

// 2. Obtener reservas (Filtra si es cliente o trae todo si es Admin/Barbero)
export const getReservations = async (req, res) => {
    try {
        // 🔑 Leemos los datos directamente del Token verificado
        const emailToken = req.user.email;
        const roleToken = req.user.role; 

        if (roleToken === 'admin' || roleToken === 'superadmin') {
            // El Admin/Barbero ve TODOS los turnos de la barbería
            const allReservations = await Reservation.findAll({ order: [['date', 'ASC'], ['time', 'ASC']] });
            return res.json(allReservations);
        } else {
            // El cliente solo ve las suyas basándose en el mail de su propio Token
            const clientReservations = await Reservation.findAll({ 
                where: { clientEmail: emailToken },
                order: [['date', 'ASC'], ['time', 'ASC']]
            });
            return res.json(clientReservations);
        }
    } catch (error) {
        res.status(500).json({ message: "Error al obtener reservas: " + error.message });
    }
};

// 3. Eliminar / Cancelar Reserva
export const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await Reservation.findByPk(id);
        
        if (!reservation) {
            return res.status(404).json({ message: "La reserva no existe." });
        }

        await reservation.destroy();
        res.json({ message: "Reserva cancelada correctamente." });
    } catch (error) {
        res.status(500).json({ message: "Error al cancelar la reserva: " + error.message });
    }
};