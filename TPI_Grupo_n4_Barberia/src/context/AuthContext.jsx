import { createContext, useState, useContext, useEffect } from 'react';

//Creamos el contexto
const AuthContext = createContext();
//Creamos el Proveedor que va a envolver a la aplicación
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); //Acá guardamos los datos del usuario o null si no está logueado
    //Usamos el token guardado para saber si hay una sesión activa al recargar la página
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    //Este useEffect se ejecuta una sola vez cuando se abre la app.
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedEmail = localStorage.getItem('userEmail');
        const storedRole = localStorage.getItem('userRole');

        if (storedToken && storedEmail) {
            setUser({ email: storedEmail, rol: storedRole });
            setToken(storedToken);
        }
    }, []);

    
    const login = (tokenReal) => {
        setToken(tokenReal);
        localStorage.setItem('token', tokenReal);
        setUser({ logged: true }); 
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isSignedIn: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};