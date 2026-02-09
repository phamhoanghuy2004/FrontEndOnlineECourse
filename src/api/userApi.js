import { MOCK_USERS } from "../data/mockData";

export const mockLoginApi = (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        // Trả về thông tin user (loại bỏ password cho bảo mật giả)
        const { password, ...userInfo } = user; 
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