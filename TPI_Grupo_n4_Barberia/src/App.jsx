import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';  
import Login from './components/login/Login';
import Dashboard from './components/dashboard/Dashboard';
import Header from './components/ui/Header';
import Background from './components/ui/background';
import Protected from './components/protected/Protected'; 
import NotFound from './components/notFound/NotFound';        

function App() {
    return (
        <div>
            {/* El contenedor global para que aparezcan los cartelitos de react-toastify */}
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
            
            <Header />
            <Background />
            
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Navigate to='login' />} />
                    <Route path='/login' element={<Login />} />
                    
                    <Route element={<Protected />}>
                        <Route path='/library/*' element={<Dashboard />} />
                    </Route>
                    
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;