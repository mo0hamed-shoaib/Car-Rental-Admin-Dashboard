// Fetch and Inject Delete Modal to every HTML Page
export function injectDeleteModal() {
    // Fetch the HTML element
    return fetch("/components/deleteModal.html")
        .then(response => response.text())
        .then(data => {
            // Inject the delete modal to its div container
            document.getElementById("delete-modal-container").innerHTML = data;
        });
} 