import axios from 'axios';
import { API_URL } from '../../../config';

export const getFuncionarios = async (id: number) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/emp/GetFuncionarios`,
      { id },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    console.log('Funcionários fetched:', response.data);

    if(response.status == 401){
        console.log('Token invalido');

        return false;
    }
    return response.data;

  } catch (error) {
    console.error('Error fetching funcionarios:', error);

    throw error;
  }
};