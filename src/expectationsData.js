
const bullets = (...items) => items.map(item => `• ${item}`).join("\n");

// Fallback text for any missing activity information
export const defaultExpectations = {
    whatYoullDo: `Your experience will depend on the activity and provider.

Before booking, ask:
${bullets(
        "What happens during the session?",
        "Is it suitable for complete beginners?",
        "Will an instructor guide you?",
        "Can you take breaks or stop if needed?"
    )}`,

    whatToBring: `Check the booking confirmation for the exact packing list.

Useful basics:
${bullets(
        "Comfortable, activity-appropriate clothing",
        "Water and any personal essentials",
        "Required identification or booking confirmation",
        "Any equipment the provider asks you to bring"
    )}`,

    requirements: `Requirements vary by provider.

Confirm:
${bullets(
        "Minimum age and experience requirements",
        "Any licences or identification needed",
        "Physical accessibility and participation requirements",
        "Cancellation and rescheduling policies"
    )}`,

    safety: `Ask the provider about safety instructions, supervision, equipment, and emergency procedures.

Tell the instructor about any concerns that may affect your participation. You can ask questions before starting.`,

    howToPrepare: `Before your session:
${bullets(
        "Read the booking confirmation carefully",
        "Check the location, arrival time, and weather policy",
        "Confirm what equipment is included",
        "Contact the provider about anything you are unsure of"
    )}`
};

