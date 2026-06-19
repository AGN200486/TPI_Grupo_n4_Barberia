import { User } from "./User.js";
import { Product } from "./Product.js";
import Cart from "./Cart.js";
import Reservation from "./Reservation.js";

export const setupAssociations = () => {
    //Relaciones del carrito
    User.hasMany(Cart, { foreignKey: "userId", onDelete: "CASCADE" });
    Cart.belongsTo(User, { foreignKey: "userId" });

    Product.hasMany(Cart, { foreignKey: "productId", onDelete: "CASCADE" });
    Cart.belongsTo(Product, { foreignKey: "productId" });

    // Relaciones de la reserva
    //Un cliente tiene muchas reservas
    User.hasMany(Reservation, { foreignKey: "clientId", as: "clientReservations", onDelete: "CASCADE" });
    Reservation.belongsTo(User, { foreignKey: "clientId", as: "client" });

    //Un barbero tiene muchas reservas asignadas
    User.hasMany(Reservation, { foreignKey: "barberId", as: "barberReservations", onDelete: "CASCADE" });
    Reservation.belongsTo(User, { foreignKey: "barberId", as: "barber" });

    //Una reserva está asociada a un producto/servicio
    Product.hasMany(Reservation, { foreignKey: "productId", onDelete: "CASCADE" });
    Reservation.belongsTo(Product, { foreignKey: "productId" });
};