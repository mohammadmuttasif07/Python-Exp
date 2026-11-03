
const SIDES = 6;
const MAX_DICE = 10;
const MAX_ROLLS = 100;

const DICE_FACES = {
    1: "⚀",
    2: "⚁",
    3: "⚂",
    4: "⚃",
    5: "⚄",
    6: "⚅"
};

let history = [];

// Generate random number
function rollDie() {
    return Math.floor(Math.random() * SIDES) + 1;
}

// Generate multiple dice results
function rollMultipleDice(count) {
    let results = [];

    for (let i = 0; i < count; i++) {
        results.push(rollDie());
    }

    return results;
}

// Main roll function
function rollDice() {

    const diceCount = Number(document.getElementById("diceCount").value);
    const rollCount = Number(document.getElementById("rollCount").value);

    const error = document.getElementById("error");

    error.innerText = "";

    if (!Number.isInteger(diceCount) ||
        diceCount < 1 || diceCount > MAX_DICE) {
        error.innerText = "Enter dice between 1 and 10.";
        return;
    }

    if (!Number.isInteger(rollCount) ||
        rollCount < 1 || rollCount > MAX_ROLLS) {
        error.innerText = "Enter rolls between 1 and 100.";
        return;
    }

    let lastResults = [];

    for (let i = 1; i <= rollCount; i++) {

        let results = rollMultipleDice(diceCount);
        let total = results.reduce((sum, value) => sum + value, 0);

        const time = new Date().toLocaleString();

        history.push({
            time: time,
            dice: results,
            total: total
        });

        lastResults = results;
    }

    displayResults(lastResults);
    displayHistory();
    displayStatistics();
}

// Display dice results
function displayResults(results) {

    const diceResults = document.getElementById("diceResults");

    diceResults.innerHTML = "";

    results.forEach(number => {

        let dice = document.createElement("div");

        dice.className = "dice";
        dice.textContent = DICE_FACES[number];

        diceResults.appendChild(dice);
    });

    let total = results.reduce((sum, value) => sum + value, 0);

    document.getElementById("total").innerText =
        "Total: " + total;
}

// Display history
function displayHistory() {

    const historyDiv = document.getElementById("history");

    historyDiv.innerHTML = "";

    if (history.length === 0) {
        historyDiv.innerHTML = "<p>No rolls yet.</p>";
        return;
    }

    history.forEach((entry, index) => {

        let item = document.createElement("div");

        item.className = "history-item";

        const faces = entry.dice
            .map(number => DICE_FACES[number])
            .join(" ");

        item.textContent =
            `Roll ${index + 1} | ${entry.time} | ${faces} | Total: ${entry.total}`;

        historyDiv.appendChild(item);
    });
}

// Calculate statistics
function displayStatistics() {

    if (history.length === 0) return;

    let allDice = [];

    history.forEach(entry => {
        allDice.push(...entry.dice);
    });

    let totalDice = allDice.length;

    let sum = allDice.reduce((a, b) => a + b, 0);

    let average = sum / totalDice;

    let highest = Math.max(...allDice);
    let lowest = Math.min(...allDice);

    document.getElementById("totalRolls").innerText =
        history.length;

    document.getElementById("totalDice").innerText =
        totalDice;

    document.getElementById("average").innerText =
        average.toFixed(2);

    document.getElementById("highest").innerText =
        highest;

    document.getElementById("lowest").innerText =
        lowest;

    // Face frequency
    let frequencyDiv = document.getElementById("frequency");

    frequencyDiv.innerHTML = "";

    for (let face = 1; face <= SIDES; face++) {

        let count = allDice.filter(d => d === face).length;

        let percent = (count / totalDice) * 100;

        let item = document.createElement("div");

        item.className = "frequency-item";

        let label = document.createElement("p");

        label.textContent =
            `${DICE_FACES[face]} Face ${face}: ${count} (${percent.toFixed(1)}%)`;

        let track = document.createElement("div");
        track.className = "frequency-track";

        let bar = document.createElement("div");
        bar.className = "bar";
        bar.style.width = percent + "%";

        track.appendChild(bar);

        item.appendChild(label);
        item.appendChild(track);

        frequencyDiv.appendChild(item);
    }
}

// Save history to text file
function saveHistory() {

    if (history.length === 0) {
        alert("Nothing to save!");
        return;
    }

    let content = "DICE ROLLING SIMULATOR HISTORY\n";
    content += "================================\n\n";

    history.forEach((entry, index) => {

        content += `Roll ${index + 1}\n`;
        content += `Time: ${entry.time}\n`;
        content += `Dice: ${entry.dice.join(", ")}\n`;
        content += `Total: ${entry.total}\n\n`;
    });

    const blob = new Blob([content], {
        type: "text/plain"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "dice_history.txt";

    link.click();

    URL.revokeObjectURL(url);
}

// Clear history
function clearHistory() {

    if (history.length === 0) {
        alert("History is already empty!");
        return;
    }

    if (confirm("Are you sure you want to clear history?")) {

        history = [];

        document.getElementById("diceResults").innerHTML =
            "<p>Your dice results will appear here.</p>";

        document.getElementById("total").innerText = "Total: 0";

        document.getElementById("totalRolls").innerText = "0";
        document.getElementById("totalDice").innerText = "0";
        document.getElementById("average").innerText = "0";
        document.getElementById("highest").innerText = "0";
        document.getElementById("lowest").innerText = "0";

        document.getElementById("frequency").innerHTML = "";

        displayHistory();
    }
}
