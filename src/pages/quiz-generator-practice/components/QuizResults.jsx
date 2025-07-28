import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuizResults = ({ results, quizData, onRetakeQuiz, onBackToSetup }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate results
  const calculateResults = () => {
    const totalQuestions = quizData.questions.length;
    let correctAnswers = 0;
    let partiallyCorrect = 0;
    
    quizData.questions.forEach(question => {
      const userAnswer = results.answers[question.id];
      if (question.type === 'multipleChoice') {
        if (userAnswer === question.correctAnswer) {
          correctAnswers++;
        }
      } else if (question.type === 'fillInBlank') {
        const correctBlanks = question.blanks.filter((blank, index) => 
          userAnswer?.[index]?.toLowerCase().trim() === blank.toLowerCase()
        ).length;
        if (correctBlanks === question.blanks.length) {
          correctAnswers++;
        } else if (correctBlanks > 0) {
          partiallyCorrect++;
        }
      } else if (question.type === 'shortAnswer') {
        // Mock scoring for short answers
        if (userAnswer && userAnswer.length > 20) {
          correctAnswers++;
        }
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const timeSpent = results.timeSpent;
    const avgTimePerQuestion = Math.round(timeSpent / totalQuestions);

    return {
      totalQuestions,
      correctAnswers,
      partiallyCorrect,
      incorrectAnswers: totalQuestions - correctAnswers - partiallyCorrect,
      score,
      timeSpent,
      avgTimePerQuestion,
      grade: getGrade(score)
    };
  };

  const getGrade = (score) => {
    if (score >= 90) return { letter: 'A', color: 'text-success' };
    if (score >= 80) return { letter: 'B', color: 'text-primary' };
    if (score >= 70) return { letter: 'C', color: 'text-warning' };
    if (score >= 60) return { letter: 'D', color: 'text-error' };
    return { letter: 'F', color: 'text-destructive' };
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const calculatedResults = calculateResults();

  // Chart data
  const performanceData = [
    { name: 'Correct', value: calculatedResults.correctAnswers, color: '#10B981' },
    { name: 'Partial', value: calculatedResults.partiallyCorrect, color: '#F59E0B' },
    { name: 'Incorrect', value: calculatedResults.incorrectAnswers, color: '#EF4444' }
  ];

  const difficultyData = [
    { difficulty: 'Easy', correct: 3, total: 4 },
    { difficulty: 'Medium', correct: 2, total: 4 },
    { difficulty: 'Hard', correct: 1, total: 2 }
  ];

  const getRecommendations = () => {
    const score = calculatedResults.score;
    const recommendations = [];

    if (score < 70) {
      recommendations.push({
        type: 'study',
        title: 'Review Core Concepts',
        description: 'Focus on fundamental topics that appeared in incorrect answers',
        action: 'Start Review Session'
      });
    }

    if (calculatedResults.avgTimePerQuestion > 120) {
      recommendations.push({
        type: 'time',
        title: 'Improve Time Management',
        description: 'Practice with timed quizzes to increase your speed',
        action: 'Practice Timed Quiz'
      });
    }

    if (results.bookmarkedQuestions.length > 0) {
      recommendations.push({
        type: 'bookmark',
        title: 'Review Bookmarked Questions',
        description: `You bookmarked ${results.bookmarkedQuestions.length} questions for review`,
        action: 'Review Bookmarks'
      });
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-card rounded-lg border border-border p-6 mb-6 soft-shadow">
        <div className="text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            calculatedResults.score >= 80 ? 'bg-success/10' : 
            calculatedResults.score >= 60 ? 'bg-warning/10' : 'bg-error/10'
          }`}>
            <span className={`text-3xl font-bold ${
              calculatedResults.score >= 80 ? 'text-success' : 
              calculatedResults.score >= 60 ? 'text-warning' : 'text-error'
            }`}>
              {calculatedResults.score}%
            </span>
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Quiz Complete!</h2>
          <p className="text-muted-foreground">
            You scored {calculatedResults.correctAnswers} out of {calculatedResults.totalQuestions} questions correctly
          </p>
          <div className={`inline-flex items-center space-x-2 mt-4 px-4 py-2 rounded-full ${
            calculatedResults.score >= 80 ? 'bg-success/10 text-success' : 
            calculatedResults.score >= 60 ? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
          }`}>
            <span className="text-2xl font-bold">{calculatedResults.grade.letter}</span>
            <span className="text-sm">Grade</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card rounded-lg border border-border mb-6 soft-shadow">
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: 'BarChart3' },
              { id: 'questions', label: 'Question Review', icon: 'FileText' },
              { id: 'analytics', label: 'Analytics', icon: 'TrendingUp' },
              { id: 'recommendations', label: 'Recommendations', icon: 'Lightbulb' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab.icon} size={16} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Target" size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Score</p>
                    <p className="text-xl font-semibold text-foreground">{calculatedResults.score}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <Icon name="CheckCircle" size={20} className="text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Correct</p>
                    <p className="text-xl font-semibold text-foreground">{calculatedResults.correctAnswers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Icon name="Clock" size={20} className="text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time Spent</p>
                    <p className="text-xl font-semibold text-foreground">{formatTime(calculatedResults.timeSpent)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Zap" size={20} className="text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Time/Q</p>
                    <p className="text-xl font-semibold text-foreground">{calculatedResults.avgTimePerQuestion}s</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="space-y-4">
              {quizData.questions.map((question, index) => {
                const userAnswer = results.answers[question.id];
                const isCorrect = question.type === 'multipleChoice' ? 
                  userAnswer === question.correctAnswer : 
                  userAnswer && userAnswer.length > 0;

                return (
                  <div key={question.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-sm">
                          Q{index + 1}
                        </span>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isCorrect ? 'bg-success text-success-foreground' : 'bg-error text-error-foreground'
                        }`}>
                          <Icon name={isCorrect ? "Check" : "X"} size={14} />
                        </div>
                      </div>
                      {results.bookmarkedQuestions.includes(question.id) && (
                        <Icon name="Bookmark" size={16} className="text-warning" />
                      )}
                    </div>
                    
                    <h4 className="font-medium text-foreground mb-2">{question.question}</h4>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Your answer: </span>
                        <span className="text-foreground">
                          {Array.isArray(userAnswer) ? userAnswer.join(', ') : userAnswer || 'Not answered'}
                        </span>
                      </div>
                      
                      {question.type === 'multipleChoice' && (
                        <div>
                          <span className="text-muted-foreground">Correct answer: </span>
                          <span className="text-success">{question.correctAnswer}</span>
                        </div>
                      )}
                      
                      <div className="bg-muted/50 p-3 rounded">
                        <p className="text-muted-foreground text-xs mb-1">Explanation:</p>
                        <p className="text-foreground text-sm">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-foreground mb-4">Performance Breakdown</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={performanceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {performanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-4">Difficulty Analysis</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={difficultyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="difficulty" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="correct" fill="#10B981" />
                      <Bar dataKey="total" fill="#E5E7EB" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      rec.type === 'study' ? 'bg-primary/10' :
                      rec.type === 'time' ? 'bg-warning/10' : 'bg-secondary/10'
                    }`}>
                      <Icon 
                        name={rec.type === 'study' ? 'BookOpen' : rec.type === 'time' ? 'Clock' : 'Bookmark'} 
                        size={20} 
                        className={
                          rec.type === 'study' ? 'text-primary' :
                          rec.type === 'time' ? 'text-warning' : 'text-secondary'
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground mb-1">{rec.title}</h4>
                      <p className="text-muted-foreground text-sm mb-3">{rec.description}</p>
                      <Button variant="outline" size="sm">
                        {rec.action}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant="outline"
          onClick={onBackToSetup}
          iconName="ArrowLeft"
          iconPosition="left"
        >
          New Quiz
        </Button>
        <Button
          onClick={onRetakeQuiz}
          iconName="RotateCcw"
          iconPosition="left"
        >
          Retake Quiz
        </Button>
        <Button
          variant="outline"
          iconName="Share"
          iconPosition="left"
        >
          Share Results
        </Button>
      </div>
    </div>
  );
};

export default QuizResults;