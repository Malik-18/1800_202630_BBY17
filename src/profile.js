
import { onAuthReady, logoutUser } from "./authentication.js";
import { db } from "./firebaseConfig.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { applyTheme, setDarkMode } from "./theme.js";

// -----------Remember the logged-in user
let currentUser = null;

//----------------- Dark mode toggle
const darkModeToggle = document.getElementById("darkModeToggle");

// Save dark mode changes for the current user
if (darkModeToggle) {
    darkModeToggle.disabled = true;

    darkModeToggle.addEventListener("change", () => {
        if (!currentUser) return;

        setDarkMode(darkModeToggle.checked, currentUser);
    });
}

//--------------------- Swap the default icon for a picture
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
            currentUser = null;
            applyTheme(null);
            location.href = "index.html";
            return;
        }

        currentUser = user;

        // ------------------Apply this user's saved theme
        const isDark = applyTheme(user);

        if (darkModeToggle) {
            darkModeToggle.checked = isDark;
            darkModeToggle.disabled = false;
        }

        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const data = userDoc.exists() ? userDoc.data() : {};

            nameElement.textContent =
                data.name || user.displayName || user.email;

            if (data.image) {
                showProfileImage(data.image);
            }

        } catch (error) {
            console.error("Error getting user document:", error);

            nameElement.textContent =
                user.displayName || user.email;
        }
    });
}

showUserInfo();

// ------------------------Shrink a photo so its longest side is at most maxSize px
// ------------------------Return it as a base64 text string
function resizeImage(file, maxSize = 300) {
    return new Promise(function (resolve, reject) {
        const img = new Image();

        img.onload = function () {
            const scale = Math.min(
                1,
                maxSize / Math.max(img.width, img.height)
            );

            const canvas = document.createElement("canvas");

            canvas.width = img.width * scale;
            canvas.height = img.height * scale;

            canvas.getContext("2d").drawImage(
                img,
                0,
                0,
                canvas.width,
                canvas.height
            );

            resolve(canvas.toDataURL("image/jpeg", 0.7));
        };

        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
}

//--------- Change the profile picture
async function changeProfileImage(event) {
    const file = event.target.files[0];

    if (!file || !currentUser) return;

    // ---------Show image preview
    showProfileImage(URL.createObjectURL(file));

    try {
        // -----------Resize and save image in Firestore
        const image = await resizeImage(file);

        await setDoc(
            doc(db, "users", currentUser.uid),
            { image: image },
            { merge: true }
        );

    } catch (error) {
        alert(
            `Error saving picture:\n${error.code || ""}\n${error.message || error}`
        );
    }

    event.target.value = "";
}

// Connect image input
document
    .getElementById("imageInput")
    .addEventListener("change", changeProfileImage);

// Log out
document.getElementById("logoutBtn").addEventListener("click", async () => {
    try {
        await logoutUser();

        currentUser = null;

        // Reset the page to light mode after logout
        applyTheme(null);

    } catch (error) {
        console.error("Error logging out:", error);
    }
});
