export function goFish(deck, backColor) {
  for (let i of deck) {
    const parent = document.getElementById("deck");
    const container = document.createElement("div");
    const card = document.createElement("div");
    const front = document.createElement("div");
    const back = document.createElement("div");

    container.id = `${i}-container`;
    container.className = "card-container";
    card.id = i;
    card.className = "card";
    front.id = "front";
    front.style.backgroundImage = `url("../Cards/${i}.png")`;
    back.id = "back";
    back.style.backgroundImage = `url("../Cards/Backs/${backColor}.png")`;

    parent.appendChild(container);
    container.appendChild(card);
    card.appendChild(front);
    card.appendChild(back);
  }
}
