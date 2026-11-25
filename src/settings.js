import { onAuthReady } from "./authentication.js";
import { applyTheme, setDarkMode } from "./theme.js";

const darkModeToggle = document.getElementById("darkModeToggle");
const notificationsToggle = document.getElementById("notificationsToggle");
const languageSelect = document.getElementById("languageSelect");

onAuthReady((user) => {
    if (!user) {
        applyTheme(null);
        location.href = "index.html";
        return;
    }

    if (darkModeToggle) {
        darkModeToggle.checked = applyTheme(user);

        darkModeToggle.addEventListener("change", () => {
            setDarkMode(darkModeToggle.checked, user);
        });
    } else {
        applyTheme(user);
    }

    notificationsToggle.checked = localStorage.getItem("notifications") === "true";
    languageSelect.value = localStorage.getItem("language") || "en";
});

notificationsToggle.addEventListener("change", () => {
    localStorage.setItem("notifications", notificationsToggle.checked);
});

languageSelect.addEventListener("change", () => {
    localStorage.setItem("language", languageSelect.value);
});