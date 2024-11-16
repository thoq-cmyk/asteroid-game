const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load the rocket image
const rocketImage = new Image();
rocketImage.src = "assets/images/ROCKET/rocket.png"; // Rocket image path

// Load the asteroid image
const asteroidImage = new Image();
asteroidImage.src = "assets/images/silver/spin-28.png"; // Asteroid image path

// Load the background image
const backgroundImage = new Image();
backgroundImage.src = "assets/images/background/space.jpeg"; // Path to your background image

// Load sound effects
const laserSound = new Audio("assets/sounds/laser.mp3"); // Replace with your file path
const asteroidHitSound = new Audio("assets/sounds/boom.mp3"); // Replace with your file path
const playerHitSound = new Audio("assets/sounds/life-lost.mp3"); // Replace with your file path
const gameOverSound = new Audio("assets/sounds/game-over.mp3"); // Replace with your file path

class Player {
  constructor({ position, velocity, imageSrc }) {
    this.position = position;
    this.velocity = velocity;
    this.rotation = 0;
    this.lives = 3; // Player starts with 3 lives
    this.radius = 15; // Collision radius

    // Create a new image object for the player sprite
    this.image = new Image();
    this.image.src = imageSrc;

    // Ensure the image is loaded before attempting to draw
    this.image.onload = () => {
      this.isImageLoaded = true; // Flag indicating that the image is loaded
    };
    this.isImageLoaded = false; // Initially, the image is not loaded
  }

  draw() {
    if (!this.isImageLoaded) return; // Only draw if the image is loaded

    c.save();
    c.translate(this.position.x, this.position.y);
    c.rotate(this.rotation);
    c.translate(-this.position.x, -this.position.y);

    // Draw the player sprite
    c.drawImage(this.image, this.position.x - 15, this.position.y - 15, 30, 30); // Adjust width/height as needed

    c.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Laser {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 5; // Laser as a small circle (ball)
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "white"; // Change laser color to orange
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Asteroid {
  constructor({ position, velocity, radius, imageSrc }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.image = new Image();
    this.image.src = imageSrc;

    // Ensure the image is loaded before attempting to draw
    this.image.onload = () => {
      this.isImageLoaded = true; // Flag indicating that the image is loaded
    };
    this.isImageLoaded = false; // Initially, the image is not loaded
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

// Initialize player
const player = new Player({
  position: { x: canvas.width / 2, y: canvas.height / 2 },
  velocity: { x: 0, y: 0 },
  imageSrc: "assets/images/ROCKET/rocket.png", // Rocket image path for the player
});

const keys = {
  w: { pressed: false },
  a: { pressed: false },
  d: { pressed: false },
};

const SPEED = 3;
const ROTATIONAL_SPEED = 0.05;
const FRICTION = 0.97;
const LASER_SPEED = 5;

const lasers = [];
const asteroids = [];
let score = 0; // Initialize score

// Generate random asteroids at intervals
window.setInterval(() => {
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

function circleCollision(circle1, circle2) {
  const xDifference = circle2.position.x - circle1.position.x;
  const yDifference = circle2.position.y - circle1.position.y;
  const distance = Math.sqrt(
    xDifference * xDifference + yDifference * yDifference
  );
  return distance <= circle1.radius + circle2.radius;
}

function animate() {
  window.requestAnimationFrame(animate);

  // Draw the background image
  c.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

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
        score += 10; // Increment score when an asteroid is destroyed
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
        gameOverSound.play(); // Play game over sound
        alert("Game Over!");
        window.location.reload(); // Restart the game
      }
    }

    // Remove asteroids off-screen
    if (
      asteroid.position.x + asteroid.radius < 0 ||
      asteroid.position.x - asteroid.radius > canvas.width ||
      asteroid.position.y - asteroid.radius > canvas.height ||
      asteroid.position.y + asteroid.radius < 0
    ) {
      asteroids.splice(i, 1);
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

  // Display remaining lives
  c.fillStyle = "white";
  c.font = "20px Arial";
  c.fillText("Lives: " + player.lives, 10, 30);

  // Display score
  c.fillText("Score: " + score, canvas.width - 100, 30); // Display score at top-right corner
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
