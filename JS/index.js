import { crazyEights } from "./Crazy Eights/game.js";

import {
  shuffle,
  randomChoice,
  randBetween,
  cardName,
  correctCardOrder,
} from "./shared.js";

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

  shuffle(deck);
  shuffle(deckWithJokers);

  return [deck, deckWithJokers, cardBack];
};

const mainMenu = async function (gameArea) {
  const notification = document.createElement("div");
  Object.assign(notification, {
    id: "notification",
    className: "notification",
  });

  const optionsBox = document.createElement("div");
  Object.assign(optionsBox, { className: "options-box" });

  const gameSelector = document.createElement("div");
  Object.assign(gameSelector, { className: "game-select" });

  const gameSelectorHover = document.createElement("div");
  Object.assign(gameSelectorHover, {
    className: "hover-select",
    textContent: "SELECT GAME▼",
  });

  const selectContent = document.createElement("div");
  Object.assign(selectContent, { className: "game-select-content" });

  const numPlayersSelector = document.createElement("div");
  Object.assign(numPlayersSelector, { className: "game-select" });

  const numPlayersSelectorHover = document.createElement("div");
  Object.assign(numPlayersSelectorHover, {
    className: "hover-select",
    textContent: "# PLAYERS:",
  });

  const numPlayersContent = document.createElement("div");
  Object.assign(numPlayersContent, { className: "num-select-content" });

  const launchGameButton = document.createElement("div");
  Object.assign(launchGameButton, {
    className: "launch-button",
    textContent: "START GAME ►",
  });

  gameArea.appendChild(notification);
  notification.appendChild(optionsBox);
  notification.appendChild(launchGameButton);
  optionsBox.appendChild(gameSelector);
  optionsBox.appendChild(numPlayersSelector);
  gameSelector.appendChild(gameSelectorHover);
  gameSelector.appendChild(selectContent);
  numPlayersSelector.appendChild(numPlayersSelectorHover);
  numPlayersSelector.appendChild(numPlayersContent);

  const gameOptions = [
    { value: "crazy-eights", text: "CRAZY EIGHTS" },
    { value: "go-fish", text: "GO FISH (COMING SOON)" },
    { value: "old-maid", text: "OLD MAID (COMING SOON)" },
    { value: "solitaire", text: "SOLITAIRE (COMING SOON)" },
    { value: "kings-corners", text: "KINGS CORNERS (COMING SOON)" },
  ];

  let numPlayerOptions;

  gameOptions.forEach((option) => {
    const optionElement = document.createElement("div");
    optionElement.id = option.value;
    optionElement.textContent = option.text;
    if (!optionElement.textContent.includes("(COMING SOON)")) {
      optionElement.addEventListener("click", function () {
        gameSelectorHover.textContent = `${optionElement.textContent}▼`;

        if (numPlayersSelectorHover.textContent.at(-1) != 2) {
          numPlayersSelectorHover.textContent = "# PLAYERS: 2";

          numPlayerOptions = ["2", "3", "4"];

          numPlayerOptions.forEach((option) => {
            const optionElement = document.createElement("div");
            optionElement.id = option;
            optionElement.textContent = option;
            optionElement.addEventListener("click", function () {
              numPlayersSelectorHover.textContent = `# PLAYERS: ${option}`;
            });
            numPlayersContent.appendChild(optionElement);
          });
        }
      });
    }
    selectContent.appendChild(optionElement);
  });

  async function cardClick() {
    return new Promise((resolve) => {
      launchGameButton.addEventListener("click", function () {
        if (gameSelectorHover.textContent === "CRAZY EIGHTS▼") {
          shuffle(deck);
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

  await cardClick();

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
