import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { getEmpresa, Update } from '../../api/configs/empresa';
import { validate } from '../../api/validateToken';
import Loader from '../Loader';

export default function EmpresaPanel() {
    const navigate = useNavigate();
    const [empresa, setEmpresa] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [edit, setEdit] = useState(false);
    const [formData, setFormData] = useState<any>({});


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

    useEffect(() =>  {
        setLoading(true);
        if (!userDataString) {

            navigate('/login');
            return;
        }

        const fetchEmpresaData = async () => {
            setLoading(true);
            try {
                const response = await getEmpresa();
                const data = response.empresa;
                setEmpresa(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                toast.error('Erro ao buscar dados da empresa');
                setLoading(false);
            }
        }
        
        fetchEmpresaData();
        setLoading(false);

    }, []);

    if (!empresa) {
        return (
            <div style={styles.container}>
                <Loader />
            </div>
        );
    }

    return (
        <>
            <div style={styles.container}>
                <div style={{ textAlign: 'end', marginBottom: '24px' }}>
                    <button onClick={() =>{
                        setEdit(true);
                        setFormData({ ...empresa })
                        ;}} style={{ padding: '8px', fontSize: '14px', borderRadius: '6px', border: '1px solid #ccc', }}
                    >
                        Editar
                    </button>
                </div>
                <h2 style={styles.title}>Dados da Empresa</h2>
                <div style={styles.grid}>
                    <div style={styles.label}><strong>Nome:</strong></div>
                    <div style={styles.value}>{empresa.nome}</div>

                    <div style={styles.label}><strong>CNPJ:</strong></div>
                    <div style={styles.value}>{empresa.cnpj}</div>

                    <div style={styles.label}><strong>Email:</strong></div>
                    <div style={styles.value}>{empresa.email}</div>

                    <div style={styles.label}><strong>Telefone:</strong></div>
                    <div style={styles.value}>{empresa.telefone}</div>

                    <div style={styles.label}><strong>Endereço:</strong></div>
                    <div style={styles.value}>{empresa.rua}, {empresa.numero}. {empresa.bairro}, {empresa.cidade} - {empresa.estado}</div>

                    <div style={styles.label}><strong>Status:</strong></div>
                    <div style={styles.value}>{empresa.status === 0 ? 'Ativa' : 'Inativa'}</div>

                    <div style={styles.label}><strong>Funcionarios Ativos:</strong></div>
                    <div style={styles.value}>{empresa.n_funcionarios}</div>
                </div>
            </div>
            {edit && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h1>Editar dados da Empresa</h1>

                        <form
                            onSubmit={async (e) => {
                            e.preventDefault();
                            const confirm = window.confirm("Tem certeza que deseja editar os dados da empresa?");
                            if (!confirm) return;
                            setLoading(true);
                            try {
                                const response = await Update(formData);
                                if (response) {
                                toast.success('Dados da empresa atualizados com sucesso!');
                                setEmpresa(formData); // atualiza o estado principal
                                setEdit(false);
                                }
                            } catch (error) {
                                console.error('Erro ao editar dados da empresa:', error);
                                toast.error('Erro ao editar dados da empresa');
                            } finally {
                                setLoading(false);
                            }
                            }}
                        >
                            <br />
                            <label htmlFor="nome">Nome da Empresa:</label>
                            <input
                                type="text"
                                id="nome"
                                name="nome"
                                style={styles.input}
                                value={formData.nome || ''}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            />

                            <label htmlFor="cnpj">CNPJ:</label>
                            <input
                                type="text"
                                id="cnpj"
                                style={styles.input}
                                value={formData.cnpj || ''}
                                disabled
                                title="O CNPJ identifica a empresa. Não pode ser alterado."
                            />

                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                style={styles.input}
                                value={formData.email || ''}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />

                            <label htmlFor="telefone">Telefone:</label>
                            <input
                                type="text"
                                id="telefone"
                                name="telefone"
                                style={styles.input}
                                value={formData.telefone || ''}
                                onChange={(e) => {
                                    let value = e.target.value.replace(/\D/g, '');
                                    if (value.length > 11) value = value.slice(0, 11);
                                    if (value.length > 0) {
                                        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                                        if (value.length > 10) {
                                            value = value.replace(/(\d{5})(\d{4})$/, '$1-$2');
                                        } else if (value.length > 9) {
                                            value = value.replace(/(\d{4})(\d{4})$/, '$1-$2');
                                        }
                                    }
                                    setFormData({ ...formData, telefone: value });
                                }}
                                maxLength={15}
                                placeholder="(99) 99999-9999"
                            />

                            <label htmlFor="endereco">Endereço:</label>
                            <div style={styles.enderecoContainer}>
                            <div style={styles.divInputEnd}>
                                <label htmlFor="rua">Rua</label>
                                <input
                                    type="text"
                                    id="rua"
                                    name="rua"
                                    style={styles.inputEnd}
                                    placeholder="Rua"
                                    value={formData.rua || ''}
                                    onChange={(e) => setFormData({ ...formData, rua: e.target.value })}
                                />
                            </div>

                            <div style={styles.divInputEnd}>
                                <label htmlFor="numero">Número</label>
                                <input
                                type="text"
                                id="numero"
                                name="numero"
                                style={styles.inputEnd}
                                placeholder="Número"
                                value={formData.numero || ''}
                                onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                                />
                            </div>

                            <div style={styles.divInputEnd}>
                                <label htmlFor="bairro">Bairro</label>
                                <input
                                    type="text"
                                    id="bairro"
                                    name="bairro"
                                    style={styles.inputEnd}
                                    placeholder="Bairro"
                                    value={formData.bairro || ''}
                                    onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                                />
                            </div>

                            <div style={styles.divInputEnd}>
                                <label htmlFor="cidade">Cidade</label>
                                <input
                                    type="text"
                                    id="cidade"
                                    name="cidade"
                                    style={styles.inputEnd}
                                    placeholder="Cidade"
                                    value={formData.cidade || ''}
                                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                                />
                            </div>

                            <div style={styles.divInputEnd}>
                                <label htmlFor="estado">Estado</label>
                                <input
                                    type="text"
                                    id="estado"
                                    name="estado"
                                    style={styles.inputEnd}
                                    placeholder="Estado (ex: SP)"
                                    value={formData.estado || ''}
                                    maxLength={2}
                                    onChange={(e) => {
                                        const value = e.target.value.toUpperCase();
                                        const estadosValidos = [
                                            "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
                                            "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
                                            "RS", "RO", "RR", "SC", "SP", "SE", "TO"
                                        ];
                                        if (value === "" || estadosValidos.includes(value)) {
                                            setFormData({ ...formData, estado: value });
                                        } else {
                                            setFormData({ ...formData, estado: value });
                                        }
                                    }}
                                    pattern="AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO"
                                    title="Digite a sigla de um estado brasileiro (ex: SP, RJ, TO)"
                                    required
                                />
                                {formData.estado && ![
                                    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
                                    "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
                                    "RS", "RO", "RR", "SC", "SP", "SE", "TO"
                                ].includes(formData.estado.toUpperCase()) && (
                                    <span style={{ color: 'red', fontSize: '12px' }}>
                                        Estado inválido. Use a sigla (ex: SP, RJ, TO).
                                    </span>
                                )}
                            </div>

                            <div style={styles.divInputEnd}>
                                <label htmlFor="cep">CEP</label>
                                <input
                                    type="text"
                                    id="cep"
                                    name="cep"
                                    style={styles.inputEnd}
                                    placeholder="CEP"
                                    value={formData.cep || ''}
                                    onChange={(e) => {
                                        let value = e.target.value.replace(/\D/g, '');
                                        if (value.length > 8) value = value.slice(0, 8);
                                        if (value.length > 5) {
                                            value = value.replace(/^(\d{5})(\d{1,3})$/, '$1-$2');
                                        }
                                        setFormData({ ...formData, cep: value });
                                    }}
                                    maxLength={9}
                                />
                            </div>
                            </div>

                            <div style={{ paddingTop: '50px', display: 'flex', justifyContent: 'space-between' }}>
                                <button type="submit" style={styles.editarBtn}>
                                    Salvar Edição
                                </button>
                                <button type="button" onClick={() => setEdit(false)} style={styles.cancelBtn}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                )}

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

    enderecoContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px',
    } as CSSProperties,

    divInputEnd: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        flex: '1',
    } as CSSProperties,

    inputEnd: {
        flex: '1 1 50%', 
        minWidth: '120px',
        // maxWidth: '200px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '6px',
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
        maxHeight: '80vh',
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: '#ccc transparent',
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

    editarBtn: {
        backgroundColor: '#33ea5b',
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