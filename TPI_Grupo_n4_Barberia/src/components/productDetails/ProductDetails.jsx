import { useLocation, useNavigate } from "react-router";
import { Button, Card } from "react-bootstrap";

const ProductDetails = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    
    if (!state || !state.product) {
        return <p className="text-center mt-4 text-white">No se encontraron detalles del servicio.</p>;
    }

    const { nombre, summary, imageUrl, available } = state.product;

    return (
        <div className="d-flex justify-content-center mt-4">
            <Card style={{ width: "22rem" }} className="bg-dark text-white border border-secondary">
                <Card.Img variant="top" src={imageUrl || "https://via.placeholder.com/150"} />
                <Card.Body>
                    <Card.Title className="fs-3">{nombre}</Card.Title>
                    <p className={`mb-2 fw-bold ${available ? "text-success" : "text-danger"}`}>
                        {available ? " Disponible" : " Sin turnos por hoy"}
                    </p>
                    <p>
                        <strong>Descripción:</strong> {summary || "Sin descripción disponible."}
                    </p>
                    <Button variant="outline-light" className="w-100 mt-2" onClick={() => navigate("/library", { replace: true })}>
                        Volver a la barbería
                    </Button>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ProductDetails;