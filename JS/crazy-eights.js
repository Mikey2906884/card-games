import { randomChoice, randBetween, correctHandVis, startUp } from "./index.js";
var eightsCount = 0;

Array.prototype.shuffle = function () {
  for (let i = this.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [this[i], this[j]] = [this[j], this[i]];
  }
  return this;
};

const cardName = (card) => card.id.slice(0, card.id.length - 10);

export function correctCardOrderEights(container) {
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
}

const moveCard = function (from, to, card) {
  const cardPicker = document.getElementById(`${cardName(card)}-container`);
  const fromClassList = Array.from(from.classList);
  const toClassList = Array.from(to.classList);

  from.removeChild(cardPicker);
  to.appendChild(cardPicker);
  correctCardOrderEights(to);

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
        if (cardName(card)[0] === "A") {
          card.style.order = "40";
        } else if (cardName(card)[0] === "1") {
          card.style.order = "49";
        } else if (cardName(card)[0] === "J") {
          card.style.order = "50";
        } else if (cardName(card)[0] === "Q") {
          card.style.order = "51";
        } else if (cardName(card)[0] === "K") {
          card.style.order = "52";
        } else {
          card.style.order = `${39 + parseInt(cardName(card)[0])}`;
        }
      } else if (cardName(card).at(-1) === "♣") {
        if (cardName(card)[0] === "A") {
          card.style.order = "27";
        } else if (cardName(card)[0] === "1") {
          card.style.order = "36";
        } else if (cardName(card)[0] === "J") {
          card.style.order = "37";
        } else if (cardName(card)[0] === "Q") {
          card.style.order = "38";
        } else if (cardName(card)[0] === "K") {
          card.style.order = "39";
        } else {
          card.style.order = `${26 + parseInt(cardName(card)[0])}`;
        }
      } else if (cardName(card).at(-1) === "♥") {
        if (cardName(card)[0] === "A") {
          card.style.order = "14";
        } else if (cardName(card)[0] === "1") {
          card.style.order = "23";
        } else if (cardName(card)[0] === "J") {
          card.style.order = "24";
        } else if (cardName(card)[0] === "Q") {
          card.style.order = "25";
        } else if (cardName(card)[0] === "K") {
          card.style.order = "26";
        } else {
          card.style.order = `${13 + parseInt(cardName(card)[0])}`;
        }
      } else if (cardName(card).at(-1) === "♠") {
        if (cardName(card)[0] === "A") {
          card.style.order = "1";
        } else if (cardName(card)[0] === "1") {
          card.style.order = "10";
        } else if (cardName(card)[0] === "J") {
          card.style.order = "11";
        } else if (cardName(card)[0] === "Q") {
          card.style.order = "12";
        } else if (cardName(card)[0] === "K") {
          card.style.order = "13";
        } else {
          card.style.order = `${parseInt(cardName(card)[0])}`;
        }
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

const populateDeck = function (deck, cardBack) {
  const deckDiv = document.getElementById("deck");

  for (let card of deck) {
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

    deckDiv.appendChild(container);
    container.appendChild(cardPiece);
    cardPiece.appendChild(front);
    cardPiece.appendChild(back);
  }

  return deckDiv;
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

const createHands = function (gameArea, numPlayers) {
  const comHands = [];
  const playerHand = document.createElement("div");

  for (let i = 0; i < numPlayers - 1; i++) {
    comHands.push(document.createElement("div"));
  }

  switch (numPlayers) {
    case 2:
      [
        comHands[0].id,
        comHands[0].classList,
        comHands[0].style.maxWidth,
        comHands[0].style.top,
      ] = ["com-hand-two", "hand h-hand", "50vw", "0"];

      window.addEventListener("resize", () => {
        setTimeout(function () {
          const [playerHand, comHandTwo] = [
            document.getElementById("player-hand"),
            document.getElementById("com-hand-two"),
          ];
          correctHandVis(playerHand);
          correctHandVis(comHandTwo);
        }, 500);
      });

      gameArea.appendChild(comHands[0]);
      break;
    case 3:
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
        comHands[1].style.right,
      ] = ["com-hand-three", "hand v-hand", "50vh", "0"];

      window.addEventListener("resize", () => {
        setTimeout(function () {
          const [playerHand, comHandOne, comHandThree] = [
            document.getElementById("player-hand"),
            document.getElementById("com-hand-one"),
            document.getElementById("com-hand-three"),
          ];
          correctHandVis(playerHand);
          correctHandVis(comHandOne);
          correctHandVis(comHandThree);
        }, 500);
      });

      gameArea.appendChild(comHands[0]);
      gameArea.appendChild(comHands[1]);
      break;
    case 4:
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
  }

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
      break;
    case 3:
      return [comHands[0], comHands[1], playerHand];
      break;
    case 4:
      return [comHands[0], comHands[1], comHands[2], playerHand];
  }
};

