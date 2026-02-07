import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ChatProvider } from "./context/ChatContext";

// --- Layouts ---
import GuestLayout from "./components/layout/GuestLayout";   // Layout cho khách
import LearnerLayout from "./components/layout/LearnerLayout"; // Layout cho học viên
import TeacherLayout from "./components/layout/TeacherLayout"; // Layout cho giáo viên

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

          {/* =========================================================
              GROUP 3: TEACHER ROUTES
              Sử dụng TeacherLayout
              Truy cập qua: /teacher/...
          ========================================================= */}
          <Route path="/teacher" element={<TeacherLayout />}>
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
      </Router>
    </ChatProvider>
  );
}

export default App;