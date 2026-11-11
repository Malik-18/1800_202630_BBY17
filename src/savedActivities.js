
import { db } from "./firebaseConfig.js";
import { onAuthReady } from "./authentication.js";
import {
  doc,
  getDoc,
  collection,
  getDocs
} from "firebase/firestore";

// HTML elements
const savedList = document.getElementById("savedActivitiesList");

// Wait until Firebase checks the logged-in user
onAuthReady(async function (user) {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  try {
    // Get the logged-in user's document
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    // Get the user's favourite activity IDs
    const favourites = userSnap.data()?.favourites || [];

    // Get all activities from Firestore
    const activitiesRef = collection(db, "activities");
    const activitiesSnap = await getDocs(activitiesRef);

    // Clear loading message
    savedList.innerHTML = "";

    let savedCount = 0;

    activitiesSnap.forEach(function (activityDoc) {

      // Only display favourited activities
      if (!favourites.includes(activityDoc.id)) {
        return;
      }

      savedCount++;

      const activity = activityDoc.data();

      // Create a Bootstrap card
      const col = document.createElement("div");
      col.className = "col-12 col-md-6";

      const card = document.createElement("div");
      card.className = "card rounded-4 overflow-hidden h-100";

      // Activity image
      const img = document.createElement("img");
      img.className = "card-img-top";
      img.src = activity.imageURL;
      img.alt = `${activity.name} image`;
      img.style.height = "180px";
      img.style.objectFit = "cover";

      // Card body
      const body = document.createElement("div");
      body.className = "card-body";

      const name = document.createElement("h3");
      name.className = "fs-5 fw-bold";
      name.textContent = activity.name;

      const category = document.createElement("p");
      category.className = "text-secondary small";
      category.textContent = activity.category;

      const link = document.createElement("a");
      link.className = "btn btn-outline-dark rounded-pill";
      link.href =
        `/activity.html?docID=${encodeURIComponent(activityDoc.id)}`;
      link.textContent = "View Activity";

      body.appendChild(name);
      body.appendChild(category);
      body.appendChild(link);

      card.appendChild(img);
      card.appendChild(body);
      col.appendChild(card);

      savedList.appendChild(col);
    });

    // If no saved activities
    if (savedCount === 0) {
      savedList.textContent =
        "You haven't saved any activities yet.";
    }

  } catch (error) {
    console.error("Error loading saved activities:", error);
    savedList.textContent = "Could not load saved activities.";
  }
});


// Navigation tabs
const tabs = {
  savedTab: "savedSection",
  completedTab: "completedSection",
  progressTab: "progressSection"
};

Object.keys(tabs).forEach(function (tabId) {

  document.getElementById(tabId).addEventListener("click", function () {

    // Hide all sections
    Object.values(tabs).forEach(function (sectionId) {
      document.getElementById(sectionId).classList.add("d-none");
    });

    // Show selected section
    document.getElementById(tabs[tabId]).classList.remove("d-none");

    // Update tab styles
    Object.keys(tabs).forEach(function (id) {
      const button = document.getElementById(id);

      button.classList.remove(
        "fw-bold",
        "border-bottom",
        "border-dark",
        "border-3"
      );
    });

    const selectedButton = document.getElementById(tabId);

    selectedButton.classList.add(
      "fw-bold",
      "border-bottom",
      "border-dark",
      "border-3"
    );
  });
});
