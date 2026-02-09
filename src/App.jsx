import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ChatProvider } from "./context/ChatContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

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
import ProfilePage from "./page/student/guest/ProfilePage";


// --- Learner Pages ---
import LearnerHomePage from "./page/student/learner/LearnerHomePage";
import LearnerCoursesPage from "./page/student/learner/LearnerCoursesPage";
import LearnerProgressPage from "./page/student/learner/LearnerProgressPage";
import VirtualSpeakingPage from "./page/student/learner/VirtualSpeakingPage";
import LearnerChatPage from "./page/student/learner/LearnerChatPage";

function App() {
  return (
    <AuthProvider>
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
              <Route path="/learner/:id/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
            </Route>


            {/* =========================================================
              GROUP 2: LEARNER ROUTES
              Sử dụng LearnerLayout (Sidebar + Header Dashboard)
              Truy cập qua: /learner/...
            ========================================================= */}
            <Route path="/learner/:id" element={
              <ProtectedRoute>
                <LearnerLayout />
              </ProtectedRoute>
            }>
              <Route index element={<LearnerHomePage />} />
              <Route path="courses" element={<LearnerCoursesPage />} />
              <Route path="progresss" element={<LearnerProgressPage />} />
              <Route path="virtualSpeaking" element={<VirtualSpeakingPage />} />
              <Route path="chat" element={<LearnerChatPage />} />
            </Route>


            {/* Fallback: Nếu nhập sai đường dẫn thì về trang chủ */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </Router>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;