const scoreForm = document.getElementById("scoreForm");
const leaderboard = document.getElementById("leaderboard");

// Fetch scores from the server
async function fetchScores() {
  try {
    const response = await fetch("http://localhost:3000/scores");
    if (!response.ok) throw new Error("Network response was not ok");
    const scores = await response.json();
    displayScores(scores);
  } catch (error) {
    console.error("Error fetching scores:", error);
    alert("Failed to fetch scores. Please try again later."); // User feedback
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

// Add a new score
scoreForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent form submission
  const player = document.getElementById("player").value.trim();
  const score = parseInt(document.getElementById("score").value, 10); // Convert score to an integer

  // Basic validation
  if (!player || isNaN(score)) {
    alert("Please enter a valid player name and score."); // User feedback
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ player, score }),
    });

    if (!response.ok) throw new Error("Network response was not ok");
    scoreForm.reset(); // Clear the form
    fetchScores(); // Fetch updated scores
  } catch (error) {
    console.error("Error adding score:", error);
    alert("Failed to add score. Please try again later."); // User feedback
  }
});

// Initial fetch of scores
fetchScores();
