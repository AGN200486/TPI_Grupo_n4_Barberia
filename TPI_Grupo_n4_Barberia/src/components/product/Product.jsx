import React from 'react';
import ProductItem from '../productItem/ProductItem';

const Product = ({ product, onDelete }) => {
    return (
        <div className="d-flex justify-content-center flex-wrap">
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