/* =====================================================
   GYMTRACK
   Workout + Progress + Rest Timer
===================================================== */


/* =====================================================
   1. WORKOUT PROGRAM
===================================================== */

const program = [

  {
    day: "Sunday",
    focus: "Chest + Triceps",

    sections: [

      {
        muscle: "Chest",

        exercises: [
          ["Chest Press Machine", 3, "8–12"],
          ["Incline Chest Press Machine", 3, "8–12"],
          ["Pec Deck Machine", 3, "10–15"]
        ]

      },

      {
        muscle: "Triceps",

        exercises: [
          ["Cable Triceps Pushdown", 3, "10–15"],
          ["Overhead Cable Triceps Extension", 3, "10–15"],
          ["Triceps Extension Machine", 2, "10–15"]
        ]

      }

    ]
  },


  {
    day: "Monday",
    focus: "Back + Biceps",

    sections: [

      {
        muscle: "Back",

        exercises: [
          ["Lat Pulldown Machine", 3, "8–12"],
          ["Seated Row Machine", 3, "8–12"],
          ["Chest-Supported Row Machine", 3, "10–12"],
          ["Reverse Pec Deck", 2, "12–15"]
        ]

      },

      {
        muscle: "Biceps",

        exercises: [
          ["Biceps Curl Machine", 3, "10–15"],
          ["Preacher Curl Machine", 3, "10–15"]
        ]

      }

    ]
  },


  {
    day: "Tuesday",
    focus: "Legs + Calves + Abs",

    sections: [

      {
        muscle: "Legs",

        exercises: [
          ["Leg Press Machine", 3, "8–12"],
          ["Hack Squat Machine", 3, "8–12"],
          ["Leg Extension Machine", 3, "10–15"],
          ["Seated Leg Curl Machine", 3, "10–15"],
          ["Hip Thrust Machine", 3, "8–12"]
        ]

      },

      {
        muscle: "Calves",

        exercises: [
          ["Calf Raise Machine", 4, "12–20"]
        ]

      },

      {
        muscle: "Abs",

        exercises: [
          ["Ab Crunch Machine", 3, "12–20"]
        ]

      }

    ]
  },


  {
    day: "Wednesday",
    focus: "Rest",
    sections: []

  },


  {
    day: "Thursday",
    focus: "Chest + Back + Shoulders",

    sections: [

      {
        muscle: "Chest",

        exercises: [
          ["Chest Press Machine", 3, "8–12"],
          ["Incline Chest Press Machine", 2, "8–12"]
        ]

      },

      {
        muscle: "Back",

        exercises: [
          ["Lat Pulldown Machine", 3, "8–12"],
          ["Seated Row Machine", 3, "8–12"],
          ["Machine Row", 2, "10–12"]
        ]

      },

      {
        muscle: "Shoulders",

        exercises: [
          ["Shoulder Press Machine", 3, "8–12"],
          ["Lateral Raise Machine", 3, "12–15"],
          ["Reverse Pec Deck", 2, "12–15"]
        ]

      }

    ]
  },


  {
    day: "Friday",
    focus: "Legs + Biceps + Triceps + Abs",

    sections: [

      {
        muscle: "Legs",

        exercises: [
          ["Leg Press Machine", 3, "8–12"],
          ["Leg Extension Machine", 2, "10–15"],
          ["Seated Leg Curl Machine", 3, "10–15"],
          ["Hip Thrust Machine", 2, "8–12"]
        ]

      },

      {
        muscle: "Biceps",

        exercises: [
          ["Biceps Curl Machine", 2, "10–15"]
        ]

      },

      {
        muscle: "Triceps",

        exercises: [
          ["Cable Triceps Pushdown", 2, "10–15"]
        ]

      },

      {
        muscle: "Abs",

        exercises: [
          ["Ab Crunch Machine", 3, "12–20"]
        ]

      }

    ]
  },


  {
    day: "Saturday",
    focus: "Rest",
    sections: []

  }

];


/* =====================================================
   2. STORAGE
===================================================== */

let exerciseLogs =
  JSON.parse(
    localStorage.getItem("gymtrack_exercise_logs") || "{}"
  );


let completedWorkouts =
  JSON.parse(
    localStorage.getItem("gymtrack_completed") || "{}"
  );


let currentWorkoutIndex = 0;


/* =====================================================
   3. REST TIMER
===================================================== */

let timerSeconds = 90;
let timerInterval = null;


