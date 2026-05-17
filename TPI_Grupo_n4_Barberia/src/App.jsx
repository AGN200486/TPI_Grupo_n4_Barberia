import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Login from './components/login/Login';
import Dashboard from './components/dashboard/Dashboard';
import Header from './components/ui/Header';
import Background from './components/ui/background';
import Protected from './components/login/Protected'; 
import NotFound from './components/NotFound';         

function App() {
    return (
        <div>
            <Header />
            <Background />

            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Navigate to='login' />} />
                    <Route path='/login' element={<Login />} /> {}
                   
                    <Route element={<Protected />}> {}
                        <Route path='/library/*' element={<Dashboard />} /> {}
                    </Route>
                    
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
