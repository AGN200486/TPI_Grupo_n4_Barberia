import React from 'react';
import ProductItem from '../productItem/ProductItem';
import "./Product.css"; //Importamos su hoja de estilos dedicada

const Product = ({ product = [], onDelete, tipoSeccion }) => {
    if (!product || product.length === 0) return null;

    return (
        /*Le agregamos la clase maestra 'seccion-catalogo-barberia'*/
        <div className="seccion-catalogo-barberia barber-seccion-contenedor">
            
            <div className="text-center mb-4">
                <h2 className="barber-section-title">
                    {tipoSeccion === 'servicios' ? 'Servicios Especiales' : 'Línea de Productos'}
                </h2>
                <div className="barber-title-divider mx-auto"></div>
            </div>
            
            <div className="barber-grid-directa">
                {product.map((item) => (
                    <div key={item.id} className="barber-grid-item">
                        <ProductItem
                            item={item}
                            onDelete={onDelete}
                        />
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Product;