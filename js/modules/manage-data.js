import { tableRender, cardRender } from "./tables-render.js";

// Here we handle Add/Update/Delete

// An object that holds all table columns data
const columns = {
    bookings: [
        { label: "#", key: "id" },
        { label: "User Name", key: "name" },
        { label: "Email", key: "email" },
        { label: "Car Name", key: "car_name" },
        { label: "Date From", key: "from_date" },
        { label: "Date To", key: "to_date" },
        { label: "Total", key: "total" },
        { label: "Booking Status", key: "booking_status" }
    ],
    users: [
        { label: "#", key: "id" },
        { label: "Name", key: "name" },
        { label: "Email", key: "email" },
        { label: "Role", key: "role" },
        { label: "Created At", key: "created_at" }
    ],
    cars: [
        { label: "#", key: "id" },
        { label: "Image", key: "image_url" },
        { label: "Name", key: "name" },
        { label: "Manufacturer", key: "manufacturer" },
        { label: "Year", key: "year" },
        { label: "Body Type", key: "body_type" },
        { label: "Num of Seats", key: "num_of_seats" },
        { label: "Transmission", key: "transmission" },
        { label: "Fuel Type", key: "fuel_type" },
        { label: "Daily Rate", key: "daily_rate" },
        { label: "Status", key: "status" }
    ]
};

// A function to format dates to readable format
function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// A function to get the columns depending on the key
export function getColumns(key) {
    return columns[key] || [];
};
// ==============================================================

// **- ADD FUNCTION -**
export function addAndEdit(key, newItem) {
    // Metadata for edit mode
    const form = document.getElementById("item-form");
    const editingId = form.dataset.editingId; // If it exists = edit mode

    // Get data from local storage
    const data = JSON.parse(localStorage.getItem(key) || "[]");

    // Placeholder of the final array after Edit or Add
    let updatedData;

    // Always show select menus when Add or Edit
    if (key === "bookings") {
        showBookingSelectMenus();
    }

    // If editingId exists in the dataset of "item-form", then we will edit
    if (editingId) {
        // Edit Mode
        // Search in the data array for the index of the item whose .id matches the editingId
        const index = data.findIndex(item => Number(item.id) === Number(editingId));

        // If the item exists, we overwrite the changed properties (new) over the old properties
        if (index !== -1) {
            data[index] = {
                ...data[index], // Spread old properties
                ...newItem, // Spread new properties
                id: Number(editingId) // keep id the same
            };
        }

        // Assign the new data array to the placeholder, which will be pushed to localStorage
        updatedData = [...data];

        // Exit edit mode
        delete form.dataset.editingId;
        delete form.dataset.sectionType;
    } else {
        // Add Mode
        // Get the highest ID in the object (To add the new Item after it)
        const highestId = data.reduce((acc, item) => {
            return item.id > acc ? item.id : acc;
        }, 0);

        // Generate a new ID (Automatic)
        const newId = highestId + 1;

        // Create the new item with the generated ID (Spread new object first)
        const newItemWithId = { ...newItem, id: newId };

        updatedData = [...data, newItemWithId];
    }

    // Save the updated data to local storage
    localStorage.setItem(key, JSON.stringify(updatedData));

    // For bookings, we need to join with user data first
    if (key === "bookings") {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const cars = JSON.parse(localStorage.getItem("cars") || "[]");

        const bookingWithUser = updatedData.map(item => ({
            ...item,
            name: users.find(user => Number(user.id) === Number(item.user_id))?.name || "Unknown",
            email: users.find(user => Number(user.id) === Number(item.user_id))?.email || "Unknown",
            car_name: cars.find(car => Number(car.id) === Number(item.car_id))?.name || "Unknown"
        }));

        fillTable(key, bookingWithUser);
    } else {
        // Call fill table to extract data that fills the table (Cars and Users)
        fillTable(key, updatedData);
    }

    // Close the modal after saving
    const formModal = bootstrap.Modal.getInstance(document.getElementById("formsModal"));
    if (formModal) {
        formModal.hide();

        // Reset the form
        document.getElementById("item-form").reset();

        // Reattach event listeners after table update
        attachEditEventListeners();
        attachDeleteEventListeners();
    }
}
// *****- END OF ADD FUNCTION -*****
// ==============================================================

