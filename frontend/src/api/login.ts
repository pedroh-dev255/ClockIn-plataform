import axios from 'axios';
import { API_URL } from '../../config';


const api = axios.create({
  baseURL: `${API_URL }/api/users/login`,
});


export async function login(email: string, password: string)  {
    if(!email || !password) {
        throw new Error('missing_credentials');
    }
    try {
        const response = await api.post('/', {
            email,
            password
        });

        if(response.data.success === true){
            if (response.data.userData.tipo !== 'admin') {
                return { success: false, message: "admin_only" };
            }
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userData', JSON.stringify(response.data.userData));
        }

        return response.data;
    } catch (error) {
        console.error(error);
        
        if (axios.isAxiosError(error) && error.response && error.response.data) {
            return error.response.data; // <-- aqui vem o { success: false, message: "Senha incorreta" }
        }

        return;
    }
}

export async function logout() {
    try {
        const response = await axios.post(
            `${API_URL}/api/users/logout`,
            {},
            {
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );

        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        return {
            success: true,
            message: 'logout_success'
        };
    }
    catch (error) {
        console.error('Erro ao fazer logout:', error);
        return { success: false, message: 'logout_error' };
    }
}
