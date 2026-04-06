import axiosClient from "./axiosClient";

const paymentApi = {
    checkoutCourse: (courseId) => {
        return axiosClient.post(`/payments/checkout/course/${courseId}`);
    }
};

export default paymentApi;