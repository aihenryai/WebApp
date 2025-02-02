document.addEventListener("DOMContentLoaded", () => {
    const searchQuery = localStorage.getItem("searchQuery") || ""; // קבלת מחרוזת החיפוש
    const sortOrder = document.getElementById("sort-order");

    fetch('result_old.json')
        .then(response => response.json())
        .then(data => {
            // סינון כל התוצאות המכילות את מחרוזת החיפוש
            results = data.messages.filter(message =>
                Array.isArray(message.text) &&
                message.text.some(part =>
                    typeof part === 'string' && part.toLowerCase().includes(searchQuery)
                )
            );

            sortResults("newest"); // מיון ברירת מחדל מהחדש לישן
            renderResults();
        })
        .catch(error => console.error('Error loading JSON:', error));

    // הוספת מאזין למיון
    sortOrder.addEventListener("change", () => sortResults(sortOrder.value));

    // הוספת מאזין ללחיצת Enter בשורת החיפוש
    const searchInput = document.getElementById("search");
    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            performSearch();
        }
    });
});

function renderResults() {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = ""; // איפוס תוצאות קיימות

    if (results.length > 0) {
        results.forEach(result => {
            const resultBox = document.createElement("div");
            resultBox.className = "update-box"; // עיצוב זהה לעמוד subcategories
            resultBox.innerHTML = `
                <div class="update-header">
                    <h2>${result.from || "לא ידוע"}</h2>
                    <span class="update-date">${new Date(result.date).toLocaleDateString('he-IL')}</span>
                </div>
                <div class="update-content">
                    ${result.text.map(part => (typeof part === 'string' ? `<span>${part}</span>` : '')).join(' ')}
                </div>
            `;
            resultsContainer.appendChild(resultBox);
        });
    } else {
        resultsContainer.innerHTML = `<p>לא נמצאו תוצאות עבור "${localStorage.getItem("searchQuery")}".</p>`;
    }
}

function sortResults(order) {
    if (order === "newest") {
        results.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
        results.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    renderResults();
}

function performSearch() {
    const searchTerm = document.getElementById("search").value.trim().toLowerCase();
    if (searchTerm) {
        localStorage.setItem("searchQuery", searchTerm); // שמירת החיפוש ל-localStorage
        window.location.href = "showinfo.html"; // מעבר לעמוד תוצאות
    }
}
