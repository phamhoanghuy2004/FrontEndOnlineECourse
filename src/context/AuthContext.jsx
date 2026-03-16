import React, { createContext, useState } from "react";
import { googleLoginApi, getMyInfoApi } from "../api/userApi";
import authApi from "../api/authApi";

const getRolesFromToken = (token) => {
    try {
        const payloadBase64 = token.split('.')[1];
        const decoded = JSON.parse(atob(payloadBase64));
        const scope = decoded.scope || '';
        // Lọc ra những claim bắt đầu bằng "ROLE_" và bỏ prefix
        return scope.split(' ').filter(s => s.startsWith('ROLE_')).map(s => s.replace('ROLE_', ''));
    } catch {
        return [];
    }
};

const resolveRedirectPath = (roles) => {
    if (roles.includes('ADMIN'))   return '/admin';
    if (roles.includes('TEACHER')) return '/teacher';
    return '/';
};

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

    const login = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            //axiosClient trả về ApiResponse { code, message, data }
            const apiResponse = await authApi.login({ username, password });
            const authData = apiResponse.data; // AuthenticationResponse { authenticated, token }

            if (!authData?.authenticated) {
                throw new Error("Đăng nhập thất bại.");
            }

            const token = authData.token;

            localStorage.setItem("token", token);

            const profileData = await getMyInfoApi();
            setUser(profileData);
            localStorage.setItem("currentUser", JSON.stringify(profileData));

            const roles = getRolesFromToken(token);
            const redirectPath = resolveRedirectPath(roles);

            return { success: true, redirectPath };
        }
        catch (err) {
            // axiosClient ném ra string message từ backend
            const msg = typeof err === 'string' ? err
                      : err?.message || "Đăng nhập thất bại. Vui lòng thử lại.";
            setError(msg);
            return { success: false };
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

