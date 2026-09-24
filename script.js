// Check if it is a new day
const today = new Date();

const todayKey =
    today.getFullYear() + "-" +
    (today.getMonth() + 1) + "-" +
    today.getDate();

const savedDate = localStorage.getItem("trackingDate");

if (savedDate !== todayKey) {
    localStorage.setItem("trackingDate", todayKey);

    // Reset today's nutrition totals
    localStorage.setItem("totalCalories", 0);
    localStorage.setItem("totalProtein", 0);
    localStorage.setItem("totalWater", 0);

    // Clear yesterday's food list
    localStorage.removeItem("foodList");
}

// Load today's totals
let totalCalories =
    Number(localStorage.getItem("totalCalories")) || 0;

let totalProtein =
    Number(localStorage.getItem("totalProtein")) || 0;

let totalWater =
    Number(localStorage.getItem("totalWater")) || 0;

function addFood() {
    const foodName = document.getElementById("foodName").value;
    const calories = Number(
        document.getElementById("foodCalories").value
    );
    const protein = Number(
        document.getElementById("foodProtein").value
    );

    if (foodName === "" || calories <= 0 || protein < 0) {
        alert("Please enter the food name, calories, and protein.");
        return;
    }

    const foodList = document.getElementById("foodList");

    const foodItem = document.createElement("li");

    foodItem.textContent =
        foodName + " - " +
        calories + " calories - " +
        protein + "g protein ";

    const deleteButton = document.createElement("button");

    deleteButton.textContent = "Delete";

    deleteButton.onclick = function () {
        foodItem.remove();

        totalCalories -= calories;
        totalProtein -= protein;

        localStorage.setItem("totalCalories", totalCalories);
        localStorage.setItem("totalProtein", totalProtein);

        document.getElementById("calorieTotal").textContent =
            totalCalories + " / 2500 kcal";

        document.getElementById("proteinTotal").textContent =
            totalProtein + " / 150 g";

        updateProgressBars();
    };

    foodItem.appendChild(deleteButton);
    foodList.appendChild(foodItem);

    totalCalories += calories;
    totalProtein += protein;

    localStorage.setItem("totalCalories", totalCalories);
    localStorage.setItem("totalProtein", totalProtein);

    document.getElementById("calorieTotal").textContent =
        totalCalories + " / 2500 kcal";

    document.getElementById("proteinTotal").textContent =
        totalProtein + " / 150 g";

    updateProgressBars();

    document.getElementById("foodName").value = "";
    document.getElementById("foodCalories").value = "";
    document.getElementById("foodProtein").value = "";
}


function addWorkout() {
    const workoutName =
        document.getElementById("workoutName").value;

    const workoutWeight =
        Number(document.getElementById("workoutWeight").value);

    const workoutSets =
        Number(document.getElementById("workoutSets").value);

    const workoutReps =
        Number(document.getElementById("workoutReps").value);

    if (
        workoutName === "" ||
        workoutWeight <= 0 ||
        workoutSets <= 0 ||
        workoutReps <= 0
    ) {
        alert("Please enter all workout information.");
        return;
    }

    const workoutList =
        document.getElementById("workoutList");

    const workoutItem =
        document.createElement("li");

    workoutItem.textContent =
        workoutName +
        " - " +
        workoutWeight +
        " lbs × " +
        workoutSets +
        " sets × " +
        workoutReps +
        " reps";

    const deleteButton =
        document.createElement("button");

    deleteButton.textContent = "Delete";

    deleteButton.onclick = function () {
        workoutItem.remove();

        localStorage.setItem(
            "workoutList",
            workoutList.innerHTML
        );
    };

    const editButton = document.createElement("button");
editButton.textContent = "Edit";

editButton.onclick = function () {
    document.getElementById("workoutName").value = workoutName;
    document.getElementById("workoutWeight").value = workoutWeight;
    document.getElementById("workoutSets").value = workoutSets;
    document.getElementById("workoutReps").value = workoutReps;

    editButton.textContent = "Save Edit";

    editButton.onclick = function () {
        const newName =
            document.getElementById("workoutName").value;

        const newWeight =
            Number(document.getElementById("workoutWeight").value);

        const newSets =
            Number(document.getElementById("workoutSets").value);

        const newReps =
            Number(document.getElementById("workoutReps").value);

        if (
            newName === "" ||
            newWeight <= 0 ||
            newSets <= 0 ||
            newReps <= 0
        ) {
            alert("Please enter valid workout information.");
            return;
        }

        workoutItem.firstChild.textContent =
            newName + " - " +
            newWeight + " lbs × " +
            newSets + " sets × " +
            newReps + " reps ";

        editButton.textContent = "Edit";
    };
};

workoutItem.appendChild(editButton);
workoutItem.appendChild(deleteButton);
workoutList.appendChild(workoutItem);



    localStorage.setItem(
        "workoutList",
        workoutList.innerHTML
    );



const today = new Date().toLocaleDateString();

const workoutHistory =
    JSON.parse(localStorage.getItem("workoutHistory")) || [];

workoutHistory.push(
    today + " | " +
    workoutName + " - " +
    workoutWeight + " lbs x " +
    workoutSets + " sets x " +
    workoutReps + " reps"
);

localStorage.setItem(
    "workoutHistory",
    JSON.stringify(workoutHistory)
);

updateWeeklySummary();
updateWorkoutStreak();
updatePersonalRecords();
updateWeeklyWorkoutDashboard();

    document.getElementById("workoutTotal").textContent =
        workoutName +
        " - " +
        workoutWeight +
        " lbs";

    document.getElementById("workoutName").value = "";
    document.getElementById("workoutWeight").value = "";
    document.getElementById("workoutSets").value = "";
    document.getElementById("workoutReps").value = "";
}



