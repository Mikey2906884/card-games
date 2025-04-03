export function randomChoice(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function cardName(card) {
  const name = card.id.slice(0, card.id.length - 10);
  return String(name);
}

export function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function createDeck() {
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
}

export function correctCardOrder(container, game) {
  let cards = container.querySelectorAll(".card-container");
  for (let card of cards) {
    if (container.id === "player-hand") {
      if (cardName(card).at(-1) === "♠") {
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
      } else if (cardName(card).at(-1) === "♦") {
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
      } else if (cardName(card).at(-1) === "♣") {
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
      } else if (cardName(card).at(-1) === "♥") {
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

      switch (game) {
        case "CRAZY EIGHTS":
          if (cardName(card)[0] === "8") {
            card.style.order = "-1";
          }
          break;
      }
    }
  }

  setTimeout(function () {
    for (let card of cards) {
      card.style.zIndex = `${card.style.order}`;

      switch (game) {
        case "CRAZY EIGHTS":
          if (cardName(card)[0] === "8") {
            card.style.zIndex = null;
          }
          break;
      }
    }
  }, 500);
}

export function correctHandVis(hand, game) {
  let maxWidth;
  const cardsInHand = hand.querySelectorAll(".card-container");
  correctCardOrder(hand, game);

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

export async function moveCard(from, to, card, game) {
  const fromClassList = Array.from(from.classList);
  const toClassList = Array.from(to.classList);

  card.style.display = "none";

  from.removeChild(card);
  to.appendChild(card);
  correctCardOrder(to, game);

  // CARD ANIMATION CONTROL
  await new Promise((resolve) => {
    Object.assign(card.style, {
      display: null,
      boxShadow: null,
      position: "fixed",
    });

    if (from.id === "com-hand-three") {
      card.style.top = `${from.offsetTop}px`;
      card.style.left = `${
        from.offsetLeft + from.offsetWidth - card.offsetWidth
      }px`;
    } else {
      card.style.top = `${from.offsetTop}px`;
      card.style.left = `${from.offsetLeft}px`;
    }

    setTimeout(function () {
      if (to.id === "com-hand-three") {
        card.style.top = `${to.offsetTop}px`;
        card.style.left = `${
          from.offsetLeft + from.offsetWidth - card.offsetWidth
        }px`;
      } else {
        card.style.top = `${to.offsetTop}px`;
        card.style.left = `${to.offsetLeft}px`;
      }
      if (from.id != "player-hand") {
        card.querySelector(".card").style.transform = `rotateX(${
          card.querySelector(".card").style.transform === "rotateX(180deg)"
            ? "0"
            : "180"
        }deg)`;
        if (toClassList.includes("discard")) {
          card.querySelector(".card").style.transform =
            "rotateY(0deg) rotateZ(180deg)";
        }
      }
      if (toClassList.includes("player")) {
        card.querySelector(".card").style.transform =
          "rotateY(0deg) rotateZ(-180deg)";
      }
    }, 100);

    setTimeout(function () {
      card.style.top = null;
      card.style.left = null;
      card.style.right = null;
      resolve();
    }, 750);
  });
  // CARD ANIMATION CONTROL

  if (fromClassList.includes("hand")) {
    card.style.order = null;
    correctHandVis(from, game);
  }

  if (toClassList.includes("hand")) {
    card.style.position = "relative";
    correctHandVis(to, game);
  } else if (toClassList.includes("deck")) {
    card.style.position = "absolute";
  }
}
