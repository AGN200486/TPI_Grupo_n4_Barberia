import express from "express";
import { PORT } from "./config.js";
import productRoutes from "./routes/books.routes.js";
import { sequelize } from "./db.js";
import "./models/Product.js";

const app = express();

try {
  app.use(express.json());
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
  });
  app.use(productRoutes);

  await sequelize.sync();

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
} catch (error) {
  console.error("There was an error on initialization:", error);
}