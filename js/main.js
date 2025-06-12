import { initializeDashboard } from './modules/dashboard.js';
import { initLocalStorage } from './modules/init-data.js';

// Initialize dashboard when the page loads
window.addEventListener('load', () => {
    // Check if we're on the dashboard page
    if (document.getElementById('available-cars')) {
        // Load all required data first
        Promise.all([
            new Promise(resolve => initLocalStorage('cars', '/data/cars.json', resolve)),
            new Promise(resolve => initLocalStorage('bookings', '/data/bookings.json', resolve)),
            new Promise(resolve => initLocalStorage('users', '/data/users.json', resolve))
        ]).then(() => {
            // Initialize dashboard after all data is loaded
            initializeDashboard();
        });
    }
});
