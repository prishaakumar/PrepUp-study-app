import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const QuizInterface = ({ quizConfig, onQuizComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes
  const [showHint, setShowHint] = useState(false);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState(new Set());
  const [confidence, setConfidence] = useState({});
  const [isExamMode, setIsExamMode] = useState(false);

  // Use questions from backend if available
  const quizData = {
    id: 'quiz_' + Date.now(),
    subject: quizConfig.subject,
    questions: quizConfig.questions && Array.isArray(quizConfig.questions) && quizConfig.questions.length > 0
      ? quizConfig.questions
      : generateMockQuestions(quizConfig),
    totalTime: 1800,
    createdAt: new Date()
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleQuizSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleConfidenceChange = (questionId, level) => {
    setConfidence(prev => ({
      ...prev,
      [questionId]: level
    }));
  };

  const toggleBookmark = (questionId) => {
    setBookmarkedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleQuizSubmit = () => {
    const results = {
      quizId: quizData.id,
      answers,
      confidence,
      bookmarkedQuestions: Array.from(bookmarkedQuestions),
      timeSpent: 1800 - timeRemaining,
      completedAt: new Date()
    };
    onQuizComplete(results);
  };

  const currentQ = quizData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-card rounded-lg border border-border p-4 mb-6 soft-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-foreground capitalize">
              {quizConfig.subject} Quiz
            </h2>
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {quizData.questions.length}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className="text-muted-foreground" />
              <span className={`text-sm font-medium ${timeRemaining < 300 ? 'text-error' : 'text-foreground'}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExamMode(!isExamMode)}
              iconName={isExamMode ? "Eye" : "EyeOff"}
            >
              {isExamMode ? 'Exit Exam Mode' : 'Exam Mode'}
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Panel */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-lg border border-border p-6 soft-shadow">
            {/* Question Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                    {currentQ.type.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                    {currentQ.difficulty}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-foreground leading-relaxed">
                  {currentQ.question}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleBookmark(currentQ.id)}
                className={bookmarkedQuestions.has(currentQ.id) ? 'text-warning' : 'text-muted-foreground'}
              >
                <Icon name="Bookmark" size={20} />
              </Button>
            </div>

            {/* Question Content */}
            <div className="mb-6">
              {currentQ.type === 'multipleChoice' && (
                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <label
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name={`question_${currentQ.id}`}
                        value={option}
                        checked={answers[currentQ.id] === option}
                        onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-foreground">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQ.type === 'fillInBlank' && (
                <div className="space-y-4">
                  <div className="text-foreground leading-relaxed">
                    {currentQ.questionText.split('_____').map((part, index) => (
                      <React.Fragment key={index}>
                        {part}
                        {index < currentQ.blanks.length && (
                          <Input
                            type="text"
                            placeholder="Fill in the blank"
                            value={answers[currentQ.id]?.[index] || ''}
                            onChange={(e) => {
                              const newAnswers = [...(answers[currentQ.id] || [])];
                              newAnswers[index] = e.target.value;
                              handleAnswerChange(currentQ.id, newAnswers);
                            }}
                            className="inline-block w-32 mx-2"
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Characters: {(answers[currentQ.id] || []).join('').length}/100
                  </p>
                </div>
              )}

              {currentQ.type === 'shortAnswer' && (
                <div className="space-y-4">
                  <textarea
                    placeholder="Type your answer here..."
                    value={answers[currentQ.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                    className="w-full h-32 p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <p className="text-sm text-muted-foreground">
                    Words: {(answers[currentQ.id] || '').split(' ').filter(w => w.length > 0).length}/150
                  </p>
                </div>
              )}
            </div>

            {/* Hint Section */}
            {!isExamMode && (
              <div className="mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                  iconName="Lightbulb"
                  iconPosition="left"
                >
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </Button>
                {showHint && (
                  <div className="mt-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <p className="text-sm text-foreground">{currentQ.hint}</p>
                  </div>
                )}
              </div>
            )}

            {/* Confidence Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                How confident are you about this answer?
              </label>
              <div className="flex items-center space-x-4">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => handleConfidenceChange(currentQ.id, level)}
                    className={`w-8 h-8 rounded-full border-2 transition-colors ${confidence[currentQ.id] === level
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-border hover:border-primary'
                      }`}
                  >
                    {level}
                  </button>
                ))}
                <span className="text-sm text-muted-foreground ml-2">
                  {confidence[currentQ.id] ?
                    ['Very Low', 'Low', 'Medium', 'High', 'Very High'][confidence[currentQ.id] - 1] :
                    'Not rated'
                  }
                </span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                iconName="ChevronLeft"
                iconPosition="left"
              >
                Previous
              </Button>

              <div className="flex items-center space-x-2">
                {currentQuestion === quizData.questions.length - 1 ? (
                  <Button
                    onClick={handleQuizSubmit}
                    iconName="Check"
                    iconPosition="left"
                  >
                    Submit Quiz
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentQuestion(Math.min(quizData.questions.length - 1, currentQuestion + 1))}
                    iconName="ChevronRight"
                    iconPosition="right"
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border border-border p-4 soft-shadow sticky top-4">
            <h4 className="font-medium text-foreground mb-4">Question Overview</h4>
            <div className="grid grid-cols-5 gap-2">
              {quizData.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-8 h-8 rounded text-xs font-medium transition-colors ${index === currentQuestion
                      ? 'bg-primary text-primary-foreground'
                      : answers[quizData.questions[index].id]
                        ? 'bg-success text-success-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Answered:</span>
                <span className="text-foreground font-medium">
                  {Object.keys(answers).length}/{quizData.questions.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Bookmarked:</span>
                <span className="text-foreground font-medium">
                  {bookmarkedQuestions.size}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock question generator
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

export default QuizInterface;