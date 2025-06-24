import axios from 'axios';
import { API_URL } from '../../../config';

const userData = localStorage.getItem('userData');
const useRouteLoaderData = userData ? JSON.parse(userData) : { id_empresa: null };

export const getEmpresa = async () => {
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