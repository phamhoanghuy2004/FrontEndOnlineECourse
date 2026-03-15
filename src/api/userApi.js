import { MOCK_USERS } from "../data/mockData";

const API_BASE_URL = "http://localhost:8080";

export const googleLoginApi = async (credential) => {
  const response = await fetch(`${API_BASE_URL}/auth/google-login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ credential }),
  });
  
  const data = await response.json();
  if (!response.ok || data.code !== 1000) {
    throw new Error(data.message || "Lỗi đăng nhập Google");
  }
  return data.data; // AuthenticationResponse
};

export const completeProfileApi = async (token, profileData) => {
  const response = await fetch(`${API_BASE_URL}/users/complete-profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(profileData),
  });

  const data = await response.json();
  if (!response.ok || data.code !== 1000) {
    throw new Error(data.message || "Lỗi cập nhật hồ sơ");
  }
  return data;
};

export const getMyInfoApi = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users/my-info`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok || data.code !== 1000) {
    throw new Error(data.message || "Không thể lấy thông tin người dùng");
  }
  return data.data; // UserResponse
};


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