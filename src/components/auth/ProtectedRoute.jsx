import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Nếu đang tải (ví dụ đang check localStorage), hiện màn hình chờ
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Đang tải...</div>;
  }

  // 2. Nếu chưa đăng nhập => Đá về trang Login
  if (!user) {
    // state={{ from: location }} giúp sau khi login xong tự quay lại trang này
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Nếu đã đăng nhập => Cho phép vào
  return children;
};

export default ProtectedRoute;