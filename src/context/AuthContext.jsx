import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../api/userApi";
import authApi from "../api/authApi";



export const AuthContext = createContext();

// ===== Helpers =====
const getRolesFromToken = (token) => {
    try {
        const payloadBase64 = token.split('.')[1];
        const decoded = JSON.parse(atob(payloadBase64));
        const scope = decoded.scope || '';
        return scope.split(' ').filter(s => s.startsWith('ROLE_')).map(s => s.replace('ROLE_', ''));
    } catch {
        return [];
    }
};

const resolveRedirectPath = (roles, isFirstTime) => {
    if (isFirstTime){
        return '/complete-profile';
    }
    if (roles.includes('ADMIN')) return '/admin';
    if (roles.includes('TEACHER')) return '/teacher';
    return '/';
};



// ===== Provider =====
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("currentUser");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const fetchUserProfile = async (rolesArg) => {
        try {
            let response;
            let roles = rolesArg;

            // Nếu không truyền roles hoặc roles rỗng, thử lấy từ token hoặc user hiện tại
            if (!roles || roles.length === 0) {
                const token = localStorage.getItem("token");
                roles = token ? getRolesFromToken(token) : (user?.roles || []);
            }

            if (roles.includes('ADMIN')) {
                response = await userApi.getAdminInfoApi(); 
            } 
            else if (roles.includes('TEACHER')) {
                response = await userApi.getTeacherInfoApi(); 
            } 
            else {
                response = await userApi.getStudentInfoApi(); 
            }

            const currentUser = response.data ?? null;

            setUser(currentUser);
            localStorage.setItem("currentUser", JSON.stringify(currentUser));

        } catch (err) {
            setError(err.message || "Không thể lấy thông tin người dùng");
            throw err;
        }
    };

    const login = async (username, password) => {
        setLoading(true);
        setError(null);

        try {
            const apiResponse = await authApi.login({ username, password });
            const authData = apiResponse.data;

            if (!authData?.authenticated) {
                setError("Đăng nhập thất bại");
                return;
            }

            localStorage.setItem("token", authData.token);
            const roles = getRolesFromToken(authData.token);

            await fetchUserProfile(roles);
        
            const redirectPath = resolveRedirectPath(roles, authData.isFirstTime);

            navigate(redirectPath);

        }
        catch (err) {
            if (err.code === 1038 && err.data?.email) {

                const verifyData = {
                    email: err.data?.email,
                    isFromLogin: true
                }
                sessionStorage.setItem("verifyData", JSON.stringify(verifyData));
 
                navigate('/verify-otp');
                return;
            }
            setError(err.message || "Đăng nhập thất bại");
        }
        finally {
            setLoading(false);
        }
    }

    const loginWithGoogle = async (credential, role) => {

        setLoading(true);
        setError(null);

        try {
            const response = await userApi.googleLoginApi({credential, role});
            const authData = response.data;

            if (!authData?.authenticated) {
                setError("Đăng nhập thất bại");
                return;
            }


            localStorage.setItem("token", authData.token);
            const roles = getRolesFromToken(authData.token);

            await fetchUserProfile(roles);
        
            const redirectPath = resolveRedirectPath(roles, authData.isFirstTime);

            navigate(redirectPath);


        } catch (err) {
            setError(err.message || "Lỗi xác thực Google");
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                await authApi.logout({ token });
            }
        } catch (err) {
            console.error("Lỗi khi gọi API đăng xuất:", err);
        } finally {
            setUser(null);
            setError(null); 
            localStorage.removeItem("currentUser");
            localStorage.removeItem("token");
            sessionStorage.removeItem("verifyData"); 
            
            // Ép tải lại trang bằng hard-redirect để xoá sạch cache và state còn sót trong React
            window.location.href = '/login';
        }
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
        fetchUserProfile
    };

    return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>
}