import { Product } from "../models/Product.js";

//Obtener todos los productos y servicios
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).send("Error al obtener los productos: " + error.message);
    }
};

//Obtener un producto o servicio específico por su ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).send("Producto o servicio no encontrado.");
        }
        res.json(product);
    } catch (error) {
        res.status(500).send("Error al buscar el ítem: " + error.message);
    }
};

//Crear un nuevo producto o servicio
export const createProduct = async (req, res) => {
    try {
        //Traemos todos los campos del body
        const { name, description, price, stock, imageUrl, isService } = req.body;

        if (!name || !description) {
            return res.status(400).send("El nombre y la descripción son campos obligatorios.");
        }

        const newProduct = await Product.create({
            name,
            description,
            price,
            stock,
            imageUrl,
            isService
        });
        
        res.json(newProduct);
    } catch (error) {
        res.status(500).send("Error al crear el ítem: " + error.message);
    }
};

//Actualizar un producto o servicio existente
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, imageUrl, isService } = req.body;
        
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).send("Producto o servicio no encontrado.");
        }

        if (!name || !description) {
            return res.status(400).send("El nombre y la descripción son campos obligatorios.");
        }
        await product.update({
            name,
            description,
            price,
            stock,
            imageUrl,
            isService
        }); 
        res.send("El ítem ha sido actualizado correctamente.");
    } catch (error) {
        res.status(500).send("Error al actualizar el ítem: " + error.message);
    }
};

//Eliminar un producto o servicio
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).send("Producto o servicio no encontrado.");
        }
    
        await product.destroy();
        res.send("El ítem ha sido eliminado correctamente.");
    } catch (error) {
        res.status(500).send("Error al eliminar el ítem: " + error.message);
    }
};