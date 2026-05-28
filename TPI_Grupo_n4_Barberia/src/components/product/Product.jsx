import React from 'react';
import ProductItem from '../productItem/ProductItem';

const Product = ({ product, onDelete }) => {
    return (
        <div className="d-flex justify-content-center flex-wrap">
            {product.map((item) => (
                <ProductItem
                    key={item.id}
                    id={item.id}
                    nombre={item.name}          
                    imageUrl={item.imageUrl}
                    available={item.stock > 0} 
                    summary={item.description}  
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default Product;