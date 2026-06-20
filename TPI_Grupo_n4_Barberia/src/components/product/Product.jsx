import React from 'react';
import ProductItem from '../productItem/ProductItem';
import "./Product.css"; // Importamos su hoja de estilos dedicada

const Product = ({ product, onDelete }) => {
    return (
        <div className="product-grid-container d-flex justify-content-center flex-wrap">
            {product.map((item) => (
                <ProductItem
                    key={item.id}
                    item={item} 
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default Product;