window.onload = function () {

const savedWorkouts = localStorage.getItem("workoutList");

const savedPRName = localStorage.getItem("lastPRName");
const savedPRWeight = localStorage.getItem("lastPRWeight");



if (savedWorkouts) {
    document.getElementById("workoutList").innerHTML = savedWorkouts;

    const savedItems =
        document.getElementById("workoutList").getElementsByTagName("li");

    for (let i = 0; i < savedItems.length; i++) {

        const workoutItem = savedItems[i];

        savedItems[i].querySelectorAll("button").forEach(function(button) {
    button.remove();
});

        // Get the workout text before adding buttons
        const workoutText = workoutItem.firstChild.textContent;

        // Edit button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";

        editButton.onclick = function () {

            const match = workoutText.match(
                /^(.+?) - ([0-9.]+) lbs × ([0-9]+) sets × ([0-9]+) reps$/
            );

            if (!match) {
                alert("Could not edit this workout.");
                return;
            }

            const newName = prompt(
                "Exercise name:",
                match[1]
            );

            const newWeight = Number(prompt(
                "Weight (lbs):",
                match[2]
            ));

            const newSets = Number(prompt(
                "Sets:",
                match[3]
            ));

            const newReps = Number(prompt(
                "Reps:",
                match[4]
            ));

            if (
                !newName ||
                newWeight <= 0 ||
                newSets <= 0 ||
                newReps <= 0
            ) {
                alert("Invalid workout information.");
                return;
            }

            const newWorkoutText =
                newName +
                " - " +
                newWeight +
                " lbs × " +
                newSets +
                " sets × " +
                newReps +
                " reps";

            workoutItem.firstChild.textContent = newWorkoutText;

            localStorage.setItem(
                "workoutList",
                document.getElementById("workoutList").innerHTML
            );

            document.getElementById("workoutTotal").textContent =
                newWorkoutText;
        };

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.onclick = function () {
            workoutItem.remove();

            localStorage.setItem(
                "workoutList",
                document.getElementById("workoutList").innerHTML
            );
        };

        workoutItem.appendChild(editButton);
        workoutItem.appendChild(deleteButton);
    }
}

const savedHistory =
    JSON.parse(localStorage.getItem("workoutHistory")) || [];

const historyList = document.getElementById("workoutHistory");

savedHistory.forEach(function (workout) {
    const historyItem = document.createElement("li");

    historyItem.textContent = workout;

    historyList.appendChild(historyItem);
});

    totalCalories = Number(localStorage.getItem("totalCalories")) || 0;
    totalProtein = Number(localStorage.getItem("totalProtein")) || 0;
    totalWater = Number(localStorage.getItem("totalWater")) || 0;

    document.getElementById("calorieTotal").textContent =
        totalCalories + " / 2500 kcal";

    document.getElementById("proteinTotal").textContent =
        totalProtein + " / 150 g";

       
    document.getElementById("waterTotal").textContent =
        totalWater + " oz";

    // Update workout dashboard
    const workoutItems =
        document.getElementById("workoutList").getElementsByTagName("li");

    if (workoutItems.length > 0) {
        document.getElementById("workoutTotal").textContent =
            workoutItems[workoutItems.length - 1].firstChild.textContent;
    } else {
        document.getElementById("workoutTotal").textContent =
            "Not logged";
    }

    // Update progress bars
    updateProgressBars();

    // Update weekly stats and streak
    updateWeeklySummary();
    updateWorkoutStreak();

    // Refresh workout history
    displayWorkoutHistory();
   
};


function updateProgressBars() {
    const caloriePercent = Math.min((totalCalories / 2500) * 100, 100);
    const proteinPercent = Math.min((totalProtein / 150) * 100, 100);
    const waterPercent = Math.min((totalWater / 128) * 100, 100);

    document.getElementById("calorieProgress").style.width =
        caloriePercent + "%";

    document.getElementById("proteinProgress").style.width =
        proteinPercent + "%";

    document.getElementById("waterProgress").style.width =
        waterPercent + "%";

        updateProgressColors();
}


