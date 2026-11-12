import { onAuthReady } from "./authentication.js";
import { db } from "./firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";

// Swap the header's default icon for the user's saved profile picture
onAuthReady(async (user) => {
    if (!user) return;

    try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const image = userDoc.exists() ? userDoc.data().image : null;

        if (image) {
            const img = document.getElementById("headerImage");
            img.src = image;                                          // base64 text saved on the profile page
            img.classList.remove("d-none");
            document.getElementById("headerIcon").classList.add("d-none");
        }
    } catch (error) {
        console.error("Error loading profile picture:", error);
    }
});