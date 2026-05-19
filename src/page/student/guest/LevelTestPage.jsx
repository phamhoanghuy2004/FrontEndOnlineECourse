import { useNavigate } from 'react-router-dom';
import LevelTestLanding from '../../../components/sections/student/guest/levelTestPage/LevelTestLanding';

const PLACEMENT_TEST_ID = '833713117646593268';

const LevelTestPage = () => {
  const navigate = useNavigate();

  const handleStartTest = () => {
    navigate(`/test-sets/${PLACEMENT_TEST_ID}`);
  };

  return (
    <LevelTestLanding onStartTest={handleStartTest} />
  );
};

export default LevelTestPage;