import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7184/api', // رابط الـ Backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;