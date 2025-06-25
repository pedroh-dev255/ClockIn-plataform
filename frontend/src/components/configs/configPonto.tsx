import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { getConfigs, updateConfigs } from '../../api/configs/configs';
import { validate } from '../../api/validateToken';

import Loader from '../Loader';

export default function ConfigsPanel() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [configs, setConfigs] = useState<any>({});
    const [editingConfig, setEditingConfig] = useState<string | null>(null);
    const [tempValue, setTempValue] = useState<string>('');
    
    const userDataString = localStorage.getItem('userData');
    
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('userData');

            if (!token || !userData) {
                toast.error("Token inválido ou expirado");
                localStorage.removeItem('token');
                localStorage.removeItem('userData');
                navigate('/login');
                return;
            }

            const isValid = await validate(token);
            if (!isValid) {
                toast.error("Token inválido ou expirado");
                localStorage.removeItem('token');
                localStorage.removeItem('userData');
                navigate('/login');
                return;
            }
        };

        checkAuth();
    }, [navigate]);

    useEffect(() => {
        const fetchConfigs = async () => {
            if (!userDataString) return;

            setLoading(true);
            try {
                const parsedUser = JSON.parse(userDataString);
                if (!parsedUser?.id_empresa) {
                    toast.error("Usuário inválido");
                    return;
                }

                const response = await getConfigs(parsedUser.id_empresa);

                if (response === false) {
                    toast.error("Token inválido ou expirado");
                    navigate('/login');
                    return;
                }

                if (response && typeof response === 'object') {
                    // Transforma o array de configs em um objeto mais fácil de manipular
                    const configsObj = response.reduce((acc: any, curr: any) => {
                        acc[curr.nome] = curr.valor;
                        return acc;
                    }, {});
                    setConfigs(configsObj);
                }
            } catch (error) {
                console.error('Erro ao carregar configurações:', error);
                toast.error('Erro ao carregar configurações');
            } finally {
                setLoading(false);
            }
        };

        fetchConfigs();
    }, [userDataString]);

    const handleEditClick = (configName: string) => {
        setEditingConfig(configName);
        setTempValue(configs[configName]);
    };

    const handleSaveClick = async () => {
        if (!editingConfig || !userDataString) return;

        setLoading(true);
        try {
            const parsedUser = JSON.parse(userDataString);
            const response = await updateConfigs(
                parsedUser.id_empresa,
                editingConfig,
                tempValue
            );

            if (response) {
                toast.success('Configuração atualizada com sucesso');
                setConfigs((prev: any) => ({
                    ...prev,
                    [editingConfig]: tempValue
                }));
                setEditingConfig(null);
            } else {
                toast.error('Erro ao atualizar configuração');
            }
        } catch (error) {
            console.error('Erro ao atualizar configuração:', error);
            toast.error('Erro ao atualizar configuração');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelClick = () => {
        setEditingConfig(null);
    };

    const getConfigDescription = (configName: string) => {
        switch (configName) {
            case 'toleranciaPonto':
                return 'Tolerância para atrasos no ponto (minutos)';
            case 'toleranciaGeral':
                return 'Tolerância geral para atrasos (minutos)';
            case 'maximo50':
                return 'Horas extras que podem ser pagas como 50% (horas)';
            case 'dtFechamento':
                return 'Dia do mês para fechamento do ponto';
            default:
                return configName;
        }
    };

    return (
        <>
            <div style={styles.container}>
                <h2 style={styles.title}>Configurações do Ponto</h2>
                <p style={styles.subtitle}>Gerencie as configurações do sistema de ponto</p>
                <div style={styles.grid}>
                    <h3 style={styles.label}>Data de Fechamento</h3>     
                    <p style={styles.value}>25</p>
                    <h3 style={styles.label}>Tolerância Geral</h3>
                    <p style={styles.value}>10 minutos</p>
                    <h3 style={styles.label}>Tolerância por ponto</h3>
                    <p style={styles.value}>5 minutos</p>
                    <h3 style={styles.label}>Máximo de Horas Extras 50%</h3>
                    <p style={styles.value}>2 horas</p>
                </div>
            </div>
            {loading && <Loader />}
        </>
    );
}

const styles = {
    container: {
        maxWidth: '700px',
        margin: '0 auto',
        padding: '24px',
    } as CSSProperties,
    h1: {
        fontSize: '24px',
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: '8px',
    } as CSSProperties,
    subtitle: {
        fontSize: '14px',
        color: '#64748b',
        marginBottom: '24px',
    } as CSSProperties,
    configsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    } as CSSProperties,
    configCard: {
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    } as CSSProperties,
    configInfo: {
        flex: 1,
    } as CSSProperties,
    configName: {
        fontSize: '16px',
        fontWeight: '500',
        color: '#1e293b',
        marginBottom: '4px',
    } as CSSProperties,
    configValue: {
        fontSize: '14px',
        color: '#64748b',
    } as CSSProperties,
    configInput: {
        padding: '8px',
        border: '1px solid #cbd5e1',
        borderRadius: '4px',
        width: '100px',
    } as CSSProperties,
    configActions: {
        display: 'flex',
        gap: '8px',
    } as CSSProperties,
    editButton: {
        backgroundColor: '#dbeafe',
        color: '#1d4ed8',
        border: 'none',
        borderRadius: '4px',
        padding: '8px 12px',
        cursor: 'pointer',
        fontWeight: '500',
    } as CSSProperties,
    saveButton: {
        backgroundColor: '#dcfce7',
        color: '#166534',
        border: 'none',
        borderRadius: '4px',
        padding: '8px 12px',
        cursor: 'pointer',
        fontWeight: '500',
    } as CSSProperties,
    cancelButton: {
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        border: 'none',
        borderRadius: '4px',
        padding: '8px 12px',
        cursor: 'pointer',
        fontWeight: '500',
    } as CSSProperties,
    title: {
        fontSize: '24px',
        textAlign: 'center',
        marginBottom: '24px',
        color: '#333',
    } as CSSProperties,

    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        rowGap: '12px',
        columnGap: '16px',
        fontSize: '16px',
        color: '#444',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto',
        width: 'fit-content',
    } as CSSProperties,

    label: {
        textAlign: 'right',
        fontWeight: 600,
    } as CSSProperties,

    value: {
        textAlign: 'left',
        wordBreak: 'break-word',
    } as CSSProperties,
};