function updateProgressColors() {
    const caloriePercent = Math.min((totalCalories / 2500) * 100, 100);
    const proteinPercent = Math.min((totalProtein / 150) * 100, 100);
    const waterPercent = Math.min((totalWater / 128) * 100, 100);

    const calorieBar = document.getElementById("calorieProgress");
    const proteinBar = document.getElementById("proteinProgress");
    const waterBar = document.getElementById("waterProgress");

    calorieBar.style.backgroundColor =
        caloriePercent >= 80 ? "#4CAF50" :
        caloriePercent >= 40 ? "#FFC107" : "#F44336";

    proteinBar.style.backgroundColor =
        proteinPercent >= 80 ? "#4CAF50" :
        proteinPercent >= 40 ? "#FFC107" : "#F44336";

    waterBar.style.backgroundColor =
        waterPercent >= 80 ? "#4CAF50" :
        waterPercent >= 40 ? "#FFC107" : "#F44336";
}

function updateWorkoutStreak() {
    const history = JSON.parse(
        localStorage.getItem("workoutHistory")
    ) || [];

    const dates = new Set();

    history.forEach(function (workout) {
        const dateText = workout.split(" - ")[0];

        if (dateText) {
            dates.add(dateText);
        }
    });

    let streak = 0;
    let currentDate = new Date();

    while (true) {
        const dateString = currentDate.toLocaleDateString();

        if (dates.has(dateString)) {
            streak++;

            currentDate.setDate(
                currentDate.getDate() - 1
            );
        } else {
            break;
        }
    }

    document.getElementById("workoutStreak").textContent =
        streak + (streak === 1 ? " day" : " days");
}


function updateWeeklySummary() {
    const history = JSON.parse(
        localStorage.getItem("workoutHistory")
    ) || [];

    const today = new Date();
    const weekAgo = new Date();

    weekAgo.setDate(today.getDate() - 6);

    let weeklyExercises = 0;
    let weeklyPRs = 0;

    const workoutDates = new Set();
    const previousBest = {};

    history.forEach(function (workout) {
        const match = workout.match(
            /^(\d{1,2}\/\d{1,2}\/\d{4})\s*-\s*(.+?)\s*-\s*(\d+(?:\.\d+)?)\s*lbs/
        );

        if (!match) {
            return;
        }

        const dateText = match[1];
        const exerciseName = match[2].trim().toLowerCase();
        const weight = Number(match[3]);

        const workoutDate = new Date(dateText);

        if (isNaN(workoutDate)) {
            return;
        }

        // Count workouts from this week
        if (
            workoutDate >= weekAgo &&
            workoutDate <= today
        ) {
            weeklyExercises++;
            workoutDates.add(dateText);
        }

        // Find the best weight from before this week
        if (workoutDate < weekAgo) {
            if (
                !previousBest[exerciseName] ||
                weight > previousBest[exerciseName]
            ) {
                previousBest[exerciseName] = weight;
            }
        }
    });

    // Check this week's workouts for new PRs
    history.forEach(function (workout) {
        const match = workout.match(
            /^(\d{1,2}\/\d{1,2}\/\d{4})\s*-\s*(.+?)\s*-\s*(\d+(?:\.\d+)?)\s*lbs/
        );

        if (!match) {
            return;
        }

        const dateText = match[1];
        const exerciseName = match[2].trim().toLowerCase();
        const weight = Number(match[3]);

        const workoutDate = new Date(dateText);

        if (
            workoutDate >= weekAgo &&
            workoutDate <= today &&
            (
                !previousBest[exerciseName] ||
                weight > previousBest[exerciseName]
            )
        ) {
            weeklyPRs++;
            previousBest[exerciseName] = weight;
        }
    });

    const weeklyWorkouts = workoutDates.size;

    document.getElementById("weeklyWorkouts").textContent =
        "Workouts: " + weeklyWorkouts;

    document.getElementById("weeklyExercises").textContent =
        "Exercises: " + weeklyExercises;

    document.getElementById("weeklyPRs").textContent =
        "New PRs: " + weeklyPRs;
}



function clearWorkouts() {
    if (!confirm("Clear all workouts for today?")) {
        return;
    }

    document.getElementById("workoutList").innerHTML = "";

    localStorage.removeItem("workoutList");

    updateWeeklySummary();
    updateWorkoutStreak();

    document.getElementById("workoutTotal").textContent = "Not logged";
}


