let bulletPosition = -1;
let currentChamber = 0;
const totalChambers = 6;
let currentPlayer = 1; // 1 = Human, 2 = Bot
let gameOver = false;

function spinCylinder() {
  currentChamber = Math.floor(Math.random() * totalChambers);
  playActionVideo('media/cylinder-spin.mp4', () => {
    updateStatus("🔄 Cylinder spun. Player 1 goes first.");
  });
}

function loadBullet() {
  bulletPosition = Math.floor(Math.random() * totalChambers);
  currentChamber = 0;
  currentPlayer = 1;
  gameOver = false;
  updateStatus("🔫 Bullet loaded. Spin the cylinder.");
  if (typeof resetAnimations === "function") resetAnimations();
}

function playerShoot(target) {
  if (bulletPosition === -1 || gameOver || currentPlayer !== 1) {
    return;
  }
  processTurn(target);
}

function botTurn() {
  updateStatus("🤖 Bot is deciding...");
  setTimeout(() => {
    const target = Math.random() < 0.5 ? 'self' : 'opponent';
    updateStatus(`🤖 Bot chose to shoot ${target === 'self' ? "itself" : "you"}...`);
    setTimeout(() => {
      processTurn(target);
    }, 1000);
  }, 1000);
}

function processTurn(target) {
  if (bulletPosition === -1 || gameOver) return;

  const targetPlayer = (target === 'self') ? currentPlayer : (currentPlayer === 1 ? 2 : 1);

  if (currentChamber === bulletPosition) {
    updateStatus(`💥 BANG! Player ${targetPlayer} was shot! Game over.`);
    if (typeof playBangAnimation === "function") playBangAnimation();
    gameOver = true;
    if (targetPlayer === 2) {
      document.getElementById('botImg').src = 'media/dead-bot-placeholder.png';
    }
    return;
  } else {
    updateStatus(`🔘 Click... Player ${targetPlayer} is safe.`);
    currentChamber = (currentChamber + 1) % totalChambers;

    // Switch turn
    currentPlayer = (currentPlayer === 1) ? 2 : 1;

    if (!gameOver) {
      if (currentPlayer === 2) {
        botTurn();
      } else {
        updateStatus("🎮 Your turn! Choose who to shoot.");
      }
    }
  }
}

function resetGame() {
  bulletPosition = -1;
  currentChamber = 0;
  currentPlayer = 1;
  gameOver = false;
  updateStatus("🔁 Game reset. Load the bullet to start.");
  if (typeof resetAnimations === "function") resetAnimations();
  document.getElementById('botImg').src = 'media/bot-placeholder.png';
}

function updateStatus(message) {
  document.getElementById('status').innerText = message;
}

function playActionVideo(src, callback) {
  const video = document.getElementById('actionVideo');
  video.src = src;
  video.hidden = false;
  video.currentTime = 0;
  video.load();
  video.play().catch((err) => {
    console.error('Video play failed:', err);
  });
  video.onended = () => {
    video.hidden = true;
    if (callback) callback();
  };
}