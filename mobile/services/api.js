import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use your computer's local IP address
// To find it: Run 'ipconfig' on Windows or 'ifconfig' on Mac/Linux
// Look for IPv4 Address under your active network adapter
const API_URL = 'http://10.232.117.29:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper function to mask sensitive data in logs
const maskSensitiveData = (data) => {
    if (!data || typeof data !== 'object') return data;

    const sensitiveFields = ['password', 'confirmPassword', 'currentPassword', 'newPassword', 'token', 'accessToken', 'refreshToken'];
    const masked = { ...data };

    for (const field of sensitiveFields) {
        if (masked[field]) {
            masked[field] = '***MASKED***';
        }
    }

    return masked;
};

// Add token to requests
api.interceptors.request.use(
    async (config) => {
        // Use 'userToken' to match what's stored during login
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log all requests in dev mode (with sensitive data masked)
        if (__DEV__) {
            console.log(`📡 API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
            if (config.data) {
                // Mask sensitive fields before logging
                const safeData = maskSensitiveData(config.data);
                console.log('📦 Request Data:', JSON.stringify(safeData, null, 2));
            }
            if (token) {
                console.log('🔑 Token present: Yes');
            } else {
                console.log('⚠️ Token present: No');
            }
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
