import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useSearchParams } from 'react-router';
import { Button } from 'react-bootstrap';
import Product from '../product/Product';
import ProductDetails from '../productDetails/ProductDetails';
import NewProduct from '../newProduct/NewProduct';
import { useAuth } from '../../context/AuthContext'; 
import { toast } from 'react-toastify';
import "./Dashboard.css"; 

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [services, setServices] = useState([]);
    
    const [searchParams] = useSearchParams();
    const filtro = searchParams.get('tipo') || 'todos'; 

    const navigate = useNavigate();
    const { user, logout } = useAuth(); 

    // Cargar catálogo inicial
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
                setProducts(datos.filter(item => !item.isService || item.isService === 0 || item.isService === false));
                setServices(datos.filter(item => item.isService || item.isService === 1 || item.isService === true));
            })
            .catch((err) => {
                console.log(err);
                toast.error('Error al conectar con el catálogo de la barbería');
            });
    }, []);

    // Función que recarga el catálogo tras agregar o editar un elemento
    const handleProductAdded = () => {
        fetch('http://localhost:3000/products')
            .then((res) => res.json())
            .then((datos) => {
                setProducts(datos.filter(item => !item.isService || item.isService === 0 || item.isService === false));
                setServices(datos.filter(item => item.isService || item.isService === 1 || item.isService === true));
            })
            .catch((err) => console.log(err));
    };

    // Petición DELETE
    const handleDeleteProduct = (id) => {
        fetch(`http://localhost:3000/products/${id}`, {
            method: 'DELETE',
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('No se pudo eliminar el ítem');
                }
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
                            {filtro === 'servicios' && (
                                <Product product={services} onDelete={handleDeleteProduct} tipoSeccion="servicios" />
                            )}
                            {filtro === 'productos' && (
                                <Product product={products} onDelete={handleDeleteProduct} tipoSeccion="productos" />
                            )}
                            {filtro === 'todos' && (
                                <>
                                    <Product product={services} onDelete={handleDeleteProduct} tipoSeccion="servicios" />
                                    <Product product={products} onDelete={handleDeleteProduct} tipoSeccion="productos" />
                                </>
                            )}
                        </div>
                    }
                />
                
                {/*RUTA AGREGAR ÍTEM*/}
                <Route
                    path="add-product"
                    element={<NewProduct onProductAdded={handleProductAdded} />}
                />
                
                {/*RUTA EDITAR ÍTEM*/}
                <Route 
                    path="edit-product" 
                    element={<NewProduct onProductAdded={handleProductAdded} />} 
                />

                {/*RUTA DETALLES*/}
                <Route path=":id" element={<ProductDetails />} />
            </Routes>
        </div>
    );
};

export default Dashboard;