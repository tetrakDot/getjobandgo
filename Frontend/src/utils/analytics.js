import ReactGA from 'react-ga4';

/**
 * Replace with your actual GA4 Measurement ID
 * In a real-world scenario, this should be an environment variable.
 */
const MEASUREMENT_ID = 'G-YZ4YST1G7D';

/**
 * Initialize GA4 with the measurement ID
 */
export const initGA = () => {
    try {
        ReactGA.initialize(MEASUREMENT_ID);
        console.info('GA4 Initialized');
    } catch (error) {
        console.error('Failed to initialize GA4:', error);
    }
};

/**
 * Track a page view manually
 * @param {string} path - The path of the page being viewed
 * @param {string} title - The title of the page being viewed
 */
export const trackPageView = (path, title) => {
    ReactGA.send({ 
        hitType: 'pageview', 
        page: path, 
        title: title 
    });
};

/**
 * Track a custom event
 * @param {string} category - The category of the event
 * @param {string} action - The specific action taken
 * @param {Object} params - Additional parameters for the event
 */
export const trackEvent = (category, action, params = {}) => {
    const eventParams = {
        category,
        ...params,
        timestamp: new Date().toISOString(),
        page_url: window.location.href,
    };

    ReactGA.event(action, eventParams);
};

// --- Specialized Event Trackers ---

/**
 * Track user login
 * @param {string} userId - ID of the logged-in user
 */
export const trackLogin = (userId) => {
    trackEvent('User', 'login', { user_id: userId });
    ReactGA.set({ userId }); // Ensure future events are associated with this user
};

/**
 * Track user registration
 * @param {string} userId - ID of the registered user
 */
export const trackRegistration = (userId) => {
    trackEvent('User', 'registration', { user_id: userId });
};

/**
 * Track job search
 * @param {string} searchTerm - The query the user searched for
 */
export const trackJobSearch = (searchTerm) => {
    trackEvent('Job', 'search', { search_term: searchTerm });
};

/**
 * Track job view
 * @param {string} jobId - ID of the job being viewed
 * @param {string} userId - ID of the current user (optional)
 */
export const trackJobView = (jobId, userId = null) => {
    trackEvent('Job', 'view', { job_id: jobId, user_id: userId });
};

/**
 * Track job application
 * @param {string} jobId - ID of the job being applied for
 * @param {string} userId - ID of the current user
 */
export const trackJobApply = (jobId, userId) => {
    trackEvent('Job', 'apply', { job_id: jobId, user_id: userId });
};

/**
 * Track resume upload
 * @param {string} userId - ID of the current user
 * @param {string} fileName - Name of the file uploaded
 */
export const trackResumeUpload = (userId, fileName) => {
    trackEvent('User', 'resume_upload', { user_id: userId, file_name: fileName });
};

/**
 * Track company job posting
 * @param {string} companyId - ID of the company
 * @param {string} jobId - ID of the newly created job
 */
export const trackJobPosting = (companyId, jobId) => {
    trackEvent('Company', 'job_posting', { company_id: companyId, job_id: jobId });
};

export default {
    initGA,
    trackPageView,
    trackEvent,
    trackLogin,
    trackRegistration,
    trackJobSearch,
    trackJobView,
    trackJobApply,
    trackResumeUpload,
    trackJobPosting,
};
