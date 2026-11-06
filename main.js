
let iq = 0;
let totalIQ = 0;
let clickPower = 1;
let iqPerSecond = 0;
let rebirths = 0;

const SAVE_KEY = "oszinsSave";

// ==============================
// LEHRPERSONEN
// ==============================

const teachers = [
    { name: "Herr Fuhrer", cost: 5000, boost: 5, owned: 0 },
    { name: "Herr Vischer", cost: 12000, boost: 12, owned: 0 },
    { name: "Herr Sommer", cost: 30000, boost: 30, owned: 0 },
    { name: "Herr Aerni", cost: 75000, boost: 75, owned: 0 },
    { name: "Herr Weber", cost: 180000, boost: 180, owned: 0 },
    { name: "Herr Meier", cost: 450000, boost: 400, owned: 0 },
    { name: "Herr Siebert", cost: 1100000, boost: 900, owned: 0 },
    { name: "Frau Breuss", cost: 2800000, boost: 2000, owned: 0 },
    { name: "Herr Jeni", cost: 7000000, boost: 4500, owned: 0 },
    { name: "Frau Böhler", cost: 18000000, boost: 10000, owned: 0 },
    { name: "Frau Walter", cost: 45000000, boost: 22000, owned: 0 },
    { name: "Frau Pichler", cost: 110000000, boost: 50000, owned: 0 },
    { name: "Herr Reusser", cost: 275000000, boost: 110000, owned: 0 },
    { name: "Frau Gauda", cost: 700000000, boost: 250000, owned: 0 },
    { name: "Frau Derungs", cost: 1800000000, boost: 550000, owned: 0 },
    { name: "Frau Dappen", cost: 4500000000, boost: 1200000, owned: 0 }
];

const teacherBaseCosts = teachers.map(t => t.cost);

// ==============================
// SCHULMATERIAL
// ==============================

const upgrades = [
    { name: "Bleistift", icon: "✏️", cost: 2500, bonus: 5, owned: 0 },
    { name: "Schulheft", icon: "📓", cost: 8000, bonus: 15, owned: 0 },
    { name: "Füller", icon: "🖊️", cost: 25000, bonus: 40, owned: 0 },
    { name: "Lineal", icon: "📏", cost: 75000, bonus: 100, owned: 0 },
    { name: "Taschenrechner", icon: "🧮", cost: 200000, bonus: 300, owned: 0 },
    { name: "Laptop", icon: "💻", cost: 600000, bonus: 800, owned: 0 },
    { name: "Schulrucksack", icon: "🎒", cost: 1800000, bonus: 2000, owned: 0 },
    { name: "Gaming-PC", icon: "🖥️", cost: 5000000, bonus: 5000, owned: 0 },
    { name: "Smartboard", icon: "📺", cost: 15000000, bonus: 15000, owned: 0 },
    { name: "Schulserver", icon: "🖧", cost: 50000000, bonus: 50000, owned: 0 }
];

const upgradeBaseCosts = upgrades.map(u => u.cost);

// ==============================
// REBIRTH
// ==============================

// Jeder Rebirth verdoppelt den Multiplikator.
function getMultiplier() {
    return Math.pow(2, rebirths);
}

// Der erste Rebirth kostet 1 Million IQ.
// Jeder weitere kostet dreimal so viel.
function getRebirthCost() {
    return 1000000 * Math.pow(3, rebirths);
}

// ==============================
// PREISE
// ==============================

function updateCosts() {
    teachers.forEach((teacher, index) => {
        teacher.cost = Math.floor(
            teacherBaseCosts[index] *
            Math.pow(1.65, teacher.owned)
        );
    });

    upgrades.forEach((upgrade, index) => {
        upgrade.cost = Math.floor(
            upgradeBaseCosts[index] *
            Math.pow(1.9, upgrade.owned)
        );
    });
}

// ==============================
// BOOSTS BERECHNEN
// ==============================

function calculateBoosts() {
    let teacherBoost = 0;
    let upgradeBoost = 0;

    teachers.forEach(teacher => {
        teacherBoost += teacher.owned * teacher.boost;
    });

    upgrades.forEach(upgrade => {
        upgradeBoost += upgrade.owned * upgrade.bonus;
    });

    const multiplier = getMultiplier();

    iqPerSecond = teacherBoost * multiplier;
    clickPower = (1 + upgradeBoost) * multiplier;
}

