// =============================
// OSZINS CLICKER VERSION 4.0
// =============================

const SAVE_KEY = "oszinsSave";

let iq = 0;
let totalIQ = 0;
let clickPower = 1;
let iqPerSecond = 0;
let rebirths = 0;
let leaves = 0;

let goldenReady = false;
let goldenActiveUntil = 0;
let nextGoldenTime = Date.now() + 2 * 60 * 1000;

let bossActive = false;
let bossQuestionIndex = 0;
let bossCorrect = 0;
let bossQuestions = [];
let nextBossTime = Date.now() + 30 * 60 * 1000;

let leafEventActive = false;
let leavesSpawned = 0;
let leafEventEnd = 0;
let nextLeafTime = Date.now() + 60 * 60 * 1000;
let leafSpawnTimer = 0;

let testActive = false;
let testTimeLeft = 20;
let testCountdown = 60;
let currentQuestion = null;
let questionNumber = 0;

// =============================
// LEHRER
// =============================

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

// =============================
// NORMALE UPGRADES
// =============================

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

// =============================
// LIMITIERTE BLATT-UPGRADES
// =============================

const limitedUpgrades = [
    { name: "Goldenes Blatt", cost: 50, bonus: 100, bought: false },
    { name: "Herbst-Heft", cost: 100, bonus: 250, bought: false },
    { name: "Blätter-Rucksack", cost: 150, bonus: 500, bought: false },
    { name: "Goldener Taschenrechner", cost: 200, bonus: 1000, bought: false },
    { name: "Herbst-Gaming-PC", cost: 250, bonus: 2500, bought: false }
];

// =============================
// SCHULTEST-FRAGEN
// =============================

const questions = [
    { q: "Wie viele Minuten hat eine Stunde?", a: ["30", "60", "90", "100"], c: 1, level: 1 },
    { q: "Was ist 12 x 8?", a: ["86", "92", "96", "108"], c: 2, level: 1 },
    { q: "Wie heisst die Hauptstadt der Schweiz?", a: ["Zürich", "Genf", "Bern", "Basel"], c: 2, level: 1 },
    { q: "Wie viele Seiten hat ein Würfel?", a: ["4", "6", "8", "12"], c: 1, level: 1 },
    { q: "Was ist 15 x 7?", a: ["95", "100", "105", "115"], c: 2, level: 2 },
    { q: "Wie heisst die Hauptstadt von Frankreich?", a: ["Rom", "Paris", "Madrid", "Berlin"], c: 1, level: 2 },
    { q: "Wie viele Kontinente gibt es?", a: ["5", "6", "7", "8"], c: 2, level: 2 },
    { q: "Was ist die Quadratwurzel von 144?", a: ["10", "11", "12", "14"], c: 2, level: 2 },
    { q: "Welcher Planet ist der Sonne am nächsten?", a: ["Venus", "Mars", "Merkur", "Jupiter"], c: 2, level: 3 },
    { q: "Was ist 25 x 16?", a: ["300", "350", "400", "450"], c: 2, level: 3 },
    { q: "Wie viele Grad hat ein rechter Winkel?", a: ["45", "90", "180", "360"], c: 1, level: 3 },
    { q: "Welches Gas brauchen Menschen zum Atmen?", a: ["Stickstoff", "Sauerstoff", "Helium", "Wasserstoff"], c: 1, level: 3 }
];

// =============================
// BOSSFRAGEN
// =============================

const bossQuestionPool = [
    { q: "Was ist 125 x 8?", a: ["900", "1000", "1100", "1200"], c: 1 },
    { q: "Wie viele Bundesstaaten haben die USA?", a: ["48", "49", "50", "52"], c: 2 },
    { q: "Was ist die Hauptstadt von Japan?", a: ["Seoul", "Peking", "Tokio", "Bangkok"], c: 2 },
    { q: "Was ist 17 x 17?", a: ["279", "289", "299", "309"], c: 1 },
    { q: "Wie viele Knochen hat ein erwachsener Mensch ungefähr?", a: ["106", "206", "306", "406"], c: 1 },
    { q: "Welcher Planet ist der grösste?", a: ["Erde", "Saturn", "Jupiter", "Neptun"], c: 2 },
    { q: "Was ist 144 geteilt durch 12?", a: ["10", "11", "12", "14"], c: 2 },
    { q: "Wie viele Minuten hat ein Tag?", a: ["1240", "1340", "1440", "1540"], c: 2 }
];

