import axios from 'axios';


const axiosClient = axios.create({
    baseURL: 'http://157.245.205.7/toeic/',
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
    '/auth/reset-password',
    '/auth/refresh'
];

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

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
        const originalRequest = error.config;
        const responseData = error.response?.data;

        // Bắt lỗi 1006 từ JwtAuthenticationEntryPoint
        if (responseData?.code === 1006 && originalRequest) {

            // Nếu chính API refresh bị 1006 (token cũ cũng hết hạn hoặc không hợp lệ) -> Đăng nhập lại
            if (originalRequest.url.includes('/auth/refresh')) {
                localStorage.removeItem("token");
                localStorage.removeItem("currentUser");
                window.location.href = '/login';
                return Promise.reject(error);
            }

            if (!originalRequest._retry) {
                originalRequest._retry = true;

                if (isRefreshing) {
                    return new Promise(function (resolve, reject) {
                        failedQueue.push({ resolve, reject });
                    }).then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosClient(originalRequest);
                    }).catch(err => {
                        return Promise.reject(err);
                    });
                }

                isRefreshing = true;
                const oldToken = localStorage.getItem('token');

                return new Promise(function (resolve, reject) {
                    axiosClient.post('/auth/refresh', { token: oldToken })
                        .then((res) => {
                            const newToken = res.data?.token || res.token;
                            localStorage.setItem('token', newToken);
                            axiosClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            processQueue(null, newToken);
                            resolve(axiosClient(originalRequest));
                        })
                        .catch((err) => {
                            processQueue(err, null);
                            localStorage.removeItem("token");
                            localStorage.removeItem("currentUser");
                            window.location.href = '/login';
                            reject(err);
                        })
                        .finally(() => {
                            isRefreshing = false;
                        });
                });
            }
        }

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