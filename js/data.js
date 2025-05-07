// Get all cars from localStorage
export function getCars() {
    const cars = localStorage.getItem('cars');
    return cars ? JSON.parse(cars) : [];
}

// Get all bookings from localStorage
export function getBookings() {
    const bookings = localStorage.getItem('bookings');
    return bookings ? JSON.parse(bookings) : [];
}

// Get all users from localStorage
export function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

// Get all bills from localStorage
export function getBills() {
    const bills = localStorage.getItem('bills');
    return bills ? JSON.parse(bills) : [];
} 