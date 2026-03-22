import Intro from "../../../components/sections/student/guest/homePage/Intro";
import Steps from "../../../components/sections/student/guest/homePage/Steps";
import Courses from "../../../components/sections/student/guest/homePage/Courses";
import Instructors from "../../../components/sections/student/guest/homePage/Instructors";
import Testimonials from "../../../components/sections/student/guest/homePage/Testimonials";
import Blog from "../../../components/sections/student/guest/homePage/Blog";
import { useAuth } from "../../../hooks/useAuth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MascotNotification from "../../../components/common/MascotNotification";

const HomePage = () => {

  const { user } = useAuth();
  const navigate = useNavigate();
  const [showGoalModal, setShowGoalModal] = useState(false);

  useEffect(() => {
    // Kiểm tra xem đã bỏ qua trong session này chưa để không làm phiền người dùng mãi
    const hasSkippedGoal = sessionStorage.getItem('hasSkippedGoal');

    if (
      user &&
      user.roles?.includes('STUDENT') &&
      !user.activeGoal &&
      !hasSkippedGoal
    ) {
      // Delay 1 chút cho mượt (chờ trang render xong rồi mới nhảy popup ra)
      const timer = setTimeout(() => setShowGoalModal(true), 800);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleSetupGoal = () => {
    setShowGoalModal(false);
    // Chuyển hướng sang trang setup mục tiêu (bạn nhớ tạo route này sau)
    navigate(`/learner/${user.id}/study-goal`);
  };

  const handleSkipGoal = () => {
    setShowGoalModal(false);
    // Lưu vào session để f5 không bị hiện lại nữa
    sessionStorage.setItem('hasSkippedGoal', 'true');
  };

  return (
    <>
      <Intro />
      <Steps />
      <Courses />
      <Instructors />
      <Testimonials />
      <Blog />
      <MascotNotification 
                isOpen={showGoalModal}
                onClose={handleSkipGoal}
                onConfirm={handleSetupGoal}
                title="Khởi động hành trình!"
                message="Để Echill có thể đồng hành và đưa ra lộ trình phù hợp nhất, hãy cho chúng mình biết mục tiêu học tập của bạn nhé!"
                confirmText="Thiết lập mục tiêu ngay 🚀"
                cancelText="Bỏ qua, để sau"
                mascotIcon="🦉" // Đổi thành Emoji 🎯, 🚀, hoặc truyền <img src={...}/>
            />
    </>
  );
};

export default HomePage;