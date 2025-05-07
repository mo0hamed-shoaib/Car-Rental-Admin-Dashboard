// Fetch and Inject Navbar to every HTML Page
function injectNavbar() {
    // Fetch the HTML element
    fetch("/components/navbar.html")
        .then(response => response.text())
        .then(data => {
            // Inject the navbar element to its div container
            document.getElementById("navbar").innerHTML = data;

            // Extract each anchor tag and the current open page
            const allAnchors = document.querySelectorAll("#navbar a");
            const currentPage = window.location.pathname.split("/").pop();

            // Loop over each anchor tag and compare its href with the current open page
            allAnchors.forEach(anchor => {
                const anchorRef = anchor.getAttribute("href").split("/").pop();
                if (anchorRef === currentPage) {
                    anchor.classList.add("active");
                } else {
                    anchor.classList.remove("active");
                }
            });
        })
        .catch(error => console.error("Error loading navbar: ", error));
}

// Call injectNavbar function after the DOM is loaded to wait the HTML parsing
window.addEventListener("DOMContentLoaded", injectNavbar);
// ==============================================================
