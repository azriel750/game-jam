"use strict";
const difficultySelect = document.getElementById("difficulty");
const calculationEl = document.getElementById("calculation");
const abacusValueEl = document.getElementById("abacus-value");
const checkBtn = document.getElementById("check-result");
const feedbackEl = document.getElementById("feedback");
let correctResult = 0;
let abacusValue = 0;
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
            a = randInt(1, 10);
            b = randInt(1, 10);
            op = "+";
            correctResult = a + b;
            break;
        case "medium":
            a = randInt(10, 100);
            b = randInt(10, 100);
            op = "-";
            correctResult = a - b;
            break;
        case "hard":
            a = randInt(2, 10);
            b = randInt(2, 10);
            op = "x";
            correctResult = a * b;
            break;
    }
    calculationEl.textContent = `${a} ${op} ${b} = ?`;
    feedbackEl.textContent = "➖";
    abacusValue = 0;
    abacusValueEl.textContent = abacusValue.toString();
}
// Génère un entier aléatoire entre min et max inclus
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Modifie la valeur du boulier
function updateAbacus(change) {
    abacusValue += change;
    if (abacusValue < 0)
        abacusValue = 0;
    abacusValueEl.textContent = abacusValue.toString();
}
function checkAnswer() {
    if (abacusValue === correctResult) {
        feedbackEl.textContent = "✅ Bravo !";
        feedbackEl.style.color = "green";
    }
    else {
        feedbackEl.textContent = "❌ Réessaie !";
        feedbackEl.style.color = "red";
    }
}
checkBtn.addEventListener("click", checkAnswer);
difficultySelect.addEventListener("change", generateCalculation);
generateCalculation();
const grid = document.getElementById("abacus-grid");
const columns = 9;
let beads = [];
function createBead(row, col, value) {
    const bead = document.createElement("div");
    bead.className = "bead";
    bead.style.gridRow = row.toString();
    bead.style.gridColumn = (col + 1).toString();
    const b = { element: bead, active: false, value, row, col };
    bead.addEventListener("click", () => {
        const isLowerBead = row >= 4;
        if (isLowerBead) {
            const columnBeads = beads.filter(bd => bd.col === col && bd.row >= 4);
            const toggleTo = !b.active;
            for (const bd of columnBeads) {
                if (bd.row >= row) {
                    bd.active = toggleTo;
                    bd.element.style.transform = toggleTo ? "translateY(-20px)" : "translateY(0)";
                }
            }
        }
        else {
            b.active = !b.active;
            bead.style.transform = b.active ? "translateY(-100px)" : "translateY(0)";
        }
        updateScore();
    });
    grid.appendChild(bead);
    return b;
}
for (let col = 0; col < columns; col++) {
    const power = columns - 1 - col;
    const multiplier = Math.pow(10, power);
    beads.push(createBead(1, col, 5 * multiplier));
    for (let row = 7; row <= 10; row++) {
        beads.push(createBead(row, col, 1 * multiplier));
    }
}
abacusValueEl.textContent = abacusValue.toString();
const bar = document.createElement("div");
bar.className = "bar";
grid.appendChild(bar);
function updateScore() {
    const score = beads.filter(b => b.active).reduce((sum, b) => sum + b.value, 0);
    abacusValue = score;
    abacusValueEl.textContent = abacusValue.toString();
}
