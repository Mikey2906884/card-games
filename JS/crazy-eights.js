import { correctHandVis } from "./index.js";

function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const cardName = (card) => card.id.slice(0, card.id.length - 10);

const correctCardOrder = (container) => {
  const cards = container.querySelectorAll(".card-container");
  let indexTrack = cards.length - 1;
  for (let i = cards.length; i > 0; i--) {
    cards[indexTrack].style.zIndex = `${i}`;
    indexTrack--;
  }
  return cards;
};

const moveCard = function (from, to, card) {
  const cardPicker = document.getElementById(`${cardName(card)}-container`);
  const fromClassList = Array.from(from.classList);
  const toClassList = Array.from(to.classList);

  from.removeChild(cardPicker);
  to.appendChild(cardPicker);
  correctCardOrder(to);

  if (fromClassList.includes("hand")) {
    correctHandVis(from);
  }

  if (fromClassList.includes("discard")) {
    card.querySelector(".card").style.transform = "rotateY(180deg)";
  }

  if (toClassList.includes("hand")) {
    if (toClassList.includes("player")) {
      card.querySelector(".card").style.transform = "rotateY(0deg)";
    }

    card.style.position = "relative";
    correctHandVis(to);
  } else if (toClassList.includes("deck")) {
    card.style.position = "absolute";
    card.style.marginRight = null;
    card.style.marginLeft = null;

    if (toClassList.includes("discard")) {
      card.querySelector(".card").style.transform = "rotateY(0deg)";
    }
  }
};

const populateDeck = function (deck, backColor) {
  for (let i of deck) {
    const parent = document.getElementById("deck");
    const container = document.createElement("div");
    const card = document.createElement("div");
    const front = document.createElement("div");
    const back = document.createElement("div");

    container.id = `${i}-container`;
    container.className = "card-container";
    container.style.flexShrink = 0;
    card.id = i;
    card.className = "card";
    front.id = "front";
    front.style.backgroundImage = `url("../Images/Cards/${i}.png")`;
    back.id = "back";
    back.style.backgroundImage = `url("../Images/Cards/Backs/${backColor}.png")`;

    parent.appendChild(container);
    container.appendChild(card);
    card.appendChild(front);
    card.appendChild(back);
  }
};

const createDiscard = function (deckDiv, gameArea) {
  const discard = document.createElement("div");

  [discard.id, discard.classList] = ["discard", "discard deck"];

  gameArea.appendChild(discard);
  return discard;
};

