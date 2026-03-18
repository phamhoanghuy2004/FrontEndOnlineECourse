import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

const PUBLIC_ENDPOINTS = [
    '/auth/login', 
    '/auth/register', 
    '/auth/verify-register-otp',
    '/auth/resend-register-otp', 
    '/auth/google-login', 
    '/auth/forgot-password', 
    '/auth/reset-password'
];

// 💥 1. INTERCEPTOR REQUEST: Kẻ đánh chặn trước khi gửi API
axiosClient.interceptors.request.use(
    (config) => {
        // Kiểm tra xem URL hiện tại có phải là Public Endpoint không
        const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint => config.url.includes(endpoint));

        // NẾU KHÔNG PHẢI PUBLIC ENDPOINT THÌ MỚI GẮN TOKEN
        if (!isPublicEndpoint) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 💥 2. INTERCEPTOR RESPONSE: Kẻ đánh chặn khi nhận dữ liệu về 
axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            return response.data; // Data chính là API Response
        }
        return response;
    },
    (error) => {
        const responseData = error.response?.data;

        const errorMessage =
            responseData?.message ||
            error.message ||
            "Có lỗi xảy ra!";

        return Promise.reject({
            message: errorMessage,
            code: responseData?.code ?? null,
            data: responseData?.data ?? null
        });
    }
);

export default axiosClient;