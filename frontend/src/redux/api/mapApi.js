// src/redux/api/mapApi.js
import api from '../../services/apiService';

export const fetchMapData = async () => {
  try {
    const response = await api.get('/api/mapData');
    return response.data;
  } catch (error) {
    console.error('Error fetching map data:', error);
    throw error;
  }
};