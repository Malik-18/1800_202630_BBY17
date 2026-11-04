import { onAuthReady } from "./authentication.js";
import { applyTheme } from "./theme.js";

// Keep the saved theme applied on this page too
applyTheme();

// Only logged-in users can see settings
onAuthReady((user) => {
    if (!user) location.href = "index.html";
});

const notificationsToggle = document.getElementById("notificationsToggle");
const languageSelect = document.getElementById("languageSelect");

// Load saved settings
notificationsToggle.checked = localStorage.getItem("notifications") === "true";
languageSelect.value = localStorage.getItem("language") || "en";

// Save changes
notificationsToggle.addEventListener("change", () => {
    localStorage.setItem("notifications", notificationsToggle.checked);
});

languageSelect.addEventListener("change", () => {
    localStorage.setItem("language", languageSelect.value);
});