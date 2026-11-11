import { db } from "./firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";

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