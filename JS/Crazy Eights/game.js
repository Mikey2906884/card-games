import { startUp } from "../index.js";

import {
  randomChoice,
  randBetween,
  cardName,
  shuffle,
  moveCard,
  correctHandVis,
} from "../shared.js";

import {
  populateDeck,
  createDiscard,
  createHands,
  initialDeal,
  playerPlayedEight,
  comPlayedEight,
  deckCheck,
  pointsIncrease,
  playerDraw,
} from "./support.js";

const playerTurn = async function (playerHand, deck, discard, gameArea) {
  let topOfDiscard = Array.from(discard.querySelectorAll(".card-container")).at(
    -1
  );

  setTimeout(function () {
    playerHand.style.boxShadow = "0 0 200px lime";
    playerHand.style.backgroundColor = "#00ff0040";
  }, 1000);

  async function cardClick() {
    await new Promise((resolve) => {
      setTimeout(async function () {
        let Counter = 0;

        while (Counter === 0) {
          let cardsInHand = playerHand.querySelectorAll(".card-container");

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
              deck.style.cursor = null;
              deck.style.boxShadow = null;
            }

            card.playable = async function () {
              if (card.style.bottom) {
                card.style.bottom = null;
                card.style.boxShadow = null;
                moveCard(playerHand, discard, card, "CRAZY EIGHTS");

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

            card.addEventListener("click", card.playable);
          }

          if (Counter === 0) {
            await playerDraw(playerHand, deck, discard, topOfDiscard);
          }
        }
      }, 1000);
    });
  }

  await cardClick();

  for (let card of Array.from(playerHand.querySelectorAll(".card-container"))) {
    const newCardContainer = document.createElement("div");
    Object.assign(newCardContainer, {
      id: card.id,
      className: card.className,
    });
    Object.assign(newCardContainer.style, {
      position: card.style.position,
      marginLeft: card.style.marginLeft,
      marginRight: card.style.marginRight,
    });

    const newCardPiece = document.createElement("div");
    Object.assign(newCardPiece, {
      id: card.querySelector(".card").id,
      className: card.querySelector(".card").className,
    });
    newCardPiece.style.transform = card.querySelector(".card").style.transform;

    const newCardFront = document.createElement("div");
    Object.assign(newCardFront, {
      id: "front",
      className: "front",
    });
    newCardFront.style.backgroundImage =
      card.querySelector(".front").style.backgroundImage;

    const newCardBack = document.createElement("div");
    Object.assign(newCardBack, {
      id: "back",
      className: "back",
    });
    newCardBack.style.backgroundImage =
      card.querySelector(".back").style.backgroundImage;

    playerHand.removeChild(card);

    playerHand.appendChild(newCardContainer);
    newCardContainer.appendChild(newCardPiece);
    newCardPiece.appendChild(newCardFront);
    newCardPiece.appendChild(newCardBack);
    correctHandVis(playerHand, "CRAZY EIGHTS");
  }

  topOfDiscard = Array.from(discard.querySelectorAll(".card-container")).at(-1);

  topOfDiscard.removeEventListener("click", topOfDiscard.playable);
  topOfDiscard.removeEventListener("click", topOfDiscard.draw);
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
        moveCard(comHand, discard, play, "CRAZY EIGHTS");

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
          moveCard(deck, comHand, topOfDeck, "CRAZY EIGHTS");
          setTimeout(function () {
            deckCheck(deck, discard);
          }, 200);

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
                moveCard(comHand, discard, topOfDeck, "CRAZY EIGHTS");

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

const winner = async function (
  hand,
  playerHand,
  comHandOne,
  comHandTwo,
  comHandThree,
  numPlayers,
  turnOrder,
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
    return turnOrder;
  } else {
    const notification = document.createElement("div");
    Object.assign(notification, {
      id: "notification",
    });

    const optionsContainer = document.createElement("div");
    Object.assign(optionsContainer, {
      id: "♠♦♣♥",
    });

    const playAgain = document.createElement("div");
    Object.assign(playAgain, {
      classList: "play-again button",
      textContent: "PLAY AGAIN",
    });

    const mainMenu = document.createElement("div");
    Object.assign(mainMenu, {
      classList: "main-menu button",
      textContent: "MAIN MENU ►",
    });

    const continuer = document.createElement("div");
    Object.assign(continuer, {
      id: "continuer",
      classList: "continuer button",
      textContent: "NEXT ROUND ►",
    });

    const resultsContainer = document.createElement("div");
    Object.assign(resultsContainer, {
      id: "results",
    });

    const playerResults = document.createElement("div");
    const comOneResults = document.createElement("div");
    const comTwoResults = document.createElement("div");
    const comThreeResults = document.createElement("div");

    async function roundFinish() {
      return new Promise(function () {
        setTimeout(function () {
          notification.appendChild(resultsContainer);
          resultsContainer.appendChild(comOneResults);
          resultsContainer.appendChild(comTwoResults);
          resultsContainer.appendChild(comThreeResults);
          resultsContainer.appendChild(playerResults);

          if (roundTracker != 3) {
            notification.appendChild(continuer);
            continuer.addEventListener("click", function () {
              shuffle(deck);
              roundTracker++;
              crazyEights(deck, cardBack, numPlayers);
            });
          } else {
            setTimeout(function () {
              switch (numPlayers) {
                case 2:
                  if (pointsTracker[0] === Math.min(...pointsTracker)) {
                    notification.textContent = "COMPUTER 1 WINS!";
                  } else {
                    notification.textContent = "YOU WIN!";
                  }
                  break;

                case 3:
                  if (pointsTracker[0] === Math.min(...pointsTracker)) {
                    notification.textContent = "COMPUTER 1 WINS!";
                  } else if (pointsTracker[1] === Math.min(...pointsTracker)) {
                    notification.textContent = "COMPUTER 2 WINS!";
                  } else {
                    notification.textContent = "YOU WIN!";
                  }
                  break;

                case 4:
                  if (pointsTracker[0] === Math.min(...pointsTracker)) {
                    notification.textContent = "COMPUTER 1 WINS!";
                  } else if (pointsTracker[1] === Math.min(...pointsTracker)) {
                    notification.textContent = "COMPUTER 2 WINS!";
                  } else if (pointsTracker[2] === Math.min(...pointsTracker)) {
                    notification.textContent = "COMPUTER 3 WINS!";
                  } else {
                    notification.textContent = "YOU WIN!";
                  }
              }
              notification.appendChild(resultsContainer);
              notification.appendChild(optionsContainer);
              optionsContainer.appendChild(playAgain);
              optionsContainer.appendChild(mainMenu);
              resultsContainer.appendChild(comOneResults);
              resultsContainer.appendChild(comTwoResults);
              resultsContainer.appendChild(comThreeResults);
              resultsContainer.appendChild(playerResults);

              playAgain.addEventListener("click", function () {
                shuffle(deck);
                eightsCount = 0;
                roundTracker = 1;
                pointsTracker = [];
                crazyEights(deck, cardBack, numPlayers);
              });
              mainMenu.addEventListener("click", function () {
                gameArea.style.backgroundImage = null;
                gameArea.style.backgroundColor = null;
                startUp();
              });
            }, 2000);
          }
        }, 2000);
      });
    }

    switch (numPlayers) {
      case 2:
        if (hand.id.endsWith("two")) {
          notification.textContent = `COMPUTER WINS ROUND ${roundTracker}!`;
        } else {
          notification.textContent = `YOU WIN ROUND ${roundTracker}!`;
        }
        gameArea.appendChild(notification);

        pointsTracker[0] = pointsIncrease(comHandTwo, pointsTracker[0]);
        pointsTracker[1] = pointsIncrease(playerHand, pointsTracker[1]);

        comTwoResults.textContent = `COMPUTER: ${pointsTracker[0]}`;
        playerResults.textContent = `YOU: ${pointsTracker[1]}`;
        break;

      case 3:
        if (hand.id.endsWith("one")) {
          notification.textContent = `COMPUTER 1 WINS ROUND ${roundTracker}!`;
        } else if (hand.id.endsWith("three")) {
          notification.textContent = `COMPUTER 2 WINS ROUND ${roundTracker}!`;
        } else {
          notification.textContent = `YOU WIN ROUND ${roundTracker}!`;
        }
        gameArea.appendChild(notification);

        pointsTracker[0] = pointsIncrease(comHandOne, pointsTracker[0]);
        pointsTracker[1] = pointsIncrease(comHandThree, pointsTracker[1]);
        pointsTracker[2] = pointsIncrease(playerHand, pointsTracker[2]);

        comOneResults.textContent = `COMPUTER 1: ${pointsTracker[0]}`;
        comThreeResults.textContent = `COMPUTER 2: ${pointsTracker[1]}`;
        playerResults.textContent = `YOU: ${pointsTracker[2]}`;
        break;
      case 4:
        if (hand.id.endsWith("one")) {
          notification.textContent = `COMPUTER 1 WINS ROUND ${roundTracker}!`;
        } else if (hand.id.endsWith("two")) {
          notification.textContent = `COMPUTER 2 WINS ROUND ${roundTracker}!`;
        } else if (hand.id.endsWith("three")) {
          notification.textContent = `COMPUTER 3 WINS ROUND ${roundTracker}!`;
        } else {
          notification.textContent = `YOU WIN ROUND ${roundTracker}!`;
        }
        gameArea.appendChild(notification);

        pointsTracker[0] = pointsIncrease(comHandOne, pointsTracker[0]);
        pointsTracker[1] = pointsIncrease(comHandTwo, pointsTracker[1]);
        pointsTracker[2] = pointsIncrease(comHandThree, pointsTracker[2]);
        pointsTracker[3] = pointsIncrease(playerHand, pointsTracker[3]);

        comOneResults.textContent = `COMPUTER 1: ${pointsTracker[0]}`;
        comTwoResults.textContent = `COMPUTER 2: ${pointsTracker[1]}`;
        comThreeResults.textContent = `COMPUTER 3: ${pointsTracker[2]}`;
        playerResults.textContent = `YOU: ${pointsTracker[3]}`;
    }

    await roundFinish();
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
  Object.assign(backToMain, {
    id: "back-to-main",
    classList: "back-to-main button",
    textContent: "◄ BACK TO MAIN",
  });

  backToMain.addEventListener("click", function () {
    gameArea.style.backgroundImage = null;
    gameArea.style.backgroundColor = null;
    startUp();
  });

  gameArea.appendChild(backToMain);

  if (roundTracker === 1) {
    switch (numPlayers) {
      case 2:
        pointsTracker.push(0, 0);
        break;
      case 3:
        pointsTracker.push(0, 0, 0);
        break;
      case 4:
        pointsTracker.push(0, 0, 0, 0);
    }
  }

  let playing = true;

  while (playing) {
    switch (numPlayers) {
      case 2:
        switch (turnOrder) {
          case 1:
            await playerTurn(playerHand, deckDiv, discard, gameArea);
            turnOrder = await winner(
              playerHand,
              playerHand,
              comHandOne,
              comHandTwo,
              comHandThree,
              numPlayers,
              turnOrder,
              deck,
              cardBack,
              gameArea
            );
            break;
          case 2:
            await comTurn(comHandTwo, deckDiv, discard, gameArea);
            turnOrder = await winner(
              comHandTwo,
              playerHand,
              comHandOne,
              comHandTwo,
              comHandThree,
              numPlayers,
              turnOrder,
              deck,
              cardBack,
              gameArea
            );
        }
        break;
      case 3:
        switch (turnOrder) {
          case 1:
            await playerTurn(playerHand, deckDiv, discard, gameArea);
            turnOrder = await winner(
              playerHand,
              playerHand,
              comHandOne,
              comHandTwo,
              comHandThree,
              numPlayers,
              turnOrder,
              deck,
              cardBack,
              gameArea
            );
            break;
          case 2:
            await comTurn(comHandOne, deckDiv, discard, gameArea);
            turnOrder = await winner(
              comHandOne,
              playerHand,
              comHandOne,
              comHandTwo,
              comHandThree,
              numPlayers,
              turnOrder,
              deck,
              cardBack,
              gameArea
            );
            break;
          case 3:
            await comTurn(comHandThree, deckDiv, discard, gameArea);
            turnOrder = await winner(
              comHandThree,
              playerHand,
              comHandOne,
              comHandTwo,
              comHandThree,
              numPlayers,
              turnOrder,
              deck,
              cardBack,
              gameArea
            );
        }
        break;
      case 4:
        switch (turnOrder) {
          case 1:
            await playerTurn(playerHand, deckDiv, discard, gameArea);
            turnOrder = await winner(
              playerHand,
              playerHand,
              comHandOne,
              comHandTwo,
              comHandThree,
              numPlayers,
              turnOrder,
              deck,
              cardBack,
              gameArea
            );
            break;
          case 2:
            await comTurn(comHandOne, deckDiv, discard, gameArea);
            turnOrder = await winner(
              comHandOne,
              playerHand,
              comHandOne,
              comHandTwo,
              comHandThree,
              numPlayers,
              turnOrder,
              deck,
              cardBack,
              gameArea
            );
            break;
          case 3:
            await comTurn(comHandTwo, deckDiv, discard, gameArea);
            turnOrder = await winner(
              comHandTwo,
              playerHand,
              comHandOne,
              comHandTwo,
              comHandThree,
              numPlayers,
              turnOrder,
              deck,
              cardBack,
              gameArea
            );
            break;
          case 4:
            await comTurn(comHandThree, deckDiv, discard, gameArea);
            turnOrder = await winner(
              comHandThree,
              playerHand,
              comHandOne,
              comHandTwo,
              comHandThree,
              numPlayers,
              turnOrder,
              deck,
              cardBack,
              gameArea
            );
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
