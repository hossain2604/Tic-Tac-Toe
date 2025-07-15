// Selecting elements from DOM
let boxes = document.querySelectorAll(".box");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let newBtn = document.querySelector("#new-btn");
let resetBtn = document.querySelector("#reset-btn");

// Game state variables
let turnO = true; // true = Player's turn (O), false = Computer's turn (X)

// Win combinations
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
];

// Event listeners for boxes
boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (turnO && box.innerText === "" && msgContainer.classList.contains("hide")) {
            // Player's move
            box.innerText = "O";
            box.disabled = true;
            turnO = false;
            
            // Check for winner after slight delay
            setTimeout(() => {
                if (checkWinner()) return;
                setTimeout(computerMove, 750);
            }, 10);
        }
    });
});

// Utility functions
const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};

const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
    }
};

const resetGame = () => {
    turnO = true;
    enableBoxes();
    msgContainer.classList.add("hide");
};

const showWinner = (winner) => {
    const winnerName = winner === "O" ? "Player" : "Computer";
    msg.innerText = `Congratulations, Winner is ${winnerName}🎉`;
    msgContainer.classList.remove("hide");
    disableBoxes();
};

const checkWinner = () => {
    // Check all win patterns
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        const aVal = boxes[a].innerText;
        const bVal = boxes[b].innerText;
        const cVal = boxes[c].innerText;

        // Only check if all three positions have values
        if (aVal && bVal && cVal && aVal === bVal && bVal === cVal) {
            // Force DOM update before showing winner
            setTimeout(() => {
                showWinner(aVal);
            }, 10);
            return true;
        }
    }

    // Check for draw
    let isDraw = true;
    for (let box of boxes) {
        if (box.innerText === "") {
            isDraw = false;
            break;
        }
    }
    if (isDraw) {
        msg.innerText = "Game ended in a draw!";
        msgContainer.classList.remove("hide");
        disableBoxes();
        return true;
    }
    return false;
};

// Computer move logic
const computerMove = () => {
    if (!msgContainer.classList.contains("hide")) return;

    // 1. First try to win
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        const aVal = boxes[a].innerText;
        const bVal = boxes[b].innerText;
        const cVal = boxes[c].innerText;

        if (aVal === "X" && bVal === "X" && !cVal) {
            makeComputerMove(c);
            return;
        }
        if (aVal === "X" && cVal === "X" && !bVal) {
            makeComputerMove(b);
            return;
        }
        if (bVal === "X" && cVal === "X" && !aVal) {
            makeComputerMove(a);
            return;
        }
    }

    // 2. Block player from winning
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        const aVal = boxes[a].innerText;
        const bVal = boxes[b].innerText;
        const cVal = boxes[c].innerText;

        if (aVal === "O" && bVal === "O" && !cVal) {
            makeComputerMove(c);
            return;
        }
        if (aVal === "O" && cVal === "O" && !bVal) {
            makeComputerMove(b);
            return;
        }
        if (bVal === "O" && cVal === "O" && !aVal) {
            makeComputerMove(a);
            return;
        }
    }

    // 3. Take center if available
    if (!boxes[4].innerText) {
        makeComputerMove(4);
        return;
    }

    // 4. Take random corner
    const corners = [0, 2, 6, 8].filter(i => !boxes[i].innerText);
    if (corners.length) {
        makeComputerMove(corners[Math.floor(Math.random() * corners.length)]);
        return;
    }

    // 5. Take any available spot
    const empty = Array.from(boxes).findIndex(box => !box.innerText);
    if (empty !== -1) {
        makeComputerMove(empty);
    }
};

// Helper function for computer moves
const makeComputerMove = (index) => {
    boxes[index].innerText = "X";
    boxes[index].disabled = true;
    setTimeout(() => {
        if (!checkWinner()) {
            turnO = true; // Switch back to player if game continues
        }
    }, 10);
};

// Event listeners for buttons
newBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);