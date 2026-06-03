import { useState, useRef } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const Register = () => {
    const navigate = useNavigate();

    // Estados locales para capturar los datos del formulario
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Referencias para manejar el foco visual ante errores (Igual que en tu Login)
    const nameRef = useRef(null);
    const surnameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const handleRegister = (event) => {
        event.preventDefault();

        // Validaciones básicas de negocio antes del fetch
        if (!name.trim()) {
            toast.warn("Por favor, ingresá tu nombre.");
            nameRef.current.focus();
            return;
        }
        if (!surname.trim()) {
            toast.warn("Por favor, ingresá tu apellido.");
            surnameRef.current.focus();
            return;
        }
        if (password.length < 6) {
            toast.error("La contraseña debe tener al menos 6 caracteres.");
            passwordRef.current.focus();
            return;
        }

        // Construimos el JSON con el rol por defecto de 'cliente'
        const newUser = {
            name,
            surname,
            email,
            password,
            role: "cliente" // Todo usuario registrado desde la web entra como cliente
        };

        // Promesa .then() directa al Backend al endpoint de register
        fetch("http://localhost:3000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().then((errorData) => {
                        throw new Error(errorData.message || "Error al registrar el usuario");
                    });
                }
                return res.json();
            })
            .then(() => {
                toast.success("¡Registro exitoso! Ya podés iniciar sesión.");
                navigate("/login"); // Redirige al login de inmediato para que entre al sistema
            })
            .catch((err) => {
                console.error("Error en registro:", err);
                toast.error(err.message || "No se pudo conectar con el servidor.");
            });
    };

    return (
        <Card className="m-4 w-25 mx-auto bg-dark text-white border border-secondary shadow">
            <Card.Body>
                <h4 className="mb-4 text-center">Crear Cuenta Nueva</h4>
                <Form onSubmit={handleRegister}>
                    
                    <Form.Group className="mb-3" controlId="registerName">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Ej: Juan" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            ref={nameRef}
                            required 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="registerSurname">
                        <Form.Label>Apellido</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Ej: Pérez" 
                            value={surname} 
                            onChange={(e) => setSurname(e.target.value)} 
                            ref={surnameRef}
                            required 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="registerEmail">
                        <Form.Label>Correo Electrónico</Form.Label>
                        <Form.Control 
                            type="email" 
                            placeholder="nombre@ejemplo.com" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            ref={emailRef}
                            required 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="registerPassword">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Mínimo 6 caracteres" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            ref={passwordRef}
                            required 
                        />
                    </Form.Group>

                    <div className="d-grid gap-2 mt-4">
                        <Button variant="success" type="submit">
                            Registrarse
                        </Button>
                        <Button variant="link" className="text-muted text-decoration-none p-0 mt-2" onClick={() => navigate("/login")}>
                            ¿Ya tenés cuenta? Iniciá sesión acá
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default Register;