// =============================
// HILFSFUNKTIONEN
// =============================

function formatNumber(number) {
    return Math.floor(number).toLocaleString("de-CH");
}

function getMultiplier() {
    return Math.pow(2, rebirths);
}

function getGoldenMultiplier() {
    return Date.now() < goldenActiveUntil ? 7 : 1;
}

function getRebirthCost() {
    return 1000000 * Math.pow(3, rebirths);
}

function addIQ(amount) {
    iq += amount;
    totalIQ += amount;
    updateGame();
}

function calculateBoosts() {
    let teacherBoost = 0;
    let upgradeBoost = 0;

    teachers.forEach(teacher => {
        teacherBoost += teacher.owned * teacher.boost;
    });

    upgrades.forEach(upgrade => {
        upgradeBoost += upgrade.owned * upgrade.bonus;
    });

    limitedUpgrades.forEach(upgrade => {
        if (upgrade.bought) {
            upgradeBoost += upgrade.bonus;
        }
    });

    const multiplier = getMultiplier();

    iqPerSecond = teacherBoost * multiplier;
    clickPower = (1 + upgradeBoost) * multiplier;
}

function updateGame() {
    calculateBoosts();

    document.getElementById("iq").textContent = formatNumber(iq);
    document.getElementById("perSecond").textContent =
        formatNumber(iqPerSecond * getGoldenMultiplier());
    document.getElementById("clickPower").textContent =
        formatNumber(clickPower * getGoldenMultiplier());
    document.getElementById("rebirthCount").textContent = rebirths;
    document.getElementById("leafCount").textContent = leaves;

    document.getElementById("multiplierText").textContent =
        "Multiplikator: x" + formatNumber(getMultiplier());

    document.getElementById("rebirthBonus").textContent =
        "x" + formatNumber(getMultiplier());

    document.getElementById("rebirthCost").textContent =
        formatNumber(getRebirthCost()) + " IQ";

    document.getElementById("totalIQ").textContent = formatNumber(totalIQ);

    document.getElementById("totalTeachers").textContent =
        teachers.reduce((sum, item) => sum + item.owned, 0);

    document.getElementById("totalUpgrades").textContent =
        upgrades.reduce((sum, item) => sum + item.owned, 0);

    renderShops();
}

// =============================
// KLICKER
// =============================

document.getElementById("clickButton").addEventListener("click", () => {
    addIQ(clickPower * getGoldenMultiplier());
});

// =============================
// SHOPS
// =============================

function renderShops() {
    const teacherShop = document.getElementById("teacherShop");
    const upgradeShop = document.getElementById("upgradeShop");
    const limitedShop = document.getElementById("limitedShop");

    teacherShop.innerHTML = "";
    upgradeShop.innerHTML = "";
    limitedShop.innerHTML = "";

    teachers.forEach(teacher => {
        const cost = Math.floor(
            teacher.cost * Math.pow(1.65, teacher.owned)
        );

        const item = document.createElement("div");
        item.className = "shop-item";

        item.innerHTML = `
            <h3>${teacher.name}</h3>
            <p>Besitzt: ${teacher.owned}</p>
            <p>+${formatNumber(teacher.boost)} IQ pro Sekunde</p>
            <p>Preis: ${formatNumber(cost)} IQ</p>
            <button ${iq < cost ? "disabled" : ""}>Kaufen</button>
        `;

        item.querySelector("button").addEventListener("click", () => {
            if (iq >= cost) {
                iq -= cost;
                teacher.owned++;
                updateGame();
                saveGame();
            }
        });

        teacherShop.appendChild(item);
    });

    upgrades.forEach(upgrade => {
        const cost = Math.floor(
            upgrade.cost * Math.pow(1.9, upgrade.owned)
        );

        const item = document.createElement("div");
        item.className = "shop-item";

        item.innerHTML = `
            <h3>${upgrade.icon} ${upgrade.name}</h3>
            <p>Besitzt: ${upgrade.owned}</p>
            <p>+${formatNumber(upgrade.bonus)} IQ pro Klick</p>
            <p>Preis: ${formatNumber(cost)} IQ</p>
            <button ${iq < cost ? "disabled" : ""}>Kaufen</button>
        `;

        item.querySelector("button").addEventListener("click", () => {
            if (iq >= cost) {
                iq -= cost;
                upgrade.owned++;
                updateGame();
                saveGame();
            }
        });

        upgradeShop.appendChild(item);
    });

    limitedUpgrades.forEach(upgrade => {
        const item = document.createElement("div");
        item.className = "shop-item";

        item.innerHTML = `
            <h3>🍂 ${upgrade.name}</h3>
            <p>+${formatNumber(upgrade.bonus)} IQ pro Klick</p>
            <p>Preis: ${upgrade.cost} Blätter</p>
            <p>${upgrade.bought ? "Bereits gekauft" : "Noch verfügbar"}</p>
            <button ${upgrade.bought || leaves < upgrade.cost ? "disabled" : ""}>
                ${upgrade.bought ? "Gekauft" : "Kaufen"}
            </button>
        `;

        item.querySelector("button").addEventListener("click", () => {
            if (!upgrade.bought && leaves >= upgrade.cost) {
                leaves -= upgrade.cost;
                upgrade.bought = true;
                updateGame();
                saveGame();
            }
        });

        limitedShop.appendChild(item);
    });
}

