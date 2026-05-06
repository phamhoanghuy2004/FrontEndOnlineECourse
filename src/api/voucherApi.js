import axiosClient from './axiosClient';

const voucherApi = {
    // Gọi API lấy danh sách có phân trang
    getMyVouchers: (params) => {
        // params sẽ chứa { page: 1, size: 10, sortBy: 'createdAt' }
        return axiosClient.get('/vouchers/my-vouchers', { params });
    },

    // Gọi API tạo mới
    createVoucher: (data) => {
        return axiosClient.post('/vouchers', data);
    },

    // Gọi API cập nhật (Truyền ID và Payload)
    updateVoucher: (id, data) => {
        return axiosClient.put(`/vouchers/${id}`, data);
    },


    // Gọi api lấy các voucher public lên cho client
    getPublicVouchers: ()=> {
        return axiosClient.get('/vouchers/public');
    },

    getActiveComboVouchers: ()=> {
        return axiosClient.get('/vouchers/public/combo');
    }
};

export default voucherApi;