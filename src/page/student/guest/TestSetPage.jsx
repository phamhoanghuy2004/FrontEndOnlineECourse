import HeroSection from "../../../components/sections/student/guest/testSetPage/TestPracticeHero";
import TestSet from "../../../components/sections/student/guest/testSetPage/TestSet";

const TestSetPage = () => {
    return (
        <div className="relative min-h-screen w-full">

            {/* --- 1. GLOBAL BACKGROUND (Cố định, không cuộn theo nội dung) --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Nền Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-teal-50 to-blue-50"></div>

                {/* Blobs trang trí (Copy từ Hero cũ sang) */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-200/40 rounded-full mix-blend-multiply blur-3xl animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200/40 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-2000"></div>

                {/* Họa tiết chấm bi */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            </div>

            {/* --- 2. NỘI DUNG CHÍNH (Nằm đè lên nền) --- */}
            <div className="relative z-10">
                <HeroSection />
                <TestSet />
            </div>

        </div>
    );
};

export default TestSetPage;    