import { db } from "./firebaseConfig.js";
import { onAuthReady } from "./authentication.js";
import {
    doc,
    getDoc,
    getDocs,
    setDoc,
    arrayUnion,
    arrayRemove,
    collection,
    addDoc,
    serverTimestamp,
    deleteDoc
} from "firebase/firestore";
import { expectations, defaultExpectations } from "./expectationsData.js";

// Get the activity ID from the URL
const params = new URL(window.location.href).searchParams;
const activityId = params.get("docID");



// Fetch the activity and display its information
async function displayActivityInfo() {

    const nameElement = document.getElementById("activityName");

    if (!activityId) {
        nameElement.textContent = "No activity selected.";
        return;
    }

    try {
        const activityRef = doc(db, "activities", activityId);
        const activitySnap = await getDoc(activityRef);

        if (!activitySnap.exists()) {
            nameElement.textContent = "Activity not found.";
            return;
        }

        const activity = activitySnap.data();
        // Display session date and time
        document.getElementById("eventDate").textContent =
            activity.eventDate || "Date to be announced";
        document.getElementById("eventTime").textContent =
            activity.eventTime || "Time to be announced";

        // -----------Display activity name
        nameElement.textContent = activity.name;
        // -----------Display activity category
        document.getElementById("activityCategory").textContent =
            activity.category;

        // -----------Display activity description
        document.getElementById("activityDescription").textContent =
            activity.description;


        // -----------Display activity difficulty
        document.getElementById("activityDifficulty").textContent =
            activity.difficulty;
        // ------------Display activity location
        document.getElementById("activityLocation").textContent =
            activity.location;
        // ---------Display activity duration
        document.getElementById("activityDuration").textContent =
            activity.duration ?? "Not specified";

        //----------------- Display activity price-----------
        document.getElementById("activityPrice").textContent =
            activity.price == null
                ? "Not specified"
                : Number(activity.price) === 0
                    ? "Free"
                    : `$${activity.price} CAD`;

        //---------= Display activity image
        const img = document.getElementById("activityImage");

        console.log("Activity image URL:", activity.imageURL);
        img.src = activity.imageURL;
        img.alt = `${activity.name} image`;

    } catch (error) {
        console.error("Error loading activity:", error);
        nameElement.textContent = "Error loading activity.";
    }
}

// Call function when page loads
displayActivityInfo();


//-------------------------------show the what to except part-------------------------------


// Fetch the activity and fill in the "What to expect" page
async function displayExpectations() {

    // Back arrow returns to this activity's details page----------
    try {
        const activityRef = doc(db, "activities", activityId);
        const activitySnap = await getDoc(activityRef);

        if (!activitySnap.exists()) {
            console.error("Activity not found.");
            return;
        }

        const activity = activitySnap.data();
        console.log("Firebase activity name:", activity.name);
        console.log("Custom expectations:", expectations[activity.name]);

        // Use this activity's text, and fill any missing parts with the defaults
        const info = {
            ...defaultExpectations,
            ...expectations[activity.name]
        };
        document.getElementById("doText").textContent = info.whatYoullDo;
        document.getElementById("bringText").textContent = info.whatToBring;
        document.getElementById("requirementsText").textContent = info.requirements;
        document.getElementById("safetyText").textContent = info.safety;
        document.getElementById("prepareText").textContent = info.howToPrepare;


        //-----------------for bullet points on requirement-------------------------------------------


        ["doText", "bringText", "requirementsText", "safetyText", "prepareText"]
            .forEach(function (id) {
                document.getElementById(id).style.whiteSpace = "pre-line";
            });


        //-------------------------------------------------------------------------------

    } catch (error) {
        console.error("Error loading expectations:", error);

    }
}

// Call function when information loads
displayExpectations();


/* ---------------- SAVE TO TRY ---------------- */

const saveButton = document.getElementById("saveToTryBtn");
onAuthReady(async function (user) {
    if (!saveButton) return;

    if (!user) {
        saveButton.disabled = true;
        return;
    }

    if (!activityId) {
        saveButton.disabled = true;
        return;
    }

    const userRef = doc(db, "users", user.uid);

    try {
        // Read the user's saved activities
        const userSnap = await getDoc(userRef);
        let favourites = userSnap.data()?.favourites || [];

        // Display the correct button state
        function updateSaveButton() {
            if (favourites.includes(activityId)) {
                saveButton.innerHTML =
                    '<i class="bi bi-check-lg me-2"></i>Save to My Activities';
            }
            else {
                saveButton.innerHTML =
                    '<i class="bi bi-heart me-2"></i>Save to My Activities';
            }
        }

        updateSaveButton();
        saveButton.disabled = false;

        // Save or unsave when clicked
        saveButton.onclick = async function () {

            saveButton.disabled = true;

            try {
                if (favourites.includes(activityId)) {

                    // Remove from favourites
                    await setDoc(
                        userRef,
                        { favourites: arrayRemove(activityId) },
                        { merge: true }
                    );

                    favourites = favourites.filter(
                        id => id !== activityId
                    );

                } else {

                    // Add to favourites
                    await setDoc(
                        userRef,
                        { favourites: arrayUnion(activityId) },
                        { merge: true }
                    );

                    favourites.push(activityId);
                }

                updateSaveButton();

            } catch (error) {
                console.error("Error saving activity:", error);
                alert("Could not update saved activities.");
            } finally {
                saveButton.disabled = false;
            }
        };

    } catch (error) {
        console.error("Error loading favourites:", error);
        saveButton.disabled = true;
    }
});