const initialDeal = function (
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
            moveCard(deck, playerHand, cardsInDeck[0]);
            moveCard(deck, comHandTwo, cardsInDeck[1]);
            break;
          case 2:
            moveCard(deck, comHandTwo, cardsInDeck[0]);
            moveCard(deck, playerHand, cardsInDeck[1]);
        }
        break;
      case 3:
        switch (turnOrder) {
          case 1:
            moveCard(deck, playerHand, cardsInDeck[0]);
            moveCard(deck, comHandOne, cardsInDeck[1]);
            moveCard(deck, comHandThree, cardsInDeck[2]);
            break;
          case 2:
            moveCard(deck, comHandOne, cardsInDeck[0]);
            moveCard(deck, comHandThree, cardsInDeck[1]);
            moveCard(deck, playerHand, cardsInDeck[2]);
            break;
          case 3:
            moveCard(deck, comHandThree, cardsInDeck[0]);
            moveCard(deck, playerHand, cardsInDeck[1]);
            moveCard(deck, comHandOne, cardsInDeck[2]);
        }
        break;
      case 4:
        switch (turnOrder) {
          case 1:
            moveCard(deck, playerHand, cardsInDeck[0]);
            moveCard(deck, comHandOne, cardsInDeck[1]);
            moveCard(deck, comHandTwo, cardsInDeck[2]);
            moveCard(deck, comHandThree, cardsInDeck[3]);
            break;
          case 2:
            moveCard(deck, comHandOne, cardsInDeck[0]);
            moveCard(deck, comHandTwo, cardsInDeck[1]);
            moveCard(deck, comHandThree, cardsInDeck[2]);
            moveCard(deck, playerHand, cardsInDeck[3]);
            break;
          case 3:
            moveCard(deck, comHandTwo, cardsInDeck[0]);
            moveCard(deck, comHandThree, cardsInDeck[1]);
            moveCard(deck, playerHand, cardsInDeck[2]);
            moveCard(deck, comHandOne, cardsInDeck[3]);
            break;
          case 4:
            moveCard(deck, comHandThree, cardsInDeck[0]);
            moveCard(deck, playerHand, cardsInDeck[1]);
            moveCard(deck, comHandOne, cardsInDeck[2]);
            moveCard(deck, comHandTwo, cardsInDeck[3]);
        }
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
  let topOfDeck = Array.from(deck.querySelectorAll(".card-container")).at(-1);

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

              card.removeEventListener("click", card.clickMe);
              resolve();
            }
          };

          card.addEventListener("click", card.clickMe);
        }
        if (Counter === 0) {
          topOfDeck.style.cursor = "pointer";
          topOfDeck.style.boxShadow = "0 0 50px red";
        }

        topOfDeck.clickMe = async function () {
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
          } else if (
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
            moveCard(deck, playerHand, topOfDeck);
            deckCheck(deck, discard);
            topOfDeck.style.boxShadow = null;
            topOfDeck.removeEventListener("click", topOfDeck.clickMe);

            let double = topOfDeck.clickMe;

            topOfDeck = Array.from(deck.querySelectorAll(".card-container")).at(
              -1
            );
            topOfDeck.style.boxShadow = "0 0 50px red";
            topOfDeck.clickMe = double;

            topOfDeck.addEventListener("click", topOfDeck.clickMe);
          } else {
            moveCard(deck, playerHand, topOfDeck);

            topOfDeck.style.bottom = "3vh";
            topOfDeck.style.boxShadow = "0 0 25px white";

            setTimeout(async function () {
              topOfDeck.style.bottom = null;
              topOfDeck.style.boxShadow = null;
              moveCard(playerHand, discard, topOfDeck);

              if (cardName(topOfDeck)[0] === "8") {
                await playerPlayedEight(topOfDeck, gameArea);
              }

              resolve();
            }, 1000);

            setTimeout(function () {
              playerHand.style.boxShadow = null;
              playerHand.style.backgroundColor = null;
            }, 2000);
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
  let topOfDeck = Array.from(deck.querySelectorAll(".card-container")).at(-1);

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
              if (["1", "J", "Q", "K"].includes(cardName(card)[0])) {
                suiteCounts[0] += 11;
              } else if (cardName(card)[0] === "A") {
                suiteCounts[0] += 2;
              } else {
                suiteCounts[0] += 1 + parseInt(cardName(card)[0]);
              }
              break;
            case "♦":
              if (["1", "J", "Q", "K"].includes(cardName(card)[0])) {
                suiteCounts[1] += 11;
              } else if (cardName(card)[0] === "A") {
                suiteCounts[1] += 2;
              } else {
                suiteCounts[1] += 1 + parseInt(cardName(card)[0]);
              }
              break;
            case "♥":
              if (["1", "J", "Q", "K"].includes(cardName(card)[0])) {
                suiteCounts[2] += 11;
              } else if (cardName(card)[0] === "A") {
                suiteCounts[2] += 2;
              } else {
                suiteCounts[2] += 1 + parseInt(cardName(card)[0]);
              }
              break;
            case "♣":
              if (["1", "J", "Q", "K"].includes(cardName(card)[0])) {
                suiteCounts[3] += 11;
              } else if (cardName(card)[0] === "A") {
                suiteCounts[3] += 2;
              } else {
                suiteCounts[3] += 1 + parseInt(cardName(card)[0]);
              }
          }
        }
      }

      if (playableCards.length != 0) {
        const cardScores = [];

        for (let card of playableCards) {
          let score = 0;

          if (["1", "J", "Q", "K"].includes(cardName(card)[0])) {
            score += 10;
          } else if (cardName(card)[0] === "A") {
            score += 1;
          } else {
            score += parseInt(cardName(card)[0]);
          }

          for (let secondCard of playableCards) {
            if (
              cardName(secondCard).at(-1) === cardName(card).at(-1) &&
              cardName(secondCard)[0] != "8"
            ) {
              score += 1;
            }
          }

          cardScores.push(score);
        }

        play = playableCards[cardScores.indexOf(Math.max(...cardScores))];
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
        let drawing = 0;

        while (drawing === 0) {
          moveCard(deck, comHand, topOfDeck);
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
                  cardName(topOfDeck).at(-1) ===
                    cardName(topOfDiscard).at(-1) &&
                  cardName(topOfDeck)[0] != "8"
                ) &&
                !(cardName(topOfDeck)[0] === "8")
              ) {
                topOfDeck = Array.from(
                  deck.querySelectorAll(".card-container")
                ).at(-1);
                resolve();
              } else {
                moveCard(comHand, discard, topOfDeck);

                if (cardName(topOfDeck)[0] === "8") {
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

                  await comPlayedEight(suiteChoice, topOfDeck, gameArea);

                  drawing = 1;
                  resolve();
                } else {
                  drawing = 1;
                  resolve();
                }
              }
            }, 1000);
          });
        }
      }

      setTimeout(function () {
        comHand.style.boxShadow = null;
        comHand.style.backgroundColor = null;
      }, 1000);

      resolve();
    }, 2000);
  });
};

