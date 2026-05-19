import { useState } from 'react';
import PlacementIntroPage from './levelTest/PlacementIntroPage';
import AdaptiveTestPage from './levelTest/AdaptiveTestPage';
import PlacementLoadingPage from './levelTest/PlacementLoadingPage';
import PlacementResultPage from './levelTest/PlacementResultPage';

const LevelTestPage = () => {
  const [pageState, setPageState] = useState('intro'); // 'intro' | 'test' | 'loading' | 'result'
  const [scores, setScores] = useState({
    Grammar: 3,
    Vocabulary: 3,
    Reading: 3,
    Listening: 3
  });

  const handleStartTest = () => {
    setPageState('test');
  };

  const handleCancelTest = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  const handleFinishTest = (finalScores) => {
    setScores(finalScores);
    setPageState('loading');
  };

  const handleLoadingFinished = () => {
    setPageState('result');
  };

  const handleRetakeTest = () => {
    setPageState('intro');
  };

  const handleSelectCourse = (course) => {
    window.location.href = '/courses';
  };

  switch (pageState) {
    case 'intro':
      return (
        <PlacementIntroPage
          onStart={handleStartTest}
          onCancel={handleCancelTest}
        />
      );
    case 'test':
      return (
        <AdaptiveTestPage
          onFinish={handleFinishTest}
          onCancel={handleCancelTest}
        />
      );
    case 'loading':
      return (
        <PlacementLoadingPage
          onContinue={handleLoadingFinished}
        />
      );
    case 'result':
      return (
        <PlacementResultPage
          scores={scores}
          onRetake={handleRetakeTest}
          onSelectCourse={handleSelectCourse}
        />
      );
    default:
      return (
        <PlacementIntroPage
          onStart={handleStartTest}
          onCancel={handleCancelTest}
        />
      );
  }
};

export default LevelTestPage;