function updateTimerDisplay() {

  const minutes =
    Math.floor(timerSeconds / 60);

  const seconds =
    timerSeconds % 60;

  document.getElementById(
    "timerDisplay"
  ).textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


function startTimer() {

  if (timerInterval) {
    return;
  }

  timerInterval =
    setInterval(() => {

      if (timerSeconds <= 0) {

        clearInterval(timerInterval);

        timerInterval = null;

        showToast("Rest finished 💪");

        return;
      }

      timerSeconds--;

      updateTimerDisplay();

    }, 1000);

}


function resetTimer() {

  clearInterval(timerInterval);

  timerInterval = null;

  timerSeconds = 90;

  updateTimerDisplay();

}


document
  .getElementById("timerStart")
  .addEventListener(
    "click",
    startTimer
  );


document
  .getElementById("timerReset")
  .addEventListener(
    "click",
    resetTimer
  );


/* =====================================================
   4. SAVE DATA
===================================================== */

function saveData() {

  localStorage.setItem(
    "gymtrack_exercise_logs",
    JSON.stringify(exerciseLogs)
  );

  localStorage.setItem(
    "gymtrack_completed",
    JSON.stringify(completedWorkouts)
  );

}


/* =====================================================
   5. CREATE SAFE EXERCISE KEY
===================================================== */

function createExerciseKey(name) {

  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

}


/* =====================================================
   6. TOAST
===================================================== */

function showToast(message) {

  const toast =
    document.getElementById("toast");

  toast.textContent = message;

  toast.style.display = "block";

  setTimeout(() => {

    toast.style.display = "none";

  }, 1800);

}


/* =====================================================
   7. CHANGE PAGE
===================================================== */

function showPage(pageId) {

  document
    .querySelectorAll(".page")
    .forEach(page => {

      page.classList.remove("active");

    });


  const selectedPage =
    document.getElementById(pageId);


  if (selectedPage) {

    selectedPage.classList.add("active");

  }


  document
    .querySelectorAll(".navigation-button")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.page === pageId
      );

    });


  if (pageId === "progressPage") {

    renderProgress();

  }

}


/* =====================================================
   8. HOME PAGE
===================================================== */

function renderHome() {

  const container =
    document.getElementById("daysList");

  container.innerHTML = "";


  const trainingDays =
    program.filter(
      day => day.sections.length > 0
    );


  const completedDays =
    trainingDays.filter(
      day => completedWorkouts[day.day]
    );


  const percentage =
    trainingDays.length === 0
      ? 0
      : Math.round(
          completedDays.length /
          trainingDays.length *
          100
        );


  document.getElementById(
    "weeklyText"
  ).textContent =
    `${completedDays.length} of ${trainingDays.length} workouts completed`;


  document.getElementById(
    "weeklyPercentage"
  ).textContent =
    `${percentage}%`;


  program.forEach(
    (day, index) => {

      const isRestDay =
        day.sections.length === 0;


      const isCompleted =
        completedWorkouts[day.day];


      let action = "";


      if (isRestDay) {

        action =
          `<span class="rest-text">REST</span>`;

      }

      else if (isCompleted) {

        action =
          `<span class="done-text">✓ Done</span>`;

      }

      else {

        action =
          `
          <button
            class="start-button"
            onclick="openWorkout(${index})"
          >
            Start
          </button>
          `;

      }


      container.innerHTML += `

        <div class="day-card">

          <div>

            <div class="day-name">
              ${day.day}
            </div>

            <div class="day-focus">
              ${day.focus}
            </div>

          </div>

          <div class="day-action">
            ${action}
          </div>

        </div>

      `;

    }
  );

}


/* =====================================================
   9. OPEN WORKOUT
===================================================== */

