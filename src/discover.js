
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import { db } from "./firebaseConfig.js";
import { onAuthReady } from "./authentication.js";
import {
  doc,
  onSnapshot,
  getDoc,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  setDoc,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";


let currentUser = null;   // who is logged in
let favourites = [];      // the hike IDs they've favourited


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

    setupHeart(newCard, activity.id);

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

// Runs once Firebase knows if someone is logged in
onAuthReady(async function (user) {
  if (!user) {
    location.href = "index.html";                              // Not logged in → back to start
  } else {
    currentUser = user;                                        // 1. Remember who's logged in
    const userDoc = await getDoc(doc(db, "users", user.uid));  // 2. Get their user doc

    // 3. Load user's favourites, or use an empty array if none exist
    favourites = userDoc.data()?.favourites || [];   // uses "optional chaining" (?.)

    // Beginner version of the line above:
    // if (userDoc.exists() && userDoc.data().favourites) {
    //   favourites = userDoc.data().favourites;
    // } else {
    //   favourites = [];
    // }

    displayCardsDynamically();                                 // 4. Draw the cards
  }
});



function setupHeart(card, hikeID) {

  // [FRONT END] Find the heart icon inside this card
  const heart = card.querySelector(".fav-btn");

  // [FRONT END] Already a favourite? Fill the heart.
  //             (favourites was read from Firestore in Step 2.3)
  if (favourites.includes(hikeID)) {
    heart.classList.replace("bi-heart", "bi-heart-fill");
  }

  // Connect it: "heart, when you are clicked, toggle this hike"
  heart.addEventListener("click", function () {
    toggleFavourite(heart, hikeID);
  });
}


// ------------------------------------------------------------
async function toggleFavourite(heart, hikeID) {

  // [BACK END] The address of the logged-in user's document in Firestore
  const userRef = doc(db, "users", currentUser.uid);

  // [FRONT END] Is the heart filled right now?
  if (heart.classList.contains("bi-heart-fill")) {

    // Filled → REMOVE from favourites
    // [BACK END] Remove this hike's ID from the user's favourites array
    await setDoc(userRef, { favourites: arrayRemove(hikeID) }, { merge: true });
    // [FRONT END] Show the empty heart
    heart.classList.replace("bi-heart-fill", "bi-heart");

  } else {

    // Empty → ADD to favourites
    // [BACK END] Add this hike's ID to the user's favourites array
    await setDoc(userRef, { favourites: arrayUnion(hikeID) }, { merge: true });
    // [FRONT END] Show the filled heart
    heart.classList.replace("bi-heart", "bi-heart-fill");
  }
}
