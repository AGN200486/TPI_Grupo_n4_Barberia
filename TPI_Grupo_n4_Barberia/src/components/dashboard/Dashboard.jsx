import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router';
import { Button } from 'react-bootstrap';
import ProductDetails from '../productDetails/ProductDetails';
import NewProduct from '../newProduct/NewProduct';


const Dashboard = ({ onLogout }) => {
    const [products, setBooks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:3000/books")
            .then(res => res.json())
            .then(data => setBooks([...data]))
            .catch(error => console.log(error))
    }, []);

    const handleProductAdded = (enteredProduct) => {
        fetch("http://localhost:3000/books", {
            headers: {
                "Content-type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(enteredProduct)
        })
            .then(res => res.json())
            .then(data => {
                setProducts(prevProduct => [data, ...prevProduct])
            })
            .catch(err => console.log(err))
    };

    const handleDeleteProduct = (enteredProduct, id) => {
        fetch("http://localhost:3000/books", {
            headers: {
                "Content-type": "application/json"
            },
            method: "DELETE",
            body: JSON.stringify(enteredProduct)
        })
            .then(res => res.json())
            .then(data => {
                setBooks((enteredProduct) => enteredProduct.filter((product) => product.id !== id))
            })
            .catch(err => console.log(err))
    };

    const handleNavigateAddProduct = () => {
        navigate("/library/add-product", { replace: true });
    };

    const handleLogout = () => {
        onLogout();
        navigate("/login");
    };

    return (
        <div>
            <div className="d-flex justify-content-end gap-2 p-2">
                <Button variant="success" onClick={handleNavigateAddProduct}>
                    Agregar producto
                </Button>
                <Button variant="secondary" onClick={handleLogout}>
                    Cerrar sesión
                </Button>
            </div>
            <h2 className="text-center">Barberia</h2>
            <p className="text-center">¡Quiero quedar re facha!</p>
            <Routes>
                <Route
                    index
                    element={
                        <Product product={product} onDelete={handleDeleteProduct} />
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
