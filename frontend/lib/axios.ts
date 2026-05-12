// frontend/lib/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // http://localhost:8080/api
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';
    const isCheckAuthRequest = error.config?.url?.includes('/auth/me');

    if (error.response?.status === 401 && !isAuthPage && !isCheckAuthRequest) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;