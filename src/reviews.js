import { db } from "./firebaseConfig.js";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy
} from "firebase/firestore";

// Get the activity ID from the URL
const params = new URL(window.location.href).searchParams;
const activityId = params.get("docID");

// Get HTML elements
const activityName = document.getElementById("activityName");
const reviewsList = document.getElementById("reviewsList");

// Back and Share Experience buttons keep the same activity ID
if (activityId) {
  document.getElementById("backToActivity").href =
    `/activity.html?docID=${encodeURIComponent(activityId)}`;

  document.getElementById("shareExperienceBtn").href =
    `/shareExperience.html?docID=${encodeURIComponent(activityId)}`;
}

// Display activity information and reviews
async function displayReviews() {

  if (!activityId) {
    activityName.textContent = "No activity selected.";
    reviewsList.textContent = "";
    return;
  }

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

    // Get reviews for this activity, newest first
    const reviewsRef = collection(
      db,
      "activities",
      activityId,
      "reviews"
    );

    const reviewsQuery = query(reviewsRef, orderBy("timestamp", "desc"));
    const snapshot = await getDocs(reviewsQuery);

    reviewsList.innerHTML = "";

    if (snapshot.empty) {
      reviewsList.textContent =
        "No reviews yet. Be the first to share your experience!";
      return;
    }

    // Display each review
    snapshot.forEach(function (reviewDoc) {
      const review = reviewDoc.data();

      // One row: avatar on the left, review on the right
      const card = document.createElement("div");
      card.className = "d-flex gap-3 border-bottom py-3";

      const avatar = document.createElement("i");
      avatar.className = "bi bi-person-circle text-secondary";
      avatar.style.fontSize = "48px";

      const content = document.createElement("div");
      content.className = "flex-grow-1";

      const name = document.createElement("h3");
      name.className = "fs-6 fw-bold mb-0";
      name.textContent = review.name || "Anonymous";

      // Stars and date, e.g. "★★★★☆ · 11/16/2026"
      const rating = review.rating || 0;
      const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
      const date = review.timestamp
        ? review.timestamp.toDate().toLocaleDateString()
        : "just now";

      const meta = document.createElement("p");
      meta.className = "text-secondary small mb-2";
      meta.textContent = `${stars} · ${date}`;

      const message = document.createElement("p");
      message.className = "mb-2 text-break";
      message.style.whiteSpace = "pre-line";   // keep the line breaks the user typed
      message.textContent = review.message || "";

      content.appendChild(name);
      content.appendChild(meta);
      content.appendChild(message);

      // Only show a picture if the review has one
      if (review.image) {
        const picture = document.createElement("img");
        picture.src = review.image;              // base64 text saved by shareExperience.js
        picture.alt = "Review picture";
        picture.className = "img-fluid rounded-4";   // keeps the picture's own proportions
        picture.style.maxHeight = "400px";           // very tall pictures can't take over the screen
        content.appendChild(picture);
      }

      card.appendChild(avatar);
      card.appendChild(content);
      reviewsList.appendChild(card);
    });

  } catch (error) {
    console.error("Error loading reviews:", error);
    activityName.textContent = "Error loading reviews.";
    reviewsList.textContent = "Could not load reviews.";
  }
}

displayReviews();