function openWorkout(index) {

  currentWorkoutIndex = index;


  const workout =
    program[index];


  showPage("workoutPage");


  document.getElementById(
    "workoutDay"
  ).textContent =
    workout.day.toUpperCase();


  document.getElementById(
    "workoutTitle"
  ).textContent =
    workout.focus;


  document.getElementById(
    "workoutDescription"
  ).textContent =
    "Machines only • Log your weight and reps";


  const container =
    document.getElementById(
      "exerciseList"
    );


  container.innerHTML = "";


  workout.sections.forEach(
    section => {

      container.innerHTML += `

        <h2 class="exercise-section-title">
          ${section.muscle}
        </h2>

      `;


      section.exercises.forEach(
        exercise => {

          const name =
            exercise[0];

          const sets =
            exercise[1];

          const reps =
            exercise[2];


          const key =
            createExerciseKey(name);


          const saved =
            exerciseLogs[key] || {};


          container.innerHTML += `

            <div class="exercise-card">

              <div class="exercise-name">
                ${name}
              </div>

              <div class="exercise-details">
                ${sets} sets · ${reps} reps
              </div>


              <div class="input-grid">

                <div class="input-container">

                  <label>
                    WEIGHT (KG)
                  </label>

                  <input
                    type="number"
                    inputmode="decimal"
                    step="0.5"

                    data-exercise="${key}"
                    data-field="weight"

                    value="${saved.weight || ""}"

                    placeholder="0"
                  >

                </div>


                <div class="input-container">

                  <label>
                    REPS
                  </label>

                  <input
                    type="number"
                    inputmode="numeric"

                    data-exercise="${key}"
                    data-field="reps"

                    value="${saved.reps || ""}"

                    placeholder="0"
                  >

                </div>

              </div>

            </div>

          `;

        }
      );

    }
  );


  resetTimer();

}


/* =====================================================
   10. SAVE INPUTS AUTOMATICALLY
===================================================== */

document.addEventListener(
  "input",
  event => {

    const input =
      event.target;


    if (!input.dataset.exercise) {
      return;
    }


    const key =
      input.dataset.exercise;


    const field =
      input.dataset.field;


    if (!exerciseLogs[key]) {

      exerciseLogs[key] = {};

    }


    exerciseLogs[key][field] =
      input.value;


    saveData();

  }
);


/* =====================================================
   11. FINISH WORKOUT
===================================================== */

document
  .getElementById("finishButton")
  .addEventListener(
    "click",
    () => {

      const workout =
        program[currentWorkoutIndex];


      completedWorkouts[
        workout.day
      ] = true;


      saveData();


      showToast(
        "Workout completed ✓"
      );


      renderHome();


      setTimeout(
        () => {

          showPage("homePage");

        },
        300
      );

    }
  );


/* =====================================================
   12. BACK BUTTON
===================================================== */

document
  .getElementById("backButton")
  .addEventListener(
    "click",
    () => {

      showPage("homePage");

    }
  );


/* =====================================================
   13. PROGRESS PAGE
===================================================== */

function renderProgress() {

  const container =
    document.getElementById(
      "progressList"
    );


  container.innerHTML = "";


  const allExercises = {};


  program.forEach(
    day => {

      day.sections.forEach(
        section => {

          section.exercises.forEach(
            exercise => {

              const name =
                exercise[0];

              const key =
                createExerciseKey(name);


              allExercises[key] =
                name;

            }
          );

        }
      );

    }
  );


  let loggedCount = 0;


  Object.keys(allExercises)
    .forEach(
      key => {

        const log =
          exerciseLogs[key];


        if (
          !log ||
          !log.weight
        ) {

          return;

        }


        loggedCount++;


        const reps =
          log.reps
            ? `${log.reps} reps`
            : "No reps";


        container.innerHTML += `

          <div class="progress-card">

            <div class="progress-name">
              ${allExercises[key]}
            </div>

            <div class="progress-value">
              ${log.weight} kg
              <br>
              ${reps}
            </div>

          </div>

        `;

      }
    );


  document.getElementById(
    "loggedExercises"
  ).textContent =
    loggedCount;


  const completedCount =
    Object.keys(
      completedWorkouts
    ).length;


  document.getElementById(
    "totalWorkouts"
  ).textContent =
    completedCount;


  if (loggedCount === 0) {

    container.innerHTML = `

      <p class="subtitle">

        No exercise data yet.
        Start your first workout!

      </p>

    `;

  }

}


/* =====================================================
   14. NAVIGATION BUTTONS
===================================================== */

document
  .querySelectorAll(".navigation-button")
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          showPage(
            button.dataset.page
          );

        }
      );

    }
  );


/* =====================================================
   15. RESET EVERYTHING
===================================================== */

document
  .getElementById("resetButton")
  .addEventListener(
    "click",
    () => {

      const confirmed =
        confirm(
          "Delete all GymTrack data?"
        );


      if (!confirmed) {
        return;
      }


      exerciseLogs = {};

      completedWorkouts = {};


      saveData();

      renderHome();

      renderProgress();


      showToast(
        "GymTrack data reset"
      );

    }
  );


/* =====================================================
   16. INITIALIZE APP
===================================================== */

updateTimerDisplay();

renderHome();

showPage("homePage");