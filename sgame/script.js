const ship = document.getElementById("ship");
const gameContainer = document.getElementById("gameContainer");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");

let score = 0;
let time = 60;
let shipSpeed = 10;
let bulletSpeed = 5;
let sharks = [];
let gameInterval, sharkInterval, timerInterval;

// Move ship with arrow keys
document.addEventListener("keydown", (event) => {
    const shipRect = ship.getBoundingClientRect();
    switch (event.key) {
        case "ArrowLeft":
            // Ensure the ship doesn't move out of bounds on the left
            if (shipRect.left > gameContainer.offsetLeft) {
                ship.style.left = `${Math.max(0, ship.offsetLeft - shipSpeed)}px`;
            }
            break;
        case "ArrowRight":
            // Ensure the ship doesn't move out of bounds on the right
            if (shipRect.right < gameContainer.offsetLeft + gameContainer.offsetWidth) {
                ship.style.left = `${Math.min(gameContainer.offsetWidth - ship.offsetWidth, ship.offsetLeft + shipSpeed)}px`;
            }
            break;
        case " ":
            shoot();
            break;
    }
});

// Shoot bullet
function shoot() {
    const bullet = document.createElement("div");
    bullet.classList.add("bullet");
    bullet.style.left = `${ship.offsetLeft + ship.offsetWidth / 2 - 2.5}px`;
    bullet.style.top = `${ship.offsetTop - 10}px`;
    gameContainer.appendChild(bullet);

    const bulletInterval = setInterval(() => {
        bullet.style.top = `${bullet.offsetTop - bulletSpeed}px`;

        // Remove bullet if it leaves the game area
        if (bullet.offsetTop < 0) {
            bullet.remove();
            clearInterval(bulletInterval);
        }

        // Check for collisions with sharks
        sharks.forEach((shark, index) => {
            if (isCollision(bullet, shark)) {
                bullet.remove();
                shark.remove();
                sharks.splice(index, 1);
                clearInterval(bulletInterval);
                score++;
                scoreDisplay.textContent = score;
            }
        });
    }, 20);
}

// Spawn sharks
function spawnShark() {
    const shark = document.createElement("div");
    shark.classList.add("shark");
    shark.style.left = `${Math.floor(Math.random() * (gameContainer.offsetWidth - 50))}px`;
    shark.style.top = "0px";
    gameContainer.appendChild(shark);
    sharks.push(shark);

    const sharkInterval = setInterval(() => {
        shark.style.top = `${shark.offsetTop + 2}px`;

        // Remove shark if it leaves the game area
        if (shark.offsetTop > gameContainer.offsetHeight) {
            shark.remove();
            sharks.splice(sharks.indexOf(shark), 1);
            clearInterval(sharkInterval);
        }
    }, 50);
}

// Collision detection
function isCollision(bullet, shark) {
    const bulletRect = bullet.getBoundingClientRect();
    const sharkRect = shark.getBoundingClientRect();
    return !(
        bulletRect.top > sharkRect.bottom ||
        bulletRect.bottom < sharkRect.top ||
        bulletRect.left > sharkRect.right ||
        bulletRect.right < sharkRect.left
    );
}

// Start game timer
function startTimer() {
    timerInterval = setInterval(() => {
        time--;
        timeDisplay.textContent = time;
        if (time <= 0) {
            clearInterval(timerInterval);
            clearInterval(sharkInterval);
            alert(`Time's up! Your score is ${score}.`);
        }
    }, 1000);
}

// Game initialization
function startGame() {
    gameInterval = setInterval(spawnShark, 1000);
    startTimer();
}

// Start the game
startGame();
