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

const mainMenu = async function (gameArea) {
  const notification = document.createElement("div");
  const optionsBox = document.createElement("div");
  const gameSelector = document.createElement("div");
  const gameSelectorHover = document.createElement("div");
  const selectContent = document.createElement("div");
  const numPlayersSelector = document.createElement("div");
  const numPlayersSelectorHover = document.createElement("div");
  const numPlayersContent = document.createElement("div");
  const launchGame = document.createElement("div");

  notification.id = "notification";
  notification.className = "notification";
  optionsBox.className = "options-box";
  gameSelector.className = "game-select";
  gameSelectorHover.className = "hover-select";
  gameSelectorHover.textContent = "SELECT GAME";
  selectContent.className = "game-select-content";
  numPlayersSelector.className = "game-select";
  numPlayersSelectorHover.className = "hover-select";
  numPlayersSelectorHover.textContent = "# PLAYERS: 2";
  numPlayersContent.className = "num-select-content";
  launchGame.className = "launch-button";
  launchGame.textContent = "START GAME >";

  gameArea.appendChild(notification);
  notification.appendChild(optionsBox);
  notification.appendChild(launchGame);
  optionsBox.appendChild(gameSelector);
  optionsBox.appendChild(numPlayersSelector);
  gameSelector.appendChild(gameSelectorHover);
  gameSelector.appendChild(selectContent);
  numPlayersSelector.appendChild(numPlayersSelectorHover);
  numPlayersSelector.appendChild(numPlayersContent);

  const gameOptions = [
    { value: "crazy-eights", text: "CRAZY EIGHTS" },
    { value: "go-fish", text: "GO FISH (COMING SOON)" },
  ];

  gameOptions.forEach((option) => {
    const optionElement = document.createElement("div");
    optionElement.id = option.value;
    optionElement.textContent = option.text;
    if (!optionElement.textContent.includes("(COMING SOON)")) {
      optionElement.addEventListener("click", function () {
        gameSelectorHover.textContent = optionElement.textContent;
      });
    }
    selectContent.appendChild(optionElement);
  });

  const numPlayerOptions = ["2", "3", "4"];

  numPlayerOptions.forEach((option) => {
    const optionElement = document.createElement("div");
    optionElement.id = option;
    optionElement.textContent = option;
    optionElement.addEventListener("click", function () {
      numPlayersSelectorHover.textContent = `# PLAYERS: ${option}`;
    });
    numPlayersContent.appendChild(optionElement);
  });

  async function cardClick() {
    return new Promise((resolve) => {
      launchGame.addEventListener("click", function () {
        if (gameSelectorHover.textContent === "CRAZY EIGHTS") {
          crazyEights(
            deck,
            cardBack,
            parseInt(numPlayersSelectorHover.textContent.at(-1))
          );
          resolve;
        }
      });
    });
  }

  await new Promise(async function (resolve) {
    await cardClick();
    resolve();
  });

  return;
};

export async function startUp() {
  const gameArea = document.getElementById("game-area");
  const deckDiv = document.createElement("div");
  deckDiv.id = "deck";
  deckDiv.className = "deck";
  gameArea.innerHTML = "";
  gameArea.appendChild(deckDiv);

  mainMenu(gameArea);
}

const [deck, deckWithJokers, cardBack] = createDeck();
startUp();
