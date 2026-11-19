
import { db } from "./firebaseConfig.js";
import {
  doc,
  getDoc,
  collection,
  getDocs
} from "firebase/firestore";

// Get the activity ID from the URL
const params = new URL(window.location.href).searchParams;
const activityId = params.get("docID");

// Get HTML elements
const activityName = document.getElementById("activityName");
const reviewsList = document.getElementById("reviewsList");

// Display activity information and reviews
async function displayReviews() {

  if (!activityId) {
    activityName.textContent = "No activity selected.";
    reviewsList.textContent = "";
    return;
  }

  // Back to the selected activity
  document.getElementById("backToActivity").href =
    `/activity.html?docID=${encodeURIComponent(activityId)}`;

  try {
    // Get activity from Firestore
    const activityRef = doc(db, "activities", activityId);
    const activitySnap = await getDoc(activityRef);

    if (!activitySnap.exists()) {
      activityName.textContent = "Activity not found.";
      reviewsList.textContent = "";
      return;
    }

    activityName.textContent = activitySnap.data().name;

    // Get reviews for this activity
    const reviewsRef = collection(
      db,
      "activities",
      activityId,
      "reviews"
    );

    const snapshot = await getDocs(reviewsRef);

    reviewsList.innerHTML = "";

    if (snapshot.empty) {
      reviewsList.textContent =
        "No reviews yet. Be the first to share your experience!";
      return;
    }

    // Display each review
    snapshot.forEach(function (reviewDoc) {
      const review = reviewDoc.data();

      const card = document.createElement("div");
      card.className = "border rounded-4 p-3 mb-3";

      const name = document.createElement("h3");
      name.className = "fs-6 fw-bold";
      name.textContent = review.name || "Anonymous";

      const message = document.createElement("p");
      message.className = "mb-0";
      message.textContent = review.message || "";

      card.appendChild(name);
      card.appendChild(message);
      reviewsList.appendChild(card);
    });

  } catch (error) {
    console.error("Error loading reviews:", error);
    activityName.textContent = "Error loading reviews.";
    reviewsList.textContent = "Could not load reviews.";
  }
}

displayReviews();
