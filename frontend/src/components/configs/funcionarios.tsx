import type { CSSProperties } from 'react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { getFuncionarios } from '../../api/configs/funcionarios';

import Loader from '../Loader';

export default function FuncionariosPanel() {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedFuncionario, setSelectedFuncionario] = useState<any | null>(null);
    const [funcionarios, setFuncionarios] = useState<any[]>([]);
    // carregar dados do usário
    const token = localStorage.getItem('token');
    const userDataString = localStorage.getItem('userData');
    const userData = userDataString ? JSON.parse(userDataString) : null;
    
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('ativo');


    useEffect(() => {
        const fetchFuncionarios = async () => {
            if (!userDataString) return;

            setLoading(true);
            try {
                const parsedUser = JSON.parse(userDataString);
                if (!parsedUser?.id_empresa) {
                    toast.error("Usuário inválido");
                    return;
                }

                const response = await getFuncionarios(parsedUser.id_empresa);

                if (response === false) {
                    toast.error("Token inválido ou expirado");
                    setFuncionarios([]);
                    return;
                }

                const data = response?.funcionarios;

                if (Array.isArray(data)) {
                    setFuncionarios(data);
                } else if (data && typeof data === 'object') {
                    setFuncionarios([data]); // transforma em array
                } else {
                    setFuncionarios([]); // fallback
                }
            } catch (error) {
                console.error('Erro ao carregar funcionários:', error);
                toast.error('Erro ao carregar funcionários');
                setFuncionarios([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFuncionarios();
    }, []);



    const funcionariosFiltrados = funcionarios.filter(f =>
        filter === 'todos' ? true : f.status === filter
    );

    return (
        <>
            <div>
                <div style={styles.funcionariosHeader}>
                    <select
                        style={styles.select}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="todos">Todos</option>
                        <option value="ativo">Ativos</option>
                        <option value="desligado">Desligados</option>
                    </select>

                    <button style={styles.button} onClick={() => setShowRegisterModal(true)}>
                        + Cadastrar Funcionário
                    </button>
                </div>

                <div style={styles.cardGrid}>
                    {funcionariosFiltrados.map((func) => (
                        <div
                            key={func.id}
                            style={styles.card}
                            onClick={() => setSelectedFuncionario(func)}
                        >
                            <h3>{func.nome}</h3>
                            <p>{func.cargo}</p>
                            <span style={{ color: func.status === 'ativo' ? 'green' : 'red' }}>
                                {func.status}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Modal de cadastro */}
                {showRegisterModal && (
                    <div style={styles.modalOverlay}>
                        <div style={styles.modal}>
                            <h2>Cadastrar Funcionário</h2>
                            <input placeholder="Nome completo" style={styles.input} />
                            <input placeholder="CPF" style={styles.input} />
                            <input placeholder="Email" style={styles.input} />
                            <input placeholder="Telefone" style={styles.input} />
                            <input placeholder="Cargo" style={styles.input} />

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                <button onClick={() => setShowRegisterModal(false)} style={styles.cancelBtn}>Cancelar</button>
                                <button style={styles.confirmBtn}>Salvar</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de detalhes */}
                {selectedFuncionario && (
                    <div style={styles.modalOverlay}>
                        <div style={styles.modal}>
                            <h2>{selectedFuncionario.nome}</h2>
                            <p><b>Cargo:</b> {selectedFuncionario.cargo}</p>
                            <p><b>Status:</b> {selectedFuncionario.status}</p>

                            <h3>Registros de Ponto (Hoje)</h3>
                            <ul>
                                <li>08:00 - Entrada</li>
                                <li>12:00 - Saída Almoço</li>
                                <li>13:00 - Retorno</li>
                                <li>17:00 - Saída</li>
                            </ul>

                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button onClick={() => setSelectedFuncionario(null)} style={styles.cancelBtn}>Fechar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {loading && <Loader />}
        </>
    );
}

const styles = {
    funcionariosHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
    } as CSSProperties,

    select: {
        padding: '8px',
        fontSize: '14px',
        borderRadius: '6px',
        border: '1px solid #ccc',
    } as CSSProperties,

    button: {
        backgroundColor: '#2563eb',
        color: '#fff',
        padding: '10px 16px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
    } as CSSProperties,

    cardGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '16px',
    } as CSSProperties,

    card: {
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        cursor: 'pointer',
        backgroundColor: '#f9fafb',
        transition: '0.2s',
    } as CSSProperties,

    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    } as CSSProperties,

    modal: {
        background: '#fff',
        padding: '24px',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '500px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    } as CSSProperties,

    input: {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        border: '1px solid #ccc',
        borderRadius: '6px',
    } as CSSProperties,

    cancelBtn: {
        backgroundColor: '#e5e7eb',
        color: '#111',
        padding: '10px 16px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
    } as CSSProperties,

    confirmBtn: {
        backgroundColor: '#2563eb',
        color: '#fff',
        padding: '10px 16px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
    } as CSSProperties,
};
