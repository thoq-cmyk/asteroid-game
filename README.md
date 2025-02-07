# asteroid-game
This project builds upon the foundations of the Asteroid Game Tutorial by Net Ninja:
Watch the tutorial here.

Assets and Resources
I sourced sprite animations from The Sprite Resource:
Visit The Sprite Resource here.

Sprite Animations:
Game Models:

Asteroids: Models for asteroid obstacles.
Player: Replaced the default player model with a red rocket sprite.
Enemies: Added UFO ships as standard enemy units and a large mothership sprite for more challenging encounters.
Custom TV Frame:
I wrapped the game area with a TV frame sourced online. The frame features an arcade-style text font, generated using the Arcade Text Font Generator, to evoke a retro arcade aesthetic.

Custom Start Button:
Designed a start button with clear instructions to guide players at the beginning of the game.

Features and Enhancements
Game Controls:

Arrow Keys: Move the player (red rocket) up, down, left, and right.
Spacebar: Fire lasers to destroy enemies and asteroids.
Shooting Mechanics:

Implemented laser shooting functionality for the player, allowing them to shoot enemies and asteroids.
Designed unique enemy behaviors: UFOs and the mothership can fire lasers at the player while exhibiting distinct movement patterns.
Collision Detection:

Wrote collision detection logic to handle:
Player lasers hitting enemies and asteroids.
Enemy lasers hitting the player.
Player collisions with enemies or asteroids.
This ensures accurate and responsive gameplay interactions.
Parallax Space Background:
Replaced the original background with a dynamic space-themed parallax background to create visual depth.

Background Speed Functionality:
Added a background speed function to simulate movement, improving immersion and gameplay flow.

Scoreboard:
Implemented a scoreboard to track and display the player’s current score during gameplay.

Game Over Screen:
Added a Game Over screen that displays the player’s final score and provides an option to restart the game.

Sound Effects and Music:
Integrated sound effects for shooting lasers, explosions, and other key actions, along with optional background music to enhance the retro arcade experience.

Code Structure and Design
JavaScript: Handles core game logic, including:

Player and enemy movement.
Shooting mechanics and collision detection.
Score tracking and difficulty scaling.
HTML/CSS: Used for the game’s layout, visuals, and UI components such as the start button, scoreboard, and TV frame.

Difficulty Scaling
The game progressively increases in difficulty as the player’s score improves by:

Increasing the speed of asteroids and enemy movement.
Introducing more enemies and projectiles over time.
Browser Compatibility
The game has been tested and works best on:

Google Chrome
Mozilla Firefox      




<img width="1420" alt="Screenshot 2024-12-<img width="1419" alt="Screenshot 2024-12-17 at 23 39 16" src="https://github.com/user-attachments/assets/a6f3c66d-75e7-4ead-b2a0-2fffba2c6560" />
<img width="1412" alt="Screenshot 2024-12-17 at 23 38 55" src="https://github.com/user-attachments/assets/ede97d93-9ca9-486b-9331-baf03138be1a" />
<img width="1426" alt="Screenshot 2024-12-17 at 23 40 08" src="https://github.com/user-attachments/assets/16dcc68b-ef71-4780-a7a1-4108f4ed0b9d" />














