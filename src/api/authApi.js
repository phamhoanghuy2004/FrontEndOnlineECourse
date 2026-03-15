import axiosClient from "./axiosClient";

const authApi = {
    // 1. Đăng ký
    register: (data) => {
        const url = '/auth/register';
        return axiosClient.post(url, data);
    },

    // 2. Xác thực OTP
    verifyOtp: (data) => {
        const url = '/auth/verify-otp';
        return axiosClient.post(url, data);
    },

    // 3. Gửi lại OTP
    resendOtp: (email) => {
        const url = '/auth/resend-otp';
        return axiosClient.post(url, { email }); // Bọc email vào object khớp với ResendOtpRequest
    },

    getMyProfile: () => {
        return axiosClient.get('/students/my-profile');
    },
};

export default authApi;