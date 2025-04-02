import { shuffle } from "./shared";

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
        numPlayersSelectorHover.textContent = "# PLAYERS: 2";

        numPlayerOptions = ["2", "3", "4"];

        numPlayerOptions.forEach((number) => {
          const numElement = document.createElement("div");
          Object.assign(numElement, {
            id: number,
            textContent: number,
          });

          numElement.addEventListener("click", function () {
            numPlayersSelectorHover.textContent = `# PLAYERS: ${option}`;
          });
          numPlayersContent.appendChild(numElement);
        });
      }
    });
  }
  selectContent.appendChild(optionElement);
});
