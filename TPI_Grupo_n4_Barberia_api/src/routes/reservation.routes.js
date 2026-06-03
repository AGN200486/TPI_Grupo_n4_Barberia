import { Router } from 'express';
import { createReservation, getReservations, deleteReservation } from '../services/reservation.services.js';
import { verifyToken } from '../services/auth.services.js'; // 👈 IMPORTAMOS TU MIDDLEWARE REAL

const router = Router();

// Le inyectamos verifyToken en el medio de la ruta para que actúe de escudo protector
router.post('/reservations', verifyToken, createReservation);
router.get('/reservations', verifyToken, getReservations);
router.delete('/reservations/:id', verifyToken, deleteReservation);

export default router;