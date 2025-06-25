import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export async function getConfigs(idEmpresa: number) {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/configs/${idEmpresa}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar configurações:', error);
        return false;
    }
}

export async function updateConfigs(idEmpresa: number, configName: string, configValue: string) {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(
            `${API_URL}/configs`,
            {
                id_empresa: idEmpresa,
                nome: configName,
                valor: configValue,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar configuração:', error);
        return false;
    }
}