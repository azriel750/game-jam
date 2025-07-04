document.addEventListener("DOMContentLoaded", () => {
  const boulier = document.getElementById("boulier") as HTMLDivElement;
  const valeurDisplay = document.getElementById("valeur") as HTMLDivElement;
  const multiCheckbox = document.getElementById("multiSelect") as HTMLInputElement;

  const colonnes = 9;
  const espace = 50;

  type EtatColonne = {
    haut: 0 | 1;
    bas: number[]; // indices lignes 4 à 7, boules en bas (0 = ligne 4, plus petit = plus haut)
  };

  const etat: EtatColonne[] = Array.from({ length: colonnes }, () => ({
    haut: 0,
    bas: [4, 5, 6, 7], // positions fixes des boules basses (en bas de la colonne, indices 4 à 7)
  }));

  let selection: { col: number; index: number }[] = [];
  let draggingInfo:
    | { type: "haut"; col: number }
    | { type: "bas"; col: number; indices: number[] }
    | null = null;

  function dessiner(): void {
    boulier.innerHTML = "";

    for (let col = 0; col < colonnes; col++) {
      const left = col * espace + 10;

      // Boule du haut
      const bouleHaut = document.createElement("div");
      bouleHaut.className = "boule";
      bouleHaut.style.left = `${left}px`;
      bouleHaut.style.top = `${etat[col].haut * espace}px`;
      bouleHaut.draggable = true;

      bouleHaut.ondragstart = (e) => {
        draggingInfo = { type: "haut", col };
        e.dataTransfer!.setData("text/plain", "haut");
      };
      bouleHaut.ondragend = () => {
        draggingInfo = null;
      };

      boulier.appendChild(bouleHaut);

      // Boules du bas (indices 0 à 3 correspondent à lignes 4 à 7)
      etat[col].bas.forEach((ligneBas, index) => {
        const boule = document.createElement("div");
        boule.className = "boule";
        boule.style.left = `${left}px`;
        boule.style.top = `${ligneBas * espace}px`;

        if (selection.find((s) => s.col === col && s.index === index)) {
          boule.classList.add("selected");
        }

        boule.onclick = (e) => {
          if (!multiCheckbox.checked) {
            selection = [{ col, index }];
          } else {
            // Multi sélection: uniquement les boules du haut contiguës dans la pile basse
            const indicesInCol = selection
              .filter((s) => s.col === col)
              .map((s) => s.index);

            let newIndices: number[];
            if (indicesInCol.includes(index)) {
              newIndices = indicesInCol.filter((i) => i !== index);
            } else {
              newIndices = [...indicesInCol, index];
            }

            newIndices.sort((a, b) => a - b);

            // Vérifier que ce sont les premières boules consécutives (0,1,2,...)
            let valide = true;
            for (let i = 0; i < newIndices.length; i++) {
              if (newIndices[i] !== i) {
                valide = false;
                break;
              }
            }

            if (valide && newIndices.length <= 4) {
              selection = newIndices.map((idx) => ({ col, index: idx }));
            } else {
              alert(
                "La sélection multiple doit concerner uniquement les boules consécutives en haut de la pile basse, " +
                  "et au maximum 4 boules."
              );
            }
          }
          dessiner();
          e.stopPropagation();
        };

        boule.draggable = true;
        boule.ondragstart = (e) => {
          if (!selection.find((s) => s.col === col && s.index === index)) {
            selection = [{ col, index }];
          }
          draggingInfo = {
            type: "bas",
            col,
            indices: selection.filter((s) => s.col === col).map((s) => s.index),
          };
          e.dataTransfer!.setData("text/plain", "bas");
        };
        boule.ondragend = () => {
          draggingInfo = null;
        };

        boulier.appendChild(boule);
      });
    }
  }

  boulier.ondragover = (e) => {
    e.preventDefault();
    e.dataTransfer!.dropEffect = "move";
  };

  boulier.ondrop = (e) => {
  e.preventDefault();
  if (!draggingInfo) return;

  const col = Math.floor(e.offsetX / espace);
  const ligne = Math.floor(e.offsetY / espace);

  if (col < 0 || col >= colonnes) return;

  if (draggingInfo.type === "haut") {
    // Boule du haut : ligne 0 ou 1 uniquement
    if (ligne === 0 || ligne === 1) {
      etat[draggingInfo.col].haut = ligne as 0 | 1;
    }
    selection = [];
  } else if (draggingInfo.type === "bas") {
    if (col !== draggingInfo.col) return; // dans la même colonne seulement

    const nbBoules = draggingInfo.indices.length;

    // Limiter la ligne minimale à 2 (pour ne pas passer au-dessus du haut)
    let baseLigne = ligne;
    if (baseLigne < 2) baseLigne = 2;

    // Limiter la ligne maximale pour que le groupe rentre dans la colonne (si 8 lignes du bas : lignes 2..9)
    const maxLigne = 9; // dernière ligne de la colonne
    if (baseLigne + nbBoules - 1 > maxLigne) {
      baseLigne = maxLigne - nbBoules + 1;
    }

    // Déplacer les boules en conservant l'ordre
    for (let i = 0; i < nbBoules; i++) {
      etat[col].bas[draggingInfo.indices[i]] = baseLigne + i;
    }

    selection = [];
  }

  majValeur();
  dessiner();
};

  function majValeur(): void {
    let total = 0;
    for (let i = 0; i < colonnes; i++) {
      const puissance = Math.pow(10, colonnes - 1 - i);
      const haut = etat[i].haut === 1 ? 5 : 0;
      // On compte uniquement les boules basses dans les indices 4 à 7
      const bas = etat[i].bas.filter((x) => x >= 4 && x <= 7).length;
      total += (haut + bas) * puissance;
    }
    valeurDisplay.textContent = `Valeur: ${total}`;
  }

  document.body.onclick = (e) => {
    if (!(e.target as HTMLElement).classList.contains("boule")) {
      selection = [];
      dessiner();
    }
  };

  dessiner();
  majValeur();
});
