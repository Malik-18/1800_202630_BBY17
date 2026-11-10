import { onAuthReady } from "./authentication.js";
import { db } from "./firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";

// Check login and display user's name
onAuthReady(async function (user) {

    if (!user) {
        location.href = "index.html";
        return;
    }

    const nameElement = document.getElementById("name-goes-here");

    // Only read the name if this page displays it
    if (nameElement) {
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));

            const name = userDoc.exists()
                ? userDoc.data().name || user.displayName || user.email
                : user.displayName || user.email;

            nameElement.textContent = `${name}!`;

        } catch (error) {
            console.error("Error loading user name:", error);
        }
    }
});