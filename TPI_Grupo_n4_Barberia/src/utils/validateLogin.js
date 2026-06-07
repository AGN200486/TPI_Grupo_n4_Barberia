const validateLoginInput = (email, password) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || email.trim() === "") {
        return { valid: false, message: "Por favor, ingresá tu correo electrónico." };
    }
    if (!emailRegex.test(email)) {
        return { valid: false, message: "El formato del correo electrónico no es válido." };
    }
    if (!password || password.length < 6) {
        return { valid: false, message: "La contraseña debe tener al menos 6 caracteres." };
    }
    
    return { valid: true, message: "Campos validados correctamente para envío." };
};

module.exports = { validateLoginInput };