const deckCheck = async function (deck, discard) {
  if (deck.querySelectorAll(".card-container").length === 0) {
    await new Promise(function (resolve) {
      for (let card of discard.querySelectorAll(".card-container")) {
        if (
          card != Array.from(discard.querySelectorAll(".card-container")).at(-1)
        ) {
          moveCard(discard, deck, card);
        } else {
          resolve();
        }
      }
    });
    const deckArray = Array.from(deck.querySelectorAll(".card-container"));
    deckArray.shuffle();

    for (let card of deckArray) {
      deck.removeChild(card);
      deck.appendChild(card);
    }
  }
};

const winner = async function (
  hand,
  numPlayers,
  turnOrder,
  playing,
  deck,
  cardBack,
  gameArea
) {
  if (hand.querySelectorAll(".card-container").length != 0) {
    if (turnOrder < numPlayers) {
      turnOrder++;
    } else {
      turnOrder = 1;
    }
    playing = true;
    return [turnOrder, playing];
  } else {
    const notification = document.createElement("div");
    const optionsContainer = document.createElement("div");
    const playAgain = document.createElement("div");
    const mainMenu = document.createElement("div");

    playAgain.className = "play-again";
    mainMenu.className = "main-menu";
    optionsContainer.id = "♠♦♣♥";
    notification.id = "notification";
    playAgain.textContent = "PLAY AGAIN";
    mainMenu.textContent = "MAIN MENU >";

    if (hand.id.startsWith("com")) {
      notification.textContent = "COMPUTER WINS!";
    } else {
      notification.textContent = "YOU WIN!";
    }
    gameArea.appendChild(notification);

    async function cardClick() {
      return new Promise((resolve) => {
        setTimeout(function () {
          notification.appendChild(optionsContainer);
          optionsContainer.appendChild(playAgain);
          optionsContainer.appendChild(mainMenu);

          playAgain.addEventListener("click", function () {
            deck.shuffle();
            crazyEights(deck, cardBack, numPlayers);
            resolve;
          });
          mainMenu.addEventListener("click", function () {
            gameArea.style.backgroundImage = null;
            gameArea.style.backgroundColor = null;
            startUp();
            resolve();
          });
        }, 2000);
      });
    }

    await new Promise(async function (resolve) {
      await cardClick();
      resolve();
    });
  }
};

