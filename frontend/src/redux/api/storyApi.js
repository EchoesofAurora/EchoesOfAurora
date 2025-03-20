import api from '../../services/apiService';

export const fetchStories = async () => {
  try {
    const response = await api.get('/api/stories');
    return response.data;
  } catch (error) {
    console.error('Error fetching stories:', error);
    throw error;
  }
};

export const fetchStoryById = async (storyId) => {
  try {
    const response = await api.get(`/api/stories/${storyId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching story ${storyId}:`, error);
    throw error;
  }
};