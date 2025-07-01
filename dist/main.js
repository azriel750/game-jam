"use strict";
const boulier = document.getElementById("boulier");
const valeurDisplay = document.getElementById("valeur");
const colonnes = 9;
const lignes = 10; // 2 haut + barre + 8 bas
// état : tableau de colonnes, chacune contient une position pour haut (0-1) et 4 pour bas (0-3)
const etat = Array.from({ length: colonnes }, () => ({ haut: 0, bas: [0, 1, 2, 3] }));
function dessiner() {
    boulier.innerHTML = "";
    for (let ligne = 0; ligne < lignes; ligne++) {
        for (let col = 0; col < colonnes; col++) {
            const cell = document.createElement("div");
            cell.className = "case";
            // Partie haute : ligne 0 ou 1
            if (ligne === etat[col].haut && ligne < 2) {
                const boule = document.createElement("div");
                boule.className = "boule";
                boule.onclick = () => {
                    etat[col].haut = 1 - etat[col].haut;
                    majValeur();
                    dessiner();
                };
                cell.appendChild(boule);
            }
            // Partie basse : lignes 2 à 9
            const ligneBas = ligne - 2;
            if (ligne >= 2 && etat[col].bas.includes(ligneBas)) {
                const boule = document.createElement("div");
                boule.className = "boule";
                boule.onclick = () => {
                    // permet de faire monter ou descendre si possible
                    const index = etat[col].bas.indexOf(ligneBas);
                    if (index !== -1) {
                        if (ligneBas > 0 && !etat[col].bas.includes(ligneBas - 1)) {
                            etat[col].bas[index] = ligneBas - 1;
                        }
                        else if (ligneBas < 7 && !etat[col].bas.includes(ligneBas + 1)) {
                            etat[col].bas[index] = ligneBas + 1;
                        }
                        majValeur();
                        dessiner();
                    }
                };
                cell.appendChild(boule);
            }
            boulier.appendChild(cell);
        }
    }
}
function majValeur() {
    let total = 0;
    for (let i = 0; i < colonnes; i++) {
        const puissance = Math.pow(10, colonnes - 1 - i);
        const haut = etat[i].haut === 1 ? 5 : 0;
        const bas = etat[i].bas.filter(x => x <= 3).length;
        total += (haut + bas) * puissance;
    }
    valeurDisplay.textContent = `Valeur: ${total}`;
}
dessiner();
majValeur();
