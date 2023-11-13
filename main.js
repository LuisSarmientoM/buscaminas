import "./style.css";
const SIZE = 6;
document.querySelector(
    "#app"
).innerHTML = `<section id="game"></section><section>
  <button id="restart" >restart</button>

</section>`;
const game = document.querySelector("#game");

const bombs = new Set();
const GAME_STATUS = {
    STARTED: (index) => checkBombs(+index),
    PAUSED: "paused",
    STARTING: (index) => fillBombs(+index),
};
let gameStatus = "STARTING";
game.style.setProperty("--cells", SIZE);
let buttons;
start();

function createButton(index) {
    const button = document.createElement("button");
    button.textContent = "";
    button.setAttribute("data-index", index);
    game.appendChild(button);
    return button;
}

document.querySelector("#restart").addEventListener("click", start);

function fillBombs(startClick) {
    do {
        const randomNumber = Math.floor(Math.random() * SIZE ** 2);
        if (!bombs.has(randomNumber) && randomNumber !== startClick) {
            bombs.add(randomNumber);
            buttons[randomNumber].setAttribute("data-bomb", 1);
        }
    } while (bombs.size < SIZE);
    gameStatus = "STARTED";
    checkBombs(startClick);
}

function checkBombs(index) {
    console.log(index);
    if (bombs.has(index)) {
        document.querySelector(`[data-index="${index}"]`).textContent = "💥";
        gameStatus = "ENDED";
        return;
    }
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    let bombCount = 0;

    for (let i = Math.max(0, row - 1); i <= Math.min(SIZE - 1, row + 1); i++) {
        for (
            let j = Math.max(0, col - 1);
            j <= Math.min(SIZE - 1, col + 1);
            j++
        ) {
            if (i !== row || j !== col) {
                if (bombs.has(i * SIZE + j)) {
                    bombCount++;
                }
            }
        }
    }

    if (bombCount > 0) {
        document.querySelector(`[data-index="${index}"]`).textContent =
            bombCount;
    } else {
        document.querySelector(`[data-index="${index}"]`).textContent = "";
    }
    document.querySelector(`[data-index="${index}"]`).style.backgroundColor =
        "green";
}

function start() {
    gameStatus = "STARTING";
    bombs.clear();

    game.innerHTML = "";

    buttons = Array.from({ length: SIZE ** 2 }, (_, index) =>
        createButton(index)
    );
    game.addEventListener(
        "click",
        ({
            target: {
                dataset: { index },
            },
        }) => {
            if (!GAME_STATUS[gameStatus]) return;
            GAME_STATUS[gameStatus](index);
        }
    );
}
