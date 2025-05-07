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
                showAddModal("users-fields");
                // Attach form validation after modal is shown
                const form = document.getElementById("item-form");
                attachFormValidation(form, "users");
            });

            // Handle form submission for adding a user
            // Get the form id
            const userForm = document.getElementById("item-form");
            userForm.addEventListener("submit", function (e) {
                e.preventDefault(); // Stop page reload on submit

                // Get the form data from input fields
                const username = document.getElementById("user_name").value;
                const email = document.getElementById("email").value;
                const password = document.getElementById("password").value;
                const role = document.getElementById("role").value;

                // Create a new user object with the form data
                const newUser = {
                    name: username,
                    email,
                    password,
                    role,
                    created_at: new Date().toISOString()
                };

                // Use addAndEdit
                addAndEdit("users", newUser);
            });

            // Initialize data and attach event listeners
            initLocalStorage("users", "/data/users.json", function () {
                // Get users data (after it's in local storage)
                const usersData = JSON.parse(localStorage.getItem("users") || "[]");

                // Render the table view and card view
                fillTable("users", usersData);
                attachEditEventListeners();
                attachDeleteEventListeners();
            });
        });
    });
});
