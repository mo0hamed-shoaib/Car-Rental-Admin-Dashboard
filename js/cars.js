import { initLocalStorage } from "./modules/init-data.js";
import { addAndEdit, fillTable } from "./modules/manage-data.js";
import { injectFormsModal } from "./modules/formsModal-inject.js";
import { injectDeleteModal } from "./modules/deleteModal-inject.js";
import { showAddModal, attachEditEventListeners, attachDeleteEventListeners } from "./modules/manage-data.js";
import { attachFormValidation } from "./modules/form-validation.js";

// On page load, call initLocalStorage to check if the local storage is empty or not
document.addEventListener("DOMContentLoaded", function () {
    // First inject the forms modal
    injectFormsModal().then(() => {
        // Then inject the delete modal
        injectDeleteModal().then(() => {
            // Set up add button
            document.getElementById("add-item-btn").addEventListener("click", function () {
                showAddModal("cars-fields");
                // Attach form validation after modal is shown
                const form = document.getElementById("item-form");
                attachFormValidation(form, "cars");
            });

            // Handle form submission for adding a car
            // Get the form id
            const carForm = document.getElementById("item-form");
            carForm.addEventListener("submit", function (e) {
                e.preventDefault(); // Stop page reload on submit

                // Get the form data from input fields
                const carName = document.getElementById('car_name').value;
                const manufacturer = document.getElementById('manufacturer').value;
                const model = document.getElementById("model").value;
                const year = document.getElementById('year').value;
                const bodyType = document.getElementById('body_type').value;
                const numOfSeats = document.getElementById('num_of_seats').value;
                const transmission = document.getElementById('transmission').value;
                const fuelType = document.getElementById('fuel_type').value;
                const dailyRate = document.getElementById('daily_rate').value;
                const status = document.getElementById('status').value;
                const imageUrl = document.getElementById('image_url').value;

                // Create a new car object with the form data
                const newCar = {
                    name: carName,
                    manufacturer,
                    model,
                    year,
                    body_type: bodyType,
                    num_of_seats: numOfSeats,
                    transmission,
                    fuel_type: fuelType,
                    daily_rate: dailyRate,
                    status,
                    image_url: imageUrl
                };

                // Use addAndEdit
                addAndEdit("cars", newCar);
            });

            // Initialize data and attach event listeners
            initLocalStorage("cars", "/data/cars.json", function () {
                // Get cars data (after it's in local storage)
                const carsData = JSON.parse(localStorage.getItem("cars") || "[]");

                // Render the table view and card view
                fillTable("cars", carsData);
                attachEditEventListeners();
                attachDeleteEventListeners();
            });
        });
    });
});

