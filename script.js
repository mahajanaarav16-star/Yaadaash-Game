const emojis = ["🍎","🍌","🍓","🍇","🍉","🍒","🥝","🍍","🍑","🥭"];
let board = document.getElementById("board");
let movesText = document.getElementById("moves");
let bestText = document.getElementById("best");

let firstCard, secondCard;
let lockBoard = false;
let moves = 0;
let pairs = 0;
let totalPairs = 0;
let level = "easy";

function startGame(difficulty) {
  board.innerHTML = "";
  moves = 0;
  pairs = 0;
  level = difficulty;

  let size;
  if (difficulty === "easy") size = 4;
  else if (difficulty === "medium") size = 6;
  else size = 10;

  totalPairs = size;
  let cards = [...emojis.slice(0, size), ...emojis.slice(0, size)];
  cards.sort(() => Math.random() - 0.5);

  board.style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(size*2))}, 80px)`;

  cards.forEach((emoji) => {
    let card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = emoji;
    card.innerHTML = "?";
    card.addEventListener("click", flipCard);
    board.appendChild(card);
  });

  updateUI();
}

function flipCard() {
  if (lockBoard || this.classList.contains("flipped")) return;

  document.getElementById("flip-sound").play();
  this.classList.add("flipped");
  this.innerHTML = this.dataset.emoji;

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  moves++;
  updateUI();

  if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
    document.getElementById("match-sound").play();
    firstCard = null;
    secondCard = null;
    pairs++;
    if (pairs === totalPairs) {
      document.getElementById("win-sound").play();
      saveBestScore();
      alert("🎉 You Win!");
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      firstCard.innerHTML = "?";
      secondCard.innerHTML = "?";
      firstCard = null;
      secondCard = null;
      lockBoard = false;
    }, 1000);
  }
}

function updateUI() {
  movesText.textContent = `Moves: ${moves}`;
  let best = localStorage.getItem("best-" + level);
  bestText.textContent = `Best Score: ${best ? best : "-"}`;
}

function saveBestScore() {
  let best = localStorage.getItem("best-" + level);
  if (!best || moves < best) {
    localStorage.setItem("best-" + level, moves);
  }
  updateUI();
}

startGame("easy");