// =============================
// REBIRTH
// =============================

document.getElementById("rebirthButton").addEventListener("click", () => {
    const cost = getRebirthCost();

    if (iq >= cost) {
        iq = 0;
        rebirths++;

        teachers.forEach(teacher => teacher.owned = 0);
        upgrades.forEach(upgrade => upgrade.owned = 0);

        document.getElementById("rebirthMessage").textContent =
            "Rebirth geschafft! Dein Multiplikator wurde verdoppelt.";

        updateGame();
        saveGame();
    } else {
        document.getElementById("rebirthMessage").textContent =
            "Du brauchst noch mehr IQ!";
    }
});

// =============================
// GOLDEN IQ
// =============================

function spawnGoldenIQ() {
    if (goldenReady || Date.now() < goldenActiveUntil) return;

    goldenReady = true;

    document.getElementById("goldenStatus").textContent =
        "Ein goldener IQ ist erschienen! Klicke ihn an!";

    document.getElementById("goldenButton").classList.remove("hidden");
}

document.getElementById("goldenButton").addEventListener("click", () => {
    if (!goldenReady) return;

    goldenReady = false;
    goldenActiveUntil = Date.now() + 3 * 60 * 1000;
    nextGoldenTime = goldenActiveUntil + 2 * 60 * 1000;

    document.getElementById("goldenButton").classList.add("hidden");

    document.getElementById("goldenStatus").textContent =
        "Golden IQ aktiv! Du bekommst 7-fachen IQ für 3 Minuten.";
});

function updateGoldenTimer() {
    const remaining = Math.max(0, goldenActiveUntil - Date.now());

    if (remaining > 0) {
        const seconds = Math.ceil(remaining / 1000);
        const minutes = Math.floor(seconds / 60);
        const rest = seconds % 60;

        document.getElementById("goldenTimer").textContent =
            `7x Bonus noch ${minutes}:${String(rest).padStart(2, "0")} Minuten`;
    } else {
        document.getElementById("goldenTimer").textContent = "";

        if (goldenActiveUntil > 0) {
            document.getElementById("goldenStatus").textContent =
                "Der Golden-IQ-Bonus ist vorbei.";

            goldenActiveUntil = 0;
        }
    }
}

// =============================
// BOSSFIGHT GEGEN HERR RITTER
// =============================

function startBossFight() {
    if (bossActive) return;

    bossActive = true;
    bossQuestionIndex = 0;
    bossCorrect = 0;

    bossQuestions = [...bossQuestionPool]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

    document.getElementById("bossGame").classList.remove("hidden");

    document.getElementById("bossResult").textContent =
        "Herr Ritter fordert dich heraus! Beantworte 3 Fragen!";

    showBossQuestion();
}

function showBossQuestion() {
    if (bossQuestionIndex >= bossQuestions.length) {
        finishBossFight();
        return;
    }

    const question = bossQuestions[bossQuestionIndex];

    document.getElementById("bossQuestion").textContent = question.q;

    document.getElementById("bossProgress").textContent =
        `Frage ${bossQuestionIndex + 1} von 3`;

    const answers = document.getElementById("bossAnswers");
    answers.innerHTML = "";

    question.a.forEach((answer, index) => {
        const button = document.createElement("button");
        button.textContent = answer;

        button.addEventListener("click", () => {
            if (!bossActive) return;

            if (index === question.c) {
                bossCorrect++;
            }

            bossQuestionIndex++;
            showBossQuestion();
        });

        answers.appendChild(button);
    });
}

