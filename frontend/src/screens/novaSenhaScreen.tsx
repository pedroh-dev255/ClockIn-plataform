import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams  } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

//componentes
import Loader from '../components/Loader';

//api
import { validate } from '../api/validateToken';
import { validateResetToken, resetPassword } from '../api/resetApi';


export default function LoginPage() {
    const [senha, setSenha] = useState('');
    const [senha2, setSenha2] = useState('');
    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [tokenValido, setTokenValido] = useState(false);


    const { token } = useParams();
    console.log('Token recebido:', token);
    console.log(useParams());
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const validar = async () => {
            if (!token) {
                setLoading(false);
                toast.error('Token inválido!');
                navigate('/login');
                return;
            }

            const valido = await validateResetToken(token);
            if (valido) {
                setLoading(false);
                setTokenValido(true);
            } else {
                setLoading(false);
                toast.error(t('forgotpasswordScreen.toast.expired_token'));
                navigate('/login');
            }
            setLoading(false);
        };

        validar();
    }, [token, navigate]);

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
                toast.success(t('forgotpasswordScreen.toast.already_logged'));
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

        if (senha.length < 8 || senha2.length < 8) {
            return toast.warning(t('forgotpasswordScreen.toast.password_short'));
        }
        if (senha !== senha2) {
            return toast.warning(t('forgotpasswordScreen.toast.password_mismatch'));
        }

        setLoading(true);
        const result = await resetPassword(token!, senha);
        if (result.success) {
            toast.success(t('forgotpasswordScreen.toast.success'));
            navigate('/login');
        } else {
            toast.error(result.message || t('forgotpasswordScreen.toast.error'));
        }
        setLoading(false);
    };

    if ( loading ) {
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
                    <h2 style={styles.title}>{t('forgotpasswordScreen.title')}</h2>
                    <form onSubmit={handleSubmit}>

                        <label htmlFor="senha" style={styles.label}>{t('forgotpasswordScreen.password1')}</label>
                        <input
                            id="senha"
                            type="password"
                            required
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            style={styles.input}
                            placeholder="••••••••"
                        />


                        <label htmlFor="senha2" style={styles.label}>{t('forgotpasswordScreen.password2')}</label>
                        <input
                            id="senha2"
                            type="password"
                            required
                            value={senha2}
                            onChange={(e) => setSenha2(e.target.value)}
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
                            {t('forgotpasswordScreen.submit')}
                        </button>
                    </form>
                    <p style={styles.footer}>© {new Date().getFullYear()} ClockIn!</p>
                </div>
            </div>
            {loading && <Loader />}
        </>
    );
}
