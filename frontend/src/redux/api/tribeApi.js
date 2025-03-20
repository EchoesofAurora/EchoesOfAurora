// src/redux/api/tribeApi.js
import api from '../../services/apiService';

export const fetchTribes = async () => {
  try {
    const response = await api.get('/api/tribes');
    return response.data;
  } catch (error) {
    console.error('Error fetching tribes:', error);
    throw error;
  }
};

export const fetchTribeById = async (tribeId) => {
  try {
    const response = await api.get(`/api/tribes/${tribeId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tribe ${tribeId}:`, error);
    throw error;
  }
};