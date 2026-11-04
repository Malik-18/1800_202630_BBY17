
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import { db } from "./firebaseConfig.js";
import { collection, getDocs } from "firebase/firestore";

// Store activities after reading from Firestore
let allActivities = [];

// Current selected category
let selectedCategory = "All";

// Read activities from Firestore
async function displayCardsDynamically() {

  const cardTemplate = document.getElementById("activityCardTemplate");
  const activitiesContainer = document.getElementById("activities-go-here");
  const activitiesRef = collection(db, "activities");

  try {
    const querySnapshot = await getDocs(activitiesRef);

    allActivities = [];
    querySnapshot.forEach((docSnap) => {
      const activity = docSnap.data();

      allActivities.push({
        id: docSnap.id,
        ...activity
      });
    });

    // Apply the selected filter after loading Firestore data
    filterActivities();

  } catch (error) {
    console.error("Error getting activities:", error);
    document.getElementById("resultsCount").textContent =
      "Error loading activities.";
  }
}


// Display activity cards
function displayActivities(activities) {

  const cardTemplate = document.getElementById("activityCardTemplate");
  const activitiesContainer = document.getElementById("activities-go-here");

  // Clear old cards
  activitiesContainer.innerHTML = "";

  activities.forEach((activity) => {

    // Clone template
    const newCard = cardTemplate.content.cloneNode(true);

    // Add activity information
    newCard.querySelector(".card-title").textContent = activity.name;

    newCard.querySelector(".card-category").textContent =
      activity.category;

    newCard.querySelector(".card-difficulty").textContent =
      activity.difficulty;

    // Add activity image
    const img = newCard.querySelector(".card-image");
    img.src = activity.imageURL;
    img.alt = `${activity.name} image`;

    // Link to activity details
    newCard.querySelector(".read-more").href =
      `/activity.html?docID=${encodeURIComponent(activity.id)}`;

    // Add card to page
    activitiesContainer.appendChild(newCard);
  });

  document.getElementById("resultsCount").textContent =
    `${activities.length} activities found`;
}


// Search and category filtering

function filterActivities() {

  const searchText = document.getElementById("searchInput")
    .value.toLowerCase().trim();

  const filteredActivities = allActivities.filter((activity) => {

    const matchesSearch =
      activity.name.toLowerCase().includes(searchText) ||
      activity.category.toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "All" ||
      activity.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  displayActivities(filteredActivities);
}


// Search event
document.getElementById("searchInput").addEventListener("input", filterActivities);


// Category button events
const categoryButtons = document.querySelectorAll(".category-btn");

categoryButtons.forEach((button) => {

  button.addEventListener("click", () => {

    selectedCategory = button.dataset.category;

    // Update button styles
    categoryButtons.forEach((btn) => {
      btn.classList.remove("btn-dark");
      btn.classList.add("btn-outline-dark");
    });

    button.classList.remove("btn-outline-dark");
    button.classList.add("btn-dark");

    filterActivities();
  });

});


// Read category from URL (when coming from Home)
const params = new URL(window.location.href).searchParams;
const categoryFromURL = params.get("category");

if (categoryFromURL) {

  const matchingButton = Array.from(categoryButtons).find(
    (button) => button.dataset.category === categoryFromURL
  );

  if (matchingButton) {
    matchingButton.click();
  }
}


// Load activities when page opens
displayCardsDynamically();
