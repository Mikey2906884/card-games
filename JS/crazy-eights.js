import { randomChoice, randBetween, correctHandVis } from "./index.js";

const cardName = (card) => card.id.slice(0, card.id.length - 10);

const correctCardOrder = (container) => {
  const cards = container.querySelectorAll(".card-container");
  let indexTrack = cards.length - 1;
  for (let i = cards.length; i > 0; i--) {
    cards[indexTrack].style.zIndex = `${i}`;

    if (
      cardName(cards[indexTrack])[0] === "8" &&
      container.id === "player-hand"
    ) {
      cards[indexTrack].style.zIndex = "0";
    } else if (
      cardName(cards[indexTrack]).at(-1) === "♠" &&
      container.id === "player-hand"
    ) {
      cards[indexTrack].style.zIndex = "1";
    } else if (
      cardName(cards[indexTrack]).at(-1) === "♥" &&
      container.id === "player-hand"
    ) {
      cards[indexTrack].style.zIndex = "2";
    } else if (
      cardName(cards[indexTrack]).at(-1) === "♣" &&
      container.id === "player-hand"
    ) {
      cards[indexTrack].style.zIndex = "3";
    } else if (
      cardName(cards[indexTrack]).at(-1) === "♦" &&
      container.id === "player-hand"
    ) {
      cards[indexTrack].style.zIndex = "4";
    }
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

      if (cardName(card)[0] === "8") {
        card.style.order = "-1";
      } else if (cardName(card).at(-1) === "♦") {
        card.style.order = "4";
      } else if (cardName(card).at(-1) === "♣") {
        card.style.order = "3";
      } else if (cardName(card).at(-1) === "♥") {
        card.style.order = "2";
      } else if (cardName(card).at(-1) === "♠") {
        card.style.order = "1";
      }
    }

    card.style.position = "relative";
    correctHandVis(to);
  } else if (toClassList.includes("deck")) {
    card.style.position = "absolute";

    if (toClassList.includes("discard")) {
      card.querySelector(".card").style.transform = "rotateY(0deg)";
    }
  }
};

const createDiscard = function (deckDiv, gameArea) {
  const discard = document.createElement("div");

  [discard.id, discard.classList, discard.style.left] = [
    "discard",
    "discard deck",
    "1.5vw",
  ];
  deckDiv.style.left = "-1.5vw";

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
    }, 500);
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
  discard,
  turnOrder
) {
  let cardsInDeck = deck.querySelectorAll(".card-container");
  for (let i = 0; i < 7; i++) {
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

    cardsInDeck = deck.querySelectorAll(".card-container");
  }

  moveCard(deck, discard, cardsInDeck[0]);
};

const playedEight = function (suiteChoice, cardPlayed, gameArea) {
  setTimeout(function () {
    const notification = document.createElement("div");
    [
      notification.id,
      notification.style.position,
      notification.style.display,
      notification.style.justifyContent,
      notification.style.alignItems,
      notification.style.height,
      notification.style.width,
    ] = [
      "notification",
      "relative",
      "flex",
      "center",
      "center",
      "100%",
      "100%",
    ];
  }, 500);
};

const playerTurn = function (playerHand, discard) {
  const cardsInHand = playerHand.querySelectorAll(".card-container");
  const topOfDiscard = Array.from(
    discard.querySelectorAll(".card-container")
  ).at(-1);

  playerHand.style.boxShadow = "0 0 100px lime";
};

const comTurn = function (comHand, discard) {
  const cardsInHand = comHand.querySelectorAll(".card-container");
  const topOfDiscard = Array.from(
    discard.querySelectorAll(".card-container")
  ).at(-1);

  comHand.style.boxShadow = "0 0 100px lime";

  setTimeout(function () {
    const playableCards = [];
    const eights = [];
    const suiteCounts = [0, 0, 0, 0];
    let play = null;
    let playedEight = false;

    for (let card of cardsInHand) {
      if (
        (cardName(card)[0] === cardName(topOfDiscard)[0] &&
          cardName(card)[0] != "8") ||
        (cardName(card).at(-1) === cardName(topOfDiscard).at(-1) &&
          cardName(card)[0] != "8")
      ) {
        playableCards.push(card);
      } else if (cardName(card)[0] === "8") {
        eights.push(card);
      } else {
        switch (cardName(card).at(-1)) {
          case "♠":
            suiteCounts[0] += 1;
            break;
          case "♦":
            suiteCounts[1] += 1;
            break;
          case "♥":
            suiteCounts[2] += 1;
            break;
          case "♣":
            suiteCounts[3] += 1;
            break;
        }
      }
    }

    if (playableCards.length != 0) {
      play = randomChoice(playableCards);
    } else if (eights.length != 0) {
      play = randomChoice(eights);
      playedEight = true;
    }

    if (play != null) {
      moveCard(comHand, discard, play);

      if (cardName(play)[0] === "8") {
      }
    }
  }, 2000);
};

export function crazyEights(deck, cardBack) {
  const gameArea = document.getElementById("game-area");
  const deckDiv = document.getElementById("deck");
  const discard = createDiscard(deckDiv, gameArea);
  const [comHandOne, comHandTwo, comHandThree, playerHand] =
    createHands(gameArea);
  const turnOrder = randBetween(1, 4);
  let playing = true;

  gameArea.style.backgroundImage = "url('../Images/Backgrounds/CRAZY_BG.png')";
  gameArea.style.backgroundSize = "contain";

  initialDeal(
    deckDiv,
    playerHand,
    comHandOne,
    comHandTwo,
    comHandThree,
    discard,
    turnOrder
  );

  while (playing) {
    switch (turnOrder) {
      case 1:
        playerTurn(playerHand, discard);
        if (winner(playerHand)) {
          playing = false;
          winnerFlag(playerHand);
        } else {
          turnOrder = 2;
        }
        break;
      case 2:
        comTurn(comHandOne, discard);
        if (winner(comHandOne)) {
          playing = false;
          winnerFlag(comHandOne);
        } else {
          turnOrder = 3;
        }
        break;
      case 3:
        comTurn(comHandTwo, discard);
        if (winner(comHandTwo)) {
          playing = false;
          winnerFlag(comHandTwo);
        } else {
          turnOrder = 4;
        }
        break;
      case 4:
        comTurn(comHandThree, discard);
        if (winner(comHandThree)) {
          playing = false;
          winnerFlag(comHandThree);
        } else {
          turnOrder = 1;
        }
    }
  }
}
