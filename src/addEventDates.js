import { db } from "./firebaseConfig.js";
import { collection, getDocs, updateDoc } from "firebase/firestore";

async function addEventDates() {

  const snapshot = await getDocs(collection(db, "activities"));

  let day = 5;
  const times = ["10:00 AM", "11:00 AM", "2:00 PM"];
  let index = 0;

  for (const activityDoc of snapshot.docs) {
    const activity = activityDoc.data();
    if (!activity.eventDate || !activity.eventTime) {
      await updateDoc(activityDoc.ref, {
        eventDate: activity.eventDate || `2026-12-${String(day).padStart(2, "0")}`,
        eventTime: activity.eventTime || times[index % times.length]
      });

      console.log("Updated:", activity.name);
    }

    day++;
    index++;
  }

  console.log("All activities updated!");
}

addEventDates();