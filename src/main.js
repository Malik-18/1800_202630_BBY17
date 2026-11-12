
import { onAuthReady } from "./authentication.js";
import { db } from "./firebaseConfig.js";

import {
    doc,
    getDoc,
    collection,
    getDocs,
    setDoc,
    arrayUnion,
    arrayRemove
} from "firebase/firestore";


let currentUser = null;
let favourites = [];


// Check login and load user's favourites
onAuthReady(async function (user) {

    if (!user) {
        location.href = "index.html";
        return;
    }

    currentUser = user;

    try {
        // Get user's information from Firestore
        const userSnap = await getDoc(doc(db, "users", user.uid));
        const userData = userSnap.data() || {};

        // Display user's name if the element exists
        const nameElement = document.getElementById("name-goes-here");

        if (nameElement) {
            const name =
                userData.name || user.displayName || user.email;

            nameElement.textContent = `${name}!`;
        }

        // Load saved activity IDs
        favourites = userData.favourites || [];

        // Display featured activities
        await displayHomeActivities();

    } catch (error) {
        console.error("Error loading home page:", error);

        const featuredContainer =
            document.getElementById("featuredActivities");

        if (featuredContainer) {
            featuredContainer.textContent =
                "Could not load featured activities.";
        }
    }
});


// Create an activity card
function createActivityCard(activity, activityId) {

    const col = document.createElement("div");
    col.className = "col";

    const card = document.createElement("div");
    card.className =
        "card h-100 rounded-4 overflow-hidden position-relative";

    // Link to activity details
    const link = document.createElement("a");
    link.href =
        `/activity.html?docID=${encodeURIComponent(activityId)}`;

    link.className = "text-decoration-none text-dark";

    // Activity image
    const image = document.createElement("img");
    image.src = activity.imageURL || "";
    image.alt = activity.name || "Activity";
    image.className = "card-img-top";
    image.style.height = "160px";
    image.style.objectFit = "cover";

    // Card body
    const body = document.createElement("div");
    body.className = "card-body";

    // Activity name
    const name = document.createElement("h3");
    name.className = "fs-6 fw-bold";
    name.textContent = activity.name || "Unnamed Activity";

    // Difficulty
    const difficulty = document.createElement("p");
    difficulty.className = "text-secondary small mb-0";
    difficulty.textContent =
        activity.difficulty || "Difficulty not specified";

    body.appendChild(name);
    body.appendChild(difficulty);

    link.appendChild(image);
    link.appendChild(body);

    card.appendChild(link);


    // Favourite heart button
    const heartButton = document.createElement("button");

    heartButton.type = "button";
    heartButton.className =
        "btn btn-light rounded-circle position-absolute top-0 end-0 m-2 shadow-sm";

    // Heart icon
    const heartIcon = document.createElement("i");
    heartIcon.className = "bi bi-heart fs-5";

    heartButton.appendChild(heartIcon);


    // Check if activity is already saved
    if (favourites.includes(activityId)) {

        heartIcon.className = "bi bi-heart-fill fs-5";

        heartButton.setAttribute(
            "aria-label",
            "Unsave activity"
        );

    } else {

        heartButton.setAttribute(
            "aria-label",
            "Save activity"
        );
    }


    // Like / Unlike button
    heartButton.addEventListener("click", async function () {

        if (!currentUser || heartButton.disabled) {
            return;
        }

        heartButton.disabled = true;

        const userRef = doc(db, "users", currentUser.uid);

        const isSaved = favourites.includes(activityId);

        try {

            if (isSaved) {

                // Remove activity from favourites
                await setDoc(
                    userRef,
                    {
                        favourites: arrayRemove(activityId)
                    },
                    {
                        merge: true
                    }
                );

                // Update local favourites
                favourites = favourites.filter(function (id) {
                    return id !== activityId;
                });

                // Change to empty heart
                heartIcon.className = "bi bi-heart fs-5";

                heartButton.setAttribute(
                    "aria-label",
                    "Save activity"
                );

            } else {

                // Add activity to favourites
                await setDoc(
                    userRef,
                    {
                        favourites: arrayUnion(activityId)
                    },
                    {
                        merge: true
                    }
                );

                // Update local favourites
                favourites.push(activityId);

                // Change to filled heart
                heartIcon.className = "bi bi-heart-fill fs-5";

                heartButton.setAttribute(
                    "aria-label",
                    "Unsave activity"
                );
            }

        } catch (error) {

            console.error(
                "Error updating favourites:",
                error
            );

            alert(
                "Could not update saved activities. Please try again."
            );

        } finally {

            heartButton.disabled = false;
        }
    });


    card.appendChild(heartButton);
    col.appendChild(card);

    return col;
}


// Get featured activities from Firestore
async function displayHomeActivities() {

    const featuredContainer =
        document.getElementById("featuredActivities");

    if (!featuredContainer) {
        return;
    }

    try {

        // Get activities from Firestore
        const snapshot = await getDocs(
            collection(db, "activities")
        );

        featuredContainer.innerHTML = "";

        const activities = [];

        snapshot.forEach(function (activityDoc) {

            activities.push({
                ...activityDoc.data(),
                id: activityDoc.id
            });
        });


        // Filter beginner-friendly activities
        const beginnerActivities = activities.filter(
            function (activity) {

                return String(activity.difficulty || "")
                    .toLowerCase()
                    .includes("beginner");
            }
        );


        // Show only 3 featured activities
        beginnerActivities.slice(0, 3).forEach(
            function (activity) {

                const card = createActivityCard(
                    activity,
                    activity.id
                );

                featuredContainer.appendChild(card);
            }
        );


        // If no beginner activities exist
        if (beginnerActivities.length === 0) {

            featuredContainer.textContent =
                "No beginner activities available yet.";
        }

    } catch (error) {

        console.error(
            "Error loading home activities:",
            error
        );

        featuredContainer.textContent =
            "Could not load featured activities.";
    }
}
