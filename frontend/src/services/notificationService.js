import api from './api';

export const getNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

export const getNotification = async (id) => {
  const response = await api.get(`/notifications/${id}`);
  return response.data;
};

export const createNotification = async (notificationData) => {
  const response = await api.post('/notifications', notificationData);
  return response.data;
};

export const updateNotification = async (id, notificationData) => {
  const response = await api.put(`/notifications/${id}`, notificationData);
  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await api.delete(`/notifications/${id}`);
  return response.data;
};