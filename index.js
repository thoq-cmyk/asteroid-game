document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener('DOMContentLoaded', function() {
    // Handle username form submission
    document.getElementById('usernameFormElement').addEventListener('submit', function(event) {
      event.preventDefault();
      const username = document.getElementById('username').value;
      fetch('/submitUsername', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
      }).then(response => response.text()).then(data => {
        document.getElementById('usernameForm').style.display = 'none';
        document.getElementById('leaderboardContainer').style.display = 'block';
        fetchLeaderboard();
      });
    });
  
    // Handle score form submission
    document.getElementById('scoreForm').addEventListener('submit', function(event) {
      event.preventDefault();
      const player = document.getElementById('player').value;
      const score = document.getElementById('score').value;
      fetch('/submitScore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ player, score })
      }).then(response => response.text()).then(data => {
        fetchLeaderboard();
      });
    });
  
    // Fetch and display the leaderboard
    function fetchLeaderboard() {
      fetch('/leaderboard')
        .then(response => response.json())
        .then(data => {
          const leaderboard = document.getElementById('leaderboard');
          leaderboard.innerHTML = '';
          data.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `${entry.player}: ${entry.score}`;
            leaderboard.appendChild(li);
          });
        });
    }
  
    // Initial fetch to populate the leaderboard when the page loads
    fetchLeaderboard();
  });
  const startButton = document.getElementById("startButton");
  const canvas = document.getElementById("gameCanvas");
  const controls = document.getElementById("controls"); // Get the controls section
  let isGameRunning = false;

  // Add click event listener to the start button
  startButton.addEventListener("click", function () {
    startGame(); // Call the function to start the game
  });
  // Add an event listener to the start button
  startButton.addEventListener("click", function () {
    startGame();
    controls.style.display = "none";
  });
  function startGame() {
    isGameRunning = true; // Set the game state to running
    isGameStarted = true; // Set the game started flag to true
    console.log("Game Started!"); // For testing purposes
    startButton.style.display = "none"; // Hide the start button
    canvas.style.display = "block"; // Show the canvas
    gameLoop(); // Start the game loop
  }

  function gameLoop() {
    if (!isGameRunning) return; // Exit if the game is not running

    // Your game logic here
    console.log("Game is running..."); // For testing purposes

    // Call the game loop again using requestAnimationFrame for smooth animation
    requestAnimationFrame(gameLoop);
  }

  // Optional: Function to pause the game (if needed)
  function pauseGame() {
    isGameRunning = false;
    console.log("Game Paused!"); // For testing purposes
  }

  // Optional: Add a way to pause the game (e.g., a key press)
  document.addEventListener("keydown", function (event) {
    if (event.key === "p") {
      // Press 'p' to pause
      pauseGame();
    }
  });
});
const canvas = document.getElementById("gameCanvas");
const c = canvas.getContext("2d");

// Set canvas size to 900x900 pixels
canvas.width = 900;
canvas.height = 900;

// Fill the canvas with a solid color for testing
c.fillStyle = "rgba(255, 0, 0, 0.5)"; // Semi-transparent red
c.fillRect(0, 0, canvas.width, canvas.height);

// Load images
const rocketImage = new Image();
rocketImage.src = "assets/images/ROCKET/rocket.png"; // Rocket image path

const asteroidImage = new Image();
asteroidImage.src = "assets/images/silver/spin-28.png"; // Asteroid image path

const backgroundImage = new Image();
backgroundImage.src = "assets/images/background/space.jpeg"; // Background image path

const heartImage = new Image();
heartImage.src = "assets/images/title/black-heart.png"; // Heart image path
let isHeartImageLoaded = false;
heartImage.onload = () => {
  isHeartImageLoaded = true; // Set flag when image is loaded
};

