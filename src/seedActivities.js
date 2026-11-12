// import { db } from "./firebaseConfig.js";
// import { doc, getDoc } from "firebase/firestore";

// // Declare variable: the hike ID from the URL (eachHike.html?docID=abc123)
// const params = new URL(window.location.href).searchParams;
// const hikeId = params.get("docID");

// // Fetch the hike and display its name and image
// async function displayHikeInfo() {
//     try {
//         const hikeRef = doc(db, "hikes", hikeId);
//         const hikeSnap = await getDoc(hikeRef);

//         const hike = hikeSnap.data();
//         const name = hike.name;
//         const code = hike.code;

//         // Update the page
//         document.getElementById("hikeName").textContent = name;
//         const img = document.getElementById("hikeImage");
//         img.src = `./images/${code}.jpg`;
//         img.alt = `${name} image`;
//     } catch (error) {
//         console.error("Error loading hike:", error);
//         document.getElementById("hikeName").textContent = "Error loading hike.";
//     }
// }

// displayHikeInfo();



import { db } from "./firebaseConfig.js";
import { activities } from "./activitiesData.js";

import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    serverTimestamp
} from "firebase/firestore";


// Add sample activities to Firestore

//-------------------THIS FUNCTION IS NOT NEEDED NOW---------------

// async function addActivityData() {
//     const activitiesRef = collection(db, "activities");

//     console.log("Adding sample activity data...");

//     for (const activity of activities) {
//         await addDoc(activitiesRef, {
//             ...activity,
//             last_updated: serverTimestamp()
//         });

//         console.log("Added:", activity.name);
//     }
// }

//------------------------------------------------------------------



async function seedActivities() {
    const activitiesRef = collection(db, "activities");

    try {
        const querySnapshot = await getDocs(activitiesRef);

        // Get the names of activities already in Firestore
        const existingNames = [];

        querySnapshot.forEach((docSnap) => {
            existingNames.push(docSnap.data().name);
        });

        // Add only missing activities
        for (const activity of activities) {

            if (!existingNames.includes(activity.name)) {

                await addDoc(activitiesRef, {
                    ...activity,
                    last_updated: serverTimestamp()
                });

                console.log("Added:", activity.name);

            } else {
                console.log("Already exists:", activity.name);
            }
        }

        console.log("Finished checking activities!");

    } catch (error) {
        console.error("Error seeding activities:", error);
    }
}

//seedActivities();
// seedActivities();
updateActivityDetails();

async function updateActivityDetails() {
    const activitiesRef = collection(db, "activities");

    try {
        const querySnapshot = await getDocs(activitiesRef);

        for (const docSnap of querySnapshot.docs) {
            const existingActivity = docSnap.data();

            const matchingActivity = activities.find(
                activity => activity.name === existingActivity.name
            );

            if (matchingActivity) {
                await updateDoc(docSnap.ref, {
                    price: matchingActivity.price,
                    duration: matchingActivity.duration
                });

                console.log("Updated:", existingActivity.name);
            }
        }

        console.log("Finished updating activities!");

    } catch (error) {
        console.error("Error updating activities:", error);
    }
}
