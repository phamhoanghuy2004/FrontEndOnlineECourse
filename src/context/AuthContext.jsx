import React, { createContext, useState } from "react";
import { mockLoginApi } from "../api/userApi";


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
        logout, 
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>
}