import axios from 'axios';

const fallbackURL = "https://stockify-backend-six.vercel.app";

const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL|| fallbackURL}/api`,
    withCredentials: true,
  });
  
export default axiosInstance