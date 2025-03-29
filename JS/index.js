import { crazyEights } from "./crazy-eights.js";

Array.prototype.shuffle = function () {
  for (let i = this.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [this[i], this[j]] = [this[j], this[i]];
  }
  return this;
};

export function randomChoice(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function cardName(card) {
  card.id.slice(0, card.id.length - 10);
}

export function correctCardOrder(container) {
  const cards = container.querySelectorAll(".card-container");
  let indexTrack = cards.length - 1;
  for (let i = cards.length; i > 0; i--) {
    cards[indexTrack].style.zIndex = `${i}`;
    indexTrack--;
  }
  return cards;
}

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

  if (cardsInHand.length != 0) {
    if (
      cardsInHand.length * Array.from(cardsInHand)[0].offsetWidth >=
      maxWidth
    ) {
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

const populateDeck = function (deck, cardBack) {
  for (let card of deck) {
    const parent = document.getElementById("deck");
    const container = document.createElement("div");
    const cardPiece = document.createElement("div");
    const front = document.createElement("div");
    const back = document.createElement("div");

    container.id = `${card}-container`;
    container.className = "card-container";
    container.style.flexShrink = 0;
    cardPiece.id = card;
    cardPiece.className = "card";
    front.id = "front";
    front.className = "front";
    front.style.backgroundImage = `url("../Images/Cards/${card}.png")`;
    back.id = "back";
    back.className = "back";
    back.style.backgroundImage = `url("../Images/Cards/Backs/${cardBack}.png")`;

    parent.appendChild(container);
    container.appendChild(cardPiece);
    cardPiece.appendChild(front);
    cardPiece.appendChild(back);
  }
};
populateDeck(deck, cardBack);

crazyEights(deck, cardBack);
