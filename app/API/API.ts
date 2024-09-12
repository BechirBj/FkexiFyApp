import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Private_api = axios.create({
  baseURL: 'http://192.168.1.16:3000',
});

Private_api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { Private_api };