// Keys must exactly match activity names in Firestore
export const expectations = {

    "Beginner Hiking": {
        whatYoullDo: `A beginner hike usually starts with a meeting point and a short route introduction.

You can expect to:
${bullets(
            "Meet your guide or group, if the hike is organized",
            "Learn about the trail, distance, and expected pace",
            "Walk on natural surfaces that may be uneven or slippery",
            "Take breaks for water, rest, and enjoying the scenery",
            "Return to the agreed finishing point"
        )}

Ask about the total distance, elevation gain, and estimated walking time. A trail described as beginner-friendly can still include hills, roots, and rocks.`,

        whatToBring: `Recommended essentials:
${bullets(
            "Comfortable hiking shoes with good grip",
            "Water and snacks",
            "A waterproof jacket and warm layers",
            "Sunscreen and weather-appropriate protection",
            "A charged phone"
        )}

Ask whether hiking poles or other equipment are recommended.`,

        requirements: `Previous hiking experience is usually not necessary for an introductory hike.

Before booking, confirm:
${bullets(
            "Trail distance and elevation gain",
            "Whether the route has steep or uneven sections",
            "Expected fitness level and walking pace",
            "Transportation and parking arrangements",
            "Whether the hike is guided or self-guided"
        )}`,

        safety: `Outdoor conditions can change quickly.

${bullets(
            "Check the weather and trail conditions before leaving",
            "Stay on marked trails",
            "Keep a comfortable pace and communicate when you need a break",
            "Avoid approaching or feeding wildlife",
            "Tell someone your route and expected return time"
        )}

For an unguided hike, carry suitable navigation and emergency supplies. Do not rely only on mobile reception.`,

        howToPrepare: `Before the hike:
${bullets(
            "Check the exact trailhead location",
            "Review the distance, elevation, and expected duration",
            "Check weather alerts and trail closures",
            "Wear your hiking shoes beforehand to check their comfort",
            "Eat beforehand and allow enough travel time"
        )}

If you are nervous about your fitness, ask whether the group can accommodate a slower pace.`
    },

    "Kayaking": {
        whatYoullDo: `A beginner session commonly starts on land with equipment fitting and safety instructions.

You may:
${bullets(
            "Learn how to hold and use a paddle",
            "Practise getting into and out of the kayak",
            "Learn basic forward paddling, turning, and stopping",
            "Paddle in a supervised area suited to the session",
            "Learn what to do if the kayak tips over"
        )}

Ask whether the session uses single or tandem kayaks and whether you will practise a capsize or rescue.`,

        whatToBring: `Bring:
${bullets(
            "Quick-drying clothing suitable for the weather and water temperature",
            "Secure footwear that can get wet",
            "A towel and dry clothes for afterward",
            "Water and sun protection",
            "A waterproof bag for essentials, if permitted"
        )}

Confirm whether the kayak, paddle, and properly fitted personal flotation device are included.`,

        requirements: `Before booking, confirm:
${bullets(
            "Minimum age and any swimming requirements",
            "Whether beginners are welcome",
            "Whether the activity takes place on a lake, river, or ocean",
            "Expected paddling distance and duration",
            "Whether participants must be comfortable in the water"
        )}

Ask about accessibility or support needs in advance.`,

        safety: `Water activities carry risks, including cold-water exposure and capsizing.

${bullets(
            "Wear the required, properly fitted flotation device",
            "Follow the instructor's launch and landing directions",
            "Stay within the designated paddling area",
            "Keep a safe distance from boats and obstacles",
            "Tell the instructor immediately if you feel tired or uncomfortable"
        )}

Ask how rescues are handled and what happens if weather or water conditions change.`,

        howToPrepare: `Before arriving:
${bullets(
            "Check the launch location and meeting instructions",
            "Review the weather and cancellation policy",
            "Confirm what equipment and clothing are provided",
            "Leave valuables somewhere safe",
            "Arrive early enough for equipment fitting"
        )}

Let the instructor know if this is your first time on the water.`
    },

    "Camping": {
        whatYoullDo: `A beginner camping experience may include an introduction to the campsite and basic outdoor routines.

Depending on the program, you may:
${bullets(
            "Learn how to choose and prepare a tent location",
            "Set up a tent and sleeping area",
            "Prepare simple food using approved equipment",
            "Learn campsite cleanliness and food-storage practices",
            "Spend the evening outdoors and pack up the next day"
        )}

Ask whether the experience includes an overnight stay, shared facilities, and instructor supervision.`,

        whatToBring: `Your packing list may include:
${bullets(
            "A tent, sleeping bag, and sleeping pad",
            "Warm layers and waterproof clothing",
            "A headlamp or flashlight",
            "Water, food, and cooking supplies",
            "Personal hygiene items and required medication",
            "Suitable footwear"
        )}

Confirm exactly which items the provider supplies before buying or renting equipment.`,

        requirements: `Check:
${bullets(
            "Whether the campsite is accessible by car or requires hiking",
            "Whether camping equipment is included",
            "Whether bathrooms, drinking water, and showers are available",
            "Whether meals are provided",
            "Age restrictions and overnight supervision arrangements"
        )}`,

        safety: `Camping introduces outdoor risks that may be unfamiliar to beginners.

${bullets(
            "Follow local fire restrictions and campsite rules",
            "Store food according to local wildlife guidance",
            "Keep cooking equipment away from tents",
            "Prepare for colder nighttime temperatures",
            "Know where emergency assistance is available"
        )}

Never use fuel-burning stoves, heaters, or grills inside a tent because of fire and carbon monoxide risks.`,

        howToPrepare: `Before departure:
${bullets(
            "Check the weather forecast, including nighttime temperatures",
            "Confirm the campsite address and arrival time",
            "Practise setting up your tent if bringing your own",
            "Check equipment, batteries, and food supplies",
            "Review campsite rules and emergency contacts"
        )}

Ask the provider what happens if severe weather makes camping unsafe.`
    },

    "Motorcycle Training": {
        whatYoullDo: `A beginner lesson typically starts with an introduction to the motorcycle and protective equipment.

You may:
${bullets(
            "Learn the throttle, brakes, clutch, and other controls",
            "Practise mounting, balancing, and moving the motorcycle",
            "Learn controlled starting and stopping",
            "Practise slow turns and basic manoeuvres",
            "Receive feedback from an instructor"
        )}

Ask whether the lesson takes place entirely in a training area or includes public-road riding. You should not be expected to perform advanced manoeuvres immediately.`,

        whatToBring: `Recommended clothing and essentials:
${bullets(
            "Long pants and a suitable long-sleeved jacket",
            "Sturdy, over-the-ankle footwear appropriate for riding",
            "Protective gloves",
            "Water and required identification",
            "Any licence or permit requested by the provider"
        )}

Confirm whether a certified helmet, motorcycle, and protective equipment are supplied. Do not assume equipment rental is included.`,

        requirements: `Before booking, confirm:
${bullets(
            "Minimum age",
            "Driver's or motorcycle learner's licence requirements",
            "Whether previous riding experience is necessary",
            "Any physical participation requirements",
            "Whether registration forms or waivers are required"
        )}

Requirements depend on the course and whether riding occurs on private property or public roads.`,

        safety: `Motorcycle training involves a risk of falls and injuries, even in controlled areas.

${bullets(
            "Wear the required protective equipment",
            "Follow the instructor's directions before moving",
            "Practise at a speed appropriate for your skill level",
            "Stop and ask for help if you are confused or uncomfortable",
            "Report any equipment problem immediately"
        )}

Ask about instructor supervision, beginner motorcycle sizes, and the procedure for handling falls.`,

        howToPrepare: `Before the session:
${bullets(
            "Confirm the meeting point and arrival time",
            "Check licence and identification requirements",
            "Confirm what protective gear is included",
            "Review the weather and cancellation policy",
            "Arrive rested and allow time for registration"
        )}

Tell the instructor if you have never ridden a motorcycle before.`
    },

    "Rock Climbing": {
        whatYoullDo: `An introductory indoor climbing session usually begins with equipment fitting and a safety briefing.

You may:
${bullets(
            "Learn how climbing holds and routes work",
            "Put on a harness, if required",
            "Learn basic climbing movements and foot placement",
            "Try beginner-level routes with supervision",
            "Practise safe communication with staff or a belayer"
        )}

Ask whether the session includes top-rope climbing, bouldering, or both. These activities use different safety systems.`,

        whatToBring: `Bring:
${bullets(
            "Comfortable, flexible athletic clothing",
            "Water",
            "Climbing shoes if you own them",
            "A hair tie if needed"
        )}

Ask whether climbing shoes, harnesses, and other required equipment are included or available to rent.`,

        requirements: `Confirm:
${bullets(
            "Minimum age and supervision requirements",
            "Whether previous climbing experience is needed",
            "Whether a waiver is required",
            "Whether equipment rental is included",
            "Whether the session includes belaying instruction or testing"
        )}

Tell the provider about accessibility needs before booking.`,

        safety: `Climbing involves a risk of falls and injury.

${bullets(
            "Follow staff instructions and equipment checks",
            "Use the correct safety system for the climbing style",
            "Never operate ropes or belay equipment without proper training",
            "Keep landing areas clear",
            "Tell staff if equipment feels loose or uncomfortable"
        )}

Ask how the facility supervises beginners and what safety checks happen before climbing.`,

        howToPrepare: `Before visiting:
${bullets(
            "Check the gym location and check-in process",
            "Confirm rental equipment and costs",
            "Wear comfortable clothes that allow movement",
            "Remove jewellery that could catch on equipment",
            "Arrive early for orientation and fitting"
        )}

It is normal to begin on low or easy routes and progress gradually.`
    },

    "Tennis": {
        whatYoullDo: `A beginner tennis lesson commonly starts with a warm-up and an introduction to the court.

You may:
${bullets(
            "Learn how to hold the racket",
            "Practise forehand and backhand strokes",
            "Learn basic footwork and positioning",
            "Try short rallies with an instructor or partner",
            "Learn basic scoring and court rules"
        )}

You do not need to be able to play a full match during your first lesson.`,

        whatToBring: `Bring:
${bullets(
            "Comfortable athletic clothing",
            "Court-appropriate athletic shoes",
            "Water and a towel",
            "A tennis racket if required",
            "Sun protection for outdoor lessons"
        )}

Ask whether rackets and tennis balls are supplied.`,

        requirements: `Before booking, check:
${bullets(
            "Whether the lesson is for complete beginners",
            "Whether it is private or group instruction",
            "Whether a racket is provided",
            "The court surface and indoor or outdoor location",
            "Any minimum age or fitness requirements"
        )}`,

        safety: `Tennis involves repeated movement and changes of direction.

${bullets(
            "Warm up before playing",
            "Wear shoes suitable for the court surface",
            "Keep enough distance from other players",
            "Take breaks and drink water",
            "Stop if you feel pain or dizziness"
        )}

Tell your instructor if you need a slower pace.`,

        howToPrepare: `Before the lesson:
${bullets(
            "Confirm the court number and meeting location",
            "Check the weather policy for outdoor courts",
            "Find out whether equipment is provided",
            "Arrive early enough to warm up",
            "Wear clothing that allows easy movement"
        )}

Expect to make mistakes; beginner lessons focus on learning basic movements.`
    },

    "Pottery Class": {
        whatYoullDo: `A beginner pottery class introduces you to working with clay.

Depending on the class, you may:
${bullets(
            "Learn how to prepare and shape clay",
            "Practise hand-building or using a pottery wheel",
            "Create a small bowl, cup, or decorative piece",
            "Learn how tools and studio equipment are used",
            "Leave your work for drying and firing, if offered"
        )}

Ask whether you will take your piece home the same day. Many ceramic pieces require drying, firing, and sometimes a return visit.`,

        whatToBring: `Recommended:
${bullets(
            "Comfortable clothes that can get messy",
            "Closed-toe shoes",
            "Short fingernails for easier clay handling",
            "A hair tie if needed",
            "A bag for personal belongings"
        )}

Confirm whether clay, tools, aprons, glazing, and firing are included.`,

        requirements: `Check:
${bullets(
            "Whether the class uses a wheel or hand-building techniques",
            "Minimum age",
            "Whether materials and firing are included in the price",
            "When finished pieces can be collected",
            "Whether the studio can accommodate accessibility needs"
        )}`,

        safety: `Pottery studios have equipment and materials that require care.

${bullets(
            "Follow instructions for wheels and tools",
            "Avoid breathing clay dust",
            "Clean clay using the studio's recommended wet-cleaning methods",
            "Keep hands away from moving equipment when instructed",
            "Wash your hands after working"
        )}

Only staff should handle kilns unless you have been trained and authorized.`,

        howToPrepare: `Before class:
${bullets(
            "Confirm whether you are using a wheel or hand-building",
            "Check what materials are included",
            "Wear clothes you do not mind getting dirty",
            "Ask about firing time and pickup arrangements",
            "Arrive early enough for studio orientation"
        )}

Your first piece does not need to be perfect; learning the process is the goal.`
    },

    "Painting": {
        whatYoullDo: `A beginner painting session usually introduces basic materials and techniques.

You may:
${bullets(
            "Choose or receive a reference image",
            "Learn basic brush handling and colour mixing",
            "Prepare a canvas or painting surface",
            "Build your painting in simple stages",
            "Add details and review your finished work"
        )}

Ask whether the session is guided step by step or allows independent painting.`,

        whatToBring: `Recommended:
${bullets(
            "Old clothes or an apron",
            "A water bottle",
            "A way to transport your painting if it is still wet",
            "Any reference image requested by the instructor"
        )}

Confirm whether paint, brushes, canvas, and other materials are included.`,

        requirements: `Before booking, check:
${bullets(
            "Whether beginners are welcome",
            "What type of paint will be used",
            "Whether materials are included",
            "Whether the painting can be taken home immediately",
            "Any minimum age or studio requirements"
        )}`,

        safety: `Different art materials have different handling requirements.

${bullets(
            "Follow instructions for paints and cleaning products",
            "Avoid eating or drinking near art materials",
            "Use appropriate ventilation when required",
            "Clean spills promptly",
            "Tell the instructor about relevant sensitivities"
        )}

Ask about the materials used if you have concerns about fumes or skin contact.`,

        howToPrepare: `Before class:
${bullets(
            "Check the studio address and arrival instructions",
            "Wear clothes suitable for painting",
            "Confirm whether supplies are provided",
            "Ask how to transport wet artwork",
            "Arrive with enough time to settle in"
        )}

You do not need drawing or painting experience to attend a true beginner class.`
    },

    "Photography": {
        whatYoullDo: `An introductory photography workshop usually begins with basic camera concepts.

You may:
${bullets(
            "Learn about framing and composition",
            "Explore lighting and camera angles",
            "Practise focusing and taking clear photographs",
            "Try simple photography exercises",
            "Review your photos and receive feedback"
        )}

Ask whether the workshop focuses on smartphones, digital cameras, or a specific photography style.`,

        whatToBring: `Bring:
${bullets(
            "A smartphone or camera accepted by the workshop",
            "A fully charged battery",
            "Available storage space or a memory card",
            "Comfortable shoes if the workshop includes walking",
            "Weather protection for outdoor sessions"
        )}

Ask whether tripods or additional equipment are required.`,

        requirements: `Confirm:
${bullets(
            "Whether a smartphone is sufficient",
            "Whether a camera is supplied",
            "Whether you need to install an app beforehand",
            "Whether the workshop is indoors or outdoors",
            "Whether any previous photography knowledge is expected"
        )}`,

        safety: `Photography can distract you from your surroundings.

${bullets(
            "Watch for traffic, uneven ground, and obstacles",
            "Avoid unsafe positions when trying to capture a photo",
            "Protect equipment from water and weather",
            "Respect private property and people's privacy",
            "Follow the instructor's location rules"
        )}`,

        howToPrepare: `Before attending:
${bullets(
            "Charge your camera or phone",
            "Free up storage space",
            "Check the meeting location",
            "Confirm which equipment is required",
            "Review the weather if the workshop is outdoors"
        )}

You do not need an expensive camera to learn basic photography principles.`
    },

    "Beginner Yoga": {
        whatYoullDo: `A beginner yoga class usually includes gentle movement, breathing, and relaxation.

You may:
${bullets(
            "Begin with breathing or a short introduction",
            "Learn basic standing and seated poses",
            "Practise gentle stretching and balance",
            "Use modifications for difficult positions",
            "Finish with a short relaxation period"
        )}

Ask about the yoga style and pace. Not all classes labelled beginner have the same intensity.`,

        whatToBring: `Bring:
${bullets(
            "Comfortable, stretchy clothing",
            "A yoga mat if one is not provided",
            "Water",
            "A small towel if needed"
        )}

Ask whether blocks, straps, and other props are available.`,

        requirements: `Before booking, confirm:
${bullets(
            "Whether the class is suitable for complete beginners",
            "The yoga style and expected intensity",
            "Whether a mat is provided",
            "Whether poses can be modified",
            "Whether you should discuss injuries or mobility needs with the instructor"
        )}`,

        safety: `Yoga should not require you to push through pain.

${bullets(
            "Move within a comfortable range",
            "Avoid forcing stretches",
            "Use modifications or props when needed",
            "Take breaks whenever necessary",
            "Tell the instructor about relevant limitations"
        )}

Stop a movement if it causes pain, dizziness, or unusual discomfort.`,

        howToPrepare: `Before class:
${bullets(
            "Check the class style and room location",
            "Wear comfortable clothing",
            "Confirm whether a mat is available",
            "Arrive early enough to choose a space",
            "Tell the instructor if this is your first class"
        )}

You can rest during the session; you do not have to perform every pose.`
    },

    "Meditation": {
        whatYoullDo: `A beginner meditation session usually introduces simple attention and breathing exercises.

You may:
${bullets(
            "Learn how to sit or rest comfortably",
            "Practise noticing your breathing",
            "Listen to guided instructions",
            "Gently return your attention when your mind wanders",
            "Finish with a quiet reflection or discussion"
        )}

You do not need to stop all thoughts. Mind wandering is normal.`,

        whatToBring: `Recommended:
${bullets(
            "Comfortable clothing",
            "Water",
            "A cushion or mat if the provider does not supply one",
            "An extra layer if the room is cool"
        )}

Ask whether chairs are available if sitting on the floor is uncomfortable.`,

        requirements: `Before booking, confirm:
${bullets(
            "Whether the session is guided",
            "How long the meditation periods last",
            "Whether sitting, lying down, or using a chair is allowed",
            "Whether participation in group discussion is optional",
            "Whether the session includes any additional practices"
        )}`,

        safety: `Meditation is usually gentle, but some people may experience discomfort or difficult emotions.

${bullets(
            "Choose a comfortable position",
            "Open your eyes or move if needed",
            "Take a break if you feel overwhelmed",
            "Tell the facilitator if an exercise feels uncomfortable",
            "Do not force yourself to continue a practice that causes distress"
        )}`,

        howToPrepare: `Before attending:
${bullets(
            "Check whether the session is in person or online",
            "Choose comfortable clothing",
            "Arrive early enough to settle in",
            "Silence your phone",
            "Ask about seating options if needed"
        )}

There is no requirement to feel calm immediately or meditate perfectly.`
    },

    "Pilates": {
        whatYoullDo: `A beginner Pilates class focuses on controlled movement, breathing, and body awareness.

You may:
${bullets(
            "Learn basic posture and breathing techniques",
            "Practise controlled core exercises",
            "Work on balance and flexibility",
            "Use easier versions of challenging movements",
            "Finish with gentle stretching"
        )}

Ask whether the class is mat Pilates or reformer Pilates. Equipment and exercises differ.`,

        whatToBring: `Bring:
${bullets(
            "Comfortable, fitted workout clothing",
            "Water",
            "Grip socks if required",
            "A mat if the studio asks you to bring one"
        )}

Confirm whether equipment is included.`,

        requirements: `Before booking, check:
${bullets(
            "Whether the class is mat or reformer Pilates",
            "Whether it is designed for complete beginners",
            "Whether grip socks are mandatory",
            "Whether equipment is included",
            "Whether the instructor can offer modifications"
        )}`,

        safety: `Pilates emphasizes controlled movement rather than speed.

${bullets(
            "Follow the instructor's setup directions",
            "Avoid forcing movements",
            "Use modifications when necessary",
            "Tell the instructor about relevant injuries or limitations",
            "Stop if you experience pain or dizziness"
        )}

Do not adjust reformer equipment without guidance.`,

        howToPrepare: `Before class:
${bullets(
            "Confirm the class type",
            "Check whether socks or a mat are required",
            "Arrive early for equipment orientation",
            "Wear clothes that allow comfortable movement",
            "Tell the instructor you are new to Pilates"
        )}

It is normal to need extra time to learn the movements.`
    },

    "Korean BBQ Experience": {
        whatYoullDo: `Korean BBQ is a shared dining experience where food is often cooked at a grill built into the table.

You may:
${bullets(
            "Choose meats, vegetables, and other dishes",
            "Receive small side dishes called banchan",
            "Cook ingredients at the table or have staff assist",
            "Try different sauces and combinations",
            "Share food and enjoy the meal at your own pace"
        )}

Ask whether the restaurant is all-you-can-eat or à la carte and whether staff help with grilling.`,

        whatToBring: `Usually, no special equipment is needed.

Consider:
${bullets(
            "Clothing comfortable for dining near a warm grill",
            "Payment and reservation details",
            "Information about food allergies or dietary restrictions",
            "A willingness to ask staff about unfamiliar dishes"
        )}

Some clothing may retain cooking smells after the meal.`,

        requirements: `Before booking, confirm:
${bullets(
            "Whether reservations are required",
            "Whether there is a minimum party size",
            "Whether pricing is per person or per dish",
            "Any time limits or leftover-food charges",
            "Whether vegetarian or allergy-sensitive options are available"
        )}

Cross-contact may occur on shared grills, so discuss serious allergies directly with the restaurant.`,

        safety: `Tabletop grills and cooking utensils can become very hot.

${bullets(
            "Keep hands and belongings away from the grill",
            "Use separate utensils for raw and cooked foods",
            "Follow staff guidance on cooking times",
            "Ask staff for help if you are unsure whether food is fully cooked",
            "Report burns, spills, or equipment concerns immediately"
        )}`,

        howToPrepare: `Before visiting:
${bullets(
            "Check the menu and pricing style",
            "Make a reservation if needed",
            "Review allergy and dietary options",
            "Check whether the restaurant has time limits",
            "Ask staff to explain the grilling process if it is your first visit"
        )}

You do not need previous Korean BBQ experience to enjoy the meal.`
    },

    "Mocktail Mixology Challenge": {
        whatYoullDo: `A mocktail workshop introduces drink-making techniques using non-alcoholic ingredients.

You may:
${bullets(
            "Learn about ingredients and flavour combinations",
            "Practise measuring and mixing",
            "Use a shaker or stirring tools",
            "Prepare and garnish your own mocktail",
            "Taste and compare different recipes"
        )}

Ask whether the workshop is guided, competitive, or a relaxed group activity.`,

        whatToBring: `Usually, the host supplies the equipment and ingredients.

Consider bringing:
${bullets(
            "Comfortable clothing",
            "A hair tie if needed",
            "Information about allergies or dietary restrictions",
            "Your booking confirmation"
        )}

Confirm whether all ingredients and equipment are included.`,

        requirements: `Before booking, check:
${bullets(
            "Minimum age, if any",
            "Whether the workshop is fully alcohol-free",
            "Whether ingredients contain common allergens",
            "Whether low-sugar or caffeine-free options are available",
            "Whether participants work individually or in teams"
        )}`,

        safety: `Mixology workshops involve glassware, tools, and food ingredients.

${bullets(
            "Handle glassware carefully",
            "Follow instructions for cutting tools",
            "Clean spills promptly",
            "Tell the host about allergies before tasting",
            "Ask before consuming unfamiliar ingredients"
        )}`,

        howToPrepare: `Before attending:
${bullets(
            "Confirm the venue and start time",
            "Review the workshop description",
            "Tell the host about dietary restrictions",
            "Check whether ingredients and tools are included",
            "Arrive early enough for the introduction"
        )}

You do not need previous bartending or drink-making experience.`
    },

    "Barista workshops": {
        whatYoullDo: `A beginner barista workshop introduces coffee preparation and café equipment.

You may:
${bullets(
            "Learn about coffee beans and grinding",
            "Watch how an espresso machine works",
            "Practise preparing espresso",
            "Learn basic milk steaming or alternative techniques",
            "Make drinks such as lattes or cappuccinos"
        )}

Ask whether each participant gets hands-on practice or mainly watches demonstrations.`,

        whatToBring: `Recommended:
${bullets(
            "Comfortable clothing",
            "Closed-toe shoes",
            "A hair tie if needed",
            "An apron if requested",
            "Information about allergies or caffeine concerns"
        )}

Confirm whether coffee, milk, equipment, and aprons are provided.`,

        requirements: `Before booking, confirm:
${bullets(
            "Whether the workshop is suitable for beginners",
            "Minimum age, if any",
            "Whether you will operate an espresso machine",
            "Whether dairy-free alternatives are available",
            "Whether tasting coffee is required"
        )}

Ask whether decaffeinated options are available if needed.`,

        safety: `Espresso machines, steam wands, and hot liquids can cause burns.

${bullets(
            "Follow the instructor's machine-handling directions",
            "Keep hands away from steam outlets",
            "Use hot equipment only when instructed",
            "Clean spills to prevent slipping",
            "Tell the instructor about allergies before tasting"
        )}`,

        howToPrepare: `Before the workshop:
${bullets(
            "Check the venue and arrival time",
            "Confirm whether all equipment is provided",
            "Wear practical clothing and closed-toe shoes",
            "Ask about dairy-free or decaf options if needed",
            "Arrive ready to practise and ask questions"
        )}

It is normal for your first espresso or milk foam attempt to be imperfect.`
    }
};
