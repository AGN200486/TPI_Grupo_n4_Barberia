import { Router } from "express";
import { getAllTurns, getTurnById, createTurn, updateTurnStatus, deleteTurn } from "../services/turn.services.js"
import { verifyToken } from "../services/auth.services.js";

const router = Router();

//Todas las rutas de turnos requieren autenticación
router.get("/turns", verifyToken, getAllTurns);
router.get("/turns/:id", verifyToken, getTurnById);
router.post("/turns", verifyToken, createTurn);

//Usamos PUT para cambiar el estado
router.put("/turns/:id/status", verifyToken, updateTurnStatus);

//Eliminar físicamente un turno 
router.delete("/turns/:id", verifyToken, deleteTurn);

export default router;