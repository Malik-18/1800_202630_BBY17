
import { db } from "./firebaseConfig.js";
import { onAuthReady } from "./authentication.js";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection
} from "firebase/firestore";

// Get activity ID from URL
const params = new URL(window.location.href).searchParams;
const activityId = params.get("docID");

if (activityId) {
  document.getElementById("backToActivity").href =
    `/activity.html?docID=${encodeURIComponent(activityId)}`;
}

const joinButton = document.getElementById("joinFirstTimersBtn");
const joinStatus = document.getElementById("joinStatus");

// Keep the button disabled until authentication is checked
joinButton.disabled = true;

onAuthReady(async function (user) {

  if (!user) {
    joinStatus.textContent = "Please log in to join First Timers.";
    return;
  }

  if (!activityId) {
    joinStatus.textContent = "No activity selected.";
    return;
  }

  // Each user gets one document per activity
  const memberRef = doc(
    db,
    "activities",
    activityId,
    "firstTimers",
    user.uid
  );

  try {
    // Check whether the user already joined
    const memberSnap = await getDoc(memberRef);

    if (memberSnap.exists()) {
      joinButton.textContent = "Already Joined";
      joinStatus.textContent = "You're already a First Timer!";
      return;
    }

    joinButton.disabled = false;

    joinButton.onclick = async function () {
      joinButton.disabled = true;

      try {
        await setDoc(memberRef, {
          userId: user.uid,
          name: user.displayName || "First Timer"
        });

        joinButton.textContent = "Already Joined";
        joinStatus.textContent = "You joined First Timers successfully!";

      } catch (error) {
        console.error("Error joining First Timers:", error);
        joinStatus.textContent = "Could not join. Please try again.";
        joinButton.disabled = false;
      }
    };

  } catch (error) {
    console.error("Error checking membership:", error);
    joinStatus.textContent = "Could not check membership.";
  }
});

await displayFirstTimers();

//---------------------showing users who are joining--------------------------------
async function displayFirstTimers() {
  if (!activityId) return;

  try {
    const membersRef = collection(
      db,
      "activities",
      activityId,
      "firstTimers"
    );

    const snapshot = await getDocs(membersRef);

    document.getElementById("firstTimersCount").textContent =
      `${snapshot.size} people have joined First Timers!`;

    const list = document.getElementById("firstTimersList");
    list.innerHTML = "";

    snapshot.forEach(function (memberDoc) {
      const member = memberDoc.data();

      const col = document.createElement("div");
      col.className = "col";

      const avatar = document.createElement("i");
      avatar.className = "bi bi-person-circle text-secondary";
      avatar.style.fontSize = "65px";
      avatar.title = member.name || "First Timer";

      col.appendChild(avatar);
      list.appendChild(col);
    });

  } catch (error) {
    console.error("Error loading First Timers:", error);
  }
}

displayFirstTimers();
