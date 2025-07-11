"use strict";
const difficultySelect = document.getElementById("difficulty");
const calculationEl = document.getElementById("calculation");
const abacusValueEl = document.getElementById("abacus-value");
const checkBtn = document.getElementById("check-result");
const feedbackEl = document.getElementById("feedback");
const resetBtn = document.getElementById("reset-abacus");
const grid = document.getElementById("abacus-grid");
const clickSound = document.getElementById('clickSound');
const music = document.getElementById('backgroundMusic');
const volumeControl = document.getElementById('volumeControl');
music.volume = parseFloat(volumeControl.value);
volumeControl.addEventListener('input', () => {
    music.volume = parseFloat(volumeControl.value);
    console.log('Volume réglé à', music.volume);
});
let correctResult = 0;
let abacusValue = 0;
const columns = 9;
let beads = [];
function createBead(row, col, value) {
    const bead = document.createElement("div");
    bead.className = "bead";
    bead.style.gridRow = row.toString();
    bead.style.gridColumn = (col + 1).toString();
    const b = { element: bead, active: false, value, row, col };
    bead.addEventListener("click", () => {
        const isLowerBead = row >= 7;
        if (isLowerBead) {
            const toggleTo = !b.active;
            const columnBeads = beads.filter(bd => bd.col === col && (toggleTo ? (bd.row >= 7 && bd.row <= row) : (bd.row >= row && bd.row <= 10)));
            for (const bd of columnBeads) {
                bd.active = toggleTo;
                bd.element.style.transform = toggleTo ? "translateY(-150px)" : "translateY(0)";
            }
        }
        else {
            const toggleTo = !b.active;
            const columnBeads = beads.filter(bd => bd.col === col && (toggleTo ? (bd.row >= row && bd.row <= 1) : (bd.row <= row && bd.row >= 1)));
            for (const bd of columnBeads) {
                bd.active = toggleTo;
                bd.element.style.transform = toggleTo ? "translateY(50px)" : "translateY(0)";
            }
        }
        updateScore();
        if (clickSound) {
            clickSound.currentTime = 0; // pour pouvoir rejouer rapidement
            clickSound.play();
        }
    });
    grid.appendChild(bead);
    return b;
}
function initAbacus() {
    beads = [];
    grid.innerHTML = "";
    for (let col = 0; col < columns; col++) {
        const power = columns - 1 - col;
        const multiplier = Math.pow(10, power);
        beads.push(createBead(1, col, 5 * multiplier));
        for (let row = 7; row <= 10; row++) {
            beads.push(createBead(row, col, 1 * multiplier));
        }
    }
    const bar = document.createElement("div");
    bar.className = "bar";
    grid.appendChild(bar);
}
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function generateCalculation() {
    let a, b, op;
    const difficulty = difficultySelect.value;
    switch (difficulty) {
        case "super easy":
            a = randInt(1, 1000);
            b = 0;
            op = "";
            correctResult = a;
            break;
        case "easy":
            a = randInt(1, 1000);
            b = randInt(1, 1000);
            op = "+";
            correctResult = a + b;
            break;
        case "medium":
            a = randInt(10, 1000);
            b = randInt(10, 1000);
            if (b > a)
                [a, b] = [b, a];
            op = "-";
            correctResult = a - b;
            break;
        case "hard":
            a = randInt(2, 1000);
            b = randInt(2, 1000);
            op = "x";
            correctResult = a * b;
            break;
    }
    calculationEl.textContent = difficulty === "super easy" ? `${a}` : `${a} ${op} ${b} = ?`;
    feedbackEl.textContent = "➖";
    resetAbacus();
}
function updateScore() {
    abacusValue = beads.filter(b => b.active).reduce((sum, b) => sum + b.value, 0);
    abacusValueEl.textContent = abacusValue.toString();
}
function resetAbacus() {
    for (const bead of beads) {
        bead.active = false;
        bead.element.style.transform = "translateY(0)";
    }
    abacusValue = 0;
    abacusValueEl.textContent = "0";
}
function checkAnswer() {
    console.log("clic détecté");
    if (abacusValue === correctResult) {
        feedbackEl.textContent = "✅ Bravo !";
        feedbackEl.style.color = "green";
        setTimeout(() => {
            generateCalculation();
        }, 800);
    }
    else {
        feedbackEl.textContent = "❌ Réessaie !";
        feedbackEl.style.color = "red";
    }
}
checkBtn.addEventListener("click", checkAnswer);
difficultySelect.addEventListener("change", generateCalculation);
resetBtn.addEventListener("click", resetAbacus);
initAbacus();
generateCalculation();
