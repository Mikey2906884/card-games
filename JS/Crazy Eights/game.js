var eightsCount = 0;
var roundTracker = 1;
var pointsTracker = [];

import { startUp } from "../index.js";

import {
  randomChoice,
  randBetween,
  cardName,
  shuffle,
  moveCard,
} from "../shared.js";

import {
  populateDeck,
  createDiscard,
  createHands,
  initialDeal,
} from "./support.js";

const playerPlayedEight = async function (cardPlayed, gameArea) {
  eightsCount += 1;
  await new Promise(async function (resolve) {
    const notification = document.createElement("div");
    Object.assign(notification, {});
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
              moveCard(playerHand, discard, card, "CRAZY EIGHTS");

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
            moveCard(deck, playerHand, topOfDeck, "CRAZY EIGHTS");

            await deckCheck(deck, discard);

            topOfDeck.style.boxShadow = null;

            let doubleClick = topOfDeck.clickMe;

            topOfDeck = Array.from(deck.querySelectorAll(".card-container")).at(
              -1
            );
            topOfDeck.style.boxShadow = "0 0 50px red";
            topOfDeck.clickMe = doubleClick;

            setTimeout(function () {
              topOfDeck.addEventListener("click", topOfDeck.clickMe);
            }, 250);
          } else {
            moveCard(deck, playerHand, topOfDeck, "CRAZY EIGHTS");

            await deckCheck(deck, discard);

            topOfDeck.style.bottom = "3vh";

            setTimeout(async function () {
              topOfDeck.style.bottom = null;
              topOfDeck.style.boxShadow = null;
              moveCard(playerHand, discard, topOfDeck, "CRAZY EIGHTS");

              if (cardName(topOfDeck)[0] === "8") {
                await playerPlayedEight(topOfDeck, gameArea);
              }

              resolve();
            }, 2000);

            setTimeout(function () {
              playerHand.style.boxShadow = null;
              playerHand.style.backgroundColor = null;
            }, 2000);
          }
        };

        setTimeout(function () {
          topOfDeck.addEventListener("click", topOfDeck.clickMe);
        }, 250);
      }, 1000);
    });
  }

  await cardClick();
  for (let card of playerHand.querySelectorAll(".card-container")) {
    card.removeEventListener("click", card.clickMe);
    topOfDeck.removeEventListener("click", topOfDeck.clickMe);
    card.style.bottom = null;
    card.style.boxShadow = null;
  }
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

const deckCheck = async function (deck, discard) {
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

    for (let card of deckArray) {
      deck.removeChild(card);
      deck.appendChild(card);
    }
  }
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
    const optionsContainer = document.createElement("div");
    const playAgain = document.createElement("div");
    const mainMenu = document.createElement("div");
    const resultsContainer = document.createElement("div");
    const playerResults = document.createElement("div");
    const comOneResults = document.createElement("div");
    const comTwoResults = document.createElement("div");
    const comThreeResults = document.createElement("div");
    const continuer = document.createElement("div");

    playAgain.className = "play-again";
    mainMenu.className = "main-menu";
    optionsContainer.id = "♠♦♣♥";
    notification.id = "notification";
    continuer.id = "continuer";
    resultsContainer.id = "results";
    playAgain.textContent = "PLAY AGAIN";
    mainMenu.textContent = "MAIN MENU ►";
    continuer.textContent = "NEXT ROUND ►";

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
                roundTracker = 1;
                crazyEights(deck, cardBack, numPlayers);
                resolve;
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

        for (let card of comHandTwo.querySelectorAll(".card-container")) {
          if (["1", "J", "Q", "K"].includes(cardName(card)[0])) {
            pointsTracker[0] += 10;
          } else if (cardName(card)[0] === "A") {
            pointsTracker[0] += 1;
          } else {
            pointsTracker[0] += parseInt(cardName(card)[0]);
          }
        }
        for (let card of playerHand.querySelectorAll(".card-container")) {
          if (["1", "J", "Q", "K"].includes(cardName(card)[0])) {
            pointsTracker[1] += 10;
          } else if (cardName(card)[0] === "A") {
            pointsTracker[1] += 1;
          } else {
            pointsTracker[1] += parseInt(cardName(card)[0]);
          }
        }

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

        for (let card of comHandOne.querySelectorAll(".card-container")) {
          if (["1", "J", "Q", "K"].includes(cardName(card)[0])) {
            pointsTracker[0] += 10;
          } else if (cardName(card)[0] === "A") {
            pointsTracker[0] += 1;
          } else {
            pointsTracker[0] += parseInt(cardName(card)[0]);
          }
        }
        for (let card of comHandThree.querySelectorAll(".card-container")) {
          if (["1", "J", "Q", "K"].includes(cardName(card)[0])) {
            pointsTracker[1] += 10;
          } else if (cardName(card)[0] === "A") {
            pointsTracker[1] += 1;
          } else {
            pointsTracker[1] += parseInt(cardName(card)[0]);
          }
        }
        for (let card of playerHand.querySelectorAll(".card-container")) {
          if (["1", "J", "Q", "K"].includes(cardName(card)[0])) {
            pointsTracker[2] += 10;
          } else if (cardName(card)[0] === "A") {
            pointsTracker[2] += 1;
          } else {
            pointsTracker[2] += parseInt(cardName(card)[0]);
          }
        }

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

        for (let card of comHandOne.querySelectorAll(".card-container")) {
          if (["1", "J", "Q", "K"].includes(cardName(card)[0])) {
            pointsTracker[0] += 10;
          } else if (cardName(card)[0] === "A") {
            pointsTracker[0] += 1;
          } else {
            pointsTracker[0] += parseInt(cardName(card)[0]);
          }
        }
        for (let card of comHandTwo.querySelectorAll(".card-container")) {
          if (["1", "J", "Q", "K"].includes(cardName(card)[0])) {
            pointsTracker[1] += 10;
          } else if (cardName(card)[0] === "A") {
            pointsTracker[1] += 1;
          } else {
            pointsTracker[1] += parseInt(cardName(card)[0]);
          }
        }
        for (let card of comHandThree.querySelectorAll(".card-container")) {
          if (["1", "J", "Q", "K"].includes(cardName(card)[0])) {
            pointsTracker[2] += 10;
          } else if (cardName(card)[0] === "A") {
            pointsTracker[2] += 1;
          } else {
            pointsTracker[2] += parseInt(cardName(card)[0]);
          }
        }
        for (let card of playerHand.querySelectorAll(".card-container")) {
          if (["1", "J", "Q", "K"].includes(cardName(card)[0])) {
            pointsTracker[3] += 10;
          } else if (cardName(card)[0] === "A") {
            pointsTracker[3] += 1;
          } else {
            pointsTracker[3] += parseInt(cardName(card)[0]);
          }
        }

        comOneResults.textContent = `COMPUTER 1: ${pointsTracker[0]}`;
        comTwoResults.textContent = `COMPUTER 2: ${pointsTracker[1]}`;
        comThreeResults.textContent = `COMPUTER 3: ${pointsTracker[2]}`;
        playerResults.textContent = `YOU: ${pointsTracker[3]}`;
    }

    await new Promise(async function (resolve) {
      await roundFinish();
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
    gameArea.style.backgroundColor = null;
    startUp();
  });

  gameArea.appendChild(backToMain);

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
