import express from "express";
import { runSeed } from "./seeder.js";
import { setupAssociations } from "./models/associations.js";
import { PORT } from "./config.js";
import { sequelize } from "./db.js";

//Importación de rutas
import productRoutes from "./routes/product.routes.js";
import authRoutes from "./routes/auth.routes.js";
import reservationRoutes from "./routes/reservation.routes.js";
import cartRoutes from "./routes/cart.routes.js";

//Importación de modelos para que Sequelize los registre al sincronizar la DB
import "./models/Product.js";
import "./models/User.js";
import "./models/Reservation.js";
import "./models/Cart.js";

const app = express();

//Middlewares globales (Se ejecutan siempre al recibir peticiones)
app.use(express.json());

//Configuración de CORS manual
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

//Enrutadores principales
app.use(productRoutes);
app.use(authRoutes);
app.use(reservationRoutes);
app.use(cartRoutes);

//Función asíncrona principal para inicializar la API de forma segura
const startServer = async () => {
    try {
        setupAssociations();
        //Conectar y sincronizar Base de Datos de manera segura
        await sequelize.sync({ alter: true }); //'alter: true' cuida tus datos guardados ante cambios estructurales
        console.log("Database synchronized successfully.");

        //Agregamos la ejecucion del seeder
        await runSeed();

        //Levantar el servidor de Express
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    } catch (error) {
        console.error("There was an error on initialization:", error);
    }
};

//Ejecutamos la inicialización   
startServer();