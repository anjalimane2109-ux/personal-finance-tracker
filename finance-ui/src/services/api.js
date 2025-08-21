import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // your Django backend URL
});

api.interceptors.request.use((config) => {
  const authTokens = JSON.parse(localStorage.getItem('authTokens'));
  if (authTokens?.access) {
    config.headers.Authorization = `Bearer ${authTokens.access}`;
  }
  return config;
});

export default api;
