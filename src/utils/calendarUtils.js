// Google Calendar Integration Utilities

/**
 * Check if Google Calendar API is available
 */
export const isGoogleCalendarAvailable = () => {
    return !!(window.gapi && window.gapi.auth2);
};

/**
 * Initialize Google Calendar API
 */
export const initializeGoogleCalendar = async () => {
    try {
        await window.gapi.load('client:auth2', async () => {
            await window.gapi.client.init({
                apiKey: process.env.VITE_GOOGLE_API_KEY || 'demo-key',
                clientId: process.env.VITE_GOOGLE_CLIENT_ID || 'demo-client-id',
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
                scope: 'https://www.googleapis.com/auth/calendar.events'
            });
        });
        return true;
    } catch (error) {
        console.error('Failed to initialize Google Calendar API:', error);
        return false;
    }
};

/**
 * Get Google Calendar setup instructions
 */
export const getGoogleCalendarSetupInstructions = () => {
    return {
        title: 'Google Calendar Setup',
        steps: [
            {
                step: 1,
                title: 'Create Google Cloud Project',
                description: 'Go to Google Cloud Console and create a new project',
                link: 'https://console.cloud.google.com/'
            },
            {
                step: 2,
                title: 'Enable Calendar API',
                description: 'Enable the Google Calendar API in your project',
                link: 'https://console.cloud.google.com/apis/library/calendar-json.googleapis.com'
            },
            {
                step: 3,
                title: 'Create Credentials',
                description: 'Create OAuth 2.0 credentials (API key and Client ID)',
                link: 'https://console.cloud.google.com/apis/credentials'
            },
            {
                step: 4,
                title: 'Add Environment Variables',
                description: 'Add VITE_GOOGLE_API_KEY and VITE_GOOGLE_CLIENT_ID to your .env file'
            }
        ]
    };
};

/**
 * Generate ICS calendar content from study plan
 */
export const generateICSContent = (studyPlan) => {
    if (!studyPlan || !studyPlan.schedule) {
        return null;
    }

    let icsContent = 'BEGIN:VCALENDAR\r\n';
    icsContent += 'VERSION:2.0\r\n';
    icsContent += 'PRODID:-//PrepUp//Study Plan//EN\r\n';
    icsContent += 'CALSCALE:GREGORIAN\r\n';
    icsContent += 'METHOD:PUBLISH\r\n';

    studyPlan.schedule.forEach(day => {
        day.sessions.forEach(session => {
            const startDate = session.date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
            const endDate = new Date(session.date.getTime() + session.duration * 60 * 1000)
                .toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

            icsContent += 'BEGIN:VEVENT\r\n';
            icsContent += `UID:${Date.now()}-${Math.random().toString(36).substr(2, 9)}\r\n`;
            icsContent += `DTSTART:${startDate}\r\n`;
            icsContent += `DTEND:${endDate}\r\n`;
            icsContent += `SUMMARY:${session.subject} - ${session.topic}\r\n`;
            icsContent += `DESCRIPTION:Study session: ${session.description || 'Focused study time'}\r\n`;
            icsContent += 'END:VEVENT\r\n';
        });
    });

    icsContent += 'END:VCALENDAR\r\n';
    return icsContent;
};

/**
 * Download file with given content and filename
 */
export const downloadFile = (content, filename, mimeType = 'text/plain') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Save study plan to localStorage
 */
export const saveStudyPlanToStorage = (plan) => {
    try {
        const savedPlans = JSON.parse(localStorage.getItem('savedStudyPlans') || '[]');
        const planData = {
            id: Date.now(),
            name: `Study Plan - ${new Date().toLocaleDateString()}`,
            plan: {
                ...plan,
                savedAt: new Date().toISOString(),
                version: '1.0'
            },
            createdAt: new Date().toISOString()
        };

        savedPlans.push(planData);
        localStorage.setItem('savedStudyPlans', JSON.stringify(savedPlans));
        return true;
    } catch (error) {
        console.error('Failed to save plan to storage:', error);
        return false;
    }
};

/**
 * Get saved study plans from localStorage
 */
export const getSavedStudyPlans = () => {
    try {
        return JSON.parse(localStorage.getItem('savedStudyPlans') || '[]');
    } catch (error) {
        console.error('Failed to get saved plans:', error);
        return [];
    }
}; 