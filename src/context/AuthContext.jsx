import React, { createContext, useState } from "react";
import { mockLoginApi, googleLoginApi, getMyInfoApi } from "../api/userApi";


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
            // response: { token, authenticated, isFirstTime }
            // Lưu token
            localStorage.setItem("token", response.token);
            
            // Fetch thông tin user thật từ server
            const userInfo = await getMyInfoApi(response.token);
            
            // Map roles thành role dạng chuỗi cho frontend dễ dùng
            if (userInfo.roles && userInfo.roles.length > 0) {
                userInfo.role = userInfo.roles[0].name; // VD: "STUDENT"
            }

            // Gán default giá trị avatar và name nếu không có
            if (!userInfo.avatarUrl && userInfo.avatar) {
               userInfo.avatarUrl = userInfo.avatar;
            } else if (userInfo.avatarUrl) {
               userInfo.avatar = userInfo.avatarUrl; // Navbar dùng chữ `avatar`
            }
            if (userInfo.fullName && !userInfo.name) {
                userInfo.name = userInfo.fullName;
            }

            setUser(userInfo);
            localStorage.setItem("currentUser", JSON.stringify(userInfo));
            
            // Buộc chuyển hướng nếu profile còn thiếu thông tin
            const needsCompletion = !userInfo.address || !userInfo.dob || !userInfo.jobTitle;
            const isFirst = response.isFirstTime ?? response.firstTime ?? needsCompletion;
            
            return { success: true, isFirstTime: isFirst };
        } catch (error) {
            setError(error.message);
            return { success: false };
        } finally {
            setLoading(false);
        }
    }

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
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>
}