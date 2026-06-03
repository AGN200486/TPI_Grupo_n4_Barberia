import { useRef, useState } from "react";
import { Button, Card, Col, Form, FormGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext"; 
import { toast } from "react-toastify"; 

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); 
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ email: false, password: false });
    
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setErrors({ ...errors, email: false });
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setErrors({ ...errors, password: false });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        //Validaciones
        if (!email.length) {
            setErrors({ email: true, password: false });
            toast.error("¡Debes completar el email para iniciar sesión!"); 
            emailRef.current.focus();
            return;
        }

        if (!password.length || password.length < 7) {
            setErrors({ email: false, password: true });
            toast.error("¡La contraseña debe tener mínimo 7 caracteres!"); 
            passwordRef.current.focus();
            return;
        }

        //Petición HTTP 
        fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Credenciales incorrectas o usuario no existente");
                }
                return res.json(); //Leemos el objeto { token, role } del backend
            })
            .then((data) => {
                setErrors({ email: false, password: false });
                toast.success("¡Inicio de sesión exitoso!");

                //Impactamos el token y el rol real en el contexto global
                login(data.token, data.role); 

                navigate("/library"); 
            })
            .catch((error) => {
                console.error(error);
                toast.error(error.message || "No se pudo conectar con el servidor");
            });
    };

    return (
        <Card className="m-4 w-25 mx-auto bg-dark text-white border border-secondary shadow">
            <Card.Body>
                <h3 className="text-center mb-4">Iniciar Sesión</h3>
                <Form onSubmit={handleSubmit}>
                    <FormGroup className="mb-3">
                        <Form.Control
                            type="email"
                            placeholder="Ingresar email"
                            onChange={handleEmailChange}
                            ref={emailRef}
                            value={email}
                            className={errors.email ? "border border-danger" : ""}
                        />
                        {errors.email && <p className="text-danger mt-1 mb-0">Debes completar el email para iniciar sesión.</p>}
                    </FormGroup>
                    
                    <FormGroup className="mb-4 mt-3">
                        <Form.Control
                            type="password"
                            placeholder="Ingresar contraseña"
                            onChange={handlePasswordChange}
                            ref={passwordRef}
                            value={password}
                            className={errors.password ? "border border-danger" : ""}
                        />
                        {errors.password && <p className="text-danger mt-1 mb-0">Debes completar la contraseña, mínimo 7 caracteres.</p>}
                    </FormGroup>
                    
                    <Row>
                        <Col className="d-flex justify-content-center">
                            <Button variant="primary" type="submit" className="w-100">
                                Entrar
                            </Button>
                            <Button variant="link" className="text-muted text-decoration-none p-0 mt-3 d-block mx-auto" onClick={() => navigate("/register")}>
                                ¿No tenés cuenta todavía? Registrate gratis acá
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default Login;