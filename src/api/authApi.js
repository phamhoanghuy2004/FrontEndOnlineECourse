import axiosClient from "./axiosClient";

const authApi = {
    // 1. Đăng nhập bằng username/password
    login: (data) => {
        const url = '/auth/login';
        return axiosClient.post(url, data);
    },

    // 2. Đăng ký
    register: (data) => {
        const url = '/auth/register';
        return axiosClient.post(url, data);
    },

    // 3. Xác thực OTP
    verifyOtp: (data) => {
        const url = '/auth/verify-register-otp';
        return axiosClient.post(url, data);
    },

    // 4. Gửi lại OTP
    resendOtp: (data) => {
        const url = '/auth/resend-register-otp';
        return axiosClient.post(url, data); 
    },

    // 5. Yêu cầu quên mật khẩu
    forgotPassword: (data) => {
        const url = '/auth/forgot-password';
        return axiosClient.post(url, data);
    },


    // 6. Đặt lại mật khẩu
    resetPassword: (data) => {
        const url = '/auth/reset-password';
        return axiosClient.post(url, data);
    },
};

export default authApi;