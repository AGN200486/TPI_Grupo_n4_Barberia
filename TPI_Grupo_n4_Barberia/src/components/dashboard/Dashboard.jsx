import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useSearchParams } from 'react-router';
import { Button } from 'react-bootstrap';
import Product from '../product/Product';
import ProductDetails from '../productDetails/ProductDetails';
import NewProduct from '../newProduct/NewProduct';
import { useAuth } from '../../context/AuthContext'; 
import { toast } from 'react-toastify';
import "./Dashboard.css"; //Importamos su hoja de estilos dedicada

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [services, setServices] = useState([]);
    
    const [searchParams] = useSearchParams();
    //Captura "servicios", "productos" o cae en "todos" si se hace clic en Inicio
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
                // Separamos dinámicamente según 'isService' (Soporta booleanos y enteros de SQLite)
                setProducts(datos.filter(item => !item.isService || item.isService === 0 || item.isService === false));
                setServices(datos.filter(item => item.isService || item.isService === 1 || item.isService === true));
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
                setProducts(datos.filter(item => !item.isService || item.isService === 0 || item.isService === false));
                setServices(datos.filter(item => item.isService || item.isService === 1 || item.isService === true));
            })
            .catch((err) => console.log(err));
    };

    //Peticion delete: Elimina físicamente el producto/servicio usando su ID 
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


    return (
        <div className="dashboard-wrapper container mt-3 p-3 rounded">
            <div className="dashboard-actions d-flex justify-content-end gap-2 p-2">
                {/*Control de permisos: Solo admin o superadmin ven el botón de agregar*/}
                {(user?.rol === 'admin' || user?.rol === 'superadmin') && (
                    <Button className="btn-gold-admin" onClick={handleNavigateAddProduct}>
                        + Agregar Ítem
                    </Button>
                )}
            </div>
            
            <h2 className="dashboard-main-title text-center mt-3">BARBERÍA</h2>
            <p className="dashboard-subtitle text-center">Gestión de Turnos y Catálogo de Productos</p>
            
            <Routes>
                <Route
                    index
                    element={
                        <div className="mt-4">
                            {/*Mandamos cada lista limpia a su propia sección independiente*/}
                            {filtro === 'servicios' && (
                                <Product product={services} onDelete={handleDeleteProduct} tipoSeccion="servicios" />
                            )}
                            {filtro === 'productos' && (
                                <Product product={products} onDelete={handleDeleteProduct} tipoSeccion="productos" />
                            )}
                            {filtro === 'todos' && (
                                <>
                                    {/*Renderizamos el mismo componente dos veces, pasándole la lista correspondiente*/}
                                    <Product product={services} onDelete={handleDeleteProduct} tipoSeccion="servicios" />
                                    <Product product={products} onDelete={handleDeleteProduct} tipoSeccion="productos" />
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