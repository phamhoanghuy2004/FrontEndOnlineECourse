import { Outlet } from "react-router-dom";
import Navbar from "./Navbar"; // Import Navbar cũ của bạn
import Footer from "./Footer"; // Import Footer cũ của bạn

const GuestLayout = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar />
      
      {/* Outlet là nơi nội dung các trang Home, Course... sẽ hiển thị */}
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default GuestLayout;