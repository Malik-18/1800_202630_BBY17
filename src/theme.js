// ----------------Apply the theme for the current user-------------------
export function applyTheme(user) {

    let isDark = false;
    if (user) {
        const key = `darkMode_${user.uid}`;
        isDark = localStorage.getItem(key) === "true";}

    document.documentElement.setAttribute(
        "data-bs-theme",
        isDark ? "dark" : "light");
    return isDark;
}

//-------------- Save the theme for the current user----------------
export function setDarkMode(isDark, user) {

    if (!user) return;

    const key = `darkMode_${user.uid}`;
    localStorage.setItem(key, String(isDark));
    applyTheme(user);
}