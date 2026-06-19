import Reservation from '../models/Reservation.js'
import { User } from '../models/User.js'
import { Product } from '../models/Product.js'

//Crear una nueva reserva con validación relacional
export const createReservation = async (req, res) => {
    try {
        //el frontend nos debe mandar barberId y productId
        const { barberId, productId, date, time } = req.body;
        
        //Extraemos el id del cliente directamente del token decodificado
        const clientId = req.user.id; 

        //Evitar que el mismo barbero tenga dos turnos a la misma hora el mismo día
        const existingReservation = await Reservation.findOne({
            where: { barberId, date, time }
        });

        if (existingReservation) {
            return res.status(400).json({ 
                message: `El barbero seleccionado ya tiene un turno asignado para el día ${date} a las ${time} hs.` 
            });
        }

        //Creamos la reserva vinculando las Claves Foráneas correctas
        const newReservation = await Reservation.create({
            clientId, 
            barberId, 
            productId, 
            date, 
            time
        });

        res.status(201).json({ message: "¡Reserva confirmada con éxito!", newReservation });
    } catch (error) {
        res.status(500).json({ message: "Error al crear la reserva: " + error.message });
    }
};

//Obtener reservas (Filtra si es cliente o trae todo si es Admin/Barbero) con INCLUDE relacionales
export const getReservations = async (req, res) => {
    try {
        const userIdToken = req.user.id;
        const roleToken = req.user.role; 

        //Configuración de los Includes para hacer los JOINs automáticos
        const includeConfig = [
            {
                model: User,
                as: 'client', //El alias que definimos en associations.js
                attributes: ['name', 'surname', 'email'] //Traemos datos limpios del cliente
            },
            {
                model: User,
                as: 'barber', //El alias que definimos en associations.js
                attributes: ['name', 'surname'] //Traemos datos limpios del barbero
            },
            {
                model: Product, //Vincula el servicio de la reserva
                attributes: ['name', 'price']
            }
        ];

        if (roleToken === 'admin' || roleToken === 'superadmin') {
            //El Admin/Barbero ve todos los turnos con los datos de quién atiende y quién viene
            const allReservations = await Reservation.findAll({ 
                include: includeConfig,
                order: [['date', 'ASC'], ['time', 'ASC']] 
            });
            return res.json(allReservations);
        } else {
            //El cliente solo ve sus propios turnos basándose en su ID del Token
            const clientReservations = await Reservation.findAll({ 
                where: { clientId: userIdToken },
                include: includeConfig,
                order: [['date', 'ASC'], ['time', 'ASC']]
            });
            return res.json(clientReservations);
        }
    } catch (error) {
        res.status(500).json({ message: "Error al obtener reservas: " + error.message });
    }
};

//Eliminar / Cancelar Reserva
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