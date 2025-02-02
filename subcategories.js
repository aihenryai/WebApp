let updates = []; // מאגר העדכונים

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('./result_old.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const params = new URLSearchParams(window.location.search);
        const selectedCategory = params.get("category");

        const updatesContainer = document.getElementById("updates-container");
        const categoryTitle = document.getElementById("category-title");

        if (selectedCategory) {
            if (selectedCategory === "0") {
                updates = data.messages;
                categoryTitle.textContent = "כל העדכונים";
            } else {
                categoryTitle.textContent = `עדכונים עבור קטגוריה: ${selectedCategory}`;
                updates = data.messages.filter(update => {
                    if (!Array.isArray(update.text)) return false;
                    return update.text.some(textPart =>
                        typeof textPart === "string" && textPart.includes(selectedCategory)
                    );
                });
            }

            // מיון העדכונים מהחדש לישן לפני הרינדור הראשוני
            updates.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            renderUpdates(updates);
        } else {
            updatesContainer.innerHTML = `<p>לא נבחרה קטגוריה להצגת עדכונים.</p>`;
        }

        document.getElementById("sort-order").addEventListener("change", sortUpdates);
        document.getElementById("search-box").addEventListener("input", searchUpdates);
    } catch (error) {
        console.error("שגיאה בטעינת העדכונים:", error);
        document.getElementById("updates-container").innerHTML =
            `<p>שגיאה בטעינת העדכונים. אנא נסה שוב מאוחר יותר.</p>`;
    }
});

// פונקציה להצגת העדכונים
function renderUpdates(updatesList) {
    const updatesContainer = document.getElementById("updates-container");
    updatesContainer.innerHTML = "";

    if (updatesList.length === 0) {
        updatesContainer.innerHTML = `<p>לא נמצאו עדכונים.</p>`;
        return;
    }

    updatesList.forEach(update => {
        const updateBox = document.createElement("div");
        updateBox.classList.add("update-box");

        const textContent = update.text.map(textPart =>
            typeof textPart === "string"
                ? `<span>${textPart}</span>`
                : `<a href="${textPart.text}" target="_blank">${textPart.text}</a>`
        ).join(' ');

        updateBox.innerHTML =
            `<div class="update-header">
                <h2>${update.from || "עדכון"}</h2>
                <span class="update-date">${new Date(update.date).toLocaleDateString('he-IL')}</span>
            </div>
            <div class="update-content">${textContent}</div>`;
        updatesContainer.appendChild(updateBox);
    });
}

// פונקציה למיון העדכונים
function sortUpdates() {
    const sortOrder = document.getElementById("sort-order").value;

    if (sortOrder === "newest") {
        updates.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
        updates.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    renderUpdates(updates);
}

// פונקציה לחיפוש דינאמי
function searchUpdates() {
    const searchTerm = document.getElementById("search-box").value.toLowerCase();

    const filteredUpdates = updates.filter(update =>
        update.text.some(textPart =>
            typeof textPart === "string" && textPart.toLowerCase().includes(searchTerm)
        )
    );

    renderUpdates(filteredUpdates);
}
