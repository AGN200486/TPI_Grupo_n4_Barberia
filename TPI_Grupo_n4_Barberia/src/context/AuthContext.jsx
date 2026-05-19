import { createContext, useState, useContext } from 'react';

//Creamos el contexto
const AuthContext = createContext();

//Creamos el Proveedor que va a envolver a la aplicación
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Acá guardamos los datos del usuario o null si no está logueado

    const login = (userData) => {
        setUser(userData); //Guardamos los datos del usuario en el estado global
    };

    const logout = () => {
        setUser(null); //Limpiamos el usuario al cerrar sesión
    };

    //Compartimos el estado 'user' y las funciones 'login' y 'logout'
    return (
        <AuthContext.Provider value={{ user, login, logout, isSignedIn: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

//Creamos un Hook personalizado para que usar el contexto sea más fácil en otros componentes
export const useAuth = () => {
    return useContext(AuthContext);
};