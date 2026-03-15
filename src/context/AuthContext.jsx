import React, { createContext, useState } from "react";
import { mockLoginApi, googleLoginApi } from "../api/userApi";
import authApi from "../api/authApi";


// Tao context
export const AuthContext = createContext();

// Tao Provider
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("currentUser");
        return savedUser ? JSON.parse(savedUser) : null;
    }); // lam nhu nay de khong bi mat di user khi F5 lai

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Ham dang nhap
    const login = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await mockLoginApi(username, password);
            setUser(response.data);

            // set vao localStorage de khong bi mat di khi F5
            localStorage.setItem("currentUser", JSON.stringify(response.data));
            localStorage.setItem("token", response.token);
            return true;
        }
        catch (error) {
            setError(error.message);
            return false;
        }
        finally {
            setLoading(false);
        }
    }

    const loginWithGoogle = async (credential) => {
        setLoading(true);
        setError(null);
        try {
            const response = await googleLoginApi(credential);

            if (response.authenticated) {
                localStorage.setItem("token", response.token);

                // 1. Kéo thông tin user
                const profileResult = await fetchStudentProfile();

                // 2. 💥 MỞ VỎ BỌC ĐỂ LẤY DATA THẬT
                if (profileResult.success) {
                    const userData = profileResult.data;

                    // 3. Check thiếu thông tin từ userData thật
                    const needsCompletion = !userData.address || !userData.dob || !userData.jobTitle;

                    // Ưu tiên cờ isFirstTime từ Backend, nếu không có thì xài needsCompletion
                    const isFirst = response.isFirstTime ?? response.firstTime ?? needsCompletion;

                    return { success: true, isFirstTime: isFirst };
                }
            }

            // Nếu không rơi vào if trên (không auth được hoặc không kéo được profile)
            return { success: false };

        } catch (error) {
            setError(error.message || "Lỗi xác thực Google");
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    // 💥 MỚI: Hàm fetch lại profile từ Backend
    const fetchStudentProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            // Không cần truyền token vì interceptor của axiosClient sẽ tự động lấy từ localStorage
            const response = await authApi.getMyProfile();

            // Giả định response trả về chính là object data (nhờ interceptor)
            const profileData = response.data || response;

            setUser(profileData);
            localStorage.setItem("currentUser", JSON.stringify(profileData));

            return { success: true, data: profileData };
        } catch (error) {
            setError(error.message || error || "Không thể đồng bộ thông tin người dùng");
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    };

    // Hàm Đăng Xuất
    const logout = () => {
        setUser(null);
        localStorage.removeItem("currentUser");
        localStorage.removeItem("token");
    };

    const value = {
        user,
        loading,
        error,
        setError,
        login,
        loginWithGoogle,
        logout,
        isAuthenticated: !!user,
        setUser,
        fetchStudentProfile
    };

    return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>
}