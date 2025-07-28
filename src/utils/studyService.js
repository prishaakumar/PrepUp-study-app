import { supabase } from './supabase';

class StudyService {
  // Get user's study sessions
  async getUserStudySessions(userId) {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select(`
          *,
          user_profiles!inner(full_name, email)
        `)
        .eq('user_id', userId)
        .order('scheduled_time', { ascending: true });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to fetch study sessions.' };
    }
  }

  // Create a new study session
  async createStudySession(sessionData) {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .insert([{
          user_id: sessionData.userId,
          subject: sessionData.subject,
          topic: sessionData.topic,
          scheduled_time: sessionData.scheduledTime,
          duration_minutes: sessionData.durationMinutes,
          status: 'scheduled',
          notes: sessionData.notes || null
        }])
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to create study session.' };
    }
  }

  // Update study session
  async updateStudySession(sessionId, updates) {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to update study session.' };
    }
  }

  // Start a study session
  async startStudySession(sessionId) {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .update({
          status: 'in_progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to start study session.' };
    }
  }

  // Complete a study session
  async completeStudySession(sessionId, actualDuration, xpEarned = 0) {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .update({
          status: 'completed',
          progress_percentage: 100,
          actual_duration_minutes: actualDuration,
          xp_earned: xpEarned,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to complete study session.' };
    }
  }

  // Get user's quiz results
  async getUserQuizResults(userId) {
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to fetch quiz results.' };
    }
  }

  // Save quiz result
  async saveQuizResult(quizData) {
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .insert([{
          user_id: quizData.userId,
          subject: quizData.subject,
          topic: quizData.topic,
          difficulty: quizData.difficulty,
          score: quizData.score,
          total_questions: quizData.totalQuestions,
          time_taken_seconds: quizData.timeTakenSeconds,
          xp_earned: quizData.xpEarned || 0
        }])
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to save quiz result.' };
    }
  }

  // Get user's progress by subject
  async getUserProgress(userId) {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .order('subject', { ascending: true });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to fetch user progress.' };
    }
  }

  // Update user progress
  async updateUserProgress(userId, subject, progressData) {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          subject: subject,
          total_study_minutes: progressData.totalStudyMinutes,
          total_quizzes_completed: progressData.totalQuizzesCompleted,
          average_quiz_score: progressData.averageQuizScore,
          progress_percentage: progressData.progressPercentage,
          last_activity_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to update user progress.' };
    }
  }

  // Get user's wellness entries
  async getUserWellnessEntries(userId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('wellness_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to fetch wellness entries.' };
    }
  }

  // Create wellness entry
  async createWellnessEntry(userId, wellnessData) {
    try {
      const { data, error } = await supabase
        .from('wellness_entries')
        .insert([{
          user_id: userId,
          mood: wellnessData.mood,
          stress_level: wellnessData.stressLevel,
          energy_level: wellnessData.energyLevel,
          focus_level: wellnessData.focusLevel,
          notes: wellnessData.notes || null
        }])
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to create wellness entry.' };
    }
  }

  // Get user's achievements
  async getUserAchievements(userId) {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievements!inner(
            id,
            name,
            description,
            icon,
            tier,
            xp_reward
          )
        `)
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to fetch user achievements.' };
    }
  }

  // Award achievement to user
  async awardAchievement(userId, achievementId) {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .insert([{
          user_id: userId,
          achievement_id: achievementId
        }])
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to award achievement.' };
    }
  }
}

export default new StudyService();