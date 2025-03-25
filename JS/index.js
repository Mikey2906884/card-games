function randomChoice(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

const values = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];
const suites = ["♠", "♦", "♥", "♣"];
const backColor = randomChoice(["BBACK", "RBACK"]);
const deck = [];
const deckWithJokers = [];

for (let i of values) {
  for (let j of suites) {
    deck.push(i + j);
    deckWithJokers.push(i + j);
  }
}

Array.prototype.shuffle = function () {
  for (let i = this.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [this[i], this[j]] = [this[j], this[i]];
  }
  return this;
};

deck.shuffle();

for (let i of deck) {
  const parent = document.getElementById("deck");
  const container = document.createElement("div");
  const card = document.createElement("div");
  const front = document.createElement("div");
  const back = document.createElement("div");

  container.id = `${i}-container`;
  container.className = "card-container";
  card.id = i;
  card.className = "card";
  front.id = "front";
  front.style.backgroundImage = `url("../Cards/${i}.png")`;
  back.id = "back";
  back.style.backgroundImage = `url("../Cards/${backColor}.png")`;

  parent.appendChild(container);
  container.appendChild(card);
  card.appendChild(front);
  card.appendChild(back);
}