const gamePlay = async function (
  deckDiv,
  playerHand,
  comHandOne,
  comHandTwo,
  comHandThree,
  discard,
  numPlayers,
  turnOrder,
  gameArea,
  deck,
  cardBack
) {
  const backToMain = document.createElement("div");
  backToMain.id = "back-to-main";
  backToMain.textContent = "◄ BACK TO MAIN";

  backToMain.addEventListener("click", function () {
    gameArea.style.backgroundImage = null;
    startUp();
  });

  gameArea.appendChild(backToMain);

  let playing = true;

  while (playing) {
    switch (numPlayers) {
      case 2:
        switch (turnOrder) {
          case 1:
            await playerTurn(playerHand, deckDiv, discard, gameArea);
            [turnOrder, playing] = await winner(
              playerHand,
              numPlayers,
              turnOrder,
              playing,
              deck,
              cardBack,
              gameArea
            );
            deckCheck(deckDiv, discard);
            break;
          case 2:
            await comTurn(comHandTwo, deckDiv, discard, gameArea);
            [turnOrder, playing] = await winner(
              comHandTwo,
              numPlayers,
              turnOrder,
              playing,
              deck,
              cardBack,
              gameArea
            );
            deckCheck(deckDiv, discard);
        }
        break;
      case 3:
        switch (turnOrder) {
          case 1:
            await playerTurn(playerHand, deckDiv, discard, gameArea);
            [turnOrder, playing] = await winner(
              playerHand,
              numPlayers,
              turnOrder,
              playing,
              deck,
              cardBack,
              gameArea
            );
            deckCheck(deckDiv, discard);
            break;
          case 2:
            await comTurn(comHandOne, deckDiv, discard, gameArea);
            [turnOrder, playing] = await winner(
              comHandOne,
              numPlayers,
              turnOrder,
              playing,
              deck,
              cardBack,
              gameArea
            );
            deckCheck(deckDiv, discard);
            break;
          case 3:
            await comTurn(comHandThree, deckDiv, discard, gameArea);
            [turnOrder, playing] = await winner(
              comHandThree,
              numPlayers,
              turnOrder,
              playing,
              deck,
              cardBack,
              gameArea
            );
            deckCheck(deckDiv, discard);
        }
        break;
      case 4:
        switch (turnOrder) {
          case 1:
            await playerTurn(playerHand, deckDiv, discard, gameArea);
            [turnOrder, playing] = await winner(
              playerHand,
              numPlayers,
              turnOrder,
              playing,
              deck,
              cardBack,
              gameArea
            );
            deckCheck(deckDiv, discard);
            break;
          case 2:
            await comTurn(comHandOne, deckDiv, discard, gameArea);
            [turnOrder, playing] = await winner(
              comHandOne,
              numPlayers,
              turnOrder,
              playing,
              deck,
              cardBack,
              gameArea
            );
            deckCheck(deckDiv, discard);
            break;
          case 3:
            await comTurn(comHandTwo, deckDiv, discard, gameArea);
            [turnOrder, playing] = await winner(
              comHandTwo,
              numPlayers,
              turnOrder,
              playing,
              deck,
              cardBack,
              gameArea
            );
            deckCheck(deckDiv, discard);
            break;
          case 4:
            await comTurn(comHandThree, deckDiv, discard, gameArea);
            [turnOrder, playing] = await winner(
              comHandThree,
              numPlayers,
              turnOrder,
              playing,
              deck,
              cardBack,
              gameArea
            );
            deckCheck(deckDiv, discard);
        }
    }
  }
};

