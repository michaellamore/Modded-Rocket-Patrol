# Grab 'Em All
A (heavily) modified version of Rocket Patrol - the APF-M1000 built-in gallery shooter, built using Phaser 3

# POINTS BREAKDOWN
I did a little over 100 points in-case I didn't fulfill some of the requirements

Implement a simultaneous two-player mode (30)
- Can play 1P mode or 2P mode, and each have their own scores

Redesign the game's artwork, UI, and sound to change its theme/aesthetic (60)
- Created a claw-machine type of game, not sci-fi whatsoever
- TODO: work on sounds and music

Display the time remaining (in seconds) on the screen (10)
- Timer is at the top of the screen everytime player begins playing

Implement a new timing/scoring mechanism that adds time to clock for successful hits (20)
- the very bottom animals add a couple milliseconds to the timer, whilst the highest animal gives a couple of seconds (varies between two vs one player modes)

Create and implement a new weapon (w/ new behavior and graphics) (20)
- Players play as the claw from a claw machine! 
- Moves up and down the play space
- "Grabs" stuffed animals and drags them down

Track a high score that persists across scenes and displays it in the UI (5)
- The highscore is saved in main.js, so it's useable in both Menu.js and Play.js
- Shows up on the "Gameover" screen after a complete playthrough

Randomize each spaceship's movement direction at the start of each play (5)
- Top and bottom animals go to the right, and the middle goes left. I didn't want to make it random because it would be too chaotic to play, but I wanted to explain that the code is CAPABLE of doing random movement, since it can change their movement in general