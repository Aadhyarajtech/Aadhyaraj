import axios from 'axios';

const api = axios.create({
  baseURL: 'https://aadhyaraj.onrender.com',
  timeout: 15000
});

export default api;