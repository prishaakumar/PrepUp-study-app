import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PerformanceSummary = ({ recentQuizScores, studyTimeToday, upcomingDeadlines, onViewAnalytics, onAddDeadline }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', subject: '', date: '' });

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getDeadlineUrgency = (daysLeft) => {
    if (daysLeft <= 1) return 'text-error';
    if (daysLeft <= 3) return 'text-warning';
    return 'text-muted-foreground';
  };

  const handleAddDeadline = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.subject.trim() || !form.date) return;
    onAddDeadline({
      id: Date.now(),
      title: form.title,
      subject: form.subject,
      date: form.date,
      daysLeft: Math.max(0, Math.ceil((new Date(form.date) - new Date()) / (1000 * 60 * 60 * 24)))
    });
    setForm({ title: '', subject: '', date: '' });
    setShowModal(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Recent Quiz Scores */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center">
            <Icon name="BarChart3" size={18} className="mr-2 text-primary" />
            Recent Scores
          </h3>
          <Button variant="ghost" size="sm" onClick={onViewAnalytics}>
            <Icon name="TrendingUp" size={14} />
          </Button>
        </div>

        <div className="space-y-3">
          {recentQuizScores.map((quiz) => (
            <div key={quiz.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{quiz.subject}</p>
                <p className="text-xs text-muted-foreground">{quiz.topic}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${getScoreColor(quiz.score)}`}>
                  {quiz.score}%
                </p>
                <p className="text-xs text-muted-foreground">{quiz.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Study Time Analytics */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center">
            <Icon name="Clock" size={18} className="mr-2 text-primary" />
            Study Time
          </h3>
          <Button variant="ghost" size="sm" onClick={onViewAnalytics}>
            <Icon name="MoreHorizontal" size={14} />
          </Button>
        </div>

        <div className="text-center">
          <div className="text-3xl font-bold text-foreground mb-2">
            {studyTimeToday.hours}h {studyTimeToday.minutes}m
          </div>
          <p className="text-sm text-muted-foreground mb-4">Today</p>

          <div className="w-full bg-muted rounded-full h-2 mb-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(studyTimeToday.totalMinutes / studyTimeToday.goalMinutes) * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {studyTimeToday.totalMinutes}/{studyTimeToday.goalMinutes} min goal
          </p>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center">
            <Icon name="AlertCircle" size={18} className="mr-2 text-primary" />
            Deadlines
          </h3>
          <Button variant="ghost" size="sm" onClick={() => setShowModal(true)}>
            <Icon name="Plus" size={14} />
          </Button>
        </div>

        <div className="space-y-3">
          {upcomingDeadlines.map((deadline) => (
            <div key={deadline.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{deadline.title}</p>
                <p className="text-xs text-muted-foreground">{deadline.subject}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${getDeadlineUrgency(deadline.daysLeft)}`}>
                  {deadline.daysLeft === 0 ? 'Today' :
                    deadline.daysLeft === 1 ? 'Tomorrow' :
                      `${deadline.daysLeft} days`}
                </p>
                <p className="text-xs text-muted-foreground">{deadline.date}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Modal for adding deadline */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowModal(false)}>
                <Icon name="X" size={20} />
              </button>
              <h3 className="text-lg font-semibold mb-4">Add New Deadline</h3>
              <form onSubmit={handleAddDeadline} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full border rounded px-3 py-2"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" variant="default" className="w-full">Add</Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceSummary;