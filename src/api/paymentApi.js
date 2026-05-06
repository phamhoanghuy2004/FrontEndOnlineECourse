import axiosClient from "./axiosClient";

const paymentApi = {
    checkoutCourse: (data) => {
        return axiosClient.post(`/payments/checkout/courses`, data);
    },
    checkoutCoinPackage: (data) => {
        return axiosClient.post(`/payments/checkout/coinPackage`, data);
    },
};

export default paymentApi;