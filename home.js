const categories = [
    { id: 1, name: "תוכן חינוכי וכלי עבודה" },
    { id: 2, name: "טכנולוגיה וכלי אינטרנט" },
    { id: 3, name: "כלי תמונה ועיצוב" },
    { id: 4, name: "קהילות ועדכונים" },
    { id: 5, name: "אחר" },
    { id: 0, name: "הצג הכל" }  // הוספת הקטגוריה החדשה
];

document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".categories");

categories.forEach(category => {
    const div = document.createElement("div");
    div.className = "category-box";
    div.setAttribute('data-id', category.id); // הוספת מזהה לאלמנט
    div.textContent = category.name;
    div.onclick = () => navigateToSubcategories(category.id);
    container.appendChild(div);
});
    // הוספת מאזין ללחיצת Enter בשורת החיפוש
    const searchInput = document.getElementById("search");
    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            performSearch();
        }
    });
});

function navigateToSubcategories(categoryId) {
    window.location.href = `subcategories.html?category=${categoryId}`;
}

function searchUpdates() {
    const searchTerm = document.getElementById("search").value.trim().toLowerCase();
    localStorage.setItem("searchQuery", searchTerm); // שמירת החיפוש ל-localStorage
}

function performSearch() {
    const searchTerm = document.getElementById("search").value.trim().toLowerCase();
    if (searchTerm) {
        localStorage.setItem("searchQuery", searchTerm); // שמירת החיפוש ל-localStorage
        window.location.href = "showinfo.html"; // מעבר לעמוד תוצאות
    }
}
