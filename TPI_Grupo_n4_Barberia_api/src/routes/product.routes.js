import { Router } from "express";
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../services/product.services.js"


const router = Router();

//RUTA GET: Traer todo el catálogo 
router.get("/products", getAllProducts);

//RUTA GET: Traer un producto por ID 
router.get("/products/:id", getProductById);

//RUTA POST: Crear un nuevo ítem 
router.post("/products", createProduct);

//RUTA PUT: Modificar un ítem 
router.put("/products/:id", updateProduct);

//RUTA DELETE: Eliminar un ítem 
router.delete("/products/:id", deleteProduct);

export default router;