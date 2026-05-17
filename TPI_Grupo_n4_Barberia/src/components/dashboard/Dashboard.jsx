import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router';
import { Button } from 'react-bootstrap';
import Product from '../product/Product'; 
import ProductDetails from '../productDetails/ProductDetails';
import NewProduct from '../newProduct/NewProduct';
import { useAuth } from '../../context/AuthContext'; //Importamos la nube global
import { toast } from 'react-toastify';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const { user, logout } = useAuth(); 

    useEffect(() => {
        fetch("http://localhost:3000/api/servicios")
            .then(res => res.json())
            .then(data => setProducts([...data]))
            .catch(error => console.log("Error al cargar servicios:", error))
    }, []);

    const handleProductAdded = (enteredProduct) => {
        fetch("http://localhost:3000/api/servicios", {
            headers: {
                "Content-type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(enteredProduct)
        })
            .then(res => res.json())
            .then(data => {
                setProducts(prevProduct => [data, ...prevProduct]);
                toast.success("¡Servicio agregado correctamente!");
            })
            .catch(err => toast.error("Error al agregar el servicio"))
    };

    const handleDeleteProduct = (id) => {
        fetch(`http://localhost:3000/api/servicios/${id}`, {
            method: "DELETE"
        })
            .then(res => {
                if (res.ok) {
                    setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
                    toast.success("¡Servicio eliminado!");
                }
            })
            .catch(err => toast.error("Error al eliminar el servicio"))
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
        <div>
            <div className="d-flex justify-content-end gap-2 p-2">
                {/* CONDICIÓN: El botón de agregar solo se muestra si el rol es admin o superadmin */}
                {(user?.rol === 'admin' || user?.rol === 'superadmin') && (
                    <Button variant="success" onClick={handleNavigateAddProduct}>
                        Agregar servicio
                    </Button>
                )}
                <Button variant="secondary" onClick={handleLogoutClick}>
                    Cerrar sesión
                </Button>
            </div>
            <h2 className="text-center mt-3 text-white">Barbería</h2>
            <p className="text-center text-muted">¡Quiero quedar re facha!</p>
            
            <Routes>
                <Route
                    index
                    element={
                        <Product product={products} onDelete={handleDeleteProduct} />
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