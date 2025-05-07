import { initializeDashboard } from './modules/dashboard.js';

// Initialize dashboard when the page loads
window.addEventListener('load', () => {
    // Check if we're on the dashboard page
    if (document.getElementById('available-cars')) {
        initializeDashboard();
    }
});
