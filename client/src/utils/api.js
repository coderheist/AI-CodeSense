import axios from 'axios';

const normalizeApiBaseUrl = (rawUrl) => {
  const trimmed = rawUrl?.trim();

  if (!trimmed) {
    return null;
  }

  const url = new URL(trimmed);
  const path = url.pathname.replace(/\/+$/, '');

  if (!path || path === '/') {
    url.pathname = '/api';
  } else if (!path.endsWith('/api')) {
    url.pathname = `${path}/api`;
  } else {
    url.pathname = path;
  }

  return url.toString().replace(/\/$/, '');
};

const fallbackApiBase = import.meta.env.PROD
  ? 'https://ai-codesense-32rf.onrender.com/api'
  : 'http://localhost:5000/api';

const envApiBase = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);
const API_URL = envApiBase || fallbackApiBase;

if (!envApiBase) {
  console.warn('⚠️ VITE_API_URL is missing or invalid, using fallback API URL:', API_URL);
}

// Log the final API URL for debugging
console.log('🔗 API URL configured:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
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
