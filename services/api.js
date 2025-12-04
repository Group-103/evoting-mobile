import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
// Using network IP for mobile access
const API_URL = 'http://10.246.50.181:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = Bearer ;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

if (__DEV__) {
    console.log('API Base URL:', API_URL);
}

export default api;
