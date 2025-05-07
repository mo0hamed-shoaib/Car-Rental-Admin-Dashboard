export function tableRender(tableViewId, tableDataSrc, tableColumns, hasActions = false) {
    // Store the desired table style (table vs card)
    const tableContainer = document.getElementById(tableViewId);
    if (!tableContainer) return;

    // Create the table dynamically
    let tableHtml = `<table class="table table-bordered table-hover" id="${tableViewId}-datatable"><thead><tr>`;

    // Create table headers
    tableColumns.forEach(column => {
        tableHtml += `<th>${column.label}</th>`;
    });

    // Decide if the table should have actions column or not
    if (hasActions) {
        tableHtml += `<th>Actions</th>`; // Add actions column
    }

    tableHtml += `</tr></thead><tbody>`; // Close head and row tags, open body
    // ... End of table headers render ...

    // Create table rows
    // Open a row for each data item in each iteration
    tableDataSrc.forEach(item => {
        tableHtml += `<tr>`;

        // Add each key from the data items to its own cell
        tableColumns.forEach(column => {
            if (column.key === "image_url") {
                tableHtml += `<td><img src="${item[column.key]}" alt="${item.name}" style="max-width: 100px"></td>`;
            } else {
                tableHtml += `<td>${item[column.key]}</td>`;
            }
        });

        // Get the data key from function parameter
        const dataKey = tableViewId.split("-")[0];

        // Add the actions cell in the currently open row
        if (hasActions) {
            tableHtml += `
            <td>
            <button class="btn btn-sm btn-primary edit-btn" data-id="${item.id}" data-key="${dataKey}">Edit</button>
            <button class="btn btn-sm btn-danger delete-btn" data-bs-toggle="modal" data-bs-target="#deleteModal" data-id="${item.id}" data-key="${dataKey}">Delete</button>
            </td>
            `;
        }

        tableHtml += `</tr>`; // Close the row in each iteration
    });
    // ... End of table rows render ...

    // Close the open tbody and table tags and insert dynamic HTML
    tableHtml += `</tbody></table>`;
    tableContainer.innerHTML = tableHtml;

    // Clear previous controls to prevent duplicates
    $('#export-buttons').empty();
    $('#search-box').empty();

    // Initialize DataTables
    const table = $(`#${tableViewId}-datatable`).DataTable({
        dom: 'rt', // Remove default controls
        buttons: [
            {
                extend: 'collection',
                text: 'Export',
                className: 'btn btn-secondary',
                buttons: [
                    {
                        extend: 'copy',
                        text: 'Copy',
                        className: 'btn btn-light'
                    },
                    {
                        extend: 'excel',
                        text: 'Excel',
                        className: 'btn btn-light'
                    },
                    {
                        extend: 'csv',
                        text: 'CSV',
                        className: 'btn btn-light'
                    },
                    {
                        extend: 'pdf',
                        text: 'PDF',
                        className: 'btn btn-light'
                    },
                    {
                        extend: 'print',
                        text: 'Print',
                        className: 'btn btn-light'
                    }
                ]
            }
        ],
        responsive: true,
        paging: false, // Disable pagination
        info: false, // Hide the "Showing X to Y of Z entries" text
        order: [[0, 'asc']], // Sort by first column (ID) by default
        language: {
            search: "Search:",
            zeroRecords: "No matching records found"
        }
    });

    // Move the export buttons to our custom container
    table.buttons().container().appendTo('#export-buttons');

    // Create and append custom search box
    const searchBox = $('<input type="search" class="form-control" placeholder="Search...">');
    $('#search-box').append(searchBox);

    // Add search functionality
    searchBox.on('keyup', function () {
        table.search(this.value).draw();
    });
}
// ==============================================

export function cardRender(tableViewId, tableDataSrc, tableColumns, hasActions = false) {
    // Store the desired table style (table vs card)
    const tableContainer = document.getElementById(tableViewId);
    if (!tableContainer) return;

    // Clear previous controls to prevent duplicates
    $('#card-search-box').empty();

    // Create the card dynamically
    let cardHtml = "";

    // Get the data key from function parameter
    const dataKey = tableViewId.split("-")[0];

    // Create a card for each item in the data source
    tableDataSrc.forEach(item => {
        cardHtml += `<div class="card my-3 mx-3 shadow-sm card-item"><div class="card-body">`;

        // Insert the labels and keys of data fields in the card body
        tableColumns.forEach(column => {
            if (column.key === "image_url") {
                cardHtml += `<p class="mb-1"><strong>${column.label}:</strong><br><img src="${item[column.key]}" alt="${item.name}" style="max-width: 80%; height: auto; display: block; margin:0 auto;" ></p>`;
            } else {
                cardHtml += `<p class="mb-1"><strong>${column.label}:</strong> ${item[column.key]}</p>`;
            }
        });

        // Add the actions buttons in the currently open card
        if (hasActions) {
            cardHtml += `
            <div class="mt-2">
            <button class="btn btn-sm btn-primary edit-btn" data-id="${item.id}" data-key="${dataKey}">Edit</button>
            <button class="btn btn-sm btn-danger delete-btn" data-bs-toggle="modal" data-bs-target="#deleteModal" data-id="${item.id}" data-key="${dataKey}">Delete</button>
            </div>
            `;
        }

        // Close the open divs
        cardHtml += `</div></div>`;
    });

    // insert dynamic HTML
    tableContainer.innerHTML = cardHtml;

    // Add search box for card view
    const searchBox = $('<input type="search" class="form-control" placeholder="Search...">');
    $('#card-search-box').append(searchBox);

    // Add search functionality for cards
    searchBox.on('keyup', function () {
        const value = this.value.toLowerCase();
        $(tableContainer).find('.card-item').each(function () {
            const cardText = $(this).text().toLowerCase();
            $(this).toggle(cardText.indexOf(value) > -1);
        });
    });
}
// ==============================================