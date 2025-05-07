// Fetch and Inject Forms Modal to every HTML Page
export function injectFormsModal() {
    // Fetch the HTML element
    return fetch("/components/formsModal.html")
        .then(response => response.text())
        .then(data => {
            // Inject the form modal to its div container
            document.getElementById("forms-modal-container").innerHTML = data;
        });
}
// ==============================================================