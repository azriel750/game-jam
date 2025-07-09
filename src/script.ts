type Difficulty = "super easy" | "easy" | "medium" | "hard";

const difficultySelect = document.getElementById("difficulty") as HTMLSelectElement;
const calculationEl = document.getElementById("calculation") as HTMLDivElement;
const abacusValueEl = document.getElementById("abacus-value") as HTMLSpanElement;
const checkBtn = document.getElementById("check-result") as HTMLButtonElement;
const feedbackEl = document.getElementById("feedback") as HTMLDivElement;
const clickSound = new Audio("./assets/sounds/click.mp3");
let correctResult: number = 0;
let abacusValue: number = 0;

const grid = document.getElementById("abacus-grid")!;
const columns = 9;

type Bead = {
  element: HTMLDivElement;
  active: boolean;
  value: number;
  row: number;
  col: number;
};
let beads: Bead[] = [];

// === Crée les perles ===
function createBead(row: number, col: number, value: number): Bead {
  const bead = document.createElement("div");
  bead.className = "bead";
  bead.style.gridRow = row.toString();
  bead.style.gridColumn = (col + 1).toString();

  const b: Bead = { element: bead, active: false, value, row, col };

  bead.addEventListener("click", () => {
  const isLowerBead = row >= 7;

  if (isLowerBead) {
    const columnBeads = beads.filter(bd => bd.col === col && bd.row >= 7 && bd.row <= row);
    const toggleTo = !b.active;

    for (const bd of columnBeads) {
      bd.active = toggleTo;
      bd.element.style.transform = toggleTo ? "translateY(-150px)" : "translateY(0)";
    }
  } else {
    // Perle haute
    b.active = !b.active;
    bead.style.transform = b.active ? "translateY(50px)" : "translateY(0)";
  }

  updateScore();
  clickSound.currentTime = 0;
clickSound.play();
});

  grid.appendChild(bead);
  return b;
}

// === Génère les perles ===
for (let col = 0; col < columns; col++) {
  const power = columns - 1 - col;
  const multiplier = Math.pow(10, power);

  beads.push(createBead(1, col, 5 * multiplier));

  for (let row = 7; row <= 10; row++) {
    beads.push(createBead(row, col, 1 * multiplier));
  }
}

// === Barre de séparation ===
const bar = document.createElement("div");
bar.className = "bar";
grid.appendChild(bar);

// === Met à jour le score ===
function updateScore() {
  const score = beads.filter(b => b.active).reduce((sum, b) => sum + b.value, 0);
  abacusValue = score;
  abacusValueEl.textContent = abacusValue.toString();
}

// === Calcule un nombre aléatoire entre min et max ===
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function generateCalculation(): void {
  let a: number, b: number, op: string;
  const difficulty: Difficulty = difficultySelect.value as Difficulty;

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
     let n1 = randInt(10, 1000);
let n2 = randInt(10, 1000);
a = Math.max(n1, n2);
b = Math.min(n1, n2);
      op = "-";
      correctResult = a - b;
      break;

    case "hard":
      a = randInt(2, 100);
      b = randInt(2, 100);
      op = "x";
      correctResult = a * b;
      break;
  }

  // Affiche correctement le calcul
  calculationEl.textContent = difficulty === "super easy"
    ? `${a}`
    : `${a} ${op} ${b} = ?`;

  // Réinitialise les billes visuellement et logiquement
  for (const bead of beads) {
    bead.active = false;
    bead.element.style.transform = "translateY(0)";
  }

  feedbackEl.textContent = "➖";
  abacusValue = 0;
  abacusValueEl.textContent = "0";
}
function resetAbacus(): void {
  for (const bead of beads) {
    bead.active = false;
    bead.element.style.transform = "translateY(0)";
  }
  abacusValue = 0;
  abacusValueEl.textContent = "0";
}

// === Vérifie la réponse de l'utilisateur ===
function checkAnswer(): void {
  if (abacusValue === correctResult) {
    feedbackEl.textContent = "✅ Bravo !";
    feedbackEl.style.color = "green";
    resetAbacus();
    
     setTimeout(() => {
    generateCalculation();
  }, 1000);


  } else {
    feedbackEl.textContent = "❌ Réessaie !";
    feedbackEl.style.color = "red";
  }
}

// === Événements ===
checkBtn.addEventListener("click", checkAnswer);
difficultySelect.addEventListener("change", generateCalculation);

// ✅ Appelé en dernier, une fois que les perles sont bien créées
generateCalculation();
const resetBtn = document.getElementById("reset-abacus") as HTMLButtonElement;
resetBtn.addEventListener("click", resetAbacus);