import { useRef, useState } from "react";
import { Button, Card, Form, FormGroup } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext"; 
import { toast } from "react-toastify"; 
import "../Login&Register.css";

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

        // Validaciones
        if (!email.length) {
            setErrors({ email: true, password: false });
            toast.error("¡Debes completar el email para iniciar sesión!"); 
            emailRef.current.focus();
            return;
        }

        // Validación unificada a mínimo 7 caracteres
        if (!password.length || password.length < 7) {
            setErrors({ email: false, password: true });
            toast.error("¡La contraseña debe tener mínimo 7 caracteres!"); 
            passwordRef.current.focus();
            return;
        }

        // Petición HTTP 
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
                return res.json(); // Leemos el objeto { token, role } del backend
            })
            .then((data) => {
                setErrors({ email: false, password: false });
                toast.success("¡Inicio de sesión exitoso!");

                // Impactamos el token y el rol real en el contexto global
                login(data.token, data.role); 

                navigate("/library"); 
            })
            .catch((error) => {
                console.error(error);
                toast.error(error.message || "No se pudo conectar con el servidor");
            });
    };

    return (
        <div className="login-container d-flex align-items-center justify-content-center">
            <Card className="login-card shadow">
                <Card.Body className="p-4">
                    <h3 className="login-title text-center mb-4">Iniciar Sesión</h3>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup className="mb-3">
                            <Form.Label className="login-label">Correo Electrónico</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Ingresar email"
                                onChange={handleEmailChange}
                                ref={emailRef}
                                value={email}
                                className={`login-input ${errors.email ? "login-input-error" : ""}`}
                                required
                            />
                            {errors.email && <p className="login-error-text mt-1 mb-0">Debes completar el email para iniciar sesión.</p>}
                        </FormGroup>
                        
                        <FormGroup className="mb-3">
                            <Form.Label className="login-label">Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Mínimo 7 caracteres"
                                onChange={handlePasswordChange}
                                ref={passwordRef}
                                value={password}
                                className={`login-input ${errors.password ? "login-input-error" : ""}`}
                                minLength={7} //Atributo HTML para coincidir con la restricción
                                required
                            />
                            {errors.password && <p className="login-error-text mt-1 mb-0">Debes completar la contraseña, mínimo 7 caracteres.</p>}
                        </FormGroup>
                        
                        {/* Botones en formato bloque integrados con la estética rústica */}
                        <div className="d-grid gap-2 mt-4">
                            {/* Botón de envío clásico (submit) */}
                            <Button className="btn-barber-login-submit" type="submit">
                                Ingresar
                            </Button>
                            
                            {/* Enlace de redirección */}
                            <Button 
                                variant="link" 
                                className="btn-barber-login-link" 
                                onClick={() => navigate("/register")}
                            >
                                ¿No tenés cuenta? Registrate acá
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Login;