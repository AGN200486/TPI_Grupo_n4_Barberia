import { useLocation, useNavigate } from "react-router";
import { Button, Card } from "react-bootstrap";

const ProductDetails = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { nombre, summary, imageUrl, available } = state.product;

    return (
        <div className="d-flex justify-content-center mt-4">
            <Card style={{ width: "22rem" }}>
                <Card.Img variant="top" src={imageUrl} />
                <Card.Body>
                    <Card.Title>{nombre}</Card.Title>
                    <p className="mb-1">
                        {available ? "Disponible" : "Sin Stock"}
                    </p>
                    <p>
                        <strong>Descripcion:</strong> {summary}
                    </p>
                    <Button onClick={() => navigate("/library", { replace: true })}>
                        Volver a la página principal
                    </Button>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ProductDetails;