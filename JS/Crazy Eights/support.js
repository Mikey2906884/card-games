import { cardName, moveCard, correctHandVis, shuffle } from "../shared.js";

export function populateDeck(deck, cardBack) {
  const deckDiv = document.getElementById("deck");

  for (let card of deck) {
    const container = document.createElement("div");
    Object.assign(container, {
      id: `${card}-container`,
      className: "card-container",
    });

    const cardPiece = document.createElement("div");
    Object.assign(cardPiece, {
      id: card,
      className: "card",
    });

    const front = document.createElement("div");
    Object.assign(front, {
      id: "front",
      className: "front",
    });
    front.style.backgroundImage = `url("../Images/Cards/${card}.png")`;

    const back = document.createElement("div");
    Object.assign(back, {
      id: "back",
      className: "back",
    });
    back.style.backgroundImage = `url("../Images/Cards/Backs/${cardBack}.png")`;

    deckDiv.appendChild(container);
    container.appendChild(cardPiece);
    cardPiece.appendChild(front);
    cardPiece.appendChild(back);
  }
  return deckDiv;
}

export function createDiscard(deckDiv, gameArea) {
  const discard = document.createElement("div");
  Object.assign(discard, {
    id: "discard",
    classList: "discard deck",
  });
  discard.style.left = "1.5vw";
  deckDiv.style.left = "-1.5vw";

  gameArea.appendChild(discard);
  return discard;
}

export function createHands(gameArea, numPlayers) {
  const comHands = [];
  const playerHand = document.createElement("div");

  for (let i = 0; i < numPlayers - 1; i++) {
    comHands.push(document.createElement("div"));
  }

  switch (numPlayers) {
    case 2:
      Object.assign(comHands[0], {
        id: "com-hand-two",
        classList: "hand h-hand",
      });
      Object.assign(comHands[0].style, {
        maxWidth: "50vw",
        top: "0",
      });

      window.addEventListener("resize", () => {
        setTimeout(function () {
          const [playerHand, comHandTwo] = [
            document.getElementById("player-hand"),
            document.getElementById("com-hand-two"),
          ];
          correctHandVis(playerHand, "CRAZY EIGHTS");
          correctHandVis(comHandTwo, "CRAZY EIGHTS");
        }, 500);
      });

      gameArea.appendChild(comHands[0]);
      break;
    case 3:
      Object.assign(comHands[0], {
        id: "com-hand-one",
        classList: "hand v-hand",
      });
      Object.assign(comHands[0].style, {
        maxWidth: "50vh",
        left: "0",
      });

      Object.assign(comHands[1], {
        id: "com-hand-three",
        classList: "hand v-hand",
      });
      Object.assign(comHands[1].style, {
        maxWidth: "50vh",
        right: "0",
      });

      window.addEventListener("resize", () => {
        setTimeout(function () {
          const [playerHand, comHandOne, comHandThree] = [
            document.getElementById("player-hand"),
            document.getElementById("com-hand-one"),
            document.getElementById("com-hand-three"),
          ];
          correctHandVis(playerHand, "CRAZY EIGHTS");
          correctHandVis(comHandOne, "CRAZY EIGHTS");
          correctHandVis(comHandThree, "CRAZY EIGHTS");
        }, 500);
      });

      gameArea.appendChild(comHands[0]);
      gameArea.appendChild(comHands[1]);
      break;
    case 4:
      Object.assign(comHands[0], {
        id: "com-hand-one",
        classList: "hand v-hand",
      });
      Object.assign(comHands[0].style, {
        maxWidth: "50vh",
        left: "0",
      });

      Object.assign(comHands[1], {
        id: "com-hand-two",
        classList: "hand h-hand",
      });
      Object.assign(comHands[1].style, {
        maxWidth: "50vw",
        top: "0",
      });

      Object.assign(comHands[2], {
        id: "com-hand-three",
        classList: "hand v-hand",
      });
      Object.assign(comHands[2].style, {
        maxWidth: "50vh",
        right: "0",
      });

      window.addEventListener("resize", () => {
        setTimeout(function () {
          const [playerHand, comHandOne, comHandTwo, comHandThree] = [
            document.getElementById("player-hand"),
            document.getElementById("com-hand-one"),
            document.getElementById("com-hand-two"),
            document.getElementById("com-hand-three"),
          ];
          correctHandVis(playerHand, "CRAZY EIGHTS");
          correctHandVis(comHandOne, "CRAZY EIGHTS");
          correctHandVis(comHandTwo, "CRAZY EIGHTS");
          correctHandVis(comHandThree, "CRAZY EIGHTS");
        }, 500);
      });

      gameArea.appendChild(comHands[0]);
      gameArea.appendChild(comHands[1]);
      gameArea.appendChild(comHands[2]);
  }

  Object.assign(playerHand, {
    id: "player-hand",
    classList: "hand h-hand player",
  });
  Object.assign(playerHand.style, {
    maxWidth: "50vw",
    bottom: "0",
  });

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
          card.parentElement.id === "player-hand"
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
            maxWidth &&
          card.parentElement.id === "player-hand"
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

  gameArea.appendChild(playerHand);

  switch (numPlayers) {
    case 2:
      return [comHands[0], playerHand];
    case 3:
      return [comHands[0], comHands[1], playerHand];
    case 4:
      return [comHands[0], comHands[1], comHands[2], playerHand];
  }
}

export function initialDeal(
  deck,
  playerHand,
  comHandOne,
  comHandTwo,
  comHandThree,
  discard,
  numPlayers,
  turnOrder
) {
  let cardsInDeck = deck.querySelectorAll(".card-container");

  for (let i = 0; i < 5; i++) {
    switch (numPlayers) {
      case 2:
        switch (turnOrder) {
          case 1:
            moveCard(deck, playerHand, cardsInDeck[0], "CRAZY EIGHTS");
            moveCard(deck, comHandTwo, cardsInDeck[1], "CRAZY EIGHTS");
            break;
          case 2:
            moveCard(deck, comHandTwo, cardsInDeck[0], "CRAZY EIGHTS");
            moveCard(deck, playerHand, cardsInDeck[1], "CRAZY EIGHTS");
        }
        break;
      case 3:
        switch (turnOrder) {
          case 1:
            moveCard(deck, playerHand, cardsInDeck[0], "CRAZY EIGHTS");
            moveCard(deck, comHandOne, cardsInDeck[1], "CRAZY EIGHTS");
            moveCard(deck, comHandThree, cardsInDeck[2], "CRAZY EIGHTS");
            break;
          case 2:
            moveCard(deck, comHandOne, cardsInDeck[0], "CRAZY EIGHTS");
            moveCard(deck, comHandThree, cardsInDeck[1], "CRAZY EIGHTS");
            moveCard(deck, playerHand, cardsInDeck[2], "CRAZY EIGHTS");
            break;
          case 3:
            moveCard(deck, comHandThree, cardsInDeck[0], "CRAZY EIGHTS");
            moveCard(deck, playerHand, cardsInDeck[1], "CRAZY EIGHTS");
            moveCard(deck, comHandOne, cardsInDeck[2], "CRAZY EIGHTS");
        }
        break;
      case 4:
        switch (turnOrder) {
          case 1:
            moveCard(deck, playerHand, cardsInDeck[0], "CRAZY EIGHTS");
            moveCard(deck, comHandOne, cardsInDeck[1], "CRAZY EIGHTS");
            moveCard(deck, comHandTwo, cardsInDeck[2], "CRAZY EIGHTS");
            moveCard(deck, comHandThree, cardsInDeck[3], "CRAZY EIGHTS");
            break;
          case 2:
            moveCard(deck, comHandOne, cardsInDeck[0], "CRAZY EIGHTS");
            moveCard(deck, comHandTwo, cardsInDeck[1], "CRAZY EIGHTS");
            moveCard(deck, comHandThree, cardsInDeck[2], "CRAZY EIGHTS");
            moveCard(deck, playerHand, cardsInDeck[3], "CRAZY EIGHTS");
            break;
          case 3:
            moveCard(deck, comHandTwo, cardsInDeck[0], "CRAZY EIGHTS");
            moveCard(deck, comHandThree, cardsInDeck[1], "CRAZY EIGHTS");
            moveCard(deck, playerHand, cardsInDeck[2], "CRAZY EIGHTS");
            moveCard(deck, comHandOne, cardsInDeck[3], "CRAZY EIGHTS");
            break;
          case 4:
            moveCard(deck, comHandThree, cardsInDeck[0], "CRAZY EIGHTS");
            moveCard(deck, playerHand, cardsInDeck[1], "CRAZY EIGHTS");
            moveCard(deck, comHandOne, cardsInDeck[2], "CRAZY EIGHTS");
            moveCard(deck, comHandTwo, cardsInDeck[3], "CRAZY EIGHTS");
        }
    }

    cardsInDeck = deck.querySelectorAll(".card-container");
  }

  moveCard(deck, discard, cardsInDeck[0], "CRAZY EIGHTS");
}

export async function playerPlayedEight(cardPlayed, gameArea) {
  eightsCount += 1;
  await new Promise(async function (resolve) {
    const notification = document.createElement("div");
    Object.assign(notification, {
      id: "notification",
      textContent: "EIGHT PLAYED",
    });

    const suitesContainer = document.createElement("div");
    Object.assign(suitesContainer, { id: "♠♦♣♥" });

    const spades = document.createElement("div");
    Object.assign(spades, {
      className: "♠",
      textContent: "♠",
    });

    const diamonds = document.createElement("div");
    Object.assign(diamonds, {
      className: "♦",
      textContent: "♦",
    });

    const clovers = document.createElement("div");
    Object.assign(clovers, {
      className: "♣",
      textContent: "♣",
    });

    const hearts = document.createElement("div");
    Object.assign(hearts, {
      className: "♥",
      textContent: "♥",
    });

    let suiteChoice;

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
    await cardClick();

    notification.textContent = `CHANGED SUITE TO ${suiteChoice}`;

    setTimeout(function () {
      gameArea.removeChild(notification);
    }, 2000);

    setTimeout(function () {
      Object.assign(cardPlayed, {
        id: `8${eightsCount + suiteChoice}-container`,
      });

      Object.assign(cardPlayed.querySelector(".front").style, {
        backgroundImage: `url("../Images/Cards/8${suiteChoice}.png")`,
      });

      resolve();
    }, 3000);
  });
}

export async function comPlayedEight(suiteChoice, cardPlayed, gameArea) {
  eightsCount += 1;
  await new Promise(async function (resolve) {
    const notification = document.createElement("div");
    Object.assign(notification, {
      id: "notification",
      textContent: "EIGHT PLAYED",
    });

    gameArea.appendChild(notification);

    setTimeout(function () {
      notification.textContent = `CHANGED SUITE TO ${suiteChoice}`;
    }, 2000);

    setTimeout(function () {
      gameArea.removeChild(notification);
    }, 4000);

    setTimeout(function () {
      Object.assign(cardPlayed, {
        id: `8${eightsCount + suiteChoice}-container`,
      });

      Object.assign(cardPlayed.querySelector(".front").style, {
        backgroundImage: `url("../Images/Cards/8${suiteChoice}.png")`,
      });

      resolve();
    }, 5000);
  });
}

export async function deckCheck(deck, discard) {
  if (deck.querySelectorAll(".card-container").length === 0) {
    await new Promise(function (resolve) {
      for (let card of discard.querySelectorAll(".card-container")) {
        if (
          card != Array.from(discard.querySelectorAll(".card-container")).at(-1)
        ) {
          moveCard(discard, deck, card, "CRAZY EIGHTS");
        } else {
          resolve();
        }
      }
    });
    const deckArray = Array.from(deck.querySelectorAll(".card-container"));
    shuffle(deckArray);

    await new Promise(function () {
      for (let card of deckArray) {
        deck.removeChild(card);
        deck.appendChild(card);
      }
    });
  }
}

export function pointsIncrease(entity, trackerID) {
  for (let card of entity.querySelectorAll(".card-container")) {
    if (["1", "J", "Q", "K"].includes(cardName(card)[0])) {
      trackerID += 10;
    } else if (cardName(card)[0] === "A") {
      trackerID += 1;
    } else {
      trackerID += parseInt(cardName(card)[0]);
    }
  }
  return trackerID;
}

export async function playerDraw(playerHand, deck, discard, topOfDiscard) {
  return new Promise((resolve) => {
    let topOfDeck = Array.from(deck.querySelectorAll(".card-container")).at(-1);

    deck.style.cursor = "pointer";
    deck.style.boxShadow = "0 0 50px red";

    topOfDeck.draw = async function () {
      let drawing = 0;

      while (drawing === 0) {
        moveCard(deck, playerHand, topOfDeck, "CRAZY EIGHTS");

        topOfDeck.removeEventListener("click", topOfDeck.draw);

        setTimeout(function () {
          deckCheck(deck, discard);
        }, 500);

        await new Promise(function (resolve) {
          setTimeout(async function () {
            if (
              !(
                cardName(topOfDeck)[0] === cardName(topOfDiscard)[0] &&
                cardName(topOfDeck)[0] != "8"
              ) &&
              !(
                cardName(topOfDeck).at(-1) === cardName(topOfDiscard).at(-1) &&
                cardName(topOfDeck)[0] != "8"
              ) &&
              !(cardName(topOfDeck)[0] === "8")
            ) {
              topOfDeck = Array.from(
                deck.querySelectorAll(".card-container")
              ).at(-1);
              resolve();
            } else {
              drawing = 1;
              resolve();
            }
          }, 1000);
        });
      }
      resolve();
    };

    topOfDeck.addEventListener("click", topOfDeck.draw);
  });
}
