import axios from 'axios';
import { API_URL } from '../../../config';

const userData = localStorage.getItem('userData');
const useRouteLoaderData = userData ? JSON.parse(userData) : { id_empresa: null };

export const getEmpresa = async () => {
    if (!useRouteLoaderData.id_empresa || isNaN(useRouteLoaderData.id_empresa) || useRouteLoaderData.id_empresa === null) {
        console.error('ID da empresa não encontrado no userData');
        return false;
    }
    try {
        const response = await axios.get(`${API_URL}/api/emp/getByEmpresaId`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            params: {
                id: useRouteLoaderData.id_empresa
            }
        });
        
        console.log('Empresa fetched:', response.data);

        if (response.status === 401) {
            console.log('Token inválido');
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            return false;
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching empresa:', error);
        throw error;
    }
}

export async function Update(params: any) {
    try {
        const response = await axios.post(`${API_URL}/api/emp/updateEmp`, {
            'id': useRouteLoaderData.id_empresa,
            'nome': params.nome,
            'email': params.email,
            'telefone': params.telefone,

            'rua': params.rua,
            'numero': params.numero,
            'bairro': params.bairro,
            'cidade': params.cidade,
            'estado': params.estado,
            'cep': params.cep,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        console.log('Empresa updated:', response.data);
        if (response.status === 401) {
            console.log('Token inválido');
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            return false;
        }

        return response.data;
    } catch (error) {
        console.error('Error updating empresa:', error);
        throw error;
    }
    
}