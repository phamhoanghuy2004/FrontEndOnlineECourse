import StatsOverview from '../../../components/common/student/leaner/dashboard/StatsOverview';
import ActivitySection from '../../../components/sections/student/leaner/homePage/ActivitySection';
import WelcomeSection from '../../../components/sections/student/leaner/homePage/WelcomeSection';
import ContinueLearningSection from '../../../components/sections/student/leaner/homePage/ContinueLearningSection';
import Recommended from '../../../components/sections/student/leaner/homePage/Recommended';
import { motion } from 'framer-motion';
import { fadeInRight } from '../../../constants/motionVariants';

const LearnerHomePage = () => {
    return (
        <>
            <WelcomeSection />
            {/* 2. Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Content chính) - Chiếm 2 phần */}
                <div className="lg:col-span-2 space-y-8">
                    <ContinueLearningSection />
                    <ActivitySection />
                    <Recommended />
                </div>

                {/* Right Column (Sidebar phụ) - Chiếm 1 phần */}
                <div className="lg:col-span-1 space-y-8">

                    {/* Statistics */}
                    <motion.div
                        variants={fadeInRight}
                        initial="hidden"
                        animate="visible"
                        className="h-full"
                    >
                        <StatsOverview />
                    </motion.div>

                </div>

            </div>
        </>
    );
};

export default LearnerHomePage;