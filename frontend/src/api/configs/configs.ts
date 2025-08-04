import axios from 'axios';

import { API_URL } from '../../../config';

export async function getConfigs() {
    try {
        
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/emp/getConfigs`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
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