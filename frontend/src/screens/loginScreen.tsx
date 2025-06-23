import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

//componentes
import Loader from '../components/Loader';
import Esqueci from '../components/Esqueci';

//api
import { validate } from '../api/validateToken';
import { login } from "../api/login";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [esqueci, setEsqueci] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('userData');

            if (!token || !userData) {
                setCheckingAuth(false);
                return;
            }

            const isValid = await validate(token);
            if (isValid) {
                navigate('/');
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('userData');
            }
            setCheckingAuth(false);
        };

        checkAuth();
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!email || !senha) {
            toast.warning('Preencha todos os campos');
            setLoading(false);
            return;
        }

        if (!email.includes('@') || !email.includes('.')) {
            toast.warning('E-mail inválido');
            setLoading(false);
            return;
        }

        if(senha !== "PADRAO"){
            if (senha.length < 8) {
                toast.warning('Senha deve ter pelo menos 8 caracteres');
                setLoading(false);
                return;
            }
        }

        const result = await login(email, senha);
        setLoading(false);

        if (result) {
            if (result.success === true && result.resetPassword === false) {
                toast.success('Login realizado com sucesso');
                navigate('/');
            } else if (result.success === true && result.resetPassword === true) {
                toast.info('Por favor, redefina sua senha');
                navigate('/reset-password');

            }else {
                toast.error(result.message);
            }
        } else {
            toast.error("Erro ao conectar ao servidor. Contate o suporte.");
        }
    };

    if (checkingAuth) {
        return <Loader />;
    }

    const styles = {
        container: {
            minHeight: '100vh',
            background: 'linear-gradient(to right, #2563eb, #7c3aed)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        } as React.CSSProperties,
        card: {
            background: '#fff',
            borderRadius: '1rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            padding: '2rem',
            width: '100%',
            maxWidth: '400px',
        } as React.CSSProperties,
        title: {
            fontSize: '2rem',
            fontWeight: 700,
            color: '#1f2937',
            textAlign: 'center',
            marginBottom: '1.5rem',
        } as React.CSSProperties,
        label: {
            display: 'block',
            fontWeight: 500,
            color: '#4b5563',
            marginBottom: '0.25rem',
        } as React.CSSProperties,
        input: {
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid #d1d5db',
            marginBottom: '1rem',
            fontSize: '1rem',
        } as React.CSSProperties,
        button: {
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            backgroundColor: '#2563eb',
            color: '#fff',
            fontWeight: 600,
            fontSize: '1rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.3s',
        } as React.CSSProperties,
        buttonHover: {
            backgroundColor: '#1d4ed8',
        } as React.CSSProperties,
        footer: {
            textAlign: 'center',
            fontSize: '0.85rem',
            color: '#6b7280',
            marginTop: '1rem',
        } as React.CSSProperties,
    };

    return (
        <>
            <div style={styles.container}>
                <div style={styles.card}>
                    <h2 style={styles.title}>Entrar no Sistema</h2>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email" style={styles.label}>Email</label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            placeholder="seu@email.com"
                        />

                        <label htmlFor="senha" style={styles.label}>Senha</label>
                        <input
                            id="senha"
                            type="password"
                            required
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            style={styles.input}
                            placeholder="••••••••"
                        />

                        <button
                            type="submit"
                            style={styles.button}
                            onMouseOver={(e) =>
                                (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor ?? '#1d4ed8')
                            }
                            onMouseOut={(e) =>
                                (e.currentTarget.style.backgroundColor = styles.button.backgroundColor ?? '#2563eb')
                            }
                        >
                            Entrar
                        </button>
                    </form>
                    <p style={styles.footer}>© {new Date().getFullYear()} ClockIn!</p>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                        <a
                            style={{ ...styles.footer, color: '#2563eb', cursor: 'pointer', margin: 0 }}
                            onClick={() => setEsqueci(true)}
                        >
                            Esqueci minha Senha
                        </a>
                    </div>
                </div>
            </div>

            {loading && <Loader />}
            {esqueci && <Esqueci onClose={() => setEsqueci(false)} setLoading={setLoading} />}

        </>
    );
}
