import { onAuthReady, logoutUser } from "./authentication.js";
import { db } from "./firebaseConfig.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { applyTheme, setDarkMode } from "./theme.js";

// Remember the logged-in user so we can save their picture
let currentUser = null;

// Dark mode toggle: set initial state, then save changes
const darkModeToggle = document.getElementById("darkModeToggle");
darkModeToggle.checked = applyTheme();
darkModeToggle.addEventListener("change", () => setDarkMode(darkModeToggle.checked));

// Swap the default icon for a picture
function showProfileImage(src) {
    const img = document.getElementById("profileImage");
    img.src = src;
    img.classList.remove("d-none");
    document.getElementById("avatarIcon").classList.add("d-none");
}

// Show the logged-in user's name and saved picture
function showUserInfo() {
    const nameElement = document.getElementById("userName");

    onAuthReady(async (user) => {
        if (!user) {
            location.href = "index.html";
            return;
        }
        currentUser = user;

        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const data = userDoc.exists() ? userDoc.data() : {};

            nameElement.textContent = data.name || user.displayName || user.email;
            if (data.image) showProfileImage(data.image);   // base64 text saved earlier
        } catch (error) {
            console.error("Error getting user document: ", error);
            nameElement.textContent = user.displayName || user.email;
        }
    });
}
showUserInfo();

// Shrink a photo so its longest side is at most maxSize px,
// then return it as a base64 text string ("data:image/jpeg;base64,....")
function resizeImage(file, maxSize = 300) {
    return new Promise(function (resolve, reject) {
        const img = new Image();
        img.onload = function () {
            const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
            const canvas = document.createElement("canvas");
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
}

// ---- (1) What to do when a file is chosen ----
async function changeProfileImage(event) {
    const file = event.target.files[0];
    if (!file || !currentUser) return;

    // Instant preview using a temporary link to the file on this computer
    showProfileImage(URL.createObjectURL(file));

    try {
        // Shrink it, then save the text string on the user's document
        const image = await resizeImage(file);
        await setDoc(doc(db, "users", currentUser.uid), { image: image }, { merge: true });
    } catch (error) {
        alert(`Error saving picture:\n${error.code || ""}\n${error.message || error}`);
    }

    event.target.value = "";   // lets the user pick the same file again later
}

// ---- (2) Connect it: "file picker, when your file changes, run changeProfileImage" ----
document.getElementById("imageInput").addEventListener("change", changeProfileImage);

// Log out
document.getElementById("logoutBtn").addEventListener("click", async () => {
    await logoutUser();
});