function displayWorkoutHistory() {
    const history = JSON.parse(
        localStorage.getItem("workoutHistory")
    ) || [];

    const historyList =
        document.getElementById("workoutHistory");

    historyList.innerHTML = "";

    const groupedHistory = {};

    history.forEach(function (workout) {

        let date = "";
        let workoutInfo = "";

        // Support the newer "|" format
        if (workout.includes("|")) {
            const parts = workout.split("|");

            date = parts[0]
                .replace("📅", "")
                .trim();

            workoutInfo = parts
                .slice(1)
                .join("|")
                .trim();

        // Support the older " - " format
        } else {
            const parts = workout.split(" - ");

            date = parts[0]
                .replace("📅", "")
                .trim();

            workoutInfo = parts
                .slice(1)
                .join(" - ")
                .trim();
        }

        if (!groupedHistory[date]) {
            groupedHistory[date] = [];
        }

        groupedHistory[date].push(workoutInfo);
    });

    Object.keys(groupedHistory)
        .reverse()
        .forEach(function (date) {

            const details =
                document.createElement("details");

            const summary =
                document.createElement("summary");

            summary.textContent = "📅 " + date;

            details.appendChild(summary);

            const workoutList =
                document.createElement("ul");

            groupedHistory[date].forEach(
                function (workoutInfo) {

                    const workoutItem =
                        document.createElement("li");

                    workoutItem.textContent =
                        workoutInfo;

                    workoutList.appendChild(
                        workoutItem
                    );
                }
            );

            details.appendChild(workoutList);

            historyList.appendChild(details);
        });
}


function updatePersonalRecords() {
    const history = JSON.parse(
        localStorage.getItem("workoutHistory")
    ) || [];

    const records = {};

    history.forEach(function (workout) {
        const match = workout.match(
            /^.*? - (.+) - ([0-9.]+) lbs/
        );

        if (!match) {
            return;
        }

        const exercise = match[1]
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s]/g, "");

        const weight = Number(match[2]);

        if (!records[exercise] || weight > records[exercise]) {
            records[exercise] = weight;
        }
    });

    const prList = document.getElementById("prList");

    prList.innerHTML = "";

    Object.keys(records).forEach(function (exercise) {
        const item = document.createElement("li");

        item.textContent =
    exercise + " — " + records[exercise] + " lbs";

        prList.appendChild(item);
    });
}

updatePersonalRecords();


function updateWeeklyWorkoutDashboard() {
    const history = JSON.parse(
        localStorage.getItem("workoutHistory")
    ) || [];

    const days = {
        0: "sundayWorkout",
        1: "mondayWorkout",
        2: "tuesdayWorkout",
        3: "wednesdayWorkout",
        4: "thursdayWorkout",
        5: "fridayWorkout",
        6: "saturdayWorkout"
    };

    const today = new Date();

    const startOfWeek = new Date(today);
    startOfWeek.setDate(
        today.getDate() - today.getDay()
    );
    startOfWeek.setHours(0, 0, 0, 0);

    // Store exercises for each day
    const workoutDays = {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: []
    };

    let exerciseCount = 0;

    history.forEach(function(workout) {

        const parts = workout.split("|");

const datePart = parts[0]
    .replace("📅", "")
    .trim();

const workoutDetails = parts
    .slice(1)
    .join("|")
    .trim();



        const workoutDate = new Date(datePart);

        if (!isNaN(workoutDate) &&
            workoutDate >= startOfWeek) {

            const dayNumber = workoutDate.getDay();

            workoutDays[dayNumber].push(
                workoutDetails
            );

            exerciseCount++;
        }
    });

    // Reset all days
    Object.values(days).forEach(function(id) {
        document.getElementById(id).textContent = "Rest";
    });

    // Show exercises for each workout day
    Object.keys(workoutDays).forEach(function(dayNumber) {

        if (workoutDays[dayNumber].length > 0) {

            document.getElementById(
                days[dayNumber]
            ).textContent =
                "Workout 💪\n" +
                workoutDays[dayNumber]
                    .map(function(exercise) {
                        return "• " + exercise;
                    })
                    .join("\n");
        }
    });

    // Total workout days
    const totalWorkouts =
        Object.values(workoutDays)
            .filter(function(day) {
                return day.length > 0;
            }).length;

    document.getElementById(
        "weeklyWorkoutCount"
    ).textContent = totalWorkouts;

    document.getElementById(
        "weeklyExerciseCount"
    ).textContent = exerciseCount;
}


function addWater() {
    const waterAmount = Number(
        document.getElementById("waterAmount").value
    );

    if (waterAmount <= 0) {
        alert("Please enter a valid amount of water.");
        return;
    }

    totalWater += waterAmount;

    document.getElementById("waterTotal").textContent =
        totalWater + " oz";

    localStorage.setItem("totalWater", totalWater);

    updateProgressBars();

    document.getElementById("waterAmount").value = "";
}