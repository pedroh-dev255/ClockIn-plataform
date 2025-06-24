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

import FuncionariosPanel from '../components/configs/funcionarios';
import EmpresaPanel from '../components/configs/empresa';

export default function ConfigsScreen() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [activeTab, setActiveTab] = useState<'funcionarios' | 'empresa' | 'ponto'>('funcionarios');

    const token = localStorage.getItem('token') || '';
    const userData = localStorage.getItem('userData') || '';

    useEffect(() => {
        
        const checkAuth = async () => {
            setLoading(true);
            if (!token || !userData) {
                setIsAuthenticated(false);
                return;
            }

            const isValid = await validate(token);
            setIsAuthenticated(isValid);
            setLoading(false);
        };

        checkAuth();
    }, []);

    useEffect(() => {
        if (isAuthenticated === false) {
            toast.error('Login necessário');
            navigate('/login');
        }
    }, []);

    return (
        <>
            <Navbar />
            
            <div style={styles.container}>
                <div style={styles.box}>
                    {/* Sub-navbar */}
                    <div style={styles.tabBar}>
                        <button
                            onClick={() => setActiveTab('funcionarios')}
                            style={activeTab === 'funcionarios' ? styles.activeTab : styles.tab}
                        >
                            Funcionários
                        </button>
                        <button
                            onClick={() => setActiveTab('empresa')}
                            style={activeTab === 'empresa' ? styles.activeTab : styles.tab}
                        >
                            Empresa
                        </button>
                        <button
                            onClick={() => setActiveTab('ponto')}
                            style={activeTab === 'ponto' ? styles.activeTab : styles.tab}
                        >
                            Configurações do Ponto
                        </button>
                    </div>

                    {/* Conteúdo das abas */}
                    <div style={styles.content}>
                        {/* Chama a função que renderiza o conteúdo da aba selecionada */}
                        {activeTab === 'funcionarios' && <FuncionariosPanel />}

                        {activeTab === 'empresa' && <EmpresaPanel />}
                            
                        {activeTab === 'ponto' &&
                            <h2>Configurações do ponto</h2>
                            
                    }
                    </div>
                </div>
            </div>

            {loading && <Loader />}
        </>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(to right, #2563eb, #7c3aed)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
    } as CSSProperties,

    box: {
        width: '100%',
        maxWidth: '1400px', // Ocupa mais espaço em telas grandes
        height: 'calc(100vh - 110px)', // Deixa um espaço do fundo
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        marginTop: '70px',
    } as CSSProperties,

    tabBar: {
        display: 'flex',
        backgroundColor: '#f8fafc',
        borderBottom: '2px solid #e2e8f0',
    } as CSSProperties,

    tab: {
        flex: 1,
        padding: '16px 0',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        border: 'none',
        outline: 'none',
        fontSize: '16px',
        fontWeight: 500,
        color: '#64748b',
        transition: 'all 0.2s ease-in-out',
    } as CSSProperties,

    activeTab: {
        flex: 1,
        padding: '16px 0',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: '#fff',
        borderBottom: '3px solid #2563eb',
        fontWeight: 600,
        color: '#2563eb',
        fontSize: '16px',
        transition: 'all 0.2s ease-in-out',
    } as CSSProperties,

    content: {
        flex: 1,
        padding: '32px',
        overflowY: 'auto',
        color: '#1e293b',
        fontSize: '16px',
    } as CSSProperties,
};
