import React from 'react';
import ProductItem from '../productItem/ProductItem';

const Product = ({ product, onDelete }) => {
    return (
        <div className="d-flex justify-content-center flex-wrap">
            {product.map((product) => (
                <BookItem
                    key={product.id}
                    id={product.id}
                    title={product.nombre}
                    imageUrl={product.imageUrl}
                    available={product.available}
                    summary={product.summary}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default Product;