// ==============================
// ZAHLEN FORMATIEREN
// ==============================

function formatNumber(number) {
    return Math.floor(number).toLocaleString("de-CH");
}

// ==============================
// SPEICHERN
// ==============================

function saveGame() {
    const data = {
        iq: iq,
        totalIQ: totalIQ,
        rebirths: rebirths,
        teachers: teachers.map(t => t.owned),
        upgrades: upgrades.map(u => u.owned)
    };

    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

// ==============================
// LADEN
// ==============================

function loadGame() {
    try {
        const saved = localStorage.getItem(SAVE_KEY);

        if (saved) {
            const data = JSON.parse(saved);

            iq = Math.max(0, Number(data.iq) || 0);
            totalIQ = Math.max(0, Number(data.totalIQ) || 0);
            rebirths = Math.max(0, Math.floor(Number(data.rebirths) || 0));

            teachers.forEach((teacher, index) => {
                teacher.owned = Math.max(
                    0,
                    Math.floor(Number(data.teachers?.[index]) || 0)
                );
            });

            upgrades.forEach((upgrade, index) => {
                upgrade.owned = Math.max(
                    0,
                    Math.floor(Number(data.upgrades?.[index]) || 0)
                );
            });
        }
    } catch (error) {
        console.error("Fehler beim Laden:", error);
    }

    updateCosts();
    calculateBoosts();
    updateGame();
}

// ==============================
// KLICKEN
// ==============================

document.getElementById("clickButton").addEventListener("click", function() {
    iq += clickPower;
    totalIQ += clickPower;

    updateGame();
});

// ==============================
// LEHRPERSONEN SHOP
// ==============================

function createTeacherShop() {
    const shop = document.getElementById("teacherShop");

    teachers.forEach((teacher, index) => {
        const card = document.createElement("div");
        card.className = "teacher";

        const heading = document.createElement("h3");
        heading.textContent = teacher.name;

        const boost = document.createElement("p");
        boost.textContent = "+" + formatNumber(teacher.boost) + " IQ / Sekunde";

        const owned = document.createElement("p");
        owned.innerHTML = `Besitzt: <span id="teacherOwned${index}">0</span>`;

        const cost = document.createElement("p");
        cost.innerHTML = `Preis: <span id="teacherCost${index}">0</span> IQ`;

        const button = document.createElement("button");
        button.id = `buyTeacher${index}`;
        button.textContent = "Lehrperson kaufen";

        button.addEventListener("click", () => buyTeacher(index));

        card.append(heading, boost, owned, cost, button);
        shop.appendChild(card);
    });
}

function buyTeacher(index) {
    const teacher = teachers[index];

    if (iq >= teacher.cost) {
        iq -= teacher.cost;
        teacher.owned++;

        updateCosts();
        calculateBoosts();
        updateGame();
        saveGame();
    }
}

// ==============================
// UPGRADE SHOP
// ==============================

function createUpgradeShop() {
    const shop = document.getElementById("upgradeShop");

    upgrades.forEach((upgrade, index) => {
        const card = document.createElement("div");
        card.className = "teacher";

        const heading = document.createElement("h3");
        heading.textContent = upgrade.icon + " " + upgrade.name;

        const boost = document.createElement("p");
        boost.textContent = "+" + formatNumber(upgrade.bonus) + " Klick-IQ";

        const owned = document.createElement("p");
        owned.innerHTML = `Besitzt: <span id="upgradeOwned${index}">0</span>`;

        const cost = document.createElement("p");
        cost.innerHTML = `Preis: <span id="upgradeCost${index}">0</span> IQ`;

        const button = document.createElement("button");
        button.id = `buyUpgrade${index}`;
        button.textContent = "Upgrade kaufen";

        button.addEventListener("click", () => buyUpgrade(index));

        card.append(heading, boost, owned, cost, button);
        shop.appendChild(card);
    });
}

function buyUpgrade(index) {
    const upgrade = upgrades[index];

    if (iq >= upgrade.cost) {
        iq -= upgrade.cost;
        upgrade.owned++;

        updateCosts();
        calculateBoosts();
        updateGame();
        saveGame();
    }
}

// ==============================
// ANZEIGE AKTUALISIEREN
// ==============================

function updateGame() {
    document.getElementById("iq").textContent =
        formatNumber(iq) + " IQ";

    document.getElementById("perSecond").textContent =
        formatNumber(iqPerSecond) + " IQ pro Sekunde";

    document.getElementById("clickPower").textContent =
        formatNumber(clickPower) + " IQ pro Klick";

    document.getElementById("totalIQ").textContent =
        formatNumber(totalIQ);

    document.getElementById("rebirths").textContent = rebirths;
    document.getElementById("rebirthCount").textContent = rebirths;

    document.getElementById("multiplier").textContent =
        "x" + formatNumber(getMultiplier());

    document.getElementById("rebirthBonus").textContent =
        "x" + formatNumber(getMultiplier());

    document.getElementById("rebirthCost").textContent =
        formatNumber(getRebirthCost());

    let totalTeachers = 0;
    let totalUpgrades = 0;

    teachers.forEach((teacher, index) => {
        totalTeachers += teacher.owned;

        document.getElementById(`teacherOwned${index}`).textContent =
            teacher.owned;

        document.getElementById(`teacherCost${index}`).textContent =
            formatNumber(teacher.cost);

        document.getElementById(`buyTeacher${index}`).disabled =
            iq < teacher.cost;
    });

    upgrades.forEach((upgrade, index) => {
        totalUpgrades += upgrade.owned;

        document.getElementById(`upgradeOwned${index}`).textContent =
            upgrade.owned;

        document.getElementById(`upgradeCost${index}`).textContent =
            formatNumber(upgrade.cost);

        document.getElementById(`buyUpgrade${index}`).disabled =
            iq < upgrade.cost;
    });

    document.getElementById("totalTeachers").textContent =
        totalTeachers;

    document.getElementById("totalUpgrades").textContent =
        totalUpgrades;

    const rebirthButton = document.getElementById("rebirthButton");

    rebirthButton.disabled = iq < getRebirthCost();

    if (iq >= getRebirthCost()) {
        document.getElementById("rebirthMessage").textContent =
            "Du bist bereit für deinen nächsten Rebirth!";
    } else {
        document.getElementById("rebirthMessage").textContent =
            "Dir fehlen noch " +
            formatNumber(getRebirthCost() - iq) + " IQ!";
    }
}

// ==============================
// REBIRTH SYSTEM
// ==============================

document.getElementById("rebirthButton").addEventListener("click", function() {
    const cost = getRebirthCost();

    if (iq >= cost) {
        const nextMultiplier = getMultiplier() * 2;

        if (confirm(
            "REBIRTH durchführen?\n\n" +
            "Deine Lehrpersonen und Upgrades gehen verloren.\n" +
            "Dein neuer Multiplikator wird x" +
            formatNumber(nextMultiplier) + "!"
        )) {
            rebirths++;

            iq = 0;

            teachers.forEach(teacher => {
                teacher.owned = 0;
            });

            upgrades.forEach(upgrade => {
                upgrade.owned = 0;
            });

            updateCosts();
            calculateBoosts();
            updateGame();
            saveGame();
        }
    }
});

// ==============================
// SCHULPRÜFUNGEN
// ==============================

// difficulty: Easy, Medium, Hard, Expert
// reward: Belohnung vor Rebirth-Multiplikator

const questions = [
    {
        difficulty: "Leicht",
        reward: 5000,
        question: "Was ist 18 x 12?",
        answers: ["206", "216", "226", "236"],
        correct: 1
    },
    {
        difficulty: "Leicht",
        reward: 5000,
        question: "Wie viele Bundesräte hat die Schweiz?",
        answers: ["5", "6", "7", "8"],
        correct: 2
    },
    {
        difficulty: "Leicht",
        reward: 5000,
        question: "Was ist die Quadratwurzel von 196?",
        answers: ["12", "13", "14", "16"],
        correct: 2
    },
    {
        difficulty: "Leicht",
        reward: 5000,
        question: "Wie viele Grad hat ein rechter Winkel?",
        answers: ["45°", "60°", "90°", "180°"],
        correct: 2
    },
    {
        difficulty: "Leicht",
        reward: 5000,
        question: "Was ist 25% von 800?",
        answers: ["100", "150", "200", "250"],
        correct: 2
    },
    {
        difficulty: "Leicht",
        reward: 5000,
        question: "Wie viele Bits hat ein Byte?",
        answers: ["4", "8", "16", "32"],
        correct: 1
    },

    {
        difficulty: "Mittel",
        reward: 10000,
        question: "Was ist 3/4 + 2/5?",
        answers: ["23/20", "19/20", "17/20", "21/20"],
        correct: 0
    },
    {
        difficulty: "Mittel",
        reward: 10000,
        question: "Was ist die Lösung von 5x - 9 = 36?",
        answers: ["7", "8", "9", "10"],
        correct: 2
    },
    {
        difficulty: "Mittel",
        reward: 10000,
        question: "In welchem Jahr begann der Erste Weltkrieg?",
        answers: ["1912", "1914", "1916", "1918"],
        correct: 1
    },
    {
        difficulty: "Mittel",
        reward: 10000,
        question: "Was ist die chemische Formel von Wasser?",
        answers: ["CO2", "H2O", "O2", "NaCl"],
        correct: 1
    },
    {
        difficulty: "Mittel",
        reward: 10000,
        question: "Was ist 2 hoch 8?",
        answers: ["128", "196", "256", "512"],
        correct: 2
    },
    {
        difficulty: "Mittel",
        reward: 10000,
        question: "Was ist die Hauptstadt von Australien?",
        answers: ["Sydney", "Melbourne", "Canberra", "Perth"],
        correct: 2
    },

    {
        difficulty: "Schwer",
        reward: 25000,
        question: "Was ist die Ableitung von x²?",
        answers: ["x", "2x", "x³", "2"],
        correct: 1
    },
    {
        difficulty: "Schwer",
        reward: 25000,
        question: "Wie viel ist 1440 : 24?",
        answers: ["50", "55", "60", "65"],
        correct: 2
    },
    {
        difficulty: "Schwer",
        reward: 25000,
        question: "Welches Element hat das Symbol Fe?",
        answers: ["Fluor", "Eisen", "Francium", "Fermium"],
        correct: 1
    },
    {
        difficulty: "Schwer",
        reward: 25000,
        question: "Wie gross ist die Winkelsumme eines Vierecks?",
        answers: ["180°", "270°", "360°", "450°"],
        correct: 2
    },
    {
        difficulty: "Schwer",
        reward: 25000,
        question: "Was ist die Wahrscheinlichkeit, bei einem Würfel eine 6 zu würfeln?",
        answers: ["1/2", "1/3", "1/6", "1/12"],
        correct: 2
    },
    {
        difficulty: "Schwer",
        reward: 25000,
        question: "Welches Organ produziert Insulin?",
        answers: ["Leber", "Niere", "Bauchspeicheldrüse", "Herz"],
        correct: 2
    },

    {
        difficulty: "Experte",
        reward: 50000,
        question: "Was ist die Lösung von 3(x - 4) = 2x + 9?",
        answers: ["18", "19", "20", "21"],
        correct: 1
    },
    {
        difficulty: "Experte",
        reward: 50000,
        question: "Was ist die Summe der Innenwinkel eines Fünfecks?",
        answers: ["360°", "450°", "540°", "720°"],
        correct: 2
    },
    {
        difficulty: "Experte",
        reward: 50000,
        question: "Welcher Planet hat die höchste mittlere Dichte?",
        answers: ["Mars", "Venus", "Erde", "Merkur"],
        correct: 2
    },
    {
        difficulty: "Experte",
        reward: 50000,
        question: "Was ist 2 hoch 10?",
        answers: ["512", "1024", "2048", "4096"],
        correct: 1
    },
    {
        difficulty: "Experte",
        reward: 50000,
        question: "Welcher dieser Werte ist eine Primzahl?",
        answers: ["51", "57", "61", "69"],
        correct: 2
    },
    {
        difficulty: "Experte",
        reward: 50000,
        question: "Wie lautet die Dezimalzahl von 3/8?",
        answers: ["0,325", "0,375", "0,425", "0,625"],
        correct: 1
    },

    {
        difficulty: "Experte",
        reward: 50000,
        question: "Wie viele Bytes sind 1 Kilobyte im Dezimalsystem?",
        answers: ["100", "512", "1000", "1024"],
        correct: 2
    },
    {
        difficulty: "Schwer",
        reward: 25000,
        question: "Welcher Kontinent hat die meisten Länder?",
        answers: ["Europa", "Afrika", "Asien", "Südamerika"],
        correct: 1
    },
    {
        difficulty: "Schwer",
        reward: 25000,
        question: "Wie lautet die Formel für die Fläche eines Kreises?",
        answers: ["2πr", "πr²", "πd", "r²/2"],
        correct: 1
    },
    {
        difficulty: "Experte",
        reward: 50000,
        question: "Welche Zahl ist die kleinste gemeinsame Vielfache von 12 und 18?",
        answers: ["24", "30", "36", "72"],
        correct: 2
    },
    {
        difficulty: "Experte",
        reward: 50000,
        question: "Was ist die Lösung von 2x² = 50 für x > 0?",
        answers: ["4", "5", "10", "25"],
        correct: 1
    },
    {
        difficulty: "Experte",
        reward: 50000,
        question: "Welcher Wert entspricht der Binärzahl 1010?",
        answers: ["8", "9", "10", "12"],
        correct: 2
    }
];

let testTimer = 60;
let questionTimer = 20;
let testActive = false;
let currentQuestion = null;
let lastQuestionIndex = -1;

// ==============================
// NEUEN TEST STARTEN
// ==============================

function startTest() {
    testActive = true;
    questionTimer = 20;

    let randomIndex;

    do {
        randomIndex = Math.floor(Math.random() * questions.length);
    } while (randomIndex === lastQuestionIndex);

    lastQuestionIndex = randomIndex;
    currentQuestion = questions[randomIndex];

    document.getElementById("quiz").hidden = false;

    document.getElementById("difficulty").textContent =
        "Schwierigkeit: " + currentQuestion.difficulty;

    document.getElementById("question").textContent =
        currentQuestion.question;

    document.getElementById("quizResult").textContent = "";

    const answers = document.getElementById("answers");
    answers.innerHTML = "";

    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement("button");

        button.textContent = answer;

        button.addEventListener("click", () => {
            answerQuestion(index);
        });

        answers.appendChild(button);
    });

    document.getElementById("testTimer").textContent =
        "TEST LÄUFT! Du hast 20 Sekunden!";

    document.getElementById("questionTimer").textContent =
        "20 Sekunden";
}

