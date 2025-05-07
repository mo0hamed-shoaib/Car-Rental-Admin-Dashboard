import { initLocalStorage } from "./modules/init-data.js";
import { addAndEdit, fillTable } from "./modules/manage-data.js";
import { injectFormsModal } from "./modules/formsModal-inject.js";
import { injectDeleteModal } from "./modules/deleteModal-inject.js";
import { showAddModal, attachEditEventListeners, attachDeleteEventListeners } from "./modules/manage-data.js";
import { attachFormValidation } from "./modules/form-validation.js";

// On page load, call initLocalStorage to check if the local storage is empty or not
document.addEventListener("DOMContentLoaded", function () {
    let isDataReady = 0;
    let bookingsData = [];
    let usersData = [];

    function checkAndRender() {
        isDataReady++;
        if (isDataReady === 2) {
            const giveBookingsUsers = bookingsData.map(booking => {
                const user = usersData.find(user => Number(user.id) === Number(booking.user_id));
                const car = JSON.parse(localStorage.getItem("cars") || "[]").find(car => Number(car.id) === Number(booking.car_id));
                return {
                    ...booking,
                    name: user ? user.name : "Unknown",
                    email: user ? user.email : "Unknown",
                    car_name: car ? car.name : "Unknown"
                };
            });

            // Fill the table of bookings with data from (giveBookingsUsers)
            fillTable("bookings", giveBookingsUsers);

            // Attach event listeners after initial table render
            attachEditEventListeners();
            attachDeleteEventListeners();
        }
    }

    // First load the data
    initLocalStorage("bookings", "/data/bookings.json", function () {
        bookingsData = JSON.parse(localStorage.getItem("bookings") || "[]");
        checkAndRender();
    });
    initLocalStorage("users", "/data/users.json", function () {
        usersData = JSON.parse(localStorage.getItem("users") || "[]");
        checkAndRender();
    });

    // Then inject the form modal and set up event listeners
    injectFormsModal().then(() => {
        // Inject delete modal
        injectDeleteModal().then(() => {
            // Attach edit event listeners after form modal is injected
            attachEditEventListeners();

            document.getElementById("add-item-btn").addEventListener("click", function () {
                showAddModal("bookings-fields");
                // Attach form validation after modal is shown
                const form = document.getElementById("item-form");
                attachFormValidation(form, "bookings");
            });

            // Handle form submission for adding a booking
            // Get the form id
            const bookingForm = document.getElementById("item-form");
            bookingForm.addEventListener("submit", function (e) {
                e.preventDefault();

                // Get the form data from input fields
                const userId = document.getElementById("user_id").value;
                const carId = document.getElementById("car_id").value;
                const fromDate = document.getElementById("from_date").value;
                const toDate = document.getElementById("to_date").value;
                const bookingStatus = document.getElementById("booking_status").value;

                // Format dates to ISO string
                const fromDateISO = new Date(fromDate).toISOString();
                const toDateISO = new Date(toDate).toISOString();

                // Fetch cars (To get daily rate => calculate total)
                const cars = JSON.parse(localStorage.getItem("cars") || "[]");

                // Find the selected car object
                const selectedCar = cars.find(car => car.id === parseInt(carId));

                // Validate if the car is found and get daily rate
                if (!selectedCar) {
                    alert("Selected car is not found");
                    return;
                }

                // Get the daily rate as a number from local storage
                const dailyRate = parseFloat(selectedCar.daily_rate);

                // Calculate number of booking days
                // Get fromDate and toDate but as Date Objects to be able to subtract the days by milliseconds
                const from = new Date(fromDate);
                const to = new Date(toDate);

                // Here we get the milliseconds difference
                const diffTime = to - from;

                // Here we convert milliseconds to dats
                // Milliseconds → Seconds → Minutes → Hours → Days
                // Math.ceil rounds up if a user books 1.5 day, so it will be charged as 2 days instead of 1.5
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                // Now we use diffDays to calculate the total
                if (diffDays < 0) {
                    alert("To date must be after From date");
                    return;
                }

                // Calculate total price
                const total = dailyRate * diffDays;

                // Create booking object
                const newBooking = {
                    user_id: parseInt(userId),
                    car_id: parseInt(carId),
                    from_date: fromDateISO,
                    to_date: toDateISO,
                    booking_status: bookingStatus,
                    total,
                    created_at: new Date().toISOString()
                };

                // Use addAndEdit
                addAndEdit("bookings", newBooking);

                // Update the bookingsData with the latest data
                bookingsData = JSON.parse(localStorage.getItem("bookings") || "[]");

                // Update the table with the latest data including user information can car information
                const giveBookingsUsers = bookingsData.map(booking => {
                    const user = usersData.find(user => Number(user.id) == Number(booking.user_id));
                    const car = JSON.parse(localStorage.getItem("cars") || "[]").find(car => car.id === booking.car_id);
                    return {
                        ...booking,
                        name: user ? user.name : "Unknown",
                        email: user ? user.email : "Unknown",
                        car_name: car ? car.name : "Unknown"
                    };
                });
                fillTable("bookings", giveBookingsUsers);
                attachEditEventListeners();
                attachDeleteEventListeners();
            });
        });
    });
});

