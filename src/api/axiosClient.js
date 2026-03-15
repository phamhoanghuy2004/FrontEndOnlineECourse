import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080', // Thay đổi đường dẫn này cho khớp với Backend
    headers: {
        'Content-Type': 'application/json',
    },
});

// 💥 1. INTERCEPTOR REQUEST: Kẻ đánh chặn trước khi gửi API (Nhét Token vào đây)
axiosClient.interceptors.request.use(
    (config) => {
        // Lấy token từ LocalStorage (Key phải khớp với lúc đăng nhập/xác thực OTP)
        const token = localStorage.getItem('token'); 
        
        if (token) {
            // Gắn chuẩn Bearer Token của OAuth2 / JWT
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 💥 2. INTERCEPTOR RESPONSE: Kẻ đánh chặn khi nhận dữ liệu về (Giữ nguyên của bạn)
axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            return response.data; // Chỉ lấy cục data của Backend trả về
        }
        return response;
    },
    (error) => {
        // Mẹo nhỏ: Nếu lỗi 401 (Token hết hạn/bị can thiệp), có thể xử lý xóa token ở đây luôn
        if (error.response && error.response.status === 401) {
            console.error("Lỗi 401: Token không hợp lệ hoặc đã hết hạn!");
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            window.location.href = '/login'; // Bật cái này lên nếu muốn ép văng ra trang đăng nhập
        }

        // Gom lỗi từ Backend để ném ra cho Component xử lý
        const errorMessage = error.response?.data?.message || error.message || "Có lỗi xảy ra!";
        return Promise.reject(errorMessage);
    }
);

export default axiosClient;