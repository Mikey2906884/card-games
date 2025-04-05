import { crazyEights } from "./Crazy Eights/game.js";

import { shuffle, createDeck } from "./shared.js";

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

  const bgSelectMainContainer = document.createElement("div");
  Object.assign(bgSelectMainContainer, {
    id: "bg-select-main-container",
    className: "bg-select-main-container",
  });

  const bgSelectFlexContainer = document.createElement("div");
  Object.assign(bgSelectFlexContainer, {
    id: "bg-select-flex-container",
    className: "bg-select-flex-container",
  });

  const bgSelectTop = document.createElement("div");
  Object.assign(bgSelectTop, {
    id: "bg-select-top",
    className: "bg-select-top",
    textContent: "SELECT CARD BACK",
  });

  const bgSelectBottom = document.createElement("div");
  Object.assign(bgSelectBottom, {
    id: "bg-select-bottom",
    className: "bg-select-bottom",
    textContent: "STANDARD_BLUE",
  });

  const bgSelect = document.createElement("div");
  Object.assign(bgSelect, {
    id: "background-select",
    className: "background-select",
  });
  bgSelect.style.backgroundImage = `url("../Images/Cards/Backs/${bgSelectBottom.textContent}.png")`;

  const bgIncrement = document.createElement("div");
  Object.assign(bgIncrement, {
    id: "bg-increment",
    classList: "bg-increment button",
    textContent: "►",
  });

  const bgDecrement = document.createElement("div");
  Object.assign(bgDecrement, {
    id: "bg-decrement",
    classList: "bg-decrement button",
    textContent: "◄",
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
    classList: "launch-button button",
    textContent: "START GAME ►",
  });

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
    Object.assign(optionElement, {
      id: option.value,
      textContent: option.text,
    });

    if (!optionElement.textContent.includes("(COMING SOON)")) {
      optionElement.addEventListener("click", function () {
        gameSelectorHover.textContent = `${optionElement.textContent}▼`;

        if (optionElement.textContent === "CRAZY EIGHTS") {
          numPlayersContent.replaceChildren();
          numPlayersSelectorHover.textContent = "# PLAYERS: 2";

          numPlayerOptions = ["2", "3", "4"];

          numPlayerOptions.forEach((number) => {
            const numElement = document.createElement("div");
            Object.assign(numElement, {
              id: number,
              textContent: number,
            });

            numElement.addEventListener("click", function () {
              numPlayersSelectorHover.textContent = `# PLAYERS: ${number}`;
            });
            numPlayersContent.appendChild(numElement);
          });
        }
      });
    }
    selectContent.appendChild(optionElement);
  });

  const bgOptions = [
    "STANDARD_BLUE",
    "STANDARD_RED",
    "BLUE_WAVES",
    "PINK_WAVES",
    "LAUGHING_DRAGON",
    "GOOD_BOI",
    "GRUMPY_CAT",
    "FIRE",
    "STARS",
    "COSMOS",
    "RESIDENT_EXPERT",
    "NOT_A_BRIBE",
    "CARD_WASH",
    "CRAZY_EIGHTS",
  ];
  let bgOptionSelected = 0;

  bgIncrement.addEventListener("click", function () {
    if (bgOptionSelected === bgOptions.length - 1) bgOptionSelected = 0;
    else bgOptionSelected++;

    Object.assign(bgSelectBottom, {
      textContent: `${bgOptions[bgOptionSelected]}`,
    });
    bgSelect.style.backgroundImage = `url("../Images/Cards/Backs/${bgSelectBottom.textContent}.png")`;
  });

  bgDecrement.addEventListener("click", function () {
    if (bgOptionSelected === 0) bgOptionSelected = bgOptions.length - 1;
    else bgOptionSelected--;

    Object.assign(bgSelectBottom, {
      textContent: `${bgOptions[bgOptionSelected]}`,
    });
    bgSelect.style.backgroundImage = `url("../Images/Cards/Backs/${bgSelectBottom.textContent}.png")`;
  });

  gameArea.appendChild(notification);

  notification.appendChild(optionsBox);
  notification.appendChild(launchGameButton);
  notification.appendChild(bgSelectMainContainer);

  optionsBox.appendChild(gameSelector);
  optionsBox.appendChild(numPlayersSelector);

  gameSelector.appendChild(gameSelectorHover);
  gameSelector.appendChild(selectContent);

  numPlayersSelector.appendChild(numPlayersSelectorHover);
  numPlayersSelector.appendChild(numPlayersContent);

  bgSelectMainContainer.appendChild(bgSelectTop);
  bgSelectMainContainer.appendChild(bgSelectFlexContainer);
  bgSelectMainContainer.appendChild(bgSelectBottom);

  bgSelectFlexContainer.appendChild(bgDecrement);
  bgSelectFlexContainer.appendChild(bgSelect);
  bgSelectFlexContainer.appendChild(bgIncrement);

  const [deck, deckWithJokers] = createDeck();

  async function cardClick() {
    return new Promise((resolve) => {
      launchGameButton.addEventListener("click", function () {
        if (gameSelectorHover.textContent === "CRAZY EIGHTS▼") {
          globalThis.eightsCount = 0;
          globalThis.roundTracker = 1;
          globalThis.pointsTracker = [];
          shuffle(deck);
          crazyEights(
            deck,
            bgSelectBottom.textContent,
            parseInt(numPlayersSelectorHover.textContent.at(-1))
          );
          resolve;
        }
      });
    });
  }

  await cardClick();
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

startUp();