export function crazyEights(deck, cardBack, numPlayers) {
  const gameArea = document.getElementById("game-area");
  let deckDiv = document.createElement("div");
  deckDiv.id = "deck";
  deckDiv.className = "deck";
  gameArea.innerHTML = "";
  gameArea.appendChild(deckDiv);

  gameArea.style.backgroundImage = "url('../Images/Backgrounds/CRAZY_BG.png')";
  gameArea.style.backgroundColor = "#FAC64C";

  deckDiv = populateDeck(deck, cardBack);
  const discard = createDiscard(deckDiv, gameArea);
  let comHandOne;
  let comHandTwo;
  let comHandThree;
  let playerHand;

  switch (numPlayers) {
    case 2:
      [comHandTwo, playerHand] = createHands(gameArea, numPlayers);
      break;
    case 3:
      [comHandOne, comHandThree, playerHand] = createHands(
        gameArea,
        numPlayers
      );
      break;
    case 4:
      [comHandOne, comHandTwo, comHandThree, playerHand] = createHands(
        gameArea,
        numPlayers
      );
  }
  let turnOrder = randBetween(1, numPlayers);

  initialDeal(
    deckDiv,
    playerHand,
    comHandOne,
    comHandTwo,
    comHandThree,
    discard,
    numPlayers,
    turnOrder
  );
  gamePlay(
    deckDiv,
    playerHand,
    comHandOne,
    comHandTwo,
    comHandThree,
    discard,
    numPlayers,
    turnOrder,
    gameArea,
    deck,
    cardBack
  );
}
