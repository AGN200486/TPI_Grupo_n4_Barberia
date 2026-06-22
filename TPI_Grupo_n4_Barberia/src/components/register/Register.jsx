import { useState, useRef } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import "../Login&Register.css";

const Register = () => {
    const navigate = useNavigate();

    //Estados locales para capturar los datos del formulario
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //Referencias para manejar el foco visual ante errores
    const nameRef = useRef(null);
    const surnameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const handleRegister = (event) => {
        event.preventDefault();

        //Validar que no haya campos vacíos o con puros espacios
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
        if (!email.trim()) {
            toast.warn("Por favor, ingresá tu correo electrónico.");
            emailRef.current.focus();
            return;
        }

        //Validar formato de Email real usando una Expresión Regular (Regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Por favor, ingresá un correo electrónico válido (ejemplo@dominio.com).");
            emailRef.current.focus();
            return;
        }

        //Validar los 7 caracteres de la contraseña
        if (password.length < 7) {
            toast.error("La contraseña debe tener un mínimo de 7 caracteres.");
            passwordRef.current.focus();
            return;
        }

        //Si pasa todas las validaciones, arma el objeto y hace el fetch
        const newUser = {
            name: name.trim(),
            surname: surname.trim(),
            email: email.trim(),
            password,
            role: "cliente"
        };

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
                navigate("/login");
            })
            .catch((err) => {
                console.error("Error en registro:", err);
                toast.error(err.message || "No se pudo conectar con el servidor.");
            });
    };

    return (
        /*Envolvemos con el contenedor flex de autenticación*/
        <div className="barber-auth-page">
            <Card className="barber-register-card shadow my-5 mx-auto">
                <Card.Body className="p-4">
                    <h4 className="barber-register-title mb-4 text-center">Crear Cuenta Nueva</h4>
                    <Form onSubmit={handleRegister}>

                        <Form.Group className="mb-3" controlId="registerName">
                            <Form.Label className="barber-register-label">Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                className="barber-register-input"
                                placeholder="Ej: Juan"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                ref={nameRef}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="registerSurname">
                            <Form.Label className="barber-register-label">Apellido</Form.Label>
                            <Form.Control
                                type="text"
                                className="barber-register-input"
                                placeholder="Ej: Pérez"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                ref={surnameRef}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="registerEmail">
                            <Form.Label className="barber-register-label">Correo Electrónico</Form.Label>
                            <Form.Control
                                type="email"
                                className="barber-register-input"
                                placeholder="nombre@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                ref={emailRef}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="registerPassword">
                            <Form.Label className="barber-register-label">Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                className="barber-register-input"
                                placeholder="Mínimo 7 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                ref={passwordRef}
                                minLength={7}
                                required
                            />
                        </Form.Group>

                        <div className="d-grid gap-2 mt-4">
                            <Button className="btn-barber-register-submit" type="submit">
                                Registrarse
                            </Button>
                            <Button
                                variant="link"
                                className="btn-barber-register-link mt-2"
                                onClick={() => navigate("/login")}
                            >
                                ¿Ya tenés cuenta? Iniciá sesión acá
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Register;