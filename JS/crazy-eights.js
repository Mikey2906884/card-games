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

const correctHandVis = function (hand) {
  let maxWidth;
  const cardsInHand = hand.querySelectorAll(".card-container");

  if (Array.from(hand.classList).includes("h-hand")) {
    maxWidth = (parseInt(hand.style.maxWidth) / 100) * window.innerWidth;
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

    maxWidth = (parseInt(hand.style.maxWidth) / 100) * window.innerHeight;
  }

  if (hand.offsetWidth >= maxWidth) {
    if (hand.style.left) {
      hand.style.transform = `rotate(90deg) translate(0, 50%)`;
    } else if (hand.style.right) {
      hand.style.transform = `rotate(90deg) translate(0, -50%)`;
    }

    for (let card of cardsInHand) {
      card.style.marginRight = `-${
        (card.offsetWidth -
          (hand.offsetWidth - card.offsetWidth) / (cardsInHand.length - 1)) /
        2
      }px`;
      card.style.marginLeft = `-${
        (card.offsetWidth -
          (hand.offsetWidth - card.offsetWidth) / (cardsInHand.length - 1)) /
        2
      }px`;
    }
  } else {
    for (let card of cardsInHand) {
      card.style.marginRight = null;
      card.style.marginLeft = null;
    }
  }
};

const moveCard = function (from, to, card) {
  const cardPicker = document.getElementById(`${cardName(card)}-container`);
  const fromClassList = Array.from(from.classList);
  const toClassList = Array.from(to.classList);

  console.log(from.offsetWidth, from.offsetHeight);
  from.removeChild(cardPicker);
  console.log(from.offsetWidth);
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
    card.id = i;
    card.className = "card";
    front.id = "front";
    front.style.backgroundImage = `url("../Cards/${i}.png")`;
    back.id = "back";
    back.style.backgroundImage = `url("../Cards/Backs/${backColor}.png")`;

    parent.appendChild(container);
    container.appendChild(card);
    card.appendChild(front);
    card.appendChild(back);
  }
};

const createDiscard = function (deckDiv, gameArea) {
  const discard = document.createElement("div");

  [
    discard.id,
    discard.classList,
    discard.style.position,
    discard.style.display,
    discard.style.justifyContent,
    discard.style.alignItems,
    discard.style.height,
    discard.style.aspectRatio,
    discard.style.border,
    discard.style.borderRadius,
    discard.style.left,
  ] = [
    "discard-pile",
    "discard deck",
    "relative",
    "flex",
    "center",
    "center",
    `${(100 * deckDiv.offsetHeight) / window.innerHeight}vh`,
    "72 / 96",
    "5px solid grey",
    "10px",
    "1.5vw",
  ];
  deckDiv.style.left = "-1.5vw";

  gameArea.appendChild(discard);
  return discard;
};

const createPlayerHand = function (gameArea) {
  const playerHand = document.createElement("div");

  [
    playerHand.id,
    playerHand.classList,
    playerHand.style.position,
    playerHand.style.display,
    playerHand.style.maxWidth,
    playerHand.style.bottom,
    playerHand.style.margin,
  ] = [
    "player-hand",
    "hand h-hand player",
    "absolute",
    "flex",
    "50vw",
    "0",
    "0 auto",
  ];

  gameArea.appendChild(playerHand);
  return playerHand;
};

const createComHands = function (gameArea) {
  const comHands = [];

  for (let i = 0; i < 3; i++) {
    comHands.push(document.createElement("div"));
  }

  [
    comHands[0].id,
    comHands[0].classList,
    comHands[0].style.position,
    comHands[0].style.display,
    comHands[0].style.justifyContent,
    comHands[0].style.maxWidth,
    comHands[0].style.left,
    comHands[0].style.margin,
    comHands[0].style.transform,
  ] = [
    "com-hand-one",
    "hand v-hand",
    "absolute",
    "flex",
    "center",
    "50vh",
    "0",
    "auto 0",
    "rotate(-90deg)",
  ];

  [
    comHands[1].id,
    comHands[1].classList,
    comHands[1].style.position,
    comHands[1].style.display,
    comHands[1].style.maxWidth,
    comHands[1].style.top,
    comHands[1].style.margin,
  ] = [
    "com-hand-two",
    "hand h-hand",
    "absolute",
    "flex",
    "50vw",
    "0",
    "0 auto",
  ];

  [
    comHands[2].id,
    comHands[2].classList,
    comHands[2].style.position,
    comHands[2].style.display,
    comHands[2].style.maxWidth,
    comHands[2].style.right,
    comHands[2].style.margin,
    comHands[2].style.transform,
  ] = [
    "com-hand-three",
    "hand v-hand",
    "absolute",
    "flex",
    "50vh",
    "0",
    "auto 0",
    "rotate(90deg)",
  ];

  gameArea.appendChild(comHands[0]);
  gameArea.appendChild(comHands[1]);
  gameArea.appendChild(comHands[2]);
  return [comHands[0], comHands[1], comHands[2]];
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
  const playerHand = createPlayerHand(gameArea);
  const [comHandOne, comHandTwo, comHandThree] = createComHands(gameArea);
  const turnOrder = randBetween(1, 4);

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
  }
}
