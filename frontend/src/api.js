import axios from 'axios';

// In development, use the CRA dev-server proxy (see "proxy" in package.json)
// so requests are same-origin. Production builds keep the deployed API.
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '' : 'https://aadhyaraj-ao2s.onrender.com',
  timeout: 15000
});

export default api;