const createHands = function (gameArea) {
  const comHands = [];
  const playerHand = document.createElement("div");

  for (let i = 0; i < 3; i++) {
    comHands.push(document.createElement("div"));
  }

  [
    comHands[0].id,
    comHands[0].classList,
    comHands[0].style.maxWidth,
    comHands[0].style.left,
  ] = ["com-hand-one", "hand v-hand", "50vh", "0"];

  [
    comHands[1].id,
    comHands[1].classList,
    comHands[1].style.maxWidth,
    comHands[1].style.top,
  ] = ["com-hand-two", "hand h-hand", "50vw", "0"];

  [
    comHands[2].id,
    comHands[2].classList,
    comHands[2].style.maxWidth,
    comHands[2].style.right,
  ] = ["com-hand-three", "hand v-hand", "50vh", "0"];

  [
    playerHand.id,
    playerHand.classList,
    playerHand.style.maxWidth,
    playerHand.style.bottom,
  ] = ["player-hand", "hand h-hand player", "50vw", "0"];

  playerHand.addEventListener("mouseover", () => {
    const cardsInHand = playerHand.querySelectorAll(".card-container");
    const maxWidth =
      (parseFloat(playerHand.style.maxWidth) / 100) * window.innerWidth;

    for (let card of cardsInHand) {
      card.addEventListener("mouseenter", function () {
        card.style.marginRight = null;
        card.style.marginLeft = null;

        if (
          cardsInHand.length * Array.from(cardsInHand)[0].offsetWidth >=
            maxWidth &&
          card.parentElement.id == "player-hand"
        ) {
          card.style.marginRight = `-${
            (card.offsetWidth -
              (maxWidth - card.offsetWidth) / (cardsInHand.length - 1)) /
              2 -
            (0.9 *
              (card.offsetWidth -
                (maxWidth - card.offsetWidth) / (cardsInHand.length - 1))) /
              2
          }px`;
          card.style.marginLeft = `-${
            (card.offsetWidth -
              (maxWidth - card.offsetWidth) / (cardsInHand.length - 1)) /
              2 -
            (0.25 *
              (card.offsetWidth -
                (maxWidth - card.offsetWidth) / (cardsInHand.length - 1))) /
              2
          }px`;
        }
      });
      card.addEventListener("mouseleave", function () {
        card.style.marginRight = null;
        card.style.marginLeft = null;

        if (
          cardsInHand.length * Array.from(cardsInHand)[0].offsetWidth >=
          maxWidth
        ) {
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
      });
    }
  });

  window.addEventListener("resize", () => {
    setTimeout(function () {
      const [playerHand, comHandOne, comHandTwo, comHandThree] = [
        document.getElementById("player-hand"),
        document.getElementById("com-hand-one"),
        document.getElementById("com-hand-two"),
        document.getElementById("com-hand-three"),
      ];
      correctHandVis(playerHand);
      correctHandVis(comHandOne);
      correctHandVis(comHandTwo);
      correctHandVis(comHandThree);
    }, 1000);
  });

  gameArea.appendChild(comHands[0]);
  gameArea.appendChild(comHands[1]);
  gameArea.appendChild(comHands[2]);
  gameArea.appendChild(playerHand);
  return [comHands[0], comHands[1], comHands[2], playerHand];
};

const initialDeal = function (
  deck,
  playerHand,
  comHandOne,
  comHandTwo,
  comHandThree,
  turnOrder
) {
  let cardsInDeck;
  for (let i = 0; i < 13; i++) {
    cardsInDeck = deck.querySelectorAll(".card-container");

    if (turnOrder === 1) {
      moveCard(deck, playerHand, cardsInDeck[0]);
      moveCard(deck, comHandOne, cardsInDeck[1]);
      moveCard(deck, comHandTwo, cardsInDeck[2]);
      moveCard(deck, comHandThree, cardsInDeck[3]);
    } else if (turnOrder === 2) {
      moveCard(deck, comHandOne, cardsInDeck[0]);
      moveCard(deck, comHandTwo, cardsInDeck[1]);
      moveCard(deck, comHandThree, cardsInDeck[2]);
      moveCard(deck, playerHand, cardsInDeck[3]);
    } else if (turnOrder === 3) {
      moveCard(deck, comHandTwo, cardsInDeck[0]);
      moveCard(deck, comHandThree, cardsInDeck[1]);
      moveCard(deck, playerHand, cardsInDeck[2]);
      moveCard(deck, comHandOne, cardsInDeck[3]);
    } else if (turnOrder === 4) {
      moveCard(deck, comHandThree, cardsInDeck[0]);
      moveCard(deck, playerHand, cardsInDeck[1]);
      moveCard(deck, comHandOne, cardsInDeck[2]);
      moveCard(deck, comHandTwo, cardsInDeck[3]);
    }
  }
};

export function crazyEights(deck, cardBack) {
  populateDeck(deck, cardBack);

  const gameArea = document.getElementById("game-area");
  const deckDiv = document.getElementById("deck");
  let cards = deckDiv.querySelectorAll(".card-container");
  const discard = createDiscard(deckDiv, gameArea);
  const [comHandOne, comHandTwo, comHandThree, playerHand] =
    createHands(gameArea);
  const turnOrder = randBetween(1, 4);

  gameArea.style.backgroundImage = "url('../Images/Backgrounds/CRAZY_BG.png')";
  gameArea.style.backgroundSize = "contain";
  initialDeal(
    deckDiv,
    playerHand,
    comHandOne,
    comHandTwo,
    comHandThree,
    turnOrder
  );

  for (let card of cards) {
    card.addEventListener("click", function () {
      const cardsInDeck = deckDiv.querySelectorAll(".card-container");
      const cardsInHand = comHandOne.querySelectorAll(".card-container");

      if (Array.from(cardsInDeck).includes(card)) {
        moveCard(deckDiv, comHandOne, card);
      } else if (Array.from(cardsInHand).includes(card)) {
        moveCard(comHandOne, deckDiv, card);
      }
    });
    card.addEventListener("click", function () {
      const cardsInDeck = discard.querySelectorAll(".card-container");
      const cardsInHand = playerHand.querySelectorAll(".card-container");

      if (Array.from(cardsInDeck).includes(card)) {
        moveCard(discard, playerHand, card);
      } else if (Array.from(cardsInHand).includes(card)) {
        moveCard(playerHand, discard, card);
      }
    });
  }
}
