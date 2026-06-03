const { validateLoginInput } = require("./validateLogin");

describe("Pruebas Unitarias - Validación de Credenciales de Login", () => {
    //Test 1: Caso exitoso (Pass)
    test("Debería pasar (valid: true) si el email tiene formato correcto y la clave es larga", () => {
        const result = validateLoginInput("juan.barberia@gmail.com", "12345678");
        expect(result.valid).toBe(true);
        expect(result.message).toBe("Campos validados correctamente para envío.");
    });
    //Test 2: Caso de falla por contraseña corta (Fail controlado)
    test("Debería fallar (valid: false) si la contraseña posee menos de 6 caracteres", () => {
        const result = validateLoginInput("juan.barberia@gmail.com", "1234");
        expect(result.valid).toBe(false);
        expect(result.message).toBe("La contraseña debe tener al menos 6 caracteres.");
    });
    //Test 3: Caso de falla por estructura de Email incorrecta
    test("Debería fallar (valid: false) si el correo electrónico no posee un dominio válido", () => {
        const result = validateLoginInput("juan.barberia@com", "barberia2026");
        expect(result.valid).toBe(false);
        expect(result.message).toBe("El formato del correo electrónico no es válido.");
    });
});