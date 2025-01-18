const scoreForm = document.getElementById("scoreForm");
const leaderboard = document.getElementById("leaderboard");
const usernameForm = document.getElementById("usernameForm");
const submitUsernameButton = document.getElementById("submitUsername");
const startButton = document.getElementById("startButton");

let currentUsername = ""; // Variable to store the current username

// Fetch scores from the server
async function fetchScores() {
  try {
    const response = await fetch("http://localhost:3000/scores");
    if (!response.ok) throw new Error("Network response was not ok");
    const scores = await response.json();
    displayScores(scores);
  } catch (error) {
    console.error("Error fetching scores:", error);
    alert("Failed to fetch scores. Please try again later.");
  }
}

// Display scores in the leaderboard
function displayScores(scores) {
  leaderboard.innerHTML = ""; // Clear existing scores
  scores.forEach((score) => {
    const li = document.createElement("li");
    li.textContent = `${score.player}: ${score.score}`;
    leaderboard.appendChild(li);
  });
}

const leaderboardButton = document.getElementById("leaderboardButton"); // Define leaderboardButton

// Show username form when the leaderboard text is clicked
leaderboardButton.addEventListener("click", () => {
  document.getElementById("controls").style.display = "none"; // Hide controls
});

// Handle username submission
submitUsernameButton.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent form submission
  currentUsername = document.getElementById("username").value; // Store the username
  usernameForm.style.display = "none"; // Hide the username form
  scoreForm.style.display = "block"; // Show the score submission form
  fetchScores(); // Fetch scores after username submission
});

// Handle score submission
scoreForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent form submission
  const playerScore = {
    player: currentUsername,
    score: parseInt(document.getElementById("score").value, 10),
  };

  try {
    console.log("Submitting score:", playerScore); // Log the score being submitted
    const response = await fetch("http://localhost:3000/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerScore),
    });

    if (!response.ok) throw new Error("Failed to submit score");
    fetchScores(); // Refresh the leaderboard after submission
    scoreForm.reset(); // Reset the score form
  } catch (error) {
    console.error("Error submitting score:", error);
    alert("Failed to submit score. Please try again.");
  }
});

// Function to handle game over
function gameOver() {
  // Disable game controls
  document.getElementById("controls").style.display = "none"; // Hide controls
  window.location.href = "leaderboard.html"; // Redirect to leaderboard.html
}

// Event listener for starting the game
startButton.addEventListener("click", () => {
  // Initialize game logic here
  // For example, start the game loop, set up the canvas, etc.
});

// Initial fetch of scores
fetchScores();
