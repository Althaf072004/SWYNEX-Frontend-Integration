import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      if (window.location.pathname.includes('admin')) {
        window.location.href = '/admin-login';
      }
    }
    // Give the UI a useful message for HTTP, timeout and offline failures.
    if (!error.response) {
      error.userMessage = error.code === 'ECONNABORTED'
        ? 'The server took too long to respond. Please try again.'
        : 'Cannot connect to the API. Check that the backend is running and the API URL is correct.';
    } else {
      error.userMessage = error.response.data?.message || `Request failed (${error.response.status}).`;
    }
    return Promise.reject(error);
  }
);

export const getApiErrorMessage = (error, fallback = 'Something went wrong. Please try again.') =>
  error?.userMessage || error?.response?.data?.message || error?.message || fallback;

export default api;
