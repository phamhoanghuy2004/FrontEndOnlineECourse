import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ChatProvider } from "./context/ChatContext";

// --- Layouts ---
import GuestLayout from "./components/layout/GuestLayout";   // Layout cho khách
import LearnerLayout from "./components/layout/LearnerLayout"; // Layout cho học viên

// --- Common Components ---
import ScrollToTop from "./components/common/ScrollToTop";

// --- Auth Pages (Độc lập) ---
import LoginPage from "./page/auth/LoginPage";
import RegisterPage from "./page/auth/RegisterPage";

// --- Guest Pages ---
import HomePage from "./page/student/guest/HomePage";
import CoursePage from "./page/student/guest/CoursePage";
import CourseDetailPage from "./page/student/guest/CourseDetailPage";
import BlogPage from "./page/student/guest/BlogPage";
import BlogDetailPage from "./page/student/guest/BlogDetailPage";
import ConsulationPage from "./page/student/guest/ConsulationPage";
import TestSetPage from "./page/student/guest/TestSetPage";
import TestDetailPage from "./page/student/guest/TestDetailPage";
import LevelTestPage from "./page/student/guest/LevelTestPage";
import TestPracticePage from "./page/student/guest/TestPracticePage";


// --- Learner Pages ---
import LearnerHomePage from "./page/student/learner/LearnerHomePage";

function App() {
  return (
    <ChatProvider>
      <Router>
        <ScrollToTop />

        <Routes>
          {/* =========================================================
              GROUP 1: GUEST ROUTES
              Sử dụng GuestLayout (Navbar + Footer truyền thống)
          ========================================================= */}
          <Route element={<GuestLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CoursePage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
            <Route path="/consultation" element={<ConsulationPage />} />
            <Route path="/tests" element={<TestSetPage />} />
            <Route path="/tests/:id" element={<TestDetailPage />} />
            <Route path="/level-test" element={<LevelTestPage />} />
            <Route path="/test-practice/:id" element={<TestPracticePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>


          {/* =========================================================
              GROUP 2: LEARNER ROUTES
              Sử dụng LearnerLayout (Sidebar + Header Dashboard)
              Truy cập qua: /learner/...
          ========================================================= */}
          <Route path="/learner" element={<LearnerLayout />}>
            <Route index element={<LearnerHomePage />} />
          </Route>


          {/* Fallback: Nếu nhập sai đường dẫn thì về trang chủ */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router>
    </ChatProvider>
  );
}

export default App;