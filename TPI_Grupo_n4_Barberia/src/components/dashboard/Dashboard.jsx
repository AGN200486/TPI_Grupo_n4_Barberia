import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useSearchParams } from 'react-router';
import { Button } from 'react-bootstrap';
import Product from '../product/Product';
import ProductDetails from '../productDetails/ProductDetails'
import NewProduct from '../newProduct/NewProduct'
import { useAuth } from '../../context/AuthContext'; 
import { toast } from 'react-toastify';


const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [services, setServices] = useState([]);
    
    const [searchParams] = useSearchParams();
    const filtro = searchParams.get('tipo') || 'todos'; 

    const navigate = useNavigate();
    const { user, logout } = useAuth(); //Traemos el usuario logueado del contexto

    //Cargar catálogo inicial
    useEffect(() => {
        fetch('http://localhost:3000/products', {
            method: 'GET'
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('No se pudo cargar el catálogo');
                }
                return res.json();
            })
            .then((datos) => {
                //Separamos dinámicamente según 'isService'
                setProducts(datos.filter(item => !item.isService));
                setServices(datos.filter(item => item.isService));
            })
            .catch((err) => {
                console.log(err);
                toast.error('Error al conectar con el catálogo de la barbería');
            });
    }, []);

    //Esta función se llamará desde NewProduct cuando inserte con éxito en la API
    const handleProductAdded = () => {
        fetch('http://localhost:3000/products')
            .then((res) => res.json())
            .then((datos) => {
                setProducts(datos.filter(item => !item.isService));
                setServices(datos.filter(item => item.isService));
            })
            .catch((err) => console.log(err));
    };

    // PETICIÓN DELETE: Elimina físicamente el producto/servicio usando su ID 
    const handleDeleteProduct = (id) => {
        fetch(`http://localhost:3000/products/${id}`, {
            method: 'DELETE',
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('No se pudo eliminar el ítem');
                }

                //Filtramos el estado local para que desaparezca de la pantalla al instante
                setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id));
                setServices((prevServices) => prevServices.filter((s) => s.id !== id));
                toast.success('Ítem eliminado correctamente');
            })
            .catch((err) => {
                console.log(err);
                toast.error('No se pudo eliminar el ítem');
            });
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
            <div className="d-flex justify-content-end gap-2 p-2">
                {/*CONTROL DE PERMISOS: Solo admin o superadmin ven el botón de agregar */}
                {(user?.rol === 'admin' || user?.rol === 'superadmin') && (
                    <Button variant="success" onClick={handleNavigateAddProduct}>
                        + Agregar Ítem
                    </Button>
                )}
                <Button variant="secondary" onClick={handleLogoutClick}>
                    Cerrar sesión
                </Button>
            </div>
            
            <h2 className="text-center mt-3 text-white">BARBERÍA</h2>
            <p className="text-center text-muted">Gestión de Turnos y Catálogo de Productos</p>
            
            <Routes>
                <Route
                    index
                    element={
                        <div className="mt-4">
                            {filtro === 'servicios' && (
                                <>
                                    <h4 className="text-white mb-3 text-center">Nuestros Servicios</h4>
                                    <Product product={services} onDelete={handleDeleteProduct} />
                                </>
                            )}
                            {filtro === 'productos' && (
                                <>
                                    <h4 className="text-white mb-3 text-center">Productos en Venta</h4>
                                    <Product product={products} onDelete={handleDeleteProduct} />
                                </>
                            )}
                            {filtro === 'todos' && (
                                <>
                                    <h4 className="text-white mb-3">Servicios</h4>
                                    <Product product={services} onDelete={handleDeleteProduct} />
                                    <h4 className="text-white mt-5 mb-3">Productos</h4>
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