// **- EDIT FUNCTIONALITY SECTION -**
// First we will attach an event listener to all table Edit buttons
export function attachEditEventListeners() {
    const editButtons = document.querySelectorAll(".edit-btn");
    editButtons.forEach(button => {
        button.addEventListener("click", function () {
            // Set modal title to "Edit Item"
            document.getElementById("formsModalLabel").textContent = "Edit Item";

            // On button click, get the key and id, and fetch data
            const key = button.getAttribute("data-key");
            const id = button.getAttribute("data-id");

            // Fetch data from localStorage
            const data = JSON.parse(localStorage.getItem(key) || "[]");
            const itemToEdit = data.find(item => Number(item.id) === Number(id));

            if (!itemToEdit) {
                console.error("Item not found");
                return;
            }

            // Set editing metadata
            const form = document.getElementById("item-form");
            form.dataset.editingId = itemToEdit.id;
            form.dataset.sectionType = key;

            // Disable all hidden inputs in forms
            document.querySelectorAll("#form-fields-container > div.d-none").forEach(div => {
                div.querySelectorAll("input, select, textarea").forEach(input => {
                    input.disabled = true; // Disable inputs
                });
            });

            // Before opening the form modal, we hide all forms
            document.getElementById("bookings-fields").classList.add("d-none");
            document.getElementById("cars-fields").classList.add("d-none");
            document.getElementById("users-fields").classList.add("d-none");

            // Then We show the correct form modal based on key
            if (key === "bookings") {
                document.getElementById("bookings-fields").classList.remove("d-none");
                showBookingSelectMenus(); // First populate the select menus
            }
            if (key === "cars") {
                document.getElementById("cars-fields").classList.remove("d-none");
            }
            if (key === "users") {
                document.getElementById("users-fields").classList.remove("d-none");
            }

            // Then we enable the inputs of the currently visible form modal
            const targetDiv = document.getElementById(`${key}-fields`);
            targetDiv.querySelectorAll("input, select, textarea").forEach(input => {
                input.disabled = false; // Enable inputs again
            });

            // Now pre-fill the form data after select menus are populated
            for (const property in itemToEdit) {
                let input = document.getElementById(property);

                // Handle some id mismatch
                if (!input) {
                    if (property === "name" && key === "cars") {
                        input = document.getElementById("car_name");
                    }
                    if (property === "name" && key === "users") {
                        input = document.getElementById("user_name");
                    }
                    if (property === "status" && key === "bookings") {
                        input = document.getElementById("booking_status");
                    }
                }

                if (input) {
                    // Special handling for date inputs
                    if (property === "from_date" || property === "to_date") {
                        // Convert ISO date to YYYY-MM-DD format for the date input
                        const date = new Date(itemToEdit[property]);
                        input.value = date.toISOString().split('T')[0];
                    } else {
                        input.value = itemToEdit[property];
                    }
                }
            }

            // Get or create the modal instance
            let formModal = bootstrap.Modal.getInstance(document.getElementById("formsModal"));
            if (!formModal) {
                formModal = new bootstrap.Modal(document.getElementById("formsModal"));
            }
            formModal.show();
        });
    });
}
// *****- END OF EDIT FUNCTIONALITY SECTION -*****
// ==============================================================

// **- DELETE FUNCTIONALITY SECTION -**
export function attachDeleteEventListeners() {
    // Get the table/card container
    const container = document.querySelector('.table-responsive, .card-container');

    // Add one event listener to the container
    container.addEventListener('click', function (e) {
        // Check if the clicked element is a delete button
        if (e.target.classList.contains('delete-btn')) {
            // Get the key and id from the button's dataset
            const key = e.target.dataset.key;
            const id = parseInt(e.target.dataset.id);

            // Get or create the delete modal instance
            let deleteModal = bootstrap.Modal.getInstance(document.getElementById("deleteModal"));
            if (!deleteModal) {
                deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
            }
            deleteModal.show();

            // Store the key and id in the confirm button's dataset
            const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
            confirmDeleteBtn.dataset.key = key;
            confirmDeleteBtn.dataset.id = id;

            // Handle delete confirmation
            confirmDeleteBtn.onclick = function () {
                // Get data from localStorage
                const data = JSON.parse(localStorage.getItem(key) || "[]");

                // Find the index of the item to delete
                const index = data.findIndex(item => Number(item.id) === id);

                if (index === -1) {
                    console.error("Item not found for deletion");
                    return;
                }

                // Remove the item
                data.splice(index, 1);

                // Save back to localStorage
                localStorage.setItem(key, JSON.stringify(data));

                // Special handling for bookings to maintain correct display
                if (key === "bookings") {
                    // Get the updated bookings data
                    const bookingsData = JSON.parse(localStorage.getItem("bookings") || "[]");
                    // Get users and cars data
                    const usersData = JSON.parse(localStorage.getItem("users") || "[]");
                    const carsData = JSON.parse(localStorage.getItem("cars") || "[]");

                    // Join the data
                    const joinedData = bookingsData.map(booking => {
                        const user = usersData.find(u => Number(u.id) === Number(booking.user_id));
                        const car = carsData.find(c => Number(c.id) === Number(booking.car_id));
                        return {
                            ...booking,
                            name: user ? user.name : "Unknown",
                            email: user ? user.email : "Unknown",
                            car_name: car ? car.name : "Unknown"
                        };
                    });

                    // Update the table with joined data
                    fillTable("bookings", joinedData);
                } else {
                    // For other tables, just update with the new data
                    fillTable(key, data);
                }

                // Hide the delete modal using the same instance
                deleteModal.hide();

                // Reattach event listeners after table update
                attachEditEventListeners();
                attachDeleteEventListeners();

                console.log(`Deleted ${key} item with id: ${id}`);
            };
        }
    });
}
// *****- END OF DELETE FUNCTIONALITY SECTION -*****
// ==============================================================

