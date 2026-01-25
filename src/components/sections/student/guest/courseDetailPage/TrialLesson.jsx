import LessonSection from "../../../../common/student/guest/courseDetail/LessonSection";

const TrialLesson = ({ course }) => {
  if (!course?.trialLesson) return null;

  return (
    <LessonSection
      lesson={course.trialLesson}
      courseTag={course.tag}
      lessonIndex={1}
      isTrial={true}
    />
  );
};

export default TrialLesson;