// Function to draw hearts
function drawHearts(lives) {
  if (!isHeartImageLoaded) return; // Only draw if the image is loaded

  const heartSize = 40; // Size of the heart
  let heartX = 50; // Starting x position
  const heartY = 30; // y position for hearts

  for (let i = 0; i < lives; i++) {
    c.drawImage(heartImage, heartX, heartY, heartSize, heartSize); // Draw heart image
    heartX += heartSize + 5; // Move x position for next heart
  }
}

// Load sound effects
const laserSound = new Audio("assets/sounds/laser.mp3");
const asteroidHitSound = new Audio("assets/sounds/boom.mp3");
const playerHitSound = new Audio("assets/sounds/life-lost.mp3");
const gameOverSound = new Audio("assets/sounds/game-over.mp3");

// Player class
class Player {
  constructor({ position, velocity, imageSrc }) {
    this.position = position;
    this.velocity = velocity;
    this.rotation = 0;
    this.lives = 3; // Player starts with 3 lives
    this.radius = 15; // Collision radius
    this.image = new Image();
    this.image.src = imageSrc;
    this.isImageLoaded = false;

    this.image.onload = () => {
      this.isImageLoaded = true; // Flag indicating that the image is loaded
    };
  }

  draw() {
    if (!this.isImageLoaded) return; // Only draw if the image is loaded

    c.save();
    c.translate(this.position.x, this.position.y);
    c.rotate(this.rotation);
    c.translate(-this.position.x, -this.position.y);
    c.drawImage(this.image, this.position.x - 15, this.position.y - 15, 30, 30);
    c.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

// Laser class
class Laser {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 2; // Laser as a small circle (ball)
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "green"; // Change laser color to green
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

// Asteroid class
class Asteroid {
  constructor({ position, velocity, radius, imageSrc }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.image = new Image();
    this.image.src = imageSrc;
    this.isImageLoaded = false;

    this.image.onload = () => {
      this.isImageLoaded = true; // Flag indicating that the image is loaded
    };
  }

  draw() {
    if (!this.isImageLoaded) return; // Only draw if the image is loaded
    c.drawImage(
      this.image,
      this.position.x - this.radius,
      this.position.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

// EnemyProjectile class
class EnemyProjectile {
  constructor({ position, velocity, color }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 5; // Radius of the projectile
    this.color = color || "red"; // Default color
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2); // Draw a circle
    c.closePath();
    c.fillStyle = this.color; // Set fill color
    c.fill(); // Fill the circle with the specified color
  }

  update() {
    this.draw(); // Call the draw method to render the projectile
    this.position.x += this.velocity.x; // Update position
    this.position.y += this.velocity.y; // Update position
  }
}

// NewEnemy class
class NewEnemy {
  constructor({ position, velocity, imageSrc }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 30; // Set a radius for the new enemy
    this.image = new Image();
    this.image.src = imageSrc;
    this.isImageLoaded = false;
    this.projectiles = []; // Array to hold projectiles
    this.health = 3;

    this.image.onload = () => {
      this.isImageLoaded = true;
    };
  }

  draw() {
    if (!this.isImageLoaded) return;

    c.drawImage(
      this.image,
      this.position.x - this.radius,
      this.position.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );

    // Draw projectiles
    this.projectiles.forEach((projectile) => projectile.draw());
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.position.x += Math.sin(Date.now() * 0.0008) * 2;

    // Update projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      projectile.update();

      // Remove projectiles off-screen
      if (
        projectile.position.x + projectile.radius < 0 ||
        projectile.position.x - projectile.radius > canvas.width ||
        projectile.position.y - projectile.radius > canvas.height ||
        projectile.position.y + projectile.radius < 0
      ) {
        this.projectiles.splice(i, 1);
      }
    }

    if (Math.random() < 0.01) {
      // Adjust the probability as needed
      this.shoot();
    }
  }

  shoot() {
    const projectileVelocity = {
      x: 0, // Adjust horizontal movement if needed
      y: 7, // Speed of the projectile (adjust as needed)
    };

    this.projectiles.push(
      new EnemyProjectile({
        position: {
          x: this.position.x,
          y: this.position.y + this.radius, // Start from the bottom of the enemy
        },
        velocity: projectileVelocity,
        color: "blue", // Color for projectiles from NewEnemy
      })
    );
  }
}

// Enemy class
// Enemy class
class Enemy {
  constructor({ position, velocity, imageSrc }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 30;
    this.image = new Image();
    this.image.src = imageSrc;
    this.isImageLoaded = false;
    this.projectiles = [];
    this.shootInterval = 2000; // Time in milliseconds between shots
    this.lastShotTime = 0;
    this.health = 3;

    this.image.onload = () => {
      this.isImageLoaded = true;
    };
  }
  //test
  draw() {
    if (!this.isImageLoaded) return;
    c.drawImage(
      this.image,
      this.position.x - this.radius,
      this.position.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );
    this.projectiles.forEach((projectile) => projectile.draw());
  }

  update(currentTime) {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.position.x -= Math.sin(currentTime * 0.0008) * 2;

    // Check if it's time to shoot
    if (currentTime - this.lastShotTime >= this.shootInterval) {
      this.shoot();
      this.lastShotTime = currentTime; // Update the last shot time
    }

    // Update projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      projectile.update();

      // Remove projectiles off-screen
      if (projectile.position.y > canvas.height) {
        this.projectiles.splice(i, 1);
      }
    }
  }

  shoot() {
    const projectileVelocity = { x: 0, y: 5 }; // Adjust speed and direction as needed
    this.projectiles.push(
      new EnemyProjectile({
        position: { x: this.position.x, y: this.position.y + this.radius },
        velocity: projectileVelocity,
        color: "orange", // Color for UFO projectiles
      })
    );
  }
}

// StaticEnemy class
class StaticEnemy {
  constructor({ position, imageSrc }) {
    this.position = position;
    this.radius = 100; // Set a radius for the static enemy
    this.image = new Image();
    this.image.src = imageSrc;
    this.isImageLoaded = false;
    this.projectiles = []; // Array to hold projectiles
    this.shootInterval = 2000; // Time in milliseconds between shots
    this.lastShotTime = 0; // Time of the last shot
    this.health = 50;

    this.image.onload = () => {
      this.isImageLoaded = true;
    };
  }

  draw() {
    if (!this.isImageLoaded) return;

    c.drawImage(
      this.image,
      this.position.x - this.radius,
      this.position.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );

    // Draw projectiles
    this.projectiles.forEach((projectile) => projectile.draw());
  }

  update(currentTime) {
    this.draw(); // Static enemy does not move, just draw it

    // Check if it's time to shoot
    if (currentTime - this.lastShotTime >= this.shootInterval) {
      this.shoot();
      this.lastShotTime = currentTime; // Update the last shot time
    }

    // Update projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      projectile.update();

      // Remove projectiles off-screen
      if (
        projectile.position.x + projectile.radius < 0 ||
        projectile.position.x - projectile.radius > canvas.width ||
        projectile.position.y - projectile.radius > canvas.height ||
        projectile.position.y + projectile.radius < 0
      ) {
        this.projectiles.splice(i, 1);
      }
    }
  }

  shoot() {
    const projectileVelocity = {
      x: 0, // Move straight down
      y: 5, // Speed of the projectile (adjust as needed)
    };
    const projectileVelocityDiagonal1 = {
      x: 3, // Diagonal right
      y: 3, // Diagonal down
    };

    const projectileVelocityDiagonal2 = {
      x: -3, // Diagonal left
      y: 3, // Diagonal down
    };

    this.projectiles.push(
      new EnemyProjectile({
        position: {
          x: this.position.x,
          y: this.position.y + this.radius, // Start from the bottom of the enemy
        },
        velocity: projectileVelocity,
        color: "purple", // Color for projectiles from StaticEnemy
      })
    );
    // Shoot two diagonal projectiles
    this.projectiles.push(
      new EnemyProjectile({
        position: {
          x: this.position.x,
          y: this.position.y + this.radius, // Start from the bottom of the enemy
        },
        velocity: projectileVelocityDiagonal1,
        color: "purple", // Color for diagonal projectiles
      })
    );

    this.projectiles.push(
      new EnemyProjectile({
        position: {
          x: this.position.x,
          y: this.position.y + this.radius, // Start from the bottom of the enemy
        },
        velocity: projectileVelocityDiagonal2,
        color: "purple", // Color for diagonal projectiles
      })
    );
  }
}

// Initialize player
const player = new Player({
  position: { x: canvas.width / 2, y: canvas.height / 2 - 40 },
  velocity: { x: 0, y: 0 },
  imageSrc: "assets/images/ROCKET/rocket.png", // Rocket image path for the player
});

const keys = {
  w: { pressed: false },
  a: { pressed: false },
  d: { pressed: false },
};

const SPEED = 2;
const ROTATIONAL_SPEED = 0.05;
const FRICTION = 0.97;
const LASER_SPEED = 5;

const lasers = [];
const asteroids = [];
const enemies = []; // Array to hold enemies
let score = 0; // Initialize score

// Background position variables
let backgroundY = 0; // Initial background Y position
const BACKGROUND_SPEED = 1; // Speed at which the background moves

// Spawn rate variables
let spawnRate = 2000; // Initial spawn rate in milliseconds
let lastSpawnTime = 0; // Track the last spawn time

// Generate random asteroids at intervals
window.setInterval(() => {
  if (!isGameStarted) return;
  const index = Math.floor(Math.random() * 4);
  let x, y, vx, vy;
  const radius = 50 * Math.random() + 10;

  switch (index) {
    case 0:
      x = 0 - radius;
      y = Math.random() * canvas.height;
      vx = 1;
      vy = 0;
      break;
    case 1:
      x = Math.random() * canvas.width;
      y = canvas.height + radius;
      vx = 0;
      vy = -1;
      break;
    case 2:
      x = canvas.width + radius;
      y = Math.random() * canvas.height;
      vx = -1;
      vy = 0;
      break;
    case 3:
      x = Math.random() * canvas.width;
      y = 0 - radius;
      vx = 0;
      vy = 1;
      break;
  }

  asteroids.push(
    new Asteroid({
      position: { x: x, y: y },
      velocity: { x: vx, y: vy },
      radius: radius,
      imageSrc: "assets/images/silver/spin-03.png", // Asteroid image path
    })
  );
}, 3000);

// Generate random enemies at intervals based on score// Generate random enemies at intervals based on score
// Generate random enemies at intervals based on score
// Generate random enemies at intervals based on score
// Array to hold the score thresholds for spawning the static enemy
const staticEnemySpawnThresholds = [3500, 7000, 10500, 14000]; // Add more thresholds as needed
let staticEnemySpawnedAt = []; // Track which thresholds have been spawned

function spawnEnemies() {
  if (score > 500 && enemies.length < 10) {
    let x, y, vx, vy;

    // Check the enemy type to spawn
    const enemyType = Math.random();

    // New enemy spawns only if score is above 1000
    if (score > 1000 && enemyType < 0.33) {
      x = Math.random() * canvas.width; // Random x position
      y = 0; // Fixed y position at the top
      enemies.push(
        new NewEnemy({
          position: { x: x, y: y },
          velocity: { x: 0, y: 1 },
          imageSrc: "assets/ufo/ufo-boss.png", // Path to your new enemy image
        })
      );
    }
    // Existing enemy (UFO) spawns if score is above 500
    else if (score > 500 && enemyType < 0.66) {
      x = Math.random() * canvas.width; // Random x position
      y = 0; // Fixed y position at the top
      const ufo = new Enemy({
        position: { x: x, y: y },
        velocity: { x: 0, y: 1 },
        imageSrc: "assets/images/ufo/ufo-12.png", // Path to your existing enemy image
      });
      enemies.push(ufo);
    }

    // Check if the score has reached any of the static enemy spawn thresholds
    for (let threshold of staticEnemySpawnThresholds) {
      if (score >= threshold && !staticEnemySpawnedAt.includes(threshold)) {
        // Set position to the top middle of the canvas
        const middleX = canvas.width / 2; // Middle x position
        const topY = 0; // Fixed y position at the top
        enemies.push(
          new StaticEnemy({
            position: { x: middleX, y: topY }, // Spawn at the top middle
            imageSrc: "assets/ufo/Mothership.png", // Path to your static enemy image
          })
        );
        staticEnemySpawnedAt.push(threshold); // Mark this threshold as spawned
      }
    }

    spawnRate = Math.max(300, 3000 - Math.floor(score / 100) * 300);
  }
}
// Call spawnEnemies at intervals
setInterval(() => {
  spawnEnemies();
}, spawnRate);
function circleCollision(circle1, circle2) {
  const xDifference = circle2.position.x - circle1.position.x;
  const yDifference = circle2.position.y - circle1.position.y;
  const distance = Math.sqrt(
    xDifference * xDifference + yDifference * yDifference
  );

  return distance <= circle1.radius + circle2.radius;
}

// Closing brace for the animate function
function animate() {
  window.requestAnimationFrame(animate);

  // Update the background position
  backgroundY += BACKGROUND_SPEED;

  // Draw the background image
  c.drawImage(backgroundImage, 0, backgroundY, canvas.width, canvas.height);
  c.drawImage(
    backgroundImage,
    0,
    backgroundY - canvas.height,
    canvas.width,
    canvas.height
  );

  // Reset the background position if it goes off-screen
  if (backgroundY >= canvas.height) {
    backgroundY = 0;
  }

  // Update and draw player
  player.update();

  // Update and draw lasers
  for (let i = lasers.length - 1; i >= 0; i--) {
    const laser = lasers[i];
    laser.update();

    // Remove lasers off-screen
    if (
      laser.position.x + laser.radius < 0 ||
      laser.position.x - laser.radius > canvas.width ||
      laser.position.y - laser.radius > canvas.height ||
      laser.position.y + laser.radius < 0
    ) {
      lasers.splice(i, 1);
    }

    // Check collision between lasers and asteroids
    for (let j = asteroids.length - 1; j >= 0; j--) {
      const asteroid = asteroids[j];
      if (circleCollision(asteroid, laser)) {
        asteroidHitSound.play(); // Play asteroid hit sound
        asteroids.splice(j, 1);
        lasers.splice(i, 1);
        score += 100; // Increment score when an asteroid is destroyed
        break; // Prevent multiple collisions in one iteration
      }
    }
    // Check collision between lasers and enemies
    for (let j = 0; j < enemies.length; j++) {
      const enemy = enemies[j];
      if (circleCollision(enemy, laser)) {
        lasers.splice(i, 1); // Remove the laser
        enemy.health -= 1; // Decrease enemy health
        if (enemy.health <= 0) {
          enemies.splice(j, 1); // Remove the enemy if health is 0
          score += 200; // Increment score for destroying enemy
        }
        asteroidHitSound.play();
        break; // Prevent multiple collisions in one iteration
      }
    }
  }

  // Update and manage asteroids
  for (let i = asteroids.length - 1; i >= 0; i--) {
    const asteroid = asteroids[i];
    asteroid.update();

    // Check collision between player and asteroid
    if (circleCollision(player, asteroid)) {
      playerHitSound.play(); // Play player hit sound
      player.lives -= 1; // Decrease player lives
      console.log(`Player hit! Lives remaining: ${player.lives}`);
      asteroids.splice(i, 1); // Remove the asteroid

      // Game over check
      if (player.lives <= 0) {
        handleGameOver();
      }
    }
  }
  // function to handle game over
  function handleGameOver() {
    gameOverSound.play(); // Play game over sound
    // Removed the prompt for username at the end of the game

    // Removed the logic to submit score at the end of the game

    // Redirect to leaderboard.html
    window.location.href = "leaderboard.html"; // Redirect to leaderboard page
  }

  // Update and manage enemies
  const currentTime = Date.now(); // Get the current time
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    enemy.update(currentTime); // Pass current time to update method

    // Check collision between enemy projectiles and player
    for (let j = enemy.projectiles.length - 1; j >= 0; j--) {
      const projectile = enemy.projectiles[j];
      if (circleCollision(player, projectile)) {
        playerHitSound.play(); // Play player hit sound
        player.lives -= 1; // Decrease player lives
        console.log(
          `Player hit by enemy projectile! Lives remaining: ${player.lives}`
        );
        enemy.projectiles.splice(j, 1); // Remove the projectile

        // Game over check
        if (player.lives <= 0) {
          handleGameOver();
        }
      }
    }

    // Remove enemies off-screen
    if (
      enemy.position.x + enemy.radius < 0 ||
      enemy.position.x - enemy.radius > canvas.width ||
      enemy.position.y - enemy.radius > canvas.height ||
      enemy.position.y + enemy.radius < 0
    ) {
      enemies.splice(i, 1);
    }
  }

  // Update player movement
  if (keys.w.pressed) {
    player.velocity.x = Math.cos(player.rotation) * SPEED;
    player.velocity.y = Math.sin(player.rotation) * SPEED;
  } else {
    player.velocity.x *= FRICTION;
    player.velocity.y *= FRICTION;
  }

  if (keys.d.pressed) player.rotation += ROTATIONAL_SPEED;
  else if (keys.a.pressed) player.rotation -= ROTATIONAL_SPEED;

  // Display remaining hearts instead of lives
  drawHearts(player.lives);

  // Display score
  c.font = "24px 'Lacquer', cursive";
  c.fillText("Score: " + score, canvas.width - 180, 50); // Display score at top-right corner
}

window.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "KeyW":
      keys.w.pressed = true;
      break;
    case "KeyA":
      keys.a.pressed = true;
      break;
    case "KeyD":
      keys.d.pressed = true;
      break;
    case "Space":
      lasers.push(
        new Laser({
          position: {
            x: player.position.x + Math.cos(player.rotation) * 30,
            y: player.position.y + Math.sin(player.rotation) * 30,
          },
          velocity: {
            x: Math.cos(player.rotation) * LASER_SPEED,
            y: Math.sin(player.rotation) * LASER_SPEED,
          },
        })
      );
      laserSound.play(); // Play laser sound
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.code) {
    case "KeyW":
      keys.w.pressed = false;
      break;
    case "KeyA":
      keys.a.pressed = false;
      break;
    case "KeyD":
      keys.d.pressed = false;
      break;
  }
});

animate();

async function fetchScores() {
  try {
    const response = await fetch("http://localhost:3000/scores");
    const scores = await response.json();
    console.log(scores); // Log scores to the console

    // Display scores in the leaderboard
    const leaderboard = document.getElementById("leaderboard");
    leaderboard.innerHTML = ""; // Clear existing scores
    scores.forEach((score) => {
      const li = document.createElement("li");
      li.textContent = `${score.player}: ${score.score}`;
      leaderboard.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching scores:", error);
  }
}

// Call fetchScores when the page loads
window.onload = () => {
  fetchScores(); // Fetch scores on page load
};

// Function to submit the score after the game ends
async function submitScore(playerName, scoreValue) {
  try {
    const response = await fetch("http://localhost:3000/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ player: playerName, score: scoreValue }),
    });

    const result = await response.json();
    console.log("Score added:", result);
    fetchScores(); // Refresh the leaderboard after adding a new score
  } catch (error) {
    console.error("Error adding score:", error);
  }
}
