import axios from 'axios';
import { API_URL } from '../../config';

const api = axios.create({
  baseURL: `${API_URL }/api/users/login`,
});

export async function login(email, password) {
    try {
        const response = await api.post('/', {
            email,
            password
        });

        return response.data;
    } catch (error) {
        console.error(error);
        
        if (error.response && error.response.data) {
            return error.response.data; // <-- aqui vem o { success: false, message: "Senha incorreta" }
        }

        return { success: false, message: "Erro desconhecido" };
    }
}