function finishBossFight() {
    bossActive = false;

    document.getElementById("bossGame").classList.add("hidden");

    if (bossCorrect >= 2) {
        addIQ(1000000);

        document.getElementById("bossResult").textContent =
            "Du hast Herr Ritter besiegt! 1'000'000 IQ gewonnen!";
    } else {
        iq = Math.floor(iq * 0.5);

        document.getElementById("bossResult").textContent =
            "Herr Ritter hat gewonnen! Dein IQ wurde halbiert.";

        updateGame();
    }

    saveGame();
}

function updateBossTimer() {
    const remaining = Math.max(0, nextBossTime - Date.now());

    if (bossActive) {
        document.getElementById("bossStatus").textContent =
            "Bossfight läuft!";
        return;
    }

    const seconds = Math.ceil(remaining / 1000);
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;

    document.getElementById("bossStatus").textContent =
        `Nächster Bossfight in ${minutes}:${String(rest).padStart(2, "0")}`;

    if (remaining <= 0) {
        nextBossTime = Date.now() + 30 * 60 * 1000;
        startBossFight();
    }
}

// =============================
// BLÄTTER-EVENT
// =============================

function startLeafEvent() {
    if (leafEventActive) return;

    leafEventActive = true;
    leavesSpawned = 0;
    leafEventEnd = Date.now() + 5 * 60 * 1000;
    leafSpawnTimer = 0;

    document.getElementById("leafStatus").textContent =
        "Das Blätter-Event läuft! Sammle die Blätter!";

    document.getElementById("leafInstructions").textContent =
        "Klicke auf die herunterfallenden Blätter!";

    document.getElementById("leafArea").innerHTML = "";
}

function spawnLeaf() {
    if (!leafEventActive || leavesSpawned >= 50) return;

    leavesSpawned++;

    const leaf = document.createElement("button");
    leaf.className = "falling-leaf";
    leaf.textContent = "🍃";

    const area = document.getElementById("leafArea");
    const maxLeft = Math.max(0, area.clientWidth - 45);

    leaf.style.left = Math.floor(Math.random() * maxLeft) + "px";
    leaf.style.animationDuration = (3 + Math.random() * 2) + "s";

    leaf.addEventListener("click", () => {
        if (!leafEventActive || leaf.dataset.collected === "yes") return;

        leaf.dataset.collected = "yes";
        leaves++;
        leaf.remove();

        document.getElementById("leafCount").textContent = leaves;

        renderShops();
        saveGame();
    });

    area.appendChild(leaf);

    setTimeout(() => {
        if (leaf.isConnected) leaf.remove();
    }, 5500);
}

function endLeafEvent() {
    leafEventActive = false;
    nextLeafTime = Date.now() + 60 * 60 * 1000;

    document.getElementById("leafStatus").textContent =
        `Das Blätter-Event ist vorbei! Du hast ${formatNumber(leaves)} Blätter insgesamt.`;

    document.getElementById("leafInstructions").textContent =
        "Das nächste Event startet in ungefähr einer Stunde.";

    document.getElementById("leafArea").innerHTML = "";

    saveGame();
}

function updateLeafEvent() {
    // Countdown waehrend das Event noch nicht laeuft
    if (!leafEventActive) {
        const remaining = Math.max(0, nextLeafTime - Date.now());
        const seconds = Math.ceil(remaining / 1000);
        const minutes = Math.floor(seconds / 60);
        const rest = seconds % 60;

        document.getElementById("leafStatus").textContent =
            `Naechstes Blaetter-Event in ${minutes}:${String(rest).padStart(2, "0")}`;

        if (remaining <= 0) {
            startLeafEvent();
        }
        return;
    }

    // Countdown waehrend des laufenden Events
    const remaining = Math.max(0, leafEventEnd - Date.now());
    const seconds = Math.ceil(remaining / 1000);
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;

    document.getElementById("leafStatus").textContent =
        `Blaetter-Event laeuft noch ${minutes}:${String(rest).padStart(2, "0")} | ${leavesSpawned}/50 Blaetter erschienen`;

    if (remaining <= 0) {
        endLeafEvent();
    }
}

// =============================
// SCHULTEST
// =============================

