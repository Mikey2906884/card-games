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
          correctHandVis(playerHand, "CRAZY EIGHTS");
          correctHandVis(comHandOne, "CRAZY EIGHTS");
          correctHandVis(comHandThree, "CRAZY EIGHTS");
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
}
