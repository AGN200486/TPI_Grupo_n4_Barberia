import Cart from "../models/Cart.js";
import  { Product } from "../models/Product.js"; 
import { sequelize } from '../db.js'; //Importamos la conexión para manejar transacciones

//Obtener el carro del usuario autenticado
export const getCart = async (req, res) => {
    try {
        const cartItems = await Cart.findAll({ where: { userId: req.user.id } });
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el carro: " + error.message });
    }
};

//Agregar o sumar cantidad al carro
export const addToCart = async (req, res) => {
    const { productName, quantity, price } = req.body;
    try {
        //Verificar si el usuario ya tiene ese producto en su carro
        const existingItem = await Cart.findOne({
            where: { userId: req.user.id, productName: productName }
        });

        if (existingItem) {
            existingItem.quantity += parseInt(quantity);
            await existingItem.save();
            return res.json({ message: "Cantidad actualizada en el carro." });
        }

        //Si no existe, se crea la fila
        await Cart.create({
            userId: req.user.id,
            productName,
            quantity,
            price
        });
        res.status(201).json({ message: "Producto agregado al carro con éxito." });
    } catch (error) {
        res.status(500).json({ message: "Error al agregar al carro: " + error.message });
    }
};

//Eliminar un ítem del carro
export const deleteFromCart = async (req, res) => {
    try {
        await Cart.destroy({ where: { id: req.params.id, userId: req.user.id } });
        res.json({ message: "Producto eliminado del carro." });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar: " + error.message });
    }
};

//Procesa el pago y descuenta stock en base de datos
export const checkoutCart = async (req, res) => {
    //Iniciamos una transacción para asegurar que si un producto falla, no se descuente nada a medias
    const transaction = await sequelize.transaction();

    try {
        const userId = req.user.id; //Agarramos el ID del usuario desde el Token

        //Buscamos qué tiene el usuario en el carro actualmente antes de borrarlo
        const cartItems = await Cart.findAll({ where: { userId }, transaction });
        //Verificamos si tocó pagar con el carro vacío
        if (cartItems.length === 0) {
            return res.status(400).json({ message: "El carrito está vacío. No hay nada que abonar." });
        }

        //Empezamos a recorrer el carrito renglón por renglón
        for (const item of cartItems) {
            //Buscamos el producto en la tabla 'Products' que coincida con el nombre del carrito
            const product = await Product.findOne({ where: { name: item.productName }, transaction });

            //Validación por si borraron el producto del catalogo mientras estaba en el carrito
            if (!product) {
                throw new Error(`El producto "${item.productName}" ya no está disponible en el catálogo.`);
            }

            //Validamos que si es un servicio (Corte, Barba) no resta stock de producto físico
            const isService = product.isService === true || product.isService === 1;

            if (!isService) {
                //Si es un producto físico, verificamos si nos alcanza lo que queda en DBeaver
                if (product.stock < item.quantity) {
                    throw new Error(`Stock insuficiente para "${product.name}". Unidades disponibles: ${product.stock}`);
                }

                //Descontamos las unidades compradas del stock real
                product.stock -= parseInt(item.quantity, 10);
                
                ///Guardamos el producto con su nuevo stock (todavía dentro de la transacción)
                await product.save({ transaction });
            }
        }

        //Si todos los stocks se descontaron bien, vaciamos el carrito del usuario
        await Cart.destroy({ where: { userId }, transaction });

        //Consolidamos definitivamente los cambios en la base de datos
        await transaction.commit();

        res.json({ message: "Pago procesado con éxito. ¡El stock ha sido actualizado en la base de datos!" });

    } catch (error) {
        //Si saltó alguna alerta (ejemplo: te quedaste sin stock), cancelamos la operación completa
        await transaction.rollback();
        res.status(500).json({ message: "Error en el checkout: " + error.message });
    }
};