function startTest() {
    if (testActive) return;

    testActive = true;
    testTimeLeft = 20;

    const available = questions.filter(q =>
        q.level <= Math.min(3, 1 + Math.floor(questionNumber / 5))
    );

    currentQuestion =
        available[Math.floor(Math.random() * available.length)];

    document.getElementById("quiz").classList.remove("hidden");
    document.getElementById("quizResult").textContent = "";
    document.getElementById("question").textContent = currentQuestion.q;

    document.getElementById("difficulty").textContent =
        "Schwierigkeit: " +
        ["", "Leicht", "Mittel", "Schwer"][currentQuestion.level];

    const answers = document.getElementById("answers");
    answers.innerHTML = "";

    currentQuestion.a.forEach((answer, index) => {
        const button = document.createElement("button");
        button.textContent = answer;

        button.addEventListener("click", () => {
            if (!testActive) return;

            testActive = false;

            if (index === currentQuestion.c) {
                const reward =
                    [0, 5000, 10000, 25000][currentQuestion.level] *
                    getMultiplier();

                addIQ(reward);

                document.getElementById("quizResult").textContent =
                    `Richtig! Du bekommst ${formatNumber(reward)} IQ.`;
            } else {
                document.getElementById("quizResult").textContent =
                    "Leider falsch! Du bekommst diesmal nichts.";
            }

            questionNumber++;
            saveGame();
        });

        answers.appendChild(button);
    });
}

function updateTest() {
    if (testActive) {
        testTimeLeft--;

        document.getElementById("questionTimer").textContent =
            `Noch ${testTimeLeft} Sekunden!`;

        if (testTimeLeft <= 0) {
            testActive = false;

            document.getElementById("quizResult").textContent =
                "Zeit abgelaufen! Diesmal gibt es keine Belohnung.";

            questionNumber++;
        }

        return;
    }

    testCountdown--;

    document.getElementById("testTimer").textContent =
        `Nächster Test in ${testCountdown} Sekunden`;

    if (testCountdown <= 0) {
        testCountdown = 60;
        startTest();
    }
}

// =============================
// SPIEL-TIMER
// =============================

function gameTick() {
    if (iqPerSecond > 0) {
        addIQ(iqPerSecond * getGoldenMultiplier());
    }

    updateGoldenTimer();
    updateBossTimer();
    updateLeafEvent();
    updateTest();

    if (
        !goldenReady &&
        Date.now() >= nextGoldenTime &&
        Date.now() >= goldenActiveUntil
    ) {
        spawnGoldenIQ();
    }

    if (leafEventActive && leavesSpawned < 50) {
        leafSpawnTimer++;

        if (leafSpawnTimer >= 5) {
            leafSpawnTimer = 0;
            spawnLeaf();
        }
    }
}

// =============================
// SPEICHERN
// =============================

function saveGame() {
    const saveData = {
        iq,
        totalIQ,
        rebirths,
        leaves,
        teachers: teachers.map(t => t.owned),
        upgrades: upgrades.map(u => u.owned),
        limitedUpgrades: limitedUpgrades.map(u => u.bought),
        questionNumber
    };

    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
}

// =============================
// LADEN
// =============================

function loadGame() {
    const saved = localStorage.getItem(SAVE_KEY);

    if (!saved) return;

    try {
        const data = JSON.parse(saved);

        iq = data.iq || 0;
        totalIQ = data.totalIQ || 0;
        rebirths = data.rebirths || 0;
        leaves = data.leaves || 0;
        questionNumber = data.questionNumber || 0;

        if (Array.isArray(data.teachers)) {
            teachers.forEach((teacher, index) => {
                teacher.owned = data.teachers[index] || 0;
            });
        }

        if (Array.isArray(data.upgrades)) {
            upgrades.forEach((upgrade, index) => {
                upgrade.owned = data.upgrades[index] || 0;
            });
        }

        if (Array.isArray(data.limitedUpgrades)) {
            limitedUpgrades.forEach((upgrade, index) => {
                upgrade.bought = data.limitedUpgrades[index] || false;
            });
        }

    } catch (error) {
        console.error("Spielstand konnte nicht geladen werden:", error);
    }
}

// =============================
// SPIELSTAND ZURÜCKSETZEN
// =============================

document.getElementById("resetButton").addEventListener("click", () => {
    const confirmed = confirm(
        "Willst du wirklich deinen ganzen Spielstand löschen?"
    );

    if (confirmed) {
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
});

// =============================
// SPIEL STARTEN
// =============================

loadGame();
updateGame();

setInterval(gameTick, 1000);
setInterval(saveGame, 5000);
``
