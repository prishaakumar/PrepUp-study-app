import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import AITutorFloat from '../../components/ui/AITutorFloat';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import Navigation from '../../components/ui/Navigation';
import {
  downloadFile,
  generateICSContent,
  initializeGoogleCalendar,
  isGoogleCalendarAvailable,
  saveStudyPlanToStorage
} from '../../utils/calendarUtils';
import AIProcessing from './components/AIProcessing';
import DocumentUpload from './components/DocumentUpload';
import GoalSetting from './components/GoalSetting';
import StudyPlanResults from './components/StudyPlanResults';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const StudyPlanGenerator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [studyGoals, setStudyGoals] = useState(null);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  const steps = [
    { id: 1, title: 'Upload Materials', icon: 'Upload', description: 'Add your study documents' },
    { id: 2, title: 'Set Goals', icon: 'Target', description: 'Define your objectives' },
    { id: 3, title: 'AI Processing', icon: 'Brain', description: 'Generate your plan' },
    { id: 4, title: 'Review Plan', icon: 'CheckCircle', description: 'Customize and save' }
  ];

  const handleFilesUploaded = (newFile) => {
    setUploadedFiles(prev => [...prev, newFile]);
  };

  const handleRemoveFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleGoalsSet = (goals) => {
    setStudyGoals(goals);
    setCurrentStep(3);
  };

  const handleProcessingComplete = (plan) => {
    setGeneratedPlan(plan);
    setCurrentStep(4);
  };

  const handleModifySession = (sessionId, changes) => {
    console.log('Modifying session:', sessionId, changes);
    // Handle session modification logic
  };

  const handleSyncCalendar = async () => {
    console.log('Syncing with Google Calendar...');

    try {
      // Check if Google Calendar API is available
      if (!isGoogleCalendarAvailable()) {
        // Provide fallback option - export as .ics file
        const shouldExportICS = confirm(
          'Google Calendar API is not available. Would you like to export your study plan as a calendar file (.ics) that you can import into your calendar app?'
        );

        if (shouldExportICS) {
          const icsContent = generateICSContent(generatedPlan);
          if (icsContent) {
            downloadFile(icsContent, `study-plan-${new Date().toISOString().split('T')[0]}.ics`, 'text/calendar');
            alert('Study plan exported as calendar file! You can import this .ics file into your calendar app.');
          } else {
            alert('No study plan to export.');
          }
        }
        return;
      }

      // Initialize Google Calendar API
      const initialized = await initializeGoogleCalendar();
      if (!initialized) {
        // Fallback to ICS export
        const shouldExportICS = confirm(
          'Failed to connect to Google Calendar. Would you like to export your study plan as a calendar file (.ics) instead?'
        );

        if (shouldExportICS) {
          const icsContent = generateICSContent(generatedPlan);
          if (icsContent) {
            downloadFile(icsContent, `study-plan-${new Date().toISOString().split('T')[0]}.ics`, 'text/calendar');
            alert('Study plan exported as calendar file! You can import this .ics file into your calendar app.');
          } else {
            alert('No study plan to export.');
          }
        }
        return;
      }

      // Check if user is signed in
      const authInstance = window.gapi.auth2.getAuthInstance();
      if (!authInstance.isSignedIn.get()) {
        await authInstance.signIn();
      }

      // Create calendar events from study plan
      if (generatedPlan && generatedPlan.schedule) {
        const events = [];

        generatedPlan.schedule.forEach(day => {
          day.sessions.forEach(session => {
            const event = {
              'summary': `${session.subject} - ${session.topic}`,
              'description': `Study session: ${session.description || 'Focused study time'}`,
              'start': {
                'dateTime': session.date.toISOString(),
                'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
              },
              'end': {
                'dateTime': new Date(session.date.getTime() + session.duration * 60 * 1000).toISOString(),
                'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
              },
              'reminders': {
                'useDefault': false,
                'overrides': [
                  { 'method': 'email', 'minutes': 24 * 60 },
                  { 'method': 'popup', 'minutes': 15 }
                ]
              }
            };
            events.push(event);
          });
        });

        // Add events to Google Calendar
        const calendar = window.gapi.client.calendar;
        let successCount = 0;

        for (const event of events) {
          try {
            await calendar.events.insert({
              'calendarId': 'primary',
              'resource': event
            });
            successCount++;
          } catch (error) {
            console.error('Failed to add event:', error);
          }
        }

        if (successCount > 0) {
          alert(`Successfully synced ${successCount} study sessions to your Google Calendar!`);
        } else {
          alert('Failed to sync study sessions to Google Calendar. Please try again.');
        }
      }
    } catch (error) {
      console.error('Google Calendar sync error:', error);
      alert('Failed to sync with Google Calendar. Please check your internet connection and try again.');
    }
  };

  const handleSavePlan = async () => {
    console.log('Saving study plan...');
    try {
      if (!generatedPlan) {
        alert('No study plan to save. Please generate a plan first.');
        return;
      }
      // Log the generated plan for debugging
      console.log('Generated Plan:', generatedPlan);

      // Check if there are any sessions in the plan
      let totalSessions = 0;
      if (Array.isArray(generatedPlan.schedule)) {
        totalSessions = generatedPlan.schedule.reduce((acc, day) => {
          if (!day || !Array.isArray(day.sessions)) return acc;
          return acc + day.sessions.length;
        }, 0);
      }
      if (totalSessions === 0) {
        alert('No sessions found in your study plan. There is no point in downloading an empty plan.');
        return;
      }

      // Generate PDF with all details, robust to missing/malformed data
      const doc = new jsPDF();
      let y = 16;
      doc.setFontSize(18);
      doc.text('Your Study Plan', 14, y);
      y += 10;
      doc.setFontSize(12);
      doc.text(`AI has generated a personalized ${(generatedPlan.totalDays || generatedPlan.days || 'N/A')}-day study schedule`, 14, y);
      y += 10;

      // Stats overview
      let stats = { totalSessions: 0, totalHours: 0 };
      if (Array.isArray(generatedPlan.schedule)) {
        stats = generatedPlan.schedule.reduce((acc, day) => {
          if (!day || !Array.isArray(day.sessions)) return acc;
          acc.totalSessions += day.sessions.length;
          acc.totalHours += day.sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
          return acc;
        }, { totalSessions: 0, totalHours: 0 });
      }
      doc.text(`Total Days: ${generatedPlan.totalDays || generatedPlan.days || 'N/A'}`, 14, y += 8);
      doc.text(`Total Hours: ${Math.round(stats.totalHours)}`, 14, y += 8);
      doc.text(`Subjects: ${(Array.isArray(generatedPlan.subjects) ? generatedPlan.subjects.length : generatedPlan.subjects) || 'N/A'}`, 14, y += 8);
      doc.text(`Sessions: ${stats.totalSessions}`, 14, y += 8);
      y += 4;

      // Sessions grouped by day
      if (Array.isArray(generatedPlan.schedule) && generatedPlan.schedule.length > 0) {
        generatedPlan.schedule.forEach((day, i) => {
          if (y > 260) { doc.addPage(); y = 16; }
          doc.setFontSize(13);
          doc.text(`Day ${i + 1}: ${day && day.date ? (typeof day.date === 'string' ? day.date : new Date(day.date).toLocaleDateString()) : 'N/A'}`, 14, y += 10);
          doc.setFontSize(11);
          // Defensive: filter out invalid sessions
          let validSessions = [];
          if (day && Array.isArray(day.sessions)) {
            validSessions = day.sessions.filter(session => session && typeof session === 'object' && (
              typeof session.subject === 'string' || typeof session.activity === 'string' || typeof session.time === 'string'
            ));
          }
          // Log the sessions for debugging
          console.log(`Day ${i + 1} sessions:`, day && day.sessions);
          if (validSessions.length > 0) {
            const tableBody = validSessions.map(session => [
              typeof session.subject === 'string' ? session.subject : 'N/A',
              typeof session.activity === 'string' ? session.activity : 'N/A',
              typeof session.time === 'string' ? session.time : 'N/A',
              typeof session.duration === 'number'
                ? (session.duration === 1
                  ? '1 hour'
                  : session.duration < 1
                    ? `${session.duration * 60} min`
                    : `${session.duration} hours`)
                : 'N/A',
              Array.isArray(session.topics)
                ? session.topics.filter(t => typeof t === 'string').join(', ')
                : 'N/A'
            ]);
            try {
              doc.autoTable({
                head: [['Subject', 'Activity', 'Time', 'Duration', 'Topics']],
                body: tableBody,
                startY: y + 2,
                margin: { left: 14, right: 14 },
                theme: 'grid',
                styles: { fontSize: 10 },
                headStyles: { fillColor: [220, 220, 220] },
                didDrawPage: (data) => { y = data.cursor.y; }
              });
              y = doc.lastAutoTable.finalY || y + 10;
            } catch (tableErr) {
              console.error('PDF table error:', tableErr);
              doc.text('Error rendering sessions table.', 18, y += 8);
            }
          } else {
            doc.text('No valid sessions.', 18, y += 8);
          }
        });
      } else {
        doc.setFontSize(12);
        doc.text('No schedule data available.', 14, y += 10);
      }

      // Study Tips
      y += 12;
      if (y > 260) { doc.addPage(); y = 16; }
      doc.setFontSize(13);
      doc.text('Study Tips', 14, y);
      doc.setFontSize(11);
      const tips = [
        '• Take 5-10 minute breaks between study sessions',
        '• Review previous day\'s topics before starting new ones',
        '• Use active recall techniques during practice sessions',
        '• Adjust the schedule based on your progress and energy levels'
      ];
      tips.forEach((tip, i) => {
        doc.text(tip, 18, y + 8 + i * 7);
      });

      doc.save(`study-plan-${new Date().toISOString().split('T')[0]}.pdf`);

      // Also save to localStorage for quick access
      try {
        saveStudyPlanToStorage(generatedPlan);
      } catch (storageErr) {
        console.error('LocalStorage save error:', storageErr);
      }

      // Show success message with more details
      const message = `Study plan saved successfully!\n\n` +
        `✅ Downloaded as PDF file\n` +
        `✅ Saved to browser storage\n` +
        `✅ You can access it later from the app\n\n` +
        `File: study-plan-${new Date().toISOString().split('T')[0]}.pdf`;

      alert(message);
    } catch (error) {
      console.error('Save plan error:', error);
      alert('Failed to save study plan. Please try again.');
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return uploadedFiles.length > 0;
      case 2:
        return studyGoals !== null;
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (canProceedToNextStep()) {
      if (currentStep === 2) {
        setCurrentStep(3);
      } else {
        setCurrentStep(prev => Math.min(prev + 1, 4));
      }
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <DocumentUpload
            onFilesUploaded={handleFilesUploaded}
            uploadedFiles={uploadedFiles}
            onRemoveFile={handleRemoveFile}
          />
        );
      case 2:
        return (
          <GoalSetting
            onGoalsSet={handleGoalsSet}
            initialGoals={studyGoals}
          />
        );
      case 3:
        return (
          <AIProcessing
            uploadedFiles={uploadedFiles}
            goals={studyGoals}
            onProcessingComplete={handleProcessingComplete}
          />
        );
      case 4:
        return (
          <StudyPlanResults
            studyPlan={generatedPlan}
            onModifySession={handleModifySession}
            onSyncCalendar={handleSyncCalendar}
            onSavePlan={handleSavePlan}
          />
        );
      default:
        return null;
    }
  };

  // If we're in processing step, show full-screen processing
  if (currentStep === 3) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Navigation />
        <AIProcessing
          uploadedFiles={uploadedFiles}
          goals={studyGoals}
          onProcessingComplete={handleProcessingComplete}
        />
        <AITutorFloat />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />

      <main className="pt-4 pb-8">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <Breadcrumb />

          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              AI Study Plan Generator
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Upload your study materials and let AI create a personalized learning schedule
              tailored to your goals and timeline
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${currentStep === step.id
                        ? 'bg-primary border-primary text-primary-foreground'
                        : currentStep > step.id
                          ? 'bg-success border-success text-success-foreground'
                          : 'bg-muted border-border text-muted-foreground'
                        }`}
                    >
                      {currentStep > step.id ? (
                        <Icon name="Check" size={20} />
                      ) : (
                        <Icon name={step.icon} size={20} />
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <div
                        className={`text-sm font-medium ${currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                          }`}
                      >
                        {step.title}
                      </div>
                      <div className="text-xs text-muted-foreground hidden sm:block">
                        {step.description}
                      </div>
                    </div>
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 transition-all duration-200 ${currentStep > step.id ? 'bg-success' : 'bg-border'
                        }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="max-w-4xl mx-auto">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          {currentStep !== 3 && currentStep !== 2 && (
            <div className="flex justify-between items-center mt-8 max-w-4xl mx-auto">
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Previous
              </Button>

              <div className="text-sm text-muted-foreground">
                Step {currentStep} of {steps.length}
              </div>

              <Button
                onClick={handleNextStep}
                disabled={!canProceedToNextStep() || currentStep === 4}
                iconName="ArrowRight"
                iconPosition="right"
              >
                {currentStep === 4 ? 'Complete' : 'Next'}
              </Button>
            </div>
          )}
        </div>
      </main>

      <AITutorFloat />
    </div>
  );
};

export default StudyPlanGenerator;