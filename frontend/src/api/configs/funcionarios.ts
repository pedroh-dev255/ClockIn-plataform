import axios from 'axios';
import { API_URL } from '../../../config';

export const getFuncionarios = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/emp/GetFuncionarios`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    if(response.status == 401){
      console.log('Token inválido');
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      return false;
    }
    return response.data;

  } catch (error) {
    console.error('Error fetching funcionarios:', error);

    throw error;
  }
};

export const desligamentoHandler = async (formData: FormData) => {
  const plainData: any = {};

  formData.forEach((value, key) => {
    plainData[key] = value;
  });

  // validando se o id do funcionario é um numero
  if (isNaN(plainData.id_funcionario) || plainData.id_funcionario <= 0) {
    throw new Error('ID do funcionário inválido');
  }

  if (plainData.id_funcionario === undefined || plainData.id_funcionario === null || plainData.desligamento === undefined || plainData.desligamento === null) {
    throw new Error('Dados do funcionário não podem ser nulo ou indefinido');
  }

  const response = await axios.post(
    `${API_URL}/api/users/desligamento`,
    plainData,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
  );

  return response.data;
};

export const cadastroHandler = async (formData: FormData) => {
  const plainData: any = {};

  formData.forEach((value, key) => {
    plainData[key] = value;
  });

  // Agora você pode enviar os dados com axios:
  const response = await axios.post(
    `${API_URL}/api/users/register`,
    plainData,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
  );

  return response.data;
};
