# Never Late To Try


## Overview
Our App Idea :
Our app is for people who want to try new activities but do not know where to start, what to expect, or feel nervous trying something for the first time.
The goal is to help people go from:
“I want to try this someday”
to
“I actually tried it.”


How It Connects to “Older and Wiser”
Users learn from people who already tried the activity.
Then, after trying it themselves, they share what they learned with the next beginner.
So the cycle is:
Beginner → Experience → Learn → Share → Help the next beginner


Developed for the COMP 1800 course, this project applies User-Centred Design practices and agile project management, and demonstrates integration with Firebase backend services for storing user favorites.

---



## Features

### Discover Activities
- Browse beginner-friendly activities such as hiking, pottery, climbing, and kayaking.
- Explore activities from different categories.
- View individual activity details.

### What to Expect
- Read beginner-friendly information before trying an activity.
- Learn what to bring, what happens during the activity, and how to prepare.
- Review safety information and participation requirements.

### User Authentication
- Create an account and log in using Firebase Authentication.
- Access personal features through a user account.

### My Activities
- Save activities to try later.
- View saved activities in one place.
- Mark activities as completed.
- Undo a completed activity if needed.
- Store saved and completed activities using Cloud Firestore.

### User Profile
- View and update personal profile information.


---



## Technologies Used

- **Frontend:** HTML, CSS, JavaScript, Bootstrap
- **Build Tool:** Vite
- **Backend Services:** Firebase
- **Authentication:** Firebase Authentication for user login and signup
- **Database:** Cloud Firestore for storing activities, user profiles, favourites, and completed activities
- **Version Control:** Git and GitHub

---


## Images Used

- **Websites** : https://unsplash.com/

---



## Usage

To run the application locally:

1. Clone the repository.
2. Install dependencies by running `npm install` in the project root directory.
3. Set up the required Firebase environment variables using `.env_template`.
4. Start the development server by running `npm run dev`.
5. Open the local address shown in the terminal (usually `http://localhost:5173`).

Once the application is running:

1. Create an account or log in.
2. Browse beginner-friendly activities on the Discover page.
3. Select an activity to view its details.
4. Visit the What to Expect page to learn about preparation, equipment, requirements, and safety.
5. Save activities you are interested in.
6. Open My Activities to view your saved activities.
7. Mark an activity as completed after trying it.
8. View or update your profile.


---



## Project Structure

```text

1800_202630_BBY17/
├── public/
│   └── images/                 # Activity images and website assets
│
├── src/
│   ├── components/
│   │   ├── bottom-navbar.js    # Bottom navigation
│   │   ├── site-footer.js      # Shared footer
│   │   └── site-navbar.js      # Shared navigation bar
│   │
│   ├── styles/
│   │   └── style.css           # Website styling
│   │
│   ├── activitiesData.js       # Activity data
│   ├── activity.js             # Activity details
│   ├── app.js                  # Application logic
│   ├── authentication.js       # Authentication functions
│   ├── expectations.js         # What to Expect page
│   ├── expectationsData.js     # Activity-specific beginner information
│   ├── firebaseConfig.js       # Firebase configuration
│   ├── firstTimers.js          # First-timer information
│   ├── headerAvatar.js         # User avatar
│   ├── loginSignup.js          # Login and signup
│   ├── main.js                 # Main page functionality
│   ├── navbar.js               # Navigation functionality
│   ├── profile.js              # User profile
│   ├── reviews.js              # Reviews
│   ├── savedActivities.js      # Saved and completed activities
│   ├── seedActivities.js       # Activity database setup
│   ├── settings.js             # User settings
│   └── theme.js                # Theme functionality
│
├── activity.html
├── addactivities.html
├── discover.html
├── expectations.html
├── firstTimers.html
├── index.html
├── login.html
├── main.html
├── profile.html
├── reviews.html
├── savedActivities.html
├── settings.html
├── skeleton.html
│
├── .env_template              # Environment variable template
├── .gitignore
├── package.json               # Project dependencies and scripts
├── package-lock.json
└── README.md                  # Project documentation
```
---


## Contributors

Syed Areeb Shariq -- BCIT CST student with a great passion in going into cybersecurity. Fun fact: I love soccer, and Fishing.

Malik M - BCIT CST Student, I'm a cool guy who is funny and extroverted.

Hana - BCIT CST student who enjoys learning programing and building new things. Fun fact : I can spend hours designing something and then change my mind at the last minute.

---


## Acknowledgments

- Trail data and images are for demonstration purposes only.
- Code snippets were adapted from resources such as [Stack Overflow](https://stackoverflow.com/) and [MDN Web Docs](https://developer.mozilla.org/).
- Icons sourced from [FontAwesome](https://fontawesome.com/) and images from [Unsplash](https://unsplash.com/).

---



## Limitations and Future Work

### Limitations
- Activity information is currently limited to the data available in the application.
- What to Expect information provides general beginner guidance and may not reflect every activity provider's exact requirements.
- Activity images are stored locally in the project rather than Firebase Storage.
- Some accessibility features could be improved.

### Future Work
- Add more activities and categories.
- Improve search and filtering options.
- Integrate maps and directions for activity locations.
- Add more detailed activity provider information.
- Explore Firebase Storage for managing images.


---


