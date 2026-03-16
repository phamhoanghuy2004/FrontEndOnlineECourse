import axiosClient from "./axiosClient";

const authApi = {
    // 1. Đăng ký
    register: (data) => {
        const url = '/auth/register';
        return axiosClient.post(url, data);
    },

    // 2. Xác thực OTP
    verifyOtp: (data) => {
        const url = '/auth/verify-register-otp';
        return axiosClient.post(url, data);
    },

    // 3. Gửi lại OTP
    resendOtp: (email) => {
        const url = '/auth/resend-register-otp';
        return axiosClient.post(url, {
            email
        }); // Bọc email vào object khớp với ResendOtpRequest
    },

    forgotPassword: (data) => {
        const url = '/auth/forgot-password';
        return axiosClient.post(url, data);
    },

    resetPassword: (data) => {
        const url = '/auth/reset-password';
        return axiosClient.post(url, data);
    },
};

export default authApi;