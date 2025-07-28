import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Navigation from '../../components/ui/Navigation';
import AITutorFloat from '../../components/ui/AITutorFloat';
import Breadcrumb from '../../components/ui/Breadcrumb';
import QuizSetup from './components/QuizSetup';
import QuizInterface from './components/QuizInterface';
import QuizResults from './components/QuizResults';

const QuizGeneratorPractice = () => {
  const [currentView, setCurrentView] = useState('setup'); // setup, quiz, results
  const [quizConfig, setQuizConfig] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStartQuiz = async (config) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error('Failed to generate quiz');
      const data = await res.json();
      setQuizConfig(data);
      setCurrentView('quiz');
    } catch (err) {
      setError('Failed to generate quiz.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = (results) => {
    setQuizResults(results);
    setCurrentView('results');
  };

  const handleRetakeQuiz = () => {
    setCurrentView('quiz');
    setQuizResults(null);
  };

  const handleBackToSetup = () => {
    setCurrentView('setup');
    setQuizConfig(null);
    setQuizResults(null);
  };

  // Mock quiz data for results view
  const mockQuizData = quizConfig ? {
    id: 'quiz_' + Date.now(),
    subject: quizConfig.subject,
    questions: generateMockQuestions(quizConfig),
    totalTime: 1800,
    createdAt: new Date()
  } : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />

      <main className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb />

          {currentView === 'setup' && (
            <>
              <QuizSetup onStartQuiz={handleStartQuiz} />
              {loading && <div className="mt-4 text-blue-600">Generating quiz...</div>}
              {error && <div className="mt-4 text-red-500">{error}</div>}
            </>
          )}

          {currentView === 'quiz' && quizConfig && (
            <QuizInterface
              quizConfig={quizConfig}
              onQuizComplete={handleQuizComplete}
            />
          )}

          {currentView === 'results' && quizResults && mockQuizData && (
            <QuizResults
              results={quizResults}
              quizData={mockQuizData}
              onRetakeQuiz={handleRetakeQuiz}
              onBackToSetup={handleBackToSetup}
            />
          )}
        </div>
      </main>

      <AITutorFloat />
    </div>
  );
};

// Mock question generator function
function generateMockQuestions(config) {
  const questions = [];
  const questionTypes = config.questionTypes;

  for (let i = 0; i < config.length; i++) {
    const type = questionTypes[i % questionTypes.length];

    if (type === 'multipleChoice') {
      questions.push({
        id: `q_${i + 1}`,
        type: 'multipleChoice',
        difficulty: ['Easy', 'Medium', 'Hard'][config.difficulty % 3],
        question: `Which of the following best describes the concept in ${config.subject}?`,
        options: [
          'Option A: First possible answer',
          'Option B: Second possible answer',
          'Option C: Third possible answer',
          'Option D: Fourth possible answer'
        ],
        correctAnswer: 'Option A: First possible answer',
        hint: 'Think about the fundamental principles we discussed in class.',
        explanation: 'The correct answer is A because it aligns with the basic principles of the subject.'
      });
    } else if (type === 'fillInBlank') {
      questions.push({
        id: `q_${i + 1}`,
        type: 'fillInBlank',
        difficulty: ['Easy', 'Medium', 'Hard'][config.difficulty % 3],
        question: 'Fill in the blanks to complete the statement.',
        questionText: `The process of _____ is essential for understanding _____ in ${config.subject}.`,
        blanks: ['learning', 'concepts'],
        hint: 'Think about the key processes involved in this subject.',
        explanation: 'Learning and concepts are fundamental to understanding any subject.'
      });
    } else if (type === 'shortAnswer') {
      questions.push({
        id: `q_${i + 1}`,
        type: 'shortAnswer',
        difficulty: ['Easy', 'Medium', 'Hard'][config.difficulty % 3],
        question: `Explain the importance of key concepts in ${config.subject} and provide examples.`,
        hint: 'Structure your answer with clear examples and explanations.',
        explanation: 'A good answer should include specific examples and clear reasoning.'
      });
    }
  }

  return questions;
}

export default QuizGeneratorPractice;