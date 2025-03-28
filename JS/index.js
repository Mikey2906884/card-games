import { crazyEights } from "./crazy-eights.js";

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

export function correctHandVis(hand) {
  let maxWidth;
  const cardsInHand = hand.querySelectorAll(".card-container");

  if (Array.from(hand.classList).includes("h-hand")) {
    maxWidth = (parseFloat(hand.style.maxWidth) / 100) * window.innerWidth;
  } else if (Array.from(hand.classList).includes("v-hand")) {
    if (hand.style.left) {
      hand.style.transform = `rotate(90deg) translate(0, ${
        (hand.offsetWidth - hand.offsetHeight) / 2
      }px)`;
    } else {
      hand.style.transform = `rotate(90deg) translate(0, -${
        (hand.offsetWidth - hand.offsetHeight) / 2
      }px)`;
    }

    maxWidth = (parseFloat(hand.style.maxWidth) / 100) * window.innerHeight;
  }

  for (let card of cardsInHand) {
    card.style.marginRight = null;
    card.style.marginLeft = null;

    if (hand.style.left) {
      hand.style.transform = `rotate(90deg) translate(0, ${
        (cardsInHand.length * Array.from(cardsInHand)[0].offsetWidth -
          hand.offsetHeight) /
        2
      }px)`;
    } else if (hand.style.right) {
      hand.style.transform = `rotate(90deg) translate(0, -${
        (cardsInHand.length * Array.from(cardsInHand)[0].offsetWidth -
          hand.offsetHeight) /
        2
      }px)`;
    }
  }

  if (cardsInHand.length * Array.from(cardsInHand)[0].offsetWidth >= maxWidth) {
    for (let card of cardsInHand) {
      card.style.marginRight = `-${
        (card.offsetWidth -
          (maxWidth - card.offsetWidth) / (cardsInHand.length - 1)) /
        2
      }px`;
      card.style.marginLeft = `-${
        (card.offsetWidth -
          (maxWidth - card.offsetWidth) / (cardsInHand.length - 1)) /
        2
      }px`;
    }
    if (hand.style.left) {
      hand.style.transform = `rotate(90deg) translate(0, ${
        (maxWidth - hand.offsetHeight) / 2 +
        parseFloat(hand.querySelector(".card-container").style.marginRight)
      }px)`;
    } else if (hand.style.right) {
      hand.style.transform = `rotate(90deg) translate(0, -${
        (maxWidth - hand.offsetHeight) / 2 +
        parseFloat(hand.querySelector(".card-container").style.marginRight)
      }px)`;
    }
  }
}

const createDeck = function () {
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
  const cardBack = randomChoice(["BLUE", "RED"]);
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

  return [deck, deckWithJokers, cardBack];
};

const [deck, deckWithJokers, cardBack] = createDeck();

crazyEights(deck, cardBack);
