import axiosClient from './axiosClient'; // Nhớ sửa lại đường dẫn import file config axios của dự án Echill

const coinPackageApi = {
    /**
     * Tạo gói xu mới
     * Quyền: ADMIN, TEACHER
     * @param {Object} data - Dữ liệu gói xu (CoinPackageCreateRequest)
     */
    createCoinPackage: (data) => {
        const url = '/coin-packages';
        return axiosClient.post(url, data);
    },

    /**
     * Lấy danh sách gói xu đang hoạt động (hiển thị lên Shop cho User mua)
     * Quyền: PUBLIC (Không cần token)
     * @param {Object} params - Tham số phân trang và filter (CoinPackagePageRequest: page, size...)
     */
    getActiveCoinPackages: (params) => {
        const url = '/coin-packages/public';
        return axiosClient.get(url, { params });
    },

    /**
     * Lấy TẤT CẢ danh sách gói xu để quản lý trong trang Admin
     * Quyền: ADMIN, TEACHER
     * @param {Object} params - Tham số phân trang và filter (CoinPackagePageRequest: page, size...)
     */
    getAllCoinPackages: (params) => {
        const url = '/coin-packages';
        return axiosClient.get(url, { params });
    },

    /**
     * Cập nhật thông tin gói xu
     * Quyền: ADMIN, TEACHER
     * @param {number|string} id - ID của gói xu cần cập nhật
     * @param {Object} data - Dữ liệu cập nhật (CoinPackageUpdateRequest)
     */
    updateCoinPackage: (id, data) => {
        const url = `/coin-packages/${id}`;
        return axiosClient.put(url, data);
    },

    /**
     * Lấy chi tiết một gói xu bằng ID
     * Quyền: ADMIN, TEACHER
     * @param {number|string} id - ID của gói xu cần lấy chi tiết
     */
    getCoinPackageById: (id) => {
        const url = `/coin-packages/${id}`;
        return axiosClient.get(url);
    },
};

export default coinPackageApi;