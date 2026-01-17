import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Mỗi khi đường dẫn (pathname) thay đổi, cuộn lên đầu ngay lập tức
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Component này không render ra giao diện gì cả
};

export default ScrollToTop;