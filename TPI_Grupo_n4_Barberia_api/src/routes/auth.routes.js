import { Router } from "express";
import { registerUser, loginUser } from "../services/auth.services.js";
import { getBarbers } from "../services/auth.services.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/barbers", getBarbers);

export default router;