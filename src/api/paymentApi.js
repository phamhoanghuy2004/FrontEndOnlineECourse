import axiosClient from "./axiosClient";

const paymentApi = {
    checkoutCourse: (data) => {
        return axiosClient.post(`/payments/checkout/courses`, data);
    }
};

export default paymentApi;