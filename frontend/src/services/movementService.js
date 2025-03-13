import api from './api';

export const getMovements = async () => {
  const response = await api.get('/movements');
  return response.data;
};

export const createMovement = async (movementData) => {
  const response = await api.post('/movements', movementData);
  return response.data;
};

export const updateMovement = async (id, movementData) => {
  const response = await api.put(`/movements/${id}`, movementData);
  return response.data;
};

export const deleteMovement = async (id) => {
  const response = await api.delete(`/movements/${id}`);
  return response.data;
};