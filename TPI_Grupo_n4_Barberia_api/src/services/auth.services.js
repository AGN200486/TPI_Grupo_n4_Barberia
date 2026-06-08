import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

//la clave secreta
const SECRET_KEY = "BarberiaTPI_Grupo4_SecretKey_2026";

//Middleware para verificar el token en las rutas protegidas
export const verifyToken = (req, res, next) => {
    const header = req.header("Authorization") || "";
    const token = header.split(" ")[1];

    if (!token) {
        return res.status(401).send({ message: "No autorizado" });
    }

    try {
        const payload = jwt.verify(token, SECRET_KEY);
        req.user = payload; 
        next();
    } catch (error) {
        return res.status(401).send({ message: "Token inválido" });
    }
};

//Registrar un nuevo usuario en la barbería
export const registerUser = async (req, res) => {
    try {
        const { name, surname, email, password, role } = req.body;

        const user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).send({ message: "Este mail ya está registrado" });
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            surname,
            email,
            password: hashedPassword, //contrasea hasheada
            role: role || "cliente" //cliente es el rol default
        });

        res.json({ id: newUser.id, message: "Usuario registrado con éxito." });
    } catch (error) {
        res.status(500).send({ message: "Error en el registro: " + error.message });
    }
};

//Iniciar Sesión (Login)
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).send({ message: "Usuario no existente" });
        }

        const comparison = await bcrypt.compare(password, user.password);
        if (!comparison) {
            return res.status(401).send({ message: "Email y/o contraseña incorrecta" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role }, 
            SECRET_KEY, 
            { expiresIn: "1h" }
        );

        //DEVUELVE EL TOKEN Y EL ROL DE LA BASE DE DATOS
        return res.json({
            token: token,
            role: user.role
        });
        
    } catch (error) {
        res.status(500).send({ message: "Error en el login: " + error.message });
    }
};