import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

//api
import { validate } from "../api/validateToken";

//componentes
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';

export default function DashboardPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    const token = localStorage.getItem('token') || '';
    const userData = localStorage.getItem('userData') || '';

    // Validação do token e dados do usuário
    useEffect(() => {
        const checkAuth = async () => {
            if (!token || !userData) {
                setIsAuthenticated(false);
                return;
            }

            const isValid = await validate(token);
            setIsAuthenticated(isValid);
        };

        checkAuth();
    }, [token, userData]);

    // Redirecionamento se não autenticado
    useEffect(() => {
        if (isAuthenticated === false) {
            toast.error('Login necessário');
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    return (
        <>
            <Navbar/>
            
            <div style={styles.container}>
                
            </div>

            {loading && <Loader />}
        </>
    );
}

// 🎨 Estilos separados para organização
const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(to right, #2563eb, #7c3aed)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    } as CSSProperties,
};