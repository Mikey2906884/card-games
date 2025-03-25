import { goFish } from "./go-fish.js";

function randomChoice(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

Array.prototype.shuffle = function () {
  for (let i = this.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [this[i], this[j]] = [this[j], this[i]];
  }
  return this;
};

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
const backColor = randomChoice(["BLUE", "RED"]);
const deck = [];
const deckWithJokers = [];

for (let i of values) {
  for (let j of suites) {
    deck.push(i + j);
    deckWithJokers.push(i + j);
  }
}
deckWithJokers.push("BJOKER", "RJOKER");

deck.shuffle();
deckWithJokers.shuffle();

goFish(deck, backColor);
