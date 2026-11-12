// Shared helpers for dark mode. Uses Bootstrap 5.3's data-bs-theme attribute.
// Import applyTheme() on any page that should respect the saved theme.
 
export function applyTheme() {
    const isDark = localStorage.getItem("darkMode") === "true";
    document.documentElement.setAttribute("data-bs-theme", isDark ? "dark" : "light");
    return isDark;
}
 
export function setDarkMode(isDark) {
    localStorage.setItem("darkMode", isDark);
    applyTheme();
}
 
