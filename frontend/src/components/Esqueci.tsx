import React, { useState } from 'react';
import type { CSSProperties } from 'react';
import { API_URL } from '../../config';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    } as CSSProperties,
    card: {
        background: '#fff',
        borderRadius: '1rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        padding: '2rem',
        width: '100%',
        maxWidth: '400px',
        position: 'relative',
    } as CSSProperties,
    title: {
        fontSize: '2rem',
        fontWeight: 700,
        color: '#1f2937',
        textAlign: 'center',
        marginBottom: '1.5rem',
    } as CSSProperties,
    label: {
        display: 'block',
        fontWeight: 500,
        color: '#4b5563',
        marginBottom: '0.25rem',
    } as CSSProperties,
    input: {
        width: '100%',
        padding: '0.75rem',
        borderRadius: '0.5rem',
        border: '1px solid #d1d5db',
        marginBottom: '1rem',
        fontSize: '1rem',
    } as CSSProperties,
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
    } as CSSProperties,
    buttonHover: {
        backgroundColor: '#1d4ed8',
    } as CSSProperties,
    cancelButton: {
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        background: 'transparent',
        border: 'none',
        color: '#6b7280',
        fontSize: '1rem',
        cursor: 'pointer',
    } as CSSProperties,
    footer: {
        textAlign: 'center',
        fontSize: '0.85rem',
        color: '#6b7280',
        marginTop: '1rem',
    } as CSSProperties,
};

interface EsqueciProps {
    onClose?: () => void;
    setLoading: (value: boolean) => void;
}

export default function Esqueci({ onClose, setLoading }: EsqueciProps) {
    const [email, setEmail] = useState('');
    const { t } = useTranslation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.warning(t('forgotpasswordModal.toast.error_fields'));
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/api/users/esqueci-senha`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(t('forgotpasswordModal.toast.email_send'));
                setEmail('');
            } else {
                toast.warning(data.message || t('forgotpasswordModal.toast.warning'));
            }

            onClose?.();
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            toast.error(t('forgotpasswordModal.toast.server_error'));
            onClose?.();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.card}>
                <button style={styles.cancelButton} onClick={onClose}>
                    ✕
                </button>
                <h2 style={styles.title}>{t('forgotpasswordModal.title')}</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email" style={styles.label}>{t('forgotpasswordModal.email')}</label>
                    <input
                        id="email"
                        type="email"
                        required
                        style={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('forgotpasswordModal.email_placeholder')}
                    />
                    <button
                        type="submit"
                        style={styles.button}
                        onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor || '#1d4ed8')
                        }
                        onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor = styles.button.backgroundColor || '#2563eb')
                        }
                    >
                        {t('forgotpasswordModal.submit')}
                    </button>
                </form>
                <p style={styles.footer}>{t('forgotpasswordModal.footer')}</p>
            </div>
        </div>
    );
}
