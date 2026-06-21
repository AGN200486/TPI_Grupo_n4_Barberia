import Cart from "../models/Cart.js";
import  { Product } from "../models/Product.js"; 
import { sequelize } from '../db.js'; 

//Obtener el carro del usuario autenticado con los datos del producto incluidos
export const getCart = async (req, res) => {
    try {
        const cartItems = await Cart.findAll({ 
            where: { userId: req.user.id },
            //SEQUELIZE: Hace un JOIN dinámico para traer el nombre, precio, etc.
            include: [{
                model: Product,
                attributes: ['name', 'price', 'isService', 'description', 'stock', 'imageUrl'] 
            }]
        });
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el carro: " + error.message });
    }
};

//Agregar o sumar cantidad al carro mediante productId
export const addToCart = async (req, res) => {
    //El frontend ahora debe mandar productId y quantity en el body
    const { productId, quantity } = req.body; 
    try {
        //Verificar si el producto existe en el catálogo
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "El producto no existe en el catálogo." });
        }

        //Verificar si el usuario ya tiene ese ID de producto en su carro
        const existingItem = await Cart.findOne({
            where: { userId: req.user.id, productId: productId }
        });

        if (existingItem) {
            existingItem.quantity += parseInt(quantity, 10);
            await existingItem.save();
            return res.json({ message: "Cantidad actualizada en el carro." });
        }

        //Si no existe, se crea la fila con las relaciones correspondientes
        await Cart.create({
            userId: req.user.id,
            productId,
            quantity
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

//Procesa el pago y descuenta stock en base de datos usando las relaciones
export const checkoutCart = async (req, res) => {
    //Iniciamos una transacción para asegurar consistencia de datos
    const transaction = await sequelize.transaction();

    try {
        const userId = req.user.id; 

        //Buscamos el carrito incluyendo el modelo Product entero
        const cartItems = await Cart.findAll({ 
            where: { userId }, 
            include: [Product], 
            transaction 
        });

        if (cartItems.length === 0) {
            return res.status(400).json({ message: "El carrito está vacío. No hay nada que abonar." });
        }

        //Recorremos renglón por renglón
        for (const item of cartItems) {
            //Sequelize guarda el producto vinculado en item.Product automáticamente
            const product = item.Product; 

            if (!product) {
                throw new Error("Uno de los productos en tu carrito ya no está disponible en el catálogo.");
            }

            //Validamos si es un servicio
            const isService = product.isService === true || product.isService === 1;

            if (!isService) {
                //Si es producto físico, controlamos el stock disponible
                if (product.stock < item.quantity) {
                    throw new Error(`Stock insuficiente para "${product.name}". Unidades disponibles: ${product.stock}`);
                }

                //Descontamos las unidades del stock real
                product.stock -= parseInt(item.quantity, 10);
                
                //Guardamos los cambios del producto dentro de la transacción
                await product.save({ transaction });
            }
        }

        //Si todo salió bien, vaciamos el carrito del usuario
        await Cart.destroy({ where: { userId }, transaction });

        //Consolidamos definitivamente en la base de datos
        await transaction.commit();

        res.json({ message: "Pago procesado con éxito. ¡El stock ha sido actualizado en la base de datos!" });

    } catch (error) {
        //Si algo falló, cancelamos la operación completa y revertimos cambios
        await transaction.rollback();
        res.status(500).json({ message: "Error en el checkout: " + error.message });
    }
};