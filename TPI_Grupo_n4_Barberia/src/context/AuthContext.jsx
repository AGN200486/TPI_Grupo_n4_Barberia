import { createContext, useState, useContext, useEffect } from 'react';

//Creamos el contexto
const AuthContext = createContext();
//Creamos el Proveedor que va a envolver a la aplicación
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedRole = localStorage.getItem('userRole'); 

        //Si existen los datos en el navegador, restauramos la sesión automáticamente
        if (storedToken && storedRole) {
            setUser({ rol: storedRole }); 
            setToken(storedToken);
        }
    }, []);

    //El login recibe los dos parámetros legítimos que mandó la base de datos
    const login = (tokenReal, rolReal) => {
        setToken(tokenReal);
        setUser({ rol: rolReal }); 
        
        localStorage.setItem('token', tokenReal);
        localStorage.setItem('userRole', rolReal); 
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
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