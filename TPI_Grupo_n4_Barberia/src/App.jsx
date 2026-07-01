import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';  
import Login from './components/login/Login';
import Register from './components/register/Register';
import Dashboard from './components/dashboard/Dashboard';
import Header from './components/ui/Header';
import Background from './components/ui/background';
import Protected from './components/protected/Protected'; 
import NotFound from './components/notFound/NotFound';       
import ReservationsList from './components/reservations/ReservationsList'; 
import Cart from './components/cart/Cart';
import AdminPanel from './components/adminPanel/AdminPanel';

function App() {
    return (
        <div>
            {/*Los carteles flotantes de notificación siempre arriba de todo */}
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
            
            {/*El Router envuelve todo*/}
            <BrowserRouter>
                
                {/*El Header acá arriba*/}
                <Header /> 
                
                {/*La foto de fondo va abajo del Header */}
                <Background />
                
                {/*Las rutas que cambian el cuerpo de la página */}
                <Routes>
                    <Route path='/' element={<Navigate to='login' />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    
                    <Route element={<Protected />}>
                        <Route path='/library/*' element={<Dashboard />} />
                    </Route>
                    
                    <Route path="/reservations" element={<ReservationsList />} />

                    <Route path="/cart" element={<Cart />} />

                    <Route path="/admin-panel" element={<AdminPanel />} />

                    <Route path='*' element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;