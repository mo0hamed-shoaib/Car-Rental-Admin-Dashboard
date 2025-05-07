import { getCars, getBookings, getUsers, getBills } from '../data.js';

// Initialize all dashboard elements
export function initializeDashboard() {
    updateSummaryCards();
    initializeCharts();
    setupStorageListeners();
}

// Update summary cards with current data
function updateSummaryCards() {
    const cars = getCars();
    const bookings = getBookings();
    const users = getUsers();

    // Update available cars count
    const availableCars = cars.filter(car => car.status === 'Available').length;
    document.getElementById('available-cars').textContent = availableCars;

    // Update current bookings count
    const currentBookings = bookings.filter(booking =>
        booking.booking_status === 'Pending' || booking.booking_status === 'Completed'
    ).length;
    document.getElementById('current-bookings').textContent = currentBookings;

    // Update current users count
    const currentUsers = users.filter(user => user.role === 'User').length;
    document.getElementById('current-users').textContent = currentUsers;

    // Update total revenue
    const totalRevenue = bookings
        .filter(booking => booking.booking_status === 'Completed')
        .reduce((sum, booking) => sum + (booking.total || 0), 0);
    document.getElementById('total-revenue').textContent = `$${totalRevenue.toFixed(2)}`;
}

// Initialize all charts
function initializeCharts() {
    initializeEarningsChart();
    initializeBookingsChart();
    initializeCarsPerTypeChart();
    initializeCarsStatusChart();
    initializePaymentsStatusChart();
}

// Earnings Summary Chart
function initializeEarningsChart() {
    const bookings = getBookings();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const monthlyEarnings = new Array(12).fill(0);

    bookings
        .filter(booking => booking.booking_status === 'Completed')
        .forEach(booking => {
            const month = new Date(booking.from_date).getMonth();
            monthlyEarnings[month] += (booking.total || 0);
        });

    const ctx = document.getElementById('earnings-summary-chart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Monthly Earnings',
                    data: monthlyEarnings,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    fill: true,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)'
                }]
            },
            options: {
                animations: {
                    tension: {
                        duration: 1000,
                        easing: 'linear',
                        from: 0.7,
                        to: 0,
                        loop: true
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true
                    }
                }
            }
        });
    }
}

// Bookings Per Month Chart
function initializeBookingsChart() {
    const bookings = getBookings();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const monthlyBookings = new Array(12).fill(0);

    bookings.forEach(booking => {
        const month = new Date(booking.from_date).getMonth();
        monthlyBookings[month]++;
    });

    const ctx = document.getElementById('bookings-per-month-chart');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: 'Monthly Bookings',
                    data: monthlyBookings,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true
                    }
                }
            }
        });
    }
}

// Cars Per Type Chart
function initializeCarsPerTypeChart() {
    const cars = getCars();
    const carTypes = [...new Set(cars.map(car => car.body_type))].filter(Boolean);
    const carTypeCounts = carTypes.map(type =>
        cars.filter(car => car.body_type === type).length
    );

    const ctx = document.getElementById('cars-per-type-chart');
    if (ctx) {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: carTypes,
                datasets: [{
                    data: carTypeCounts,
                    backgroundColor: [
                        'rgba(148, 102, 255, 0.5)',
                        'rgba(255, 99, 190, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Cars Status Chart
function initializeCarsStatusChart() {
    const cars = getCars();
    const statuses = [...new Set(cars.map(car => car.status))].filter(Boolean);
    const statusCounts = statuses.map(status =>
        cars.filter(car => car.status === status).length
    );

    const ctx = document.getElementById('cars-status-chart');
    if (ctx) {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: statuses,
                datasets: [{
                    data: statusCounts,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(255, 206, 86, 0.5)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Payments Status Chart
function initializePaymentsStatusChart() {
    const bookings = getBookings();

    // Get all unique booking statuses
    const statuses = [...new Set(bookings.map(booking => booking.booking_status))].filter(Boolean);
    const statusCounts = statuses.map(status =>
        bookings.filter(booking => booking.booking_status === status).length
    );

    const ctx = document.getElementById('payments-status-chart');
    if (ctx) {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: statuses.length > 0 ? statuses : ['No Bookings'],
                datasets: [{
                    data: statusCounts.length > 0 ? statusCounts : [1],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(255, 99, 132, 0.5)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Setup storage event listeners to update dashboard when data changes
function setupStorageListeners() {
    window.addEventListener('storage', (event) => {
        if (event.key.startsWith('cars') ||
            event.key.startsWith('bookings') ||
            event.key.startsWith('users')) {
            updateSummaryCards();
            initializeCharts();
        }
    });
} 