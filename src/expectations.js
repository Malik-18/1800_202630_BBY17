import { db } from "./firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";
import { expectations, defaultExpectations } from "./expectationsData.js";

// Get the activity ID from the URL (expectations.html?docID=abc123)
const params = new URL(window.location.href).searchParams;
const activityId = params.get("docID");

// Fetch the activity and fill in the "What to expect" page
async function displayExpectations() {

    const nameElement = document.getElementById("activityName");

    if (!activityId) {
        nameElement.textContent = "No activity selected.";
        return;
    }

    // Back arrow returns to this activity's details page
    document.getElementById("backLink").href =
        `/activity.html?docID=${encodeURIComponent(activityId)}`;

    try {
        const activityRef = doc(db, "activities", activityId);
        const activitySnap = await getDoc(activityRef);

        if (!activitySnap.exists()) {
            nameElement.textContent = "Activity not found.";
            return;
        }

        const activity = activitySnap.data();

        // Display activity name and image
        nameElement.textContent = activity.name;

        const img = document.getElementById("activityImage");
        img.src = activity.imageURL;
        img.alt = `${activity.name} image`;

        // Use this activity's text, and fill any missing parts with the defaults
        const info = {
            ...defaultExpectations,
            ...expectations[activity.name]
        };

        document.getElementById("doText").textContent = info.whatYoullDo;
        document.getElementById("bringText").textContent = info.whatToBring;
        document.getElementById("requirementsText").textContent = info.requirements;
        document.getElementById("safetyText").textContent = info.safety;
        document.getElementById("prepareText").textContent = info.howToPrepare;

    } catch (error) {
        console.error("Error loading expectations:", error);
        nameElement.textContent = "Error loading expectations.";
    }
}

// Call function when page loads
displayExpectations();