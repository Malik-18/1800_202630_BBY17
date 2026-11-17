import { db } from "./firebaseConfig.js";
import { onAuthReady } from "./authentication.js";
import {
    doc,
    getDoc,
    collection,
    addDoc,
    serverTimestamp
} from "firebase/firestore";

// Get the activity ID from the URL (shareExperience.html?docID=abc123)
const params = new URL(window.location.href).searchParams;
const activityId = params.get("docID");

// These are declared at the top so every function below can use them
let currentUser = null;   // who is logged in
let rating = 0;           // 0 = no stars picked yet
let selectedFile = null;  // the ONE picture the user picked (or null)

// Back arrow, X button and "See all reviews" all go back to this activity's reviews
if (activityId) {
    const reviewsLink = `/reviews.html?docID=${encodeURIComponent(activityId)}`;
    document.getElementById("backLink").href = reviewsLink;
    document.getElementById("closeLink").href = reviewsLink;
    document.getElementById("seeReviewsBtn").href = reviewsLink;
}

// ---- Auth guard: only logged-in users can share an experience ----
onAuthReady(function (user) {
    if (!user) {
        location.href = "index.html";   // Not logged in → go away
        return;
    }
    currentUser = user;                 // Logged in → remember them
});

// ---- Show which activity this review is for ----
async function displayActivityName() {
    const nameElement = document.getElementById("activityName");

    if (!activityId) {
        nameElement.textContent = "No activity selected.";
        return;
    }

    try {
        const activitySnap = await getDoc(doc(db, "activities", activityId));
        nameElement.textContent = activitySnap.exists()
            ? activitySnap.data().name
            : "Activity not found.";
    } catch (error) {
        console.error("Error loading activity:", error);
        nameElement.textContent = "Error loading activity.";
    }
}
displayActivityName();

// ---- Star rating ----
const stars = document.querySelectorAll("#starRating i");

// Fill the first "rating" stars, empty the rest
function showStars() {
    stars.forEach(function (star, index) {
        if (index < rating) {
            star.className = "bi bi-star-fill fs-1";
        } else {
            star.className = "bi bi-star fs-1";
        }
    });
}

stars.forEach(function (star, index) {
    star.addEventListener("click", function () {
        rating = index + 1;   // 1st star = 1, 5th star = 5
        showStars();
    });
});

// ---- Picture (maximum one) ----
const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const addPictureContent = document.getElementById("addPictureContent");
const removeImageBtn = document.getElementById("removeImageBtn");

// When a file is chosen: remember it and show a preview in the box
function choosePicture(event) {
    const file = event.target.files[0];
    if (!file) return;

    selectedFile = file;
    previewImage.src = URL.createObjectURL(file);   // temporary preview link
    previewImage.classList.remove("d-none");
    addPictureContent.classList.add("d-none");
    removeImageBtn.classList.remove("d-none");
}

// Go back to the empty "Add your picture" box
function removePicture() {
    selectedFile = null;
    imageInput.value = "";
    previewImage.classList.add("d-none");
    addPictureContent.classList.remove("d-none");
    removeImageBtn.classList.add("d-none");
}

imageInput.addEventListener("change", choosePicture);
removeImageBtn.addEventListener("click", removePicture);

// Shrink a photo so its longest side is at most maxSize px,
// then return it as a base64 text string ("data:image/jpeg;base64,....")
// (same idea as profile.js, so the review fits easily inside a Firestore document)
function resizeImage(file, maxSize = 600) {
    return new Promise(function (resolve, reject) {
        const img = new Image();
        img.onload = function () {
            const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
            const canvas = document.createElement("canvas");
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
}

// ---- (1) What to do when the form is submitted ----
async function saveReview(event) {
    event.preventDefault();   // Stop the browser from reloading the page

    const alertBox = document.getElementById("formAlert");
    const submitBtn = document.getElementById("submitBtn");
    alertBox.classList.add("d-none");

    const message = document.getElementById("reviewText").value.trim();

    // Check the form before saving
    if (!currentUser || !activityId) {
        alertBox.textContent = "Please log in and choose an activity first.";
        alertBox.classList.remove("d-none");
        return;
    }
    if (rating === 0) {
        alertBox.textContent = "Please pick a star rating.";
        alertBox.classList.remove("d-none");
        return;
    }
    if (!message) {
        alertBox.textContent = "Please write a few words about your experience.";
        alertBox.classList.remove("d-none");
        return;
    }

    submitBtn.disabled = true;   // stops double-clicks

    try {
        // Shrink the picture (if there is one) and turn it into text
        let image = "";
        if (selectedFile) {
            image = await resizeImage(selectedFile);
        }

        // Collect everything into ONE object (this becomes the Firestore document)
        const newReview = {
            userId: currentUser.uid,                             // WHO wrote it
            name: currentUser.displayName || currentUser.email,
            rating: rating,
            message: message,
            image: image,                                        // "" if no picture
            timestamp: serverTimestamp()                         // WHEN
        };

        // Save it in this activity's "reviews" subcollection
        await addDoc(
            collection(db, "activities", activityId, "reviews"),
            newReview
        );

        // Swap the form for the thank-you screen
        document.getElementById("formSection").classList.add("d-none");
        document.getElementById("thanksSection").classList.remove("d-none");

    } catch (error) {
        alert(`Error saving review:\n${error.code || ""}\n${error.message || error}`);
        submitBtn.disabled = false;
    }
}

// ---- (2) Connect it: "form, when you are submitted, run saveReview" ----
document.getElementById("reviewForm").addEventListener("submit", saveReview);