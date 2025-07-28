import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SubjectCategories = ({ subjects: initialSubjects, onSubjectClick, onManageSubjects }) => {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', color: 'blue', icon: 'BookOpen' });

  const getSubjectColor = (color) => {
    const colors = {
      'blue': 'bg-blue-100 text-blue-800 border-blue-200',
      'green': 'bg-green-100 text-green-800 border-green-200',
      'purple': 'bg-purple-100 text-purple-800 border-purple-200',
      'orange': 'bg-orange-100 text-orange-800 border-orange-200',
      'red': 'bg-red-100 text-red-800 border-red-200',
      'yellow': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'pink': 'bg-pink-100 text-pink-800 border-pink-200',
      'indigo': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colors[color] || colors['blue'];
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 60) return 'bg-warning';
    return 'bg-error';
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubjects([
      ...subjects,
      {
        id: Date.now(),
        name: form.name,
        icon: form.icon,
        color: form.color,
        progress: 0,
        nextSession: 'TBD',
        hasQuiz: false,
        hasDeadline: false
      }
    ]);
    setForm({ name: '', color: 'blue', icon: 'BookOpen' });
    setShowModal(false);
  };

  const handleDeleteSubject = (id) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="BookOpen" size={20} className="mr-2 text-primary" />
          Subjects
        </h2>
        <Button variant="ghost" size="sm" onClick={() => setShowModal(true)}>
          <Icon name="Settings" size={16} />
        </Button>
      </div>

      <div className="space-y-3">
        {subjects.map((subject) => (
          <Button
            key={subject.id}
            variant="ghost"
            onClick={() => onSubjectClick(subject.id)}
            className="w-full h-auto p-3 justify-start hover:bg-muted/50 transition-all duration-200"
          >
            <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${getSubjectColor(subject.color)}`}>
              <Icon name={subject.icon} size={18} />
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-foreground text-sm">{subject.name}</p>
                <span className="text-xs text-muted-foreground">{subject.progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 mb-1">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${getProgressColor(subject.progress)}`}
                  style={{ width: `${subject.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{subject.nextSession}</p>
                <div className="flex items-center space-x-2">
                  {subject.hasQuiz && (
                    <Icon name="Brain" size={12} className="text-secondary" />
                  )}
                  {subject.hasDeadline && (
                    <Icon name="AlertCircle" size={12} className="text-error" />
                  )}
                </div>
              </div>
            </div>
          </Button>
        ))}
      </div>

      {/* Modal for managing subjects */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg relative">
            <div className="flex items-center mb-4" style={{ minHeight: 32 }}>
              <button
                className="mr-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                style={{ fontSize: 24 }}
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                <Icon name="X" size={24} />
              </button>
              <h3 className="text-lg font-semibold flex-1 text-center">Manage Subjects</h3>
            </div>
            {/* List of current subjects with delete */}
            <div className="mb-4 space-y-2 max-h-40 overflow-y-auto">
              {subjects.length === 0 && <div className="text-muted-foreground text-sm">No subjects yet.</div>}
              {subjects.map(subject => (
                <div key={subject.id} className="flex items-center justify-between bg-muted/30 rounded px-3 py-2">
                  <div className="flex items-center space-x-4">
                    <Icon name={subject.icon} size={16} className={getSubjectColor(subject.color)} />
                    <span className="text-sm text-foreground">{subject.name}</span>
                  </div>
                  <button onClick={() => handleDeleteSubject(subject.id)} className="text-error hover:text-destructive">
                    <Icon name="Trash" size={16} />
                  </button>
                </div>
              ))}
            </div>
            {/* Add subject form */}
            <form onSubmit={handleAddSubject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={form.color}
                  onChange={e => setForm({ ...form, color: e.target.value })}
                >
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="purple">Purple</option>
                  <option value="orange">Orange</option>
                  <option value="red">Red</option>
                  <option value="yellow">Yellow</option>
                  <option value="pink">Pink</option>
                  <option value="indigo">Indigo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Icon</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={form.icon}
                  onChange={e => setForm({ ...form, icon: e.target.value })}
                >
                  <option value="BookOpen">Book</option>
                  <option value="Calculator">Calculator</option>
                  <option value="Atom">Atom</option>
                  <option value="Flask">Flask</option>
                  <option value="Microscope">Microscope</option>
                  <option value="Brain">Brain</option>
                  <option value="PenTool">Pen</option>
                  <option value="Globe">Globe</option>
                </select>
              </div>
              <Button type="submit" variant="default" className="w-full">Add</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectCategories;