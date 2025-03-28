import { randomChoice, randBetween, correctHandVis } from "./index.js";
var eightsCount = 0;

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

const playerPlayedEight = async function (cardPlayed, gameArea) {
  eightsCount += 1;
  await new Promise(async function (resolve) {
    const notification = document.createElement("div");
    const suitesContainer = document.createElement("div");
    const spades = document.createElement("div");
    const diamonds = document.createElement("div");
    const clovers = document.createElement("div");
    const hearts = document.createElement("div");
    let suiteChoice;

    spades.className = "♠";
    diamonds.className = "♦";
    clovers.className = "♣";
    hearts.className = "♥";
    suitesContainer.id = "♠♦♣♥";
    notification.id = "notification";
    spades.textContent = "♠";
    diamonds.textContent = "♦";
    clovers.textContent = "♣";
    hearts.textContent = "♥";
    notification.textContent = "EIGHT PLAYED";
    gameArea.appendChild(notification);

    async function cardClick() {
      return new Promise((resolve) => {
        setTimeout(function () {
          notification.textContent = "PICK THE NEW SUITE";
          notification.appendChild(suitesContainer);
          suitesContainer.appendChild(spades);
          suitesContainer.appendChild(diamonds);
          suitesContainer.appendChild(clovers);
          suitesContainer.appendChild(hearts);

          spades.addEventListener("click", function () {
            suiteChoice = "♠";
            resolve();
          });
          diamonds.addEventListener("click", function () {
            suiteChoice = "♦";
            resolve();
          });
          clovers.addEventListener("click", function () {
            suiteChoice = "♣";
            resolve();
          });
          hearts.addEventListener("click", function () {
            suiteChoice = "♥";
            resolve();
          });
        }, 2000);
      });
    }

    await new Promise(async function (resolve) {
      await cardClick();
      resolve();
    });
    notification.textContent = `CHANGED SUITE TO ${suiteChoice}`;
    setTimeout(function () {
      gameArea.removeChild(notification);
    }, 2000);
    setTimeout(function () {
      [
        cardPlayed.id,
        cardPlayed.querySelector(".front").style.backgroundImage,
      ] = [
        `8${eightsCount + suiteChoice}-container`,
        `url("../Images/Cards/8${suiteChoice}.png")`,
      ];
      resolve();
    }, 3000);
  });
};

const comPlayedEight = async function (suiteChoice, cardPlayed, gameArea) {
  eightsCount += 1;
  await new Promise(async function (resolve) {
    const notification = document.createElement("div");
    notification.id = "notification";
    notification.textContent = "EIGHT PLAYED";
    gameArea.appendChild(notification);
    setTimeout(function () {
      notification.textContent = `CHANGED SUITE TO ${suiteChoice}`;
    }, 2000);
    setTimeout(function () {
      gameArea.removeChild(notification);
    }, 4000);
    setTimeout(function () {
      [
        cardPlayed.id,
        cardPlayed.querySelector(".front").style.backgroundImage,
      ] = [
        `8${eightsCount + suiteChoice}-container`,
        `url("../Images/Cards/8${suiteChoice}.png")`,
      ];
      resolve();
    }, 5000);
  });
};

const playerTurn = async function (playerHand, deck, discard, gameArea) {
  const cardsInHand = playerHand.querySelectorAll(".card-container");
  const topOfDiscard = Array.from(
    discard.querySelectorAll(".card-container")
  ).at(-1);
  const topOfDeck = Array.from(deck.querySelectorAll(".card-container")).at(-1);

  await new Promise(async function (resolve) {
    setTimeout(function () {
      playerHand.style.boxShadow = "0 0 200px lime";
      playerHand.style.backgroundColor = "#00ff0040";
    }, 1000);
    resolve();
  });

  async function cardClick() {
    return new Promise((resolve) => {
      setTimeout(function () {
        let Counter = 0;
        for (let card of cardsInHand) {
          if (
            (cardName(card)[0] === cardName(topOfDiscard)[0] &&
              cardName(card)[0] != "8") ||
            (cardName(card).at(-1) === cardName(topOfDiscard).at(-1) &&
              cardName(card)[0] != "8") ||
            cardName(card)[0] === "8"
          ) {
            Counter++;
            card.style.bottom = "3vh";
            card.style.boxShadow = "0 0 25px white";
          }

          card.clickMe = async function () {
            if (!card.style.bottom) {
              card.style.right = "3vh";
              setTimeout(function () {
                card.style.right = "-3vh";
              }, 100);
              setTimeout(function () {
                card.style.right = "3vh";
              }, 200);
              setTimeout(function () {
                card.style.right = "-3vh";
              }, 300);
              setTimeout(function () {
                card.style.right = null;
              }, 400);
            } else {
              card.style.bottom = null;
              card.style.boxShadow = null;
              moveCard(playerHand, discard, card);

              if (cardName(card)[0] === "8") {
                await playerPlayedEight(card, gameArea);
              }

              setTimeout(function () {
                playerHand.style.boxShadow = null;
                playerHand.style.backgroundColor = null;
              }, 1000);

              resolve();
            }
          };

          card.addEventListener("click", card.clickMe);
        }
        if (Counter === 0) {
          topOfDeck.style.cursor = "pointer";
          topOfDeck.style.boxShadow = "0 0 50px red";
        }

        topOfDeck.clickMe = function () {
          if (!topOfDeck.style.boxShadow) {
            topOfDeck.style.right = "3vh";
            setTimeout(function () {
              topOfDeck.style.right = "-3vh";
            }, 100);
            setTimeout(function () {
              topOfDeck.style.right = "3vh";
            }, 200);
            setTimeout(function () {
              topOfDeck.style.right = "-3vh";
            }, 300);
            setTimeout(function () {
              topOfDeck.style.right = null;
            }, 400);
          } else {
            moveCard(deck, playerHand, topOfDeck);

            setTimeout(function () {
              playerHand.style.boxShadow = null;
              playerHand.style.backgroundColor = null;
            }, 1000);

            resolve();
          }
        };

        topOfDeck.addEventListener("click", topOfDeck.clickMe);
      }, 1000);
    });
  }

  await new Promise(async function (resolve) {
    await cardClick();
    for (let card of playerHand.querySelectorAll(".card-container")) {
      card.removeEventListener("click", card.clickMe);
      topOfDeck.removeEventListener("click", topOfDeck.clickMe);
      card.style.bottom = null;
      card.style.boxShadow = null;
    }
    resolve();
  });
};

const comTurn = async function (comHand, deck, discard, gameArea) {
  const cardsInHand = comHand.querySelectorAll(".card-container");
  const topOfDiscard = Array.from(
    discard.querySelectorAll(".card-container")
  ).at(-1);
  const topOfDeck = Array.from(deck.querySelectorAll(".card-container")).at(-1);

  await new Promise(async function (resolve) {
    await new Promise(async function (resolve) {
      setTimeout(function () {
        comHand.style.boxShadow = "0 0 200px lime";
        comHand.style.backgroundColor = "#00ff0040";
      }, 1000);
      resolve();
    });

    setTimeout(async function () {
      const playableCards = [];
      const eights = [];
      const suiteCounts = [0, 0, 0, 0];
      let play = null;

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
      }

      if (play != null) {
        moveCard(comHand, discard, play);

        if (cardName(play)[0] === "8") {
          let suiteChoice;
          const highestSuiteCount = suiteCounts.indexOf(
            Math.max(...suiteCounts)
          );

          switch (highestSuiteCount) {
            case 0:
              suiteChoice = "♠";
              break;
            case 1:
              suiteChoice = "♦";
              break;
            case 2:
              suiteChoice = "♥";
              break;
            case 3:
              suiteChoice = "♣";
          }

          await comPlayedEight(suiteChoice, play, gameArea);
        }
      } else {
        moveCard(deck, comHand, topOfDeck);
      }

      setTimeout(function () {
        comHand.style.boxShadow = null;
        comHand.style.backgroundColor = null;
      }, 1000);

      resolve();
    }, 2000);
  });
};

const gamePlay = async function (
  deckDiv,
  playerHand,
  comHandOne,
  comHandTwo,
  comHandThree,
  discard,
  turnOrder,
  gameArea
) {
  let playing = true;

  while (playing) {
    switch (turnOrder) {
      case 1:
        await playerTurn(playerHand, deckDiv, discard, gameArea);
        turnOrder = 2;
        // if (winner(playerHand)) {
        //   playing = false;
        //   winnerFlag(playerHand);
        // } else {
        //   turnOrder = 2;
        // }
        break;
      case 2:
        await comTurn(comHandOne, deckDiv, discard, gameArea);
        turnOrder = 3;
        // if (winner(comHandOne)) {
        //   playing = false;
        //   winnerFlag(comHandOne);
        // } else {
        //   turnOrder = 3;
        // }
        break;
      case 3:
        await comTurn(comHandTwo, deckDiv, discard, gameArea);
        turnOrder = 4;
        // if (winner(comHandTwo)) {
        //   playing = false;
        //   winnerFlag(comHandTwo);
        // } else {
        //   turnOrder = 4;
        // }
        break;
      case 4:
        await comTurn(comHandThree, deckDiv, discard, gameArea);
        turnOrder = 1;
      // if (winner(comHandThree)) {
      //   playing = false;
      //   winnerFlag(comHandThree);
      // } else {
      //   turnOrder = 1;
      // }
    }
  }
};

export function crazyEights(deck, cardBack) {
  const gameArea = document.getElementById("game-area");
  const deckDiv = document.getElementById("deck");
  const discard = createDiscard(deckDiv, gameArea);
  const [comHandOne, comHandTwo, comHandThree, playerHand] =
    createHands(gameArea);
  let turnOrder = randBetween(1, 4);

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
  gamePlay(
    deckDiv,
    playerHand,
    comHandOne,
    comHandTwo,
    comHandThree,
    discard,
    turnOrder,
    gameArea
  );
}
