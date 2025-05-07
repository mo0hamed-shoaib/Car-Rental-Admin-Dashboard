// On page load, check if the local storage is empty or not
export function initLocalStorage(key, jsonPath, renderFunction) {
    if (!localStorage.getItem(key)) {
        fetch(jsonPath)
            .then(response => {
                if (!response.ok) throw new Error(`Status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                localStorage.setItem(key, JSON.stringify(data));
                if (typeof renderFunction === "function") {
                    renderFunction();
                }
            })
            .catch(err => console.error("Init error:", err));
    } else {
        if (typeof renderFunction === "function") {
            renderFunction();
        }
    }
}