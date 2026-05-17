import React from 'react';
import ProductItem from '../productItem/ProductItem';

const Product = ({ product, onDelete }) => {
    return (
        <div className="d-flex justify-content-center flex-wrap">
            {product.map((item) => (
                <ProductItem
                    key={item.id}
                    id={item.id}
                    nombre={item.nombre}
                    imageUrl={item.imageUrl}
                    available={item.available}
                    summary={item.summary}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default Product;