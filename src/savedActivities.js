
import { db } from "./firebaseConfig.js";
import { onAuthReady } from "./authentication.js";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  setDoc,
  arrayRemove,
  arrayUnion
} from "firebase/firestore";

const savedList = document.getElementById("savedActivitiesList");

let currentUser = null;
let favourites = [];
//--------------for completed page----------------------
let completedActivities = [];

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
    completedActivities = userSnap.data()?.completedActivities || [];

    await displaySavedActivities();
    await displayCompletedActivities();

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

      //------------ Card body-----------------------
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

      //----------- Mark as Completed button-------------------
      const completeButton = document.createElement("button");
      completeButton.type = "button";
      completeButton.className = "btn btn-success rounded-pill ms-2";
      completeButton.textContent = "Mark as Completed";

      if (completedActivities.includes(activityId)) {
        completeButton.textContent = "Completed!";
        completeButton.className = "btn btn-secondary rounded-pill ms-2";

      }
      //-----------------------------------------------------------
      //------------button activation and conecting to firestore-----------
      completeButton.addEventListener("click", async function () {


        if (!currentUser || completeButton.disabled) {
          return;
        }

        completeButton.disabled = true;

        try {
          const isCompleted = completedActivities.includes(activityId);

          if (isCompleted) {
            // Remove from completed activities
            await setDoc(
              doc(db, "users", currentUser.uid),
              {
                completedActivities: arrayRemove(activityId)
              },
              { merge: true }
            );

            completedActivities = completedActivities.filter(function (id) {
              return id !== activityId;
            });

            completeButton.textContent = "Mark as Completed";
            completeButton.className = "btn btn-success rounded-pill ms-2";

          } else {
            // Add to completed activities
            await setDoc(
              doc(db, "users", currentUser.uid),
              {
                completedActivities: arrayUnion(activityId)
              },
              { merge: true }
            );

            completedActivities.push(activityId);

            completeButton.textContent = "Completed!";
            completeButton.className = "btn btn-secondary rounded-pill ms-2";
          }

          // Refresh Completed tab
          await displayCompletedActivities();

        } catch (error) {
          console.error("Error updating completed activity:", error);
          alert("Could not update completed activity. Please try again.");

        } finally {
          completeButton.disabled = false;
        }
      });
      //-----------------------------------------------------------------------

      body.appendChild(name);
      body.appendChild(category);
      body.appendChild(link);
      body.appendChild(completeButton);


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
  completedTab: "completedSection"
};

// Display completed activities
async function displayCompletedActivities() {

  const completedList = document.getElementById("completedActivitiesList");

  try {
    const activitiesSnap = await getDocs(collection(db, "activities"));

    completedList.innerHTML = "";

    let completedCount = 0;

    activitiesSnap.forEach(function (activityDoc) {

      const activityId = activityDoc.id;

      if (!completedActivities.includes(activityId)) {
        return;
      }

      completedCount++;

      const activity = activityDoc.data();

      const col = document.createElement("div");
      col.className = "col-12 col-md-6";

      const card = document.createElement("div");
      card.className = "card rounded-4 overflow-hidden h-100";

      const img = document.createElement("img");
      img.className = "card-img-top";
      img.src = activity.imageURL || "";
      img.alt = `${activity.name} image`;
      img.style.height = "180px";
      img.style.objectFit = "cover";

      const body = document.createElement("div");
      body.className = "card-body";

      const name = document.createElement("h3");
      name.className = "fs-5 fw-bold";
      name.textContent = activity.name;

      const status = document.createElement("p");
      status.className = "text-success fw-bold";
      status.textContent = "✓ Completed";

      const link = document.createElement("a");
      link.className = "btn btn-outline-dark rounded-pill";
      link.href = `/activity.html?docID=${encodeURIComponent(activityId)}`;
      link.textContent = "View Activity";

      // Undo Completed button
      const undoButton = document.createElement("button");
      undoButton.type = "button";
      undoButton.className = "btn btn-outline-secondary rounded-pill ms-2";
      undoButton.textContent = "Undo Completed";

      undoButton.addEventListener("click", async function () {

        if (!currentUser || undoButton.disabled) {
          return;
        }
//-------------undobutton and removimg it from compelete page-------------------------------------
        undoButton.disabled = true;

        try {
          await setDoc(
            doc(db, "users", currentUser.uid),
            {
              completedActivities: arrayRemove(activityId)
            },
            { merge: true }
          );

          completedActivities = completedActivities.filter(function (id) {
            return id !== activityId;
          });

          // Refresh both tabs
          await displayCompletedActivities();
          await displaySavedActivities();

        } catch (error) {
          console.error("Error undoing completed activity:", error);
          alert("Could not undo completed activity.");
          undoButton.disabled = false;
        }
      });

//------------------------------------------------------------------------------
      body.appendChild(name);
      body.appendChild(status);
      body.appendChild(link);
      body.appendChild(undoButton);

      card.appendChild(img);
      card.appendChild(body);
      col.appendChild(card);
      completedList.appendChild(col);
    });

    if (completedCount === 0) {
      completedList.textContent = "You haven't completed any activities yet.";
    }

  } catch (error) {
    console.error("Error loading completed activities:", error);
    completedList.textContent = "Could not load completed activities.";
  }
}


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