// ==============================
// ANTWORT ÜBERPRÜFEN
// ==============================

function answerQuestion(index) {
    if (!testActive) return;

    testActive = false;

    const buttons = document.querySelectorAll("#answers button");

    buttons.forEach(button => {
        button.disabled = true;
    });

    const result = document.getElementById("quizResult");

    if (index === currentQuestion.correct) {
        const reward = currentQuestion.reward * getMultiplier();

        iq += reward;
        totalIQ += reward;

        result.textContent =
            "RICHTIG! +" + formatNumber(reward) + " IQ! 🎉";
    } else {
        result.textContent =
            "FALSCH! Leider bekommst du diesmal nichts.";
    }

    testTimer = 60;

    updateGame();
    saveGame();
}

// ==============================
// TESTSYSTEM TIMER
// ==============================

function tickTest() {
    if (testActive) {
        questionTimer--;

        document.getElementById("questionTimer").textContent =
            questionTimer + " Sekunden";

        if (questionTimer <= 0) {
            testActive = false;

            document.getElementById("quizResult").textContent =
                "ZEIT ABGELAUFEN! Keine Belohnung.";

            document.querySelectorAll("#answers button").forEach(button => {
                button.disabled = true;
            });

            testTimer = 60;
        }

    } else {
        testTimer--;

        if (testTimer <= 0) {
            startTest();
        } else {
            document.getElementById("testTimer").textContent =
                "Nächster Test in " + testTimer + " Sekunden";
        }
    }
}

// ==============================
// AUTOMATISCHER IQ
// ==============================

setInterval(function() {
    iq += iqPerSecond;
    totalIQ += iqPerSecond;

    updateGame();
}, 1000);

// Jede Sekunde den Test-Timer prüfen
setInterval(tickTest, 1000);

// ==============================
// AUTOMATISCH SPEICHERN
// ==============================

setInterval(saveGame, 5000);

// ==============================
// SPIEL ZURÜCKSETZEN
// ==============================

document.getElementById("resetButton").addEventListener("click", function() {
    if (confirm("Willst du deinen ganzen Spielstand löschen?")) {
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
});

// ==============================
// SPIEL STARTEN
// ==============================

createTeacherShop();
createUpgradeShop();
loadGame();
