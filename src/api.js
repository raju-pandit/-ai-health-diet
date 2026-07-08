import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api';

// Add interceptor to include auth token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const generatePlan = async (profile) => {
  const response = await axios.post(`${API_URL}/generate-plan`, { profile });
  return response.data;
};

export const savePlan = async (data) => {
  const response = await axios.post(`${API_URL}/save-plan`, data);
  return response.data;
};

export const getPlans = async (search = '') => {
  const response = await axios.get(`${API_URL}/plans`, { params: { search } });
  return response.data;
};