// A function to extract the data and render it
export function fillTable(key, data) {
    const tableColumns = getColumns(key);

    // Format dates in the data
    const formattedData = data.map(item => {
        const formattedItem = { ...item };
        if (key === 'bookings') {
            formattedItem.from_date = formatDate(item.from_date);
            formattedItem.to_date = formatDate(item.to_date);
        } else if (key === 'users') {
            formattedItem.created_at = formatDate(item.created_at);
        }
        return formattedItem;
    });

    // Render tables with the extracted data from fillTable
    tableRender(`${key}-table-view`, formattedData, tableColumns, true);
    cardRender(`${key}-card-view`, formattedData, tableColumns, true);
}
// ==============================================================

// A function to show select menus in booking form
export function showBookingSelectMenus() {
    // Get users and cars
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const cars = JSON.parse(localStorage.getItem("cars")) || [];

    // Get the select menus ids
    const userSelect = document.getElementById("user_id");
    const carSelect = document.getElementById("car_id");

    // Clear old options to keep the menus up to date
    userSelect.innerHTML = `<option value="">Select a user</option>`;
    carSelect.innerHTML = `<option value="">Select a car</option>`;

    // Show users in the select menu of users
    users.forEach(user => {
        const optionTag = document.createElement("option");
        optionTag.value = user.id;
        optionTag.textContent = user.name;
        userSelect.appendChild(optionTag);
    });

    cars.forEach(car => {
        const optionTag = document.createElement("option");
        optionTag.value = car.id;
        optionTag.textContent = `${car.name} (${car.year})`;
        carSelect.appendChild(optionTag);
    });
}
// ==============================================================

//  A function to show the add form modal when clicked on
export function showAddModal(fieldGroupId) {
    // Set modal title to "Add Item"
    document.getElementById("formsModalLabel").textContent = "Add Item";

    // Access the forms container and clear the metadata (To avoid stale data after Edit)
    const form = document.getElementById("item-form");
    delete form.dataset.editingId;
    delete form.dataset.sectionType;

    // Hide all forms first (use > to select direct child <div> only (one level deep))
    document.querySelectorAll("#form-fields-container > div").forEach(div => {
        div.classList.add("d-none");

        div.querySelectorAll("input, select, textarea").forEach(input => {
            input.disabled = true; // Disable inputs

            // We should avoid having the edit data remain stale in the form, so we do:
            input.value = ""; // Clear text inputs

            // Reset the select option to default (To avoid stale data after edit)
            if (input.tagName === "SELECT") {
                input.selectedIndex = 0;
            }
        });
    });

    // Show the targeted form
    const targetDiv = document.getElementById(fieldGroupId);
    targetDiv.classList.remove("d-none");
    targetDiv.querySelectorAll("input, select, textarea").forEach(input => {
        input.disabled = false; // Enable inputs again
    });

    // If booking form is opening, show the select menu content
    if (fieldGroupId === "bookings-fields") {
        showBookingSelectMenus();
    }

    // Get or create the modal instance
    let formModal = bootstrap.Modal.getInstance(document.getElementById("formsModal"));
    if (!formModal) {
        formModal = new bootstrap.Modal(document.getElementById("formsModal"));
    }
    formModal.show();
}
// ==============================================================