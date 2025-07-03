import { API_URL } from '../../config';

export async function validateResetToken(token: string) {
    try {
        const response = await fetch(`${API_URL}/api/users/validadeEsqueciToken/${token}`);
        const data = await response.json();
        return data.success;
    } catch (error) {
        return false;
    }
}

export async function resetPassword(token: string, novaSenha: string) {
    try {
        const response = await fetch(`${API_URL}/api/users/resetarSenha/${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ senha: novaSenha })
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: 'server_error' };
    }
}
