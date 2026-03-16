import {
  MOCK_USERS
} from "../data/mockData";
import axiosClient from "./axiosClient";



// 1. LOGIN GOOGLE
export const googleLoginApi = async (credential) => {
  // Rút gọn hoàn toàn việc set headers và stringify body
  const response = await axiosClient.post('/auth/google-login', {
    credential
  });

  // axiosClient đã trả về thẳng cục JSON của Spring Boot (gồm code, message, data)
  if (response.code !== 1000) {
    throw new Error(response.message || "Lỗi đăng nhập Google");
  }

  return response.data; // Trả về AuthenticationResponse
};

// 2. CẬP NHẬT HỒ SƠ (ĐÃ BỎ THAM SỐ TOKEN)
export const completeProfileApi = async (profileData) => {
  // Gửi API cực nhàn, Interceptor tự nhét Token vào rồi!
  const response = await axiosClient.put('/students/complete-profile', profileData);

  if (response.code !== 1000) {
    throw new Error(response.message || "Lỗi cập nhật hồ sơ");
  }

  return response; // Code cũ của bạn trả về toàn bộ response
};

// 3. LẤY THÔNG TIN CÁ NHÂN (ĐÃ BỎ THAM SỐ TOKEN)
export const getMyInfoApi = async () => {
  // Chỉ cần 1 dòng gọi GET
  const response = await axiosClient.get('/students/my-profile');

  if (response.code !== 1000) {
    throw new Error(response.message || "Không thể lấy thông tin người dùng");
  }

  return response.data; // Trả về UserResponse
};

export const mockLoginApi = (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        // Trả về thông tin user (loại bỏ password cho bảo mật giả)
        const {
          password,
          ...userInfo
        } = user;
        resolve({
          success: true,
          data: userInfo,
          token: "fake-jwt-token-123456" // Giả lập token
        });
      } else {
        reject({
          success: false,
          message: "Tên đăng nhập hoặc mật khẩu không đúng!"
        });
      }
    }, 1000); // Giả lập độ trễ mạng 1 giây
  });
};