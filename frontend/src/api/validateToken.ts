import axios from 'axios';
import { API_URL } from '../../config';

const api = axios.create({
  baseURL: `${API_URL }/api/validateToken`,
});

export async function validate(token: string)  {
    try {
        const response = await api.get('/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if(response.data.success === true){
            return true
        }else{
            localStorage.removeItem('token');
            localStorage.removeItem('userData');

            return false
        }
    } catch (error) {
        console.error('Erro ao validar token: ', error);
        return false;
    }

}