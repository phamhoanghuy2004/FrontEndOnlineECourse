import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChatProvider } from "./context/ChatContext";

// Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/common/ScrollToTop";
import ChatWidget from "./components/common/ChatWidget";

// Auth Pages
import LoginPage from "./page/auth/LoginPage";
import RegisterPage from "./page/auth/RegisterPage";

// Student - Guest Pages
import HomePage from "./page/student/guest/HomePage";
import CoursePage from "./page/student/guest/CoursePage";
import CourseDetailPage from "./page/student/guest/CourseDetailPage";
import BlogPage from "./page/student/guest/BlogPage"; 
import BlogDetailPage from "./page/student/guest/BlogDetailPage";
import ConsulationPage from "./page/student/guest/ConsulationPage";

// Student - Learner/Customer Pages (Cần đăng nhập - ví dụ tạm thời)
import LevelTestPage from "./page/student/guest/LevelTestPage";
import TestSetPage from "./page/student/guest/TestSetPage";
import TestDetailPage from "./page/student/guest/TestDetailPage";
import TestPracticePage from "./page/student/guest/TestPracticePage";

function App() {
  return (
    <ChatProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen font-sans">
          {/* Navbar thường dùng chung cho Guest & Learner */}
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* --- PUBLIC ROUTES (Guest) --- */}
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CoursePage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogDetailPage />} />
              <Route path="/consultation" element={<ConsulationPage />} />
              <Route path="/tests" element={<TestSetPage />} />
              <Route path="/tests/:id" element={<TestDetailPage />} />
              
              {/* --- AUTH ROUTES --- */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* --- PRIVATE ROUTES (Learner/Customer) --- */}
              {/* Sau này bạn sẽ bọc các route này trong <ProtectedRoute> */}
              <Route path="/level-test" element={<LevelTestPage />} />
              <Route path="/test-practice/:id" element={<TestPracticePage />} />
              
              {/* --- FUTURE ROUTES --- */}
              {/* <Route path="/admin/*" element={<AdminLayout />} /> */}
              {/* <Route path="/teacher/*" element={<TeacherLayout />} /> */}
            </Routes>
          </main>

          <Footer />
          <ChatWidget />
        </div>
      </Router>
    </ChatProvider>
  );
}

export default App;