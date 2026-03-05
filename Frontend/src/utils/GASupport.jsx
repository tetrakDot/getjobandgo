import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initGA, trackPageView } from './analytics';

/**
 * Component to handle GA4 initialization and route tracking
 */
const GASupport = () => {
    const location = useLocation();

    useEffect(() => {
        // Initialize GA4 only once
        initGA();
    }, []);

    useEffect(() => {
        // Track page view on route changes
        const currentPath = location.pathname + location.search;
        trackPageView(currentPath, document.title);
    }, [location]);

    return null; // This component doesn't render anything
};

export default GASupport;
