import axios from 'axios';

// Ensure API_URL always ends with /api
let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// If production URL doesn't include /api, add it
if (API_URL && !API_URL.includes('/api')) {
  API_URL = `${API_URL}/api`;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// AI Endpoints
export const reviewCode = async (code, language) => {
  const response = await api.post('/ai/review', { code, language });
  return response.data;
};

export const generateTests = async (code, language) => {
  const response = await api.post('/ai/testgen', { code, language });
  return response.data;
};

export const summarizeCode = async (code, language) => {
  const response = await api.post('/ai/summary', { code, language });
  return response.data;
};

export const chatWithAI = async (code, language, question, chatHistory = []) => {
  const response = await api.post('/ai/chat', { code, language, question, chatHistory });
  return response.data;
};

// User Endpoints
export const registerUser = async (userData) => {
  const response = await api.post('/user/register', userData);
  return response.data;
};

export const saveReview = async (reviewData) => {
  const response = await api.post('/user/save', reviewData);
  return response.data;
};

export const getUserHistory = async (userId, params = {}) => {
  const response = await api.get(`/user/history/${userId}`, { params });
  return response.data;
};

export const getReviewById = async (reviewId) => {
  const response = await api.get(`/user/review/${reviewId}`);
  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/user/review/${reviewId}`);
  return response.data;
};

export const getUserStats = async (userId) => {
  const response = await api.get(`/user/stats/${userId}`);
  return response.data;
};

export default api;
