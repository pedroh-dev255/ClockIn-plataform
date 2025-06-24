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

  console.log('Dados recebidos no desligamentoHandler:', plainData);

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

  console.log('Dados recebidos no cadastroHandler:', plainData);

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
