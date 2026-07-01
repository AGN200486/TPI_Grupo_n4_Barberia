import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize"; 
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

        //Controlar mínimo de 7 caracteres en el registro
        if (!password || password.length < 7) {
            return res.status(400).send({ message: "La contraseña debe tener al menos 7 caracteres." });
        }

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
            password: hashedPassword, // contraseña hasheada
            role: role || "cliente" // cliente es el rol default
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

        // Controlar mínimo de 7 caracteres en el login
        if (!password || password.length < 7) {
            return res.status(401).send({ message: "Email y/o contraseña incorrecta (mínimo 7 caracteres)" });
        }

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

        // DEVUELVE EL TOKEN Y EL ROL DE LA BASE DE DATOS
        return res.json({
            token: token,
            role: user.role
        });
        
    } catch (error) {
        res.status(500).send({ message: "Error en el login: " + error.message });
    }
};

export const getBarbers = async (req, res) => {
    try {
        const barbers = await User.findAll({
            where: {
                role: {
                    [Op.or]: ['admin', 'Admin', 'ADMIN'] // Captura cualquier variante
                }
            },
            attributes: ['id', 'name', 'surname', 'email'] // Agregamos ID y Email por seguridad
        });
        
        res.json(barbers);
    } catch (error) {
        res.status(500).send({ message: "Error al obtener los barberos: " + error.message });
    }
};

//Obtener todos los usuarios registrados (Solo Superadmin)
export const getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== 'superadmin') {
            return res.status(403).json({ message: "Acceso denegado. Se requieren permisos de Superadmin." });
        }
        //Traemos todos los usuarios pero excluimos la contraseña por seguridad
        const users = await User.findAll({
            attributes: ['id', 'name', 'surname', 'email', 'role']
        });

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios: " + error.message });
    }
};

//Modificar el rol de un usuario (Solo Superadmin)
export const updateUserRole = async (req, res) => {
    try {
        if (req.user.role !== 'superadmin') {
            return res.status(403).json({ message: "Acceso denegado. Se requieren permisos de Superadmin." });
        }

        const { id } = req.params; //El ID del usuario a modificar
        const { role } = req.body;  //El nuevo rol

        //Validar que manden un rol válido
        if (!role) {
            return res.status(400).json({ message: "Debe especificar el nuevo rol." });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        //Actualizamos el rol en la base de datos
        user.role = role.toLowerCase();
        await user.save();

        res.json({ message: `Rol del usuario ${user.email} actualizado a '${user.role}' con éxito.` });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el rol: " + error.message });
    }
};