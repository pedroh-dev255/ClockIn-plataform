import axios from 'axios';
import { API_URL } from '../../config';


const api = axios.create({
  baseURL: `${API_URL }/api/users/login`,
});


export async function login(email: string, password: string)  {
    if(!email || !password) {
        throw new Error('Email and password are required');
    }
    try {
        const response = await api.post('/', {
            email,
            password
        });

        if(response.data.success === true){
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userData', JSON.stringify(response.data.userData));
        }

        return response.data;
    } catch (error) {
        console.error(error);
        
        if (axios.isAxiosError(error) && error.response && error.response.data) {
            return error.response.data; // <-- aqui vem o { success: false, message: "Senha incorreta" }
        }

        return { success: false, message: "Erro ao se concectar-se com o servidor! Contate o Suporte Tecnico" };
    }
}
