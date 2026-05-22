import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ChatProvider } from "./context/ChatContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import CourseCheckoutPage from "./page/student/guest/CourseCheckoutPage";
import PaymentResultPage from "./page/student/guest/PaymentResultPage";
import TestSetDetail from "./page/student/guest/TestSetDetail";
import TestReviewPage from "./page/student/guest/TestReviewPage";
import SuggestedComboPage from "./page/student/guest/SuggestedComboPage";
import CoinShopPage from "./page/student/guest/CoinShopPage";

// --- Learner Pages ---
import LearnerHomePage from "./page/student/learner/LearnerHomePage";
import LearnerCoursesPage from "./page/student/learner/LearnerCoursesPage";
import LearnerProgressPage from "./page/student/learner/LearnerProgressPage";
import VirtualSpeakingPage from "./page/student/learner/VirtualSpeakingPage";
import LearnerChatPage from "./page/student/learner/LearnerChatPage";
import StudyGoalPage from "./page/student/learner/StudyGoalPage";
import StudyRoomPage from "./page/student/learner/StudyRoomPage";

// --- Teacher Pages ---
import TeacherDashboard from "./page/teacher/TeacherDashboard";
import CourseManagementPage from "./page/teacher/CourseManagementPage";
import CourseEditorPage from "./page/teacher/CourseEditorPage";
import StudentManagementPage from "./page/teacher/StudentManagementPage";
import RevenuePage from "./page/teacher/RevenuePage";
import TeacherBlogPage from "./page/teacher/TeacherBlogPage";
import BlogEditorPage from "./page/teacher/BlogEditorPage";
import TeacherProfilePage from "./page/teacher/TeacherProfilePage";
import TeacherChatPage from "./page/teacher/TeacherChatPage";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./page/admin/AdminDashboard";
import AdminTestSetPage from "./page/admin/AdminTestSetPage";
import AdminTestSetDetailPage from "./page/admin/AdminTestSetDetailPage";
import AdminTestDetailPage from "./page/admin/AdminTestDetailPage";
import VoucherManagementPage from "./page/teacher/VoucherManagementPage";
import CoinPackageManagement from "./page/teacher/CoinPackageManagement";
import ConsultationManagement from "./page/admin/ConsultationManagement";
import UserManagementPage from "./page/admin/UserManagementPage";

function App() {
  return (
    // 💥 FIX: ĐƯA <Router> RA NGOÀI CÙNG ĐỂ BAO BỌC TẤT CẢ CÁC PROVIDER
    <Router>
      <AuthProvider>
        <ChatProvider>
          <ScrollToTop />

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />

          <Routes>
            {/* =========================================================
              GROUP 1: GUEST ROUTES
              Sử dụng GuestLayout (Navbar + Footer truyền thống)
            ========================================================= */}
            <Route path="/level-test" element={<LevelTestPage />} />

            <Route element={<GuestLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CoursePage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogDetailPage />} />
              <Route path="/consultation" element={<ConsulationPage />} />
              <Route path="/tests" element={<TestSetPage />} />
              <Route path="/tests/:id" element={<TestDetailPage />} />
              <Route path="/test-practice/:id" element={<TestPracticePage />} />

              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-otp" element={<VerifyOtpPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/payment/result" element={<PaymentResultPage />} />
              <Route path="/course-recommendations" element={<SuggestedComboPage />} />

              <Route path="/complete-profile" element={
                <ProtectedRoute>
                  <CompleteProfilePage />
                </ProtectedRoute>
              } />

              <Route path="/learner/:id/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />

              <Route path="/checkout" element={
                <ProtectedRoute>
                  <CourseCheckoutPage />
                </ProtectedRoute>
              } />

              {/* 💥 ROUTE MỚI: XEM CHI TIẾT BỘ ĐỀ VÀ LỊCH SỬ LÀM BÀI */}
              <Route path="/test-sets/:id" element={
                <ProtectedRoute>
                  <TestSetDetail />
                </ProtectedRoute>
              } />

              <Route path="/test-results/:id/review" element={
                <ProtectedRoute>
                  <TestReviewPage />
                </ProtectedRoute>
              } />

              <Route path="/coinShop" element={
                <ProtectedRoute>
                  <CoinShopPage />
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
              <Route path="study-goal" element={<StudyGoalPage />} />
              <Route path="study-room/:courseId" element={<StudyRoomPage />} />
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
              <Route path="revenue" element={<Navigate to="/teacher" replace />} />
              <Route path="blog" element={<TeacherBlogPage />} />
              <Route path="blog/new" element={<BlogEditorPage />} />
              <Route path="blog/:id/edit" element={<BlogEditorPage />} />
              <Route path="profile" element={<TeacherProfilePage />} />
              <Route path="chat" element={<TeacherChatPage />} />
              <Route path="vouchers" element={<VoucherManagementPage />} />
              <Route path="coin-packages" element={<CoinPackageManagement />} />
            </Route>

            {/* =========================================================
              GROUP 4: ADMIN ROUTES
              Sử dụng AdminLayout
              Truy cập qua: /admin/...
            ========================================================= */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="test-sets" element={<AdminTestSetPage />} />
              <Route path="test-sets/:id" element={<AdminTestSetDetailPage />} />
              <Route path="tests/:id" element={<AdminTestDetailPage />} />
              <Route path="consultations" element={<ConsultationManagement />} />
              <Route path="users" element={<UserManagementPage />} />
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