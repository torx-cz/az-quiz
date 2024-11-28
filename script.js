// Elementy
const board = document.getElementById("board");
const resetButton = document.getElementById("reset-button");
const switchTeamButton = document.getElementById("switch-team-button");
const undoButton = document.getElementById("undo-button"); // Undo button

// Konfigurace herní desky
const ROWS = 7;

// Herní stav
let currentTeam = "team1"; // "team1" (modrá) nebo "team2" (červená)
let hexes = [];
let moveHistory = []; // Pole pro sledování historie tahů

// Funkce pro aktualizaci indikátoru týmu
function updateTeamIndicator() {
    if (currentTeam === "team1") {
        switchTeamButton.textContent = "Hraje: Tým 1";
        switchTeamButton.style.backgroundColor = "blue";
    } else {
        switchTeamButton.textContent = "Hraje: Tým 2";
        switchTeamButton.style.backgroundColor = "red";
    }
}

// Funkce pro vytvoření desky
function createBoard() {
    board.innerHTML = ""; // Vyčistit desku
    hexes = []; // Reset hexagonů
    questionNumber = 1; // Reset čísla otázky
    moveHistory = []; // Clear move history when reset

    for (let row = 0; row < ROWS; row++) {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("row");

        // Vytvoření hexagonů pro tuto řadu
        for (let col = 0; col <= row; col++) {
            const hex = document.createElement("div");
            hex.classList.add("hex");
            hex.dataset.row = row;
            hex.dataset.col = col;

            // Vytvoření čísla pro každý hexagon
            const numberDiv = document.createElement("div");
            numberDiv.classList.add("hex-number");
            numberDiv.textContent = questionNumber++; // Zobrazí aktuální číslo a poté ho inkrementuje
            hex.appendChild(numberDiv);

            // Klikací logika
            hex.addEventListener("click", () => handleHexClick(hex));

            // Pravý klik (pro označení jako černý, pokud je odpověď špatná)
            hex.addEventListener("contextmenu", (e) => handleRightClick(e, hex));

            rowDiv.appendChild(hex);
            hexes.push(hex);
        }
        board.appendChild(rowDiv);
    }
}

// Obsluha kliknutí na hexagon (levý klik)
function handleHexClick(hex) {
    if (hex.classList.contains("team1") || hex.classList.contains("team2")) {
        return; // Hexagon už je obsazený nebo je označený jako špatný
    }

    // Předchozí stav hexagonu před tím, než došlo ke změně
    const previousState = {
        hex: hex,
        previousClass: hex.className,
        previousTeam: currentTeam
    };

    if (hex.classList.contains("wrong")) {
        hex.classList.remove("wrong");
    }
    hex.classList.add(currentTeam);

    // Uložení aktuálního tahu do historie
    moveHistory.push(previousState);

    // Přepnutí týmu
    switchTeam();
}

// Obsluha pravého kliknutí (označení jako "wrong")
function handleRightClick(e, hex) {
    e.preventDefault(); // Zamezíme zobrazení kontextového menu pro pravý klik

    if (hex.classList.contains("team1") || hex.classList.contains("team2") || hex.classList.contains("wrong")) {
        return; // Hexagon už je obsazený nebo je označený jako špatný
    }

    // Předchozí stav hexagonu před tím, než došlo ke změně
    const previousState = {
        hex: hex,
        previousClass: hex.className,
        previousTeam: currentTeam
    };

    hex.classList.add("wrong"); // Označujeme hexagon jako černý pro špatnou odpověď
    moveHistory.push(previousState);
    switchTeam();
}

// Funkce pro ruční přepnutí týmu
function switchTeam() {
    currentTeam = currentTeam === "team1" ? "team2" : "team1";
    updateTeamIndicator(); // Aktualizujeme indikátor
}

// Funkce pro zrušení posledního tahu (Undo)
function undoLastMove() {
    const lastMove = moveHistory.pop(); // Vyjmout poslední záznam z historie

    if (lastMove) {
        // Obnovíme stav hexagonu
        lastMove.hex.className = lastMove.previousClass;
        currentTeam = lastMove.previousTeam; // Obnovíme tým
        updateTeamIndicator(); // Aktualizujeme indikátor
    }
}

// Resetování hry
resetButton.addEventListener("click", createBoard);

// Přepnutí týmu na tlačítko
switchTeamButton.addEventListener("click", switchTeam);

// Přidání funkce pro undo
undoButton.addEventListener("click", undoLastMove);

// Vytvoření herní desky
createBoard();
