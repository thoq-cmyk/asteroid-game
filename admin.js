const fetchScoresButton = document.getElementById("fetchScoresButton");
const resetLeaderboardButton = document.getElementById(
  "resetLeaderboardButton"
);
const adminLeaderboard = document.getElementById("adminLeaderboard");

// Fetch scores from the server for admin view
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

// Display scores in the admin leaderboard
function displayScores(scores) {
  adminLeaderboard.innerHTML = ""; // Clear existing scores
  scores.forEach((score) => {
    const li = document.createElement("li");
    li.textContent = `${score.player}: ${score.score}`;
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => deleteScore(score._id); // Call delete function with score ID
    li.appendChild(deleteButton);
    adminLeaderboard.appendChild(li);
  });
}

// Delete a score by ID
async function deleteScore(id) {
  try {
    const response = await fetch(`http://localhost:3000/scores/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete score");
    fetchScores(); // Refresh the leaderboard after deletion
  } catch (error) {
    console.error("Error deleting score:", error);
    alert("Failed to delete score. Please try again.");
  }
}

// Reset the leaderboard
async function resetLeaderboard() {
  try {
    const response = await fetch("http://localhost:3000/scores/reset", {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to reset leaderboard");
    fetchScores(); // Refresh the leaderboard after reset
  } catch (error) {
    console.error("Error resetting leaderboard:", error);
    alert("Failed to reset leaderboard. Please try again.");
  }
}

fetchScoresButton.addEventListener("click", fetchScores);
resetLeaderboardButton.addEventListener("click", resetLeaderboard);

// Add event listener for updating player names
const updatePlayerButton = document.getElementById("updatePlayerButton");

updatePlayerButton.addEventListener("click", async () => {
  const oldPlayerName = document.getElementById("oldPlayerName").value;
  const newPlayerName = document.getElementById("newPlayerName").value;

  try {
    const response = await fetch("http://localhost:3000/updatePlayer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ oldName: oldPlayerName, newName: newPlayerName }),
    });

    if (!response.ok) throw new Error("Failed to update player name");
    alert("Player name updated successfully!");
  } catch (error) {
    console.error("Error updating player name:", error);
    alert("Failed to update player name. Please try again.");
  }
});
fetchScoresButton.addEventListener("click", fetchScores);
resetLeaderboardButton.addEventListener("click", resetLeaderboard);
