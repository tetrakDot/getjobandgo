import axios from 'axios';
import { getStoredTokens, clearStoredTokens } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.getjobandgo.com';

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const tokens = getStoredTokens();
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredTokens();
    }
    return Promise.reject(error);
  }
);

