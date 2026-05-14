import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const verifyToken = (req, res, next) => {
    const header = req.header("Athorization") || "";

    const token = header.split(" ")[1];

    if (!token)
        return res.status(401).send({ message: "No autorizado" });

    try {
        const payload = jwt.verify(token, "qwer1234");
        console.log(payload);
        next();
    } catch (error) {
        return res.status(401).send({ message:  "Token invalido" });
    }
}

export const registerUser = async (req, res) => {
    const { name, email, password} = req.body;

    const user = await User.findOne({
        where: { email }
    });

    if (user)
        return res.status(400).send({ message: "Este mail ya esta registrado"});

    const saltRounds = 10;

    const salt = await bxrypt.genSalt(saltRounds);

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    res.json(newUser.id);
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        where: { email }
    });

    if (!user)
        return res.status(401).send({ message: "Usuario no existente" });

    const comparison = await bcrypt.compare(password, user.password);

    if (!comparison)
        return res.status(401).send({ message: "Email y/o contraseña incorrecta "});

    const secretKey = 'qwer1234';

    const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });

    return res.json(token);
}