import axios from 'axios';

const api = axios.create({
  baseURL: 'https://aadhyaraj-ao2s.onrender.com',
  timeout: 15000
});

export default api;