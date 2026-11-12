
import { db } from "./firebaseConfig.js";
import { onAuthReady } from "./authentication.js";

import {
  doc,
  getDoc,
  collection,
  getDocs,
  setDoc,
  arrayRemove
} from "firebase/firestore";

const savedList = document.getElementById("savedActivitiesList");

let currentUser = null;
let favourites = [];

// Check login and load saved activities
onAuthReady(async function (user) {

  if (!user) {
    location.href = "index.html";
    return;
  }

  currentUser = user;

  try {
    const userSnap = await getDoc(doc(db, "users", user.uid));
    favourites = userSnap.data()?.favourites || [];

    await displaySavedActivities();

  } catch (error) {
    console.error("Error loading favourites:", error);
    savedList.textContent = "Could not load saved activities.";
  }
});


// Display saved activities
async function displaySavedActivities() {

  try {
    const activitiesSnap = await getDocs(
      collection(db, "activities")
    );

    savedList.innerHTML = "";

    let savedCount = 0;

    activitiesSnap.forEach(function (activityDoc) {

      const activityId = activityDoc.id;

      if (!favourites.includes(activityId)) {
        return;
      }

      savedCount++;

      const activity = activityDoc.data();

      // Card column
      const col = document.createElement("div");
      col.className = "col-12 col-md-6";

      // Card
      const card = document.createElement("div");
      card.className =
        "card rounded-4 overflow-hidden h-100 position-relative";

      // Image
      const img = document.createElement("img");
      img.className = "card-img-top";
      img.src = activity.imageURL || "";
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
      category.textContent = activity.category || "";

      const link = document.createElement("a");
      link.className = "btn btn-outline-dark rounded-pill";
      link.href =
        `/activity.html?docID=${encodeURIComponent(activityId)}`;
      link.textContent = "View Activity";

      body.appendChild(name);
      body.appendChild(category);
      body.appendChild(link);

      card.appendChild(img);
      card.appendChild(body);

      // Filled heart (already saved)
      const heartButton = document.createElement("button");
      heartButton.type = "button";
      heartButton.className =
        "btn btn-light rounded-circle position-absolute top-0 end-0 m-2 shadow-sm";
      heartButton.setAttribute("aria-label", "Unsave activity");

      const heartIcon = document.createElement("i");
      heartIcon.className = "bi bi-heart-fill fs-5";

      heartButton.appendChild(heartIcon);

      // Unlike: remove from favourites
      heartButton.addEventListener("click", async function () {

        if (!currentUser || heartButton.disabled) {
          return;
        }

        heartButton.disabled = true;

        try {
          await setDoc(
            doc(db, "users", currentUser.uid),
            {
              favourites: arrayRemove(activityId)
            },
            {
              merge: true
            }
          );

          // Update local array
          favourites = favourites.filter(function (id) {
            return id !== activityId;
          });

          // Remove card from Saved page
          col.remove();

          // Show message if no saved activities remain
          if (savedList.children.length === 0) {
            savedList.textContent =
              "You haven't saved any activities yet.";
          }

        } catch (error) {
          console.error("Error removing favourite:", error);
          alert("Could not remove activity. Please try again.");

        } finally {
          heartButton.disabled = false;
        }
      });

      card.appendChild(heartButton);
      col.appendChild(card);
      savedList.appendChild(col);
    });

    if (savedCount === 0) {
      savedList.textContent =
        "You haven't saved any activities yet.";
    }

  } catch (error) {
    console.error("Error loading saved activities:", error);
    savedList.textContent = "Could not load saved activities.";
  }
}


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
