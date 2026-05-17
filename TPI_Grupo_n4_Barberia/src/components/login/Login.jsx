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

        if (!emailRef.current.value.length) {
            setErrors({ ...errors, email: true });
            toast.error("¡Debes completar el email!"); 
            emailRef.current.focus();
            return;
        } else if (!password.length || password.length < 7) {
            setErrors({ ...errors, password: true });
            toast.error("¡La contraseña debe tener mínimo 7 caracteres!"); 
            passwordRef.current.focus();
            return;
        }

        setErrors({ email: false, password: false });

        //Determinamos el rol simulado según el texto del email
        let rolSimulado = "cliente";
        if (email.includes("superadmin")) {
            rolSimulado = "superadmin";
        } else if (email.includes("admin")) {
            rolSimulado = "admin";
        }

        const fakeUserData = {
            email: email,
            rol: rolSimulado 
        };

        login(fakeUserData); 
        toast.success("¡Bienvenido a la Barbería!");
        navigate("/library"); 
    };

    return (
        <Card className="m-4 w-25 mx-auto bg-dark text-white border border-secondary">
            <Card.Body>
                <h3 className="text-center mb-4">Iniciar Sesión</h3>
                <Form onSubmit={handleSubmit}>
                    <FormGroup className="mb-3">
                        <Form.Control
                            type="email"
                            required
                            placeholder="Ingresar email"
                            onChange={handleEmailChange}
                            ref={emailRef}
                            value={email}
                            className={errors.email ? "border border-danger" : ""}
                        />
                    </FormGroup>
                    <FormGroup className="mb-4">
                        <Form.Control
                            type="password"
                            required
                            placeholder="Ingresar contraseña"
                            onChange={handlePasswordChange}
                            ref={passwordRef}
                            value={password}
                            className={errors.password ? "border border-danger" : ""}
                        />
                    </FormGroup>
                    <Row>
                        <Col className="d-flex justify-content-center">
                            <Button variant="primary" type="submit" className="w-100">
                                Entrar
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default Login;