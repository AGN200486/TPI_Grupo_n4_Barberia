import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from "jwt-decode";
import './AdminPanel.css'

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState({});
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const { token } = useAuth(); 
    const activeToken = token || localStorage.getItem('token'); 

    //Decodificamos el token con la libreria
    let loggedInUserId = null;
    if (activeToken) {
        try {
            const payload = jwtDecode(activeToken); 
            loggedInUserId = payload.id; 
        } catch (e) {
            console.error("Error al decodificar token con jwt-decode:", e);
        }
    }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:3000/users', {
                    method: 'GET',
                    headers: { 
                        'Authorization': `Bearer ${activeToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al obtener los usuarios');
                }

                const data = await response.json();
                setUsers(data);
                
                const initialRoles = {};
                data.forEach(user => {
                    initialRoles[user.id] = user.role;
                });
                setRoles(initialRoles);
                setLoading(false);
            } catch (error) {
                console.error("Error en la petición:", error);
                setLoading(false);
            }
        };

        if (activeToken) {
            fetchUsers();
        }
    }, [activeToken]);

    const handleRoleSelect = (userId, newRole) => {
        setRoles({
            ...roles,
            [userId]: newRole
        });
    };

    const handleSaveRole = async (userId) => {
        const selectedRole = roles[userId];
        try {
            const response = await fetch(`http://localhost:3000/users/${userId}/role`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${activeToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role: selectedRole })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al actualizar el rol');
            }
            
            setMessage(data.message);
            setUsers(users.map(u => u.id === userId ? { ...u, role: selectedRole } : u));
            setTimeout(() => setMessage(''), 4000); 
        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) {
        return <div className="admin-loading">Cargando panel de control...</div>;
    }

    return (
        <div className="admin-panel-container">
            <div className="admin-panel-box">
                <h2 className="admin-panel-title">Panel de Control de Accesos</h2>
                <p className="admin-panel-subtitle">Gestión de Roles y Permisos de Usuarios</p>
                
                {message && <div className="admin-alert-success">{message}</div>}

                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Nombre Completo</th>
                                <th>Email</th>
                                <th>Rol Actual</th>
                                <th>Asignar Nuevo Rol</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => {
                                const isMyself = loggedInUserId && String(user.id) === String(loggedInUserId);

                                return (
                                    <tr key={user.id}>
                                        <td>{user.name} {user.surname}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`role-badge role-${user.role || user.rol}`}>
                                                {user.role || user.rol}
                                            </span>
                                        </td>
                                        <td className="admin-actions-cell">
                                            <select 
                                                value={roles[user.id] || user.role || user.rol} 
                                                onChange={(e) => handleRoleSelect(user.id, e.target.value)}
                                                className="admin-select"
                                                disabled={isMyself}
                                            >
                                                <option value="cliente">Cliente</option>
                                                <option value="admin">Admin</option>
                                                <option value="superadmin">Superadmin</option>
                                            </select>

                                            <button 
                                                onClick={() => handleSaveRole(user.id)}
                                                className="admin-btn-save"
                                                disabled={isMyself}
                                                style={isMyself ? { opacity: 0.5, cursor: 'not-allowed', backgroundColor: '#555', color: '#aaa' } : {}}
                                            >
                                                Guardar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;