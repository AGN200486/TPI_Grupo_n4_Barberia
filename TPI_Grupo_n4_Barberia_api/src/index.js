import express from "express";
import { PORT } from "./config.js";
import { sequelize } from "./db.js";
//Importación de rutas
import productRoutes from "./routes/product.routes.js"
import authRoutes from "./routes/auth.routes.js"
import turnRoutes from "./routes/turn.routes.js"

//Importación de modelos para que Sequelize los registre al sincronizar la DB
import "./models/Product.js"
import "./models/User.js";
import "./models/Turn.js";

const app = express();

try {
  //Middleware para que Express entienda el formato JSON en las peticiones
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
  app.use(turnRoutes);

  //Sincronizar Base de Datos y levantar el servidor
  //Usamos 'alter: true' para que si cambiamos columnas en los modelos, se acomoden solas las tablas
  await sequelize.sync({ alter: true });

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
} catch (error) {
  console.error("There was an error on initialization:", error);
}
