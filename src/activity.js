import { db } from "./firebaseConfig.js";
import { onAuthReady } from "./authentication.js";
import {
    doc,
    getDoc,
    setDoc,
    arrayUnion,
    arrayRemove
} from "firebase/firestore";

// Get the activity ID from the URL
const params = new URL(window.location.href).searchParams;
const activityId = params.get("docID");

//---------------------MAIN ACTIVITIES BUTTON------------------------//

if (activityId) {
    document.getElementById("firstTimersBtn").href =
        `/firstTimers.html?docID=${encodeURIComponent(activityId)}`;

    document.getElementById("expectationsBtn").href =
        `/expectations.html?docID=${encodeURIComponent(activityId)}`;

    document.getElementById("reviewsBtn").href =
        `/reviews.html?docID=${encodeURIComponent(activityId)}`;
}

//----------------------------------------------------------------------//


// Fetch the activity and display its information
async function displayActivityInfo() {

    const nameElement = document.getElementById("activityName");

    if (!activityId) {
        nameElement.textContent = "No activity selected.";
        return;
    }



    try {
        const activityRef = doc(db, "activities", activityId);
        const activitySnap = await getDoc(activityRef);

        if (!activitySnap.exists()) {
            nameElement.textContent = "Activity not found.";
            return;
        }

        const activity = activitySnap.data();

        // Display activity name
        nameElement.textContent = activity.name;

        // Display activity category
        document.getElementById("activityCategory").textContent =
            activity.category;

        // Display activity description
        document.getElementById("activityDescription").textContent =
            activity.description;

        // Display activity difficulty
        document.getElementById("activityDifficulty").textContent =
            activity.difficulty;

        // Display activity location
        document.getElementById("activityLocation").textContent =
            activity.location;

        // Display activity duration
        document.getElementById("activityDuration").textContent =
            activity.duration ?? "Not specified";

        // Display activity price
        document.getElementById("activityPrice").textContent =
            activity.price == null
                ? "Not specified"
                : Number(activity.price) === 0
                    ? "Free"
                    : `$${activity.price} CAD`;

        // Display activity image
        const img = document.getElementById("activityImage");

        img.src = activity.imageURL;
        img.alt = `${activity.name} image`;

    } catch (error) {
        console.error("Error loading activity:", error);
        nameElement.textContent = "Error loading activity.";
    }
}

// Call function when page loads
displayActivityInfo();


/* ---------------- SAVE TO TRY ---------------- */

const saveButton = document.getElementById("saveToTryBtn");

onAuthReady(async function (user) {

    if (!saveButton) return;

    if (!user) {
        saveButton.disabled = true;
        return;
    }

    if (!activityId) {
        saveButton.disabled = true;
        return;
    }

    const userRef = doc(db, "users", user.uid);

    try {
        // Read the user's saved activities
        const userSnap = await getDoc(userRef);
        let favourites = userSnap.data()?.favourites || [];

        // Display the correct button state
        function updateSaveButton() {
            if (favourites.includes(activityId)) {
                saveButton.innerHTML =
                    '<i class="bi bi-check-lg me-2"></i>Saved to Try';
            } else {
                saveButton.innerHTML =
                    '<i class="bi bi-heart me-2"></i>Save to Try';
            }
        }

        updateSaveButton();
        saveButton.disabled = false;

        // Save or unsave when clicked
        saveButton.onclick = async function () {

            saveButton.disabled = true;

            try {
                if (favourites.includes(activityId)) {

                    // Remove from favourites
                    await setDoc(
                        userRef,
                        { favourites: arrayRemove(activityId) },
                        { merge: true }
                    );

                    favourites = favourites.filter(
                        id => id !== activityId
                    );

                } else {

                    // Add to favourites
                    await setDoc(
                        userRef,
                        { favourites: arrayUnion(activityId) },
                        { merge: true }
                    );

                    favourites.push(activityId);
                }

                updateSaveButton();

            } catch (error) {
                console.error("Error saving activity:", error);
                alert("Could not update saved activities.");
            } finally {
                saveButton.disabled = false;
            }
        };

    } catch (error) {
        console.error("Error loading favourites:", error);
        saveButton.disabled = true;
    }
});
