import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router';
import { Button } from 'react-bootstrap';
import Product from '../product/Product';
import ProductDetails from '../productDetails/ProductDetails';
import NewProduct from '../newProduct/NewProduct';
import { useAuth } from '../../context/AuthContext'; 
import { toast } from 'react-toastify';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [services, setServices] = useState([]);
    
    //Este estado controla qué lista se muestra en pantalla: 'todos', 'servicios' o 'productos'
    const [filtro, setFiltro] = useState('servicios'); 
    
    const navigate = useNavigate();
    const { user, logout } = useAuth(); 

    useEffect(() => {
        const productosIniciales = [
            { id: "p1", nombre: "Cera Pomada Matte", imageUrl: "https://via.placeholder.com/150", available: true, summary: "Fijación fuerte y efecto opaco natural." },
            { id: "p2", nombre: "Tijera de Pulir 5.5", imageUrl: "https://via.placeholder.com/150", available: true, summary: "Tijera profesional de acero inoxidable." }
        ];

        const serviciosIniciales = [
            { id: "s1", nombre: "Corte Clásico", imageUrl: "https://via.placeholder.com/150", available: true, summary: "Corte tradicional a tijera y máquina." },
            { id: "s2", nombre: "Corte Degradé + Barba", imageUrl: "https://via.placeholder.com/150", available: true, summary: "Degradé moderno con perfilado de barba." }
        ];

        setProducts(productosIniciales);
        setServices(serviciosIniciales);
    }, []);

    const handleProductAdded = (enteredData) => {
        const nuevoItemSimulado = {
            ...enteredData,
            id: Math.random().toString()
        };

        if (enteredData.isService) {
            setServices(prev => [nuevoItemSimulado, ...prev]);
            toast.success("¡Servicio agregado correctamente! (Simulado)");
        } else {
            setProducts(prev => [nuevoItemSimulado, ...prev]);
            toast.success("¡Producto agregado correctamente! (Simulado)");
        }
    };

    const handleDeleteProduct = (id) => {
        if (id.startsWith('s')) {
            setServices(prev => prev.filter(s => s.id !== id));
        } else {
            setProducts(prev => prev.filter(p => p.id !== id));
        }
        toast.success("¡Ítem eliminado! (Simulado)");
    };

    const handleNavigateAddProduct = () => {
        navigate("/library/add-product", { replace: true });
    };

    const handleLogoutClick = () => {
        logout(); 
        toast.info("Sesión cerrada");
        navigate("/login"); 
    };

    return (
        <div className="container mt-2">
            {/* BARRA SUPERIOR: Ahora los botones controlan el estado del filtro */}
            <div className="d-flex justify-content-end gap-2 p-2">
                <Button 
                    variant={filtro === 'servicios' ? "primary" : "outline-primary"} 
                    onClick={() => setFiltro('servicios')}
                >
                    Servicios
                </Button>
                <Button 
                    variant={filtro === 'productos' ? "primary" : "outline-primary"} 
                    onClick={() => setFiltro('productos')}
                >
                    Productos
                </Button>
                <Button 
                    variant="outline-light" 
                    onClick={() => setFiltro('todos')}
                >
                    Ver Todos
                </Button>

                {(user?.rol === 'admin' || user?.rol === 'superadmin') && (
                    <Button variant="success" onClick={handleNavigateAddProduct}>
                        + Agregar Ítem
                    </Button>
                )}
                <Button variant="secondary" onClick={handleLogoutClick}>
                    Cerrar sesión
                </Button>
            </div>
            
            <h2 className="text-center mt-3 text-white">AGN FERRETERÍA & BARBERÍA</h2>
            <p className="text-center text-muted">Gestión de Turnos y Catálogo de Productos</p>
            
            <Routes>
                <Route
                    index
                    element={
                        <div className="mt-4">
                            {/* Mostramos la lista que corresponda según el botón presionado */}
                            {filtro === 'servicios' && <Product product={services} onDelete={handleDeleteProduct} />}
                            {filtro === 'productos' && <Product product={products} onDelete={handleDeleteProduct} />}
                            {filtro === 'todos' && (
                                <>
                                    <h4 className="text-white mb-3">Servicios</h4>
                                    <Product product={services} onDelete={handleDeleteProduct} />
                                    <h4 className="text-white mt-4 mb-3">Productos</h4>
                                    <Product product={products} onDelete={handleDeleteProduct} />
                                </>
                            )}
                        </div>
                    }
                />
                <Route
                    path="add-product"
                    element={<NewProduct onProductAdded={handleProductAdded} />}
                />
                <Route path=":id" element={<ProductDetails />} />
            </Routes>
        </div>
    );
};

export default Dashboard;