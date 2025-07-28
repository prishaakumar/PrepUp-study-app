import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Auth components
import SignIn from "components/auth/SignIn";
import SignUp from "components/auth/SignUp";
// Add your imports here
import Dashboard from "pages/dashboard";
import QuizGeneratorPractice from "pages/quiz-generator-practice";
import AiTutorChat from "pages/ai-tutor-chat";
import StudyPlanGenerator from "pages/study-plan-generator";
import ProgressAnalytics from "pages/progress-analytics";
import FocusModeWellness from "pages/focus-mode-wellness";
import NotFound from "pages/NotFound";
import DocumentManager from "pages/DocumentManager";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Auth Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Main App Routes - Preview Mode (Accessible without auth) */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz-generator-practice" element={<QuizGeneratorPractice />} />
          <Route path="/ai-tutor-chat" element={<AiTutorChat />} />
          <Route path="/study-plan-generator" element={<StudyPlanGenerator />} />
          <Route path="/progress-analytics" element={<ProgressAnalytics />} />
          <Route path="/focus-mode-wellness" element={<FocusModeWellness />} />
          <Route path="/documents" element={<DocumentManager />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;