//----------------------------- join ------------------------------
const joinButton = document.getElementById("joinFirstTimersBtn");
const joinStatus = document.getElementById("joinStatus");
joinButton.disabled = true;
onAuthReady(async function (user) {
    joinButton.disabled = true;
    joinButton.onclick = null;
    if (!user) {
        joinStatus.textContent = "Please log in to join.";
        return;
    }
    if (!activityId) {
        joinStatus.textContent = "No activity selected.";
        return;
    }
    const memberRef = doc(
        db,
        "activities",
        activityId,
        "firstTimers",
        user.uid
    );

    try {

        const activityRef = doc(db, "activities", activityId);
        const activitySnap = await getDoc(activityRef);

        if (!activitySnap.exists()) {
            joinStatus.textContent = "Activity not found.";
            return;
        }

        const activity = activitySnap.data();

        const memberSnap = await getDoc(memberRef);
        let joined = memberSnap.exists();

        function updateJoinButton() {

            if (joined) {
                joinButton.textContent = "Cancel Participation";
                joinStatus.textContent =
                    "You're in! You have joined this session.";

                joinButton.classList.remove("btn-primary");
                joinButton.classList.add("btn-outline-danger");

            } else {
                joinButton.textContent = "Join This Session";
                joinStatus.textContent = "";

                joinButton.classList.remove("btn-outline-danger");
                joinButton.classList.add("btn-primary");
            }
        }

        updateJoinButton();

        if (!joined && (!activity.eventDate || !activity.eventTime)) {
            joinStatus.textContent = "Session date is not available yet.";
            return;
        }

        joinButton.disabled = false;
        joinButton.onclick = async function () {
            joinButton.disabled = true;

            try {

                if (joined) {
                    const cancel = confirm(
                        "Are you sure you want to cancel?"
                    );
                    if (!cancel) return;
                    await deleteDoc(memberRef);
                    joined = false;
                    updateJoinButton();
                    joinStatus.textContent =
                        "Your participation has been cancelled.";

                } else {

                    if (!activity.eventDate || !activity.eventTime) {
                        joinStatus.textContent =
                            "Session date is not available yet.";
                        return;
                    }
                    await setDoc(memberRef, {
                        userId: user.uid,
                        name: user.displayName || "First Timer",
                        eventDate: activity.eventDate,
                        eventTime: activity.eventTime,
                        joinedAt: serverTimestamp()
                    });
                    joined = true;
                    updateJoinButton();
                    joinStatus.textContent =
                        `You're in! See you on ${activity.eventDate} at ${activity.eventTime}.`;
                }
                await displayFirstTimers();
            } catch (error) {
                console.error("Error updating participation:", error);
                joinStatus.textContent =
                    "Something went wrong. Please try again.";

            } finally {
                joinButton.disabled = false;
            }
        };
    } catch (error) {
        console.error("Error checking membership:", error);
        joinStatus.textContent = "Could not check membership.";
    }
});


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

//---------------------------------------review section-----------------------------


// These are declared at the top so every function below can use them
let currentUser = null;   // who is logged in
let rating = 0;           // 0 = no stars picked yet
let selectedFile = null;  // the ONE picture the user picked (or null)
// i added this function cause it wouldnt let the user write rivew without it 
onAuthReady(function (user) {
    currentUser = user;
});

// Back arrow, X button and "See all reviews" all go back to this activity's reviews
if (activityId) {
    const reviewsLink = `/activity.html?docID=${encodeURIComponent(activityId)}#activityReviews`;

    document.getElementById("closeLink").href = reviewsLink;
    document.getElementById("seeReviewsBtn").href = reviewsLink;
}


// ---- Show which activity this review is for -----


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

// ------------ Star rating ------------------------
const stars = document.querySelectorAll("#starRating i");
function showStars() {              // Fill the first "rating" stars, empty the rest
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

// ----adding Picture------------------------------ 
const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const addPictureContent = document.getElementById("addPictureContent");
const removeImageBtn = document.getElementById("removeImageBtn");

// When a file is chosen, remember it and show a preview in the box
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

//---------------------display riviews-------------------------------------

async function displayReviews() {
    if (!activityId) return;
    const reviewsList = document.getElementById("reviewsList");
    try {
        const reviewsRef = collection(
            db,
            "activities",
            activityId,
            "reviews"
        );
        const snapshot = await getDocs(reviewsRef);
        reviewsList.innerHTML = "";
        if (snapshot.empty) {
            reviewsList.textContent = "No reviews yet. Be the first to share!";
            return;
        }
        snapshot.forEach(function (reviewDoc) {

            const review = reviewDoc.data();
            const card = document.createElement("div");
            card.className = "card border-0 bg-light rounded-4 p-4 mb-3";
            const name = document.createElement("h3");
            name.className = "fs-6 fw-bold";
            name.textContent = review.name || "Anonymous";
            const stars = document.createElement("p");
            stars.className = "mb-2";
            stars.textContent =
                "★".repeat(review.rating) +
                "☆".repeat(5 - review.rating);
            const message = document.createElement("p");
            message.className = "mb-0";
            message.textContent = review.message;
            card.appendChild(name);
            card.appendChild(stars);
            card.appendChild(message);
            if (review.image) {
                const image = document.createElement("img");
                image.src = review.image;
                image.alt = "Review picture";
                image.className = "img-fluid rounded-3 mt-3";
                image.style.width = "100%";
                image.style.height = "250px";
                image.style.objectFit = "cover";

                card.appendChild(image);
            }
            reviewsList.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading reviews:", error);
        reviewsList.textContent = "Could not load reviews.";
    }
}
//--------- Load existing reviews ----------
displayReviews();