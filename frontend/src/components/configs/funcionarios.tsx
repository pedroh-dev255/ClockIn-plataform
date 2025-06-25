import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { getFuncionarios, cadastroHandler, desligamentoHandler } from '../../api/configs/funcionarios';

import { validate } from '../../api/validateToken';

import Loader from '../Loader';

export default function FuncionariosPanel() {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedFuncionario, setSelectedFuncionario] = useState<any | null>(null);
    const [desligamento, setDesligamento] = useState<any | null>(null);
    const [tipoFuncionario, setTipoFuncionario] = useState('');
    const [funcionarios, setFuncionarios] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    // carregar dados do usário
    //const token = localStorage.getItem('token');
    const userDataString = localStorage.getItem('userData');
    //const userData = userDataString ? JSON.parse(userDataString) : null;
    
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('ativo');

    
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
                    navigate('/login');
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

    const resetFrom = () => {
        setSelectedFuncionario(null);
        setTipoFuncionario('');
        setSearchTerm('');
        setFilter('ativo');
    };



    const funcionariosFiltrados = funcionarios.filter(f =>
        (filter === 'todos' ? true : f.status === filter) &&
        f.nome.toLowerCase().includes(searchTerm.toLowerCase())
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

                    <input
                        type="text"
                        style={styles.inputFilter}
                        name="filtrarFun"
                        placeholder="Buscar Funcionário"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <div style={styles.cardGrid}>
                    <button style={styles.button} onClick={() => setShowRegisterModal(true)}>
                        + Cadastrar Funcionário
                    </button>

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
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const form = e.target as HTMLFormElement;
                                    const formData = new FormData(form);
                                    try {
                                        const returnCad = await cadastroHandler(formData);
                                        if (returnCad) {
                                            toast.success('Funcionário cadastrado com sucesso');
                                            setFuncionarios(prev => [...prev, returnCad]);

                                            setShowRegisterModal(false);
                                            resetFrom();
                                        } else {
                                            toast.error('Erro ao cadastrar funcionário' + returnCad.status);
                                        }
                                    } catch (error) {
                                        toast.error('Erro ao cadastrar funcionário' + error);
                                    }
                                }}
                            >
                                <h2>Cadastrar Funcionário</h2>
                                <input name='nome' placeholder="Nome completo" style={styles.input} required />
                                <input
                                    type="hidden"
                                    name="id_empresa"
                                    value={userDataString ? JSON.parse(userDataString).id_empresa : ''}
                                />
                                <input
                                    id='cpf'
                                    name='cpf'
                                    placeholder="CPF"
                                    style={styles.input}
                                    required
                                    maxLength={14}
                                    onChange={e => {
                                        let value = e.target.value.replace(/\D/g, '');
                                        if (value.length > 11) value = value.slice(0, 11);
                                        value = value.replace(/(\d{3})(\d)/, '$1.$2');
                                        value = value.replace(/(\d{3})(\d)/, '$1.$2');
                                        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                                        e.target.value = value;
                                    }}
                                    onBlur={e => {
                                        const cpf = e.target.value.replace(/\D/g, '');
                                        function validarCPF(cpf: string) {
                                            if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
                                            let soma = 0, resto;
                                            for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
                                            resto = (soma * 10) % 11;
                                            if (resto === 10 || resto === 11) resto = 0;
                                            if (resto !== parseInt(cpf[9])) return false;
                                            soma = 0;
                                            for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
                                            resto = (soma * 10) % 11;
                                            if (resto === 10 || resto === 11) resto = 0;
                                            if (resto !== parseInt(cpf[10])) return false;
                                            return true;
                                        }
                                        if (cpf && !validarCPF(cpf)) {
                                            toast.error('CPF inválido');
                                            e.target.focus();
                                        }
                                    }}
                                />
                                <input name='email' type='email' placeholder="Email" style={styles.input} required />
                                <input
                                    placeholder="Telefone"
                                    name='telefone'
                                    style={styles.input}
                                    required
                                    maxLength={15}
                                    onChange={e => {
                                        let value = e.target.value.replace(/\D/g, '');
                                        if (value.length > 11) value = value.slice(0, 11);
                                        if (value.length > 10) {
                                            value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
                                        } else if (value.length > 5) {
                                            value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
                                        } else if (value.length > 2) {
                                            value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
                                        } else {
                                            value = value.replace(/^(\d*)/, '($1');
                                        }
                                        e.target.value = value;
                                    }}
                                />
                                <input name='cargo' placeholder="Cargo" style={styles.input} required />
                                {/*
                                    Exibe os campos de senha apenas se o tipo selecionado for "admin"
                                */}
                                <select
                                    name="tipo"
                                    required
                                    style={styles.input}
                                    value={tipoFuncionario}
                                    onChange={e => setTipoFuncionario(e.target.value)}
                                >
                                    <option value="">Selecione o tipo de funcionario</option>
                                    <option value="admin">Administrador - Tem acesso a este sistema</option>
                                    <option value="funcionario">Funcionario Comum - Não tem acesso</option>
                                </select>
                                <p>Data de inicio do Funcionario</p>
                                <input name='dt_inicio' type="date" placeholder='00/00/0000' style={styles.input} required />
                                <br /><br />

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                    <button onClick={() => setShowRegisterModal(false)} style={styles.cancelBtn}>Cancelar</button>
                                    <button type='submit' style={styles.confirmBtn}>Salvar</button>
                                </div>
                            </form>
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
                            <p><b>Data Cadastro:</b> {selectedFuncionario.data_cadastro ? new Date(selectedFuncionario.data_cadastro).toLocaleDateString('pt-BR') : ''}</p>
                            <p><b>Data Demissão:</b> {selectedFuncionario.data_demissao ? selectedFuncionario.data_demissao : 'Cadastro ativo' } </p>
                            <p><b>CPF:</b> {selectedFuncionario.cpf}</p>
                            <p><b>Email:</b> {selectedFuncionario.email}</p>
                            <p><b>Telefone:</b> {selectedFuncionario.telefone}</p>
                            <p><b>Tipo:</b> {selectedFuncionario.tipo}</p>

                            

                            <div style={{ paddingTop: '50px', display: 'flex', justifyContent: 'space-between'}}>
                                <button onClick={() => {
                                    setDesligamento(selectedFuncionario);
                                    setSelectedFuncionario(null);
                                    }
                                } style={styles.desligBtn}>Desligar Funcionario</button>
                                <button onClick={() => setSelectedFuncionario(null)} style={styles.cancelBtn}>Fechar</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de detalhes */}
                {desligamento && (
                    <div style={styles.modalOverlay}>
                        <div style={styles.modal}>
                            <h1>Desligamento de Funcionario</h1>
                            <p><b>Nome:</b> {desligamento.nome}</p>
                            <p><b>Data Cadastro:</b> {desligamento.data_cadastro ? new Date(desligamento.data_cadastro).toLocaleDateString('pt-BR') : ''}</p>
                            <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    const confirm = window.confirm("Tem certeza que deseja desligar este funcionário? Esta ação é irreversível.");
                                    if (!confirm) return;

                                    const form = e.target as HTMLFormElement;
                                    const formData = new FormData(form);
                                    setLoading(true);
                                    try {
                                        
                                        const returnCad = await desligamentoHandler(formData);

                                        if (returnCad) {
                                            toast.success('Funcionário desligado com sucesso');
                                            setFuncionarios(prev => prev.map(f => f.id === desligamento.id ? { ...f, status: 'desligado', data_demissao: formData.get('desligamento') } : f));
                                        } else {
                                            toast.error('Erro ao desligar funcionário');
                                        }

                                        setDesligamento(null);
                                        setLoading(false);
                                        

                                    } catch (error) {
                                        toast.error('Erro ao desligar funcionário');
                                        setLoading(false);
                                    }
                                }}>
                                <input type="hidden" name="id_funcionario" value={desligamento.id} />
                                <input type="date" style={styles.input} name="desligamento" id="desligamento" required/>
                                
                                <div style={{ paddingTop: '50px', display: 'flex', justifyContent: 'space-between'}}>
                                    <button type='submit' style={styles.desligBtn}>Desligar Funcionario</button>
                                    <button onClick={() => setDesligamento(null)} style={styles.cancelBtn}>Fechar</button>
                                </div>
                            </form>
                            <p style={styles.texto}><b>⚠️ Atenção ⚠️</b></p>
                            <p style={styles.texto}>Essa ação não pode ser desfeita!!!<br/> Apos desativar o funcionario todos os registro do mesmo não poderão mais ser alterados. Só faça se estiver certo disto!</p>
                        </div>
                    </div>
                )}
            </div>
            {loading && <Loader />}
        </>
    );
}

const styles = {
    texto: {
        fontSize: '14px',
        color: '#666',
        marginTop: '10px',
        textAlign: 'center',
    } as CSSProperties,
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
        backgroundColor: '#dde8ff',
        color: 'black',
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

    inputFilter: {
        width: '100%',
        maxWidth: '40%',
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

    desligBtn: {
        backgroundColor: '#ea6060',
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
