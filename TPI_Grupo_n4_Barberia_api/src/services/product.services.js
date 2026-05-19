import { Product } from "../models/Product.js";

export const getAllProducts = async (req, res) => {
    const Products = await Product.findAll();
    res.json(Products);
};

export const getProductById = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
        return res.status(404).send("Producto no encontrado.");
    }
    res,jason(product);
};

export const createProduct = async (req,res) => {
    const {name, description, price, stock} = req.body;

    if (!name || description) {
        return res.status(400).send("El name y al description son campos obligatorios.");
    };

    const newProduct = await Product.create({
        name,
        description,
        price,
        stock,
    });
    res.jason(newProduct);
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock} = req.body;
    const product = await Product.findByPk(id);
    if (!product) {
        return res.status(404).send("Producto no encontado");
    }
    if (!name || description) {
        return res.status(404).send("El name y al description son campos obligatorios.");
    }
    await product.update({
        name,
        description,
        price,
        stock,
    });
    await product.save();
    res.send("El producto ha sido actualizado correctamente.");
};

export const deleteProduct = async (req, res) => {
    const {id} = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
        return res.status(404).send("Producto no encontrado.");
    }
    await product.destroy();
    res.send("El producto ha sido eliminado correctamente.");
};