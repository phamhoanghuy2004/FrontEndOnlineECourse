import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ChatProvider } from "./context/ChatContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// --- Layouts ---
import GuestLayout from "./components/layout/GuestLayout";   
import LearnerLayout from "./components/layout/LearnerLayout"; 
import TeacherLayout from "./components/layout/TeacherLayout"; 

// --- Common Components ---
import ScrollToTop from "./components/common/ScrollToTop";

// --- Auth Pages (Độc lập) ---
import LoginPage from "./page/auth/LoginPage";
import RegisterPage from "./page/auth/RegisterPage";
import VerifyOtpPage from "./page/auth/VerifyOtpPage";
import CompleteProfilePage from "./page/auth/CompleteProfilePage";

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
import ForgotPasswordPage from "./page/auth/ForgotPasswordPage";

// --- Learner Pages ---
import LearnerHomePage from "./page/student/learner/LearnerHomePage";
import LearnerCoursesPage from "./page/student/learner/LearnerCoursesPage";
import LearnerProgressPage from "./page/student/learner/LearnerProgressPage";
import VirtualSpeakingPage from "./page/student/learner/VirtualSpeakingPage";
import LearnerChatPage from "./page/student/learner/LearnerChatPage";

// --- Teacher Pages ---
import TeacherDashboard from "./page/teacher/TeacherDashboard";
import CourseManagementPage from "./page/teacher/CourseManagementPage";
import CourseEditorPage from "./page/teacher/CourseEditorPage";
import StudentManagementPage from "./page/teacher/StudentManagementPage";
import RevenuePage from "./page/teacher/RevenuePage";
import TeacherBlogPage from "./page/teacher/TeacherBlogPage";
import BlogEditorPage from "./page/teacher/BlogEditorPage";

function App() {
  return (
    // 💥 FIX: ĐƯA <Router> RA NGOÀI CÙNG ĐỂ BAO BỌC TẤT CẢ CÁC PROVIDER
    <Router>
      <AuthProvider>
        <ChatProvider>
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
              <Route path="/verify-otp" element={<VerifyOtpPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              
              <Route path="/complete-profile" element={<CompleteProfilePage />} />
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

            {/* =========================================================
              GROUP 3: TEACHER ROUTES
              Sử dụng TeacherLayout
              Truy cập qua: /teacher/...
            ========================================================= */}
            <Route path="/teacher" element={
              <ProtectedRoute>
                <TeacherLayout />
              </ProtectedRoute>
            }>
              <Route index element={<TeacherDashboard />} />
              <Route path="courses" element={<CourseManagementPage />} />
              <Route path="courses/new" element={<CourseEditorPage />} />
              <Route path="courses/:id" element={<CourseEditorPage />} />
              <Route path="courses/:id/edit" element={<CourseEditorPage />} />
              <Route path="students" element={<StudentManagementPage />} />
              <Route path="revenue" element={<RevenuePage />} />
              <Route path="blog" element={<TeacherBlogPage />} />
              <Route path="blog/new" element={<BlogEditorPage />} />
              <Route path="blog/:id/edit" element={<BlogEditorPage />} />
            </Route>

            {/* Fallback: Nếu nhập sai đường dẫn thì về trang chủ */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </ChatProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;