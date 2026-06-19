import bcrypt from 'bcrypt';
import { Product } from './models/Product.js';
import { User } from './models/User.js';

export const runSeed = async () => {
    try {
        //SEEDER DE PRODUCTOS Y SERVICIOS
        const productCount = await Product.count(); //consulta a la base de datos cuantos productos hay
        if (productCount === 0) { //Solo si la tabla está totalmente vacía entra
            await Product.bulkCreate([
                { name: "Tijera Profesional", description: "Tijera de corte microdentada para barbería", price: 25000, stock: 10, isService: false, imageUrl: "https://http2.mlstatic.com/D_NQ_NP_761016-MLU74159470319_012024-O.webp" },
                { name: "Cera Modeladora", description: "Cera efecto mate fijación fuerte", price: 8500, stock: 15, isService: false, imageUrl: "https://tse4.mm.bing.net/th/id/OIP.n37Ysoi5oABvBgw4990ZogHaHa?cb=thfvnextfalcon2&w=1200&h=1200&rs=1&pid=ImgDetMain&o=7&rm=3" },
                { name: "Corte Clásico", description: "Corte de cabello tradicional o degradé con lavado incluido", price: 12000, stock: 0, isService: true, imageUrl: "https://tse2.mm.bing.net/th/id/OIP.i2R8G6nPXcwHxtSqpsZfAQAAAA?cb=thfvnextfalcon2&rs=1&pid=ImgDetMain&o=7&rm=3" },
                { name: "Servicio de Barba", description: "Perfilado de barba completo con toalla y navaja", price: 8000, stock: 0, isService: true, imageUrl: "https://cdn.shopify.com/s/files/1/2283/7011/files/trim-your-beard_1024x1024.jpg?v=1606808497" }
            ]);
            console.log("Seeder: ¡Productos y servicios iniciales cargados con éxito!");
        }

        //SEEDER DE USUARIOS (Uno para cada rol del sistema)
        const userCount = await User.count(); //consulta a la base de datos cuantos usuarios hay
        if (userCount === 0) { //Solo si la tabla está totalmente vacía entra 
            const saltRounds = 10;

            //Hasheamos las tres contraseñas de forma segura
            const passCliente = await bcrypt.hash("cliente123", saltRounds);
            const passAdmin = await bcrypt.hash("admin123", saltRounds);
            const passSuperAdmin = await bcrypt.hash("superadmin123", saltRounds);

            await User.bulkCreate([
                {
                    name: "Juan Cliente",
                    email: "cliente@barberia.com",
                    password: passCliente,
                    role: "cliente"
                },
                {
                    name: "Franco Barbero",
                    email: "barbero@barberia.com",
                    password: passAdmin,
                    role: "admin" 
                },
                {
                    name: "Carlos Dueño",
                    email: "dueño@barberia.com",
                    password: passSuperAdmin,
                    role: "superadmin" 
                }
            ]);

            console.log("Seeder: ¡Usuarios piloto creados con éxito!");
        }

    } catch (error) {
        console.error("Error al ejecutar el seeder:", error);
    }
};