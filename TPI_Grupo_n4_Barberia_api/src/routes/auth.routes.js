import { Router } from "express";
import { 
    registerUser, 
    loginUser, 
    getBarbers, 
    verifyToken,   
    getAllUsers,
    updateUserRole  
} from "../services/auth.services.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/barbers", getBarbers);
//Primero pasa por verifyToken para autenticar, y luego ejecuta el servicio
router.get("/users", verifyToken, getAllUsers);
router.put("/users/:id/role", verifyToken, updateUserRole);

export default router;