// --- Globale Variablen und Kartendeck ---
let players = [];
let playerCount = 0;
let currentPlayerIndex = 0;
let currentNameIndex = 0;
let questionTimerInterval;
let currentCard = null; // Speichert derzeit aktive Quizkarte

// Array mit den gültigen Ereignisfeld-Positionen
const eventFieldPositions = [2, 5, 9, 12, 16, 19, 23, 27, 30, 34, 37, 40, 44, 47, 49];

// Das Kartendeck (3-stellige Codes, zufällig vergeben)
const cards = {
  // --- Original Quiz-Karten ---
  "157": {
    type: "quiz",
    question: "Wann veröffentlichte Martin Luther seine 95 Thesen?",
    options: { "A": "1512", "B": "1517", "C": "1521", "D": "1530" },
    correct: "B"
  },
  "284": {
    type: "quiz",
    question: "Welchen Kaiser konfrontierte Luther beim Reichstag zu Worms?",
    options: { "A": "Friedrich III.", "B": "Maximilian I.", "C": "Karl V.", "D": "Ferdinand II." },
    correct: "C"
  },
  "360": {
    type: "quiz",
    question: "Wie beeinflusste der Buchdruck die Verbreitung der Reformationsideen?",
    options: { "A": "Er machte Schriften nur wenigen zugänglich.", "B": "Er verbreitete die Ideen schneller und kostengünstiger.", "C": "Er führte zu weniger Diskrepanzen.", "D": "Er hatte kaum Einfluss." },
    correct: "B"
  },
  "092": {
    type: "quiz",
    question: "Welcher Reformator wirkte in der Schweiz und setzte Luthers Ideen ähnlich um?",
    options: { "A": "Johannes Calvin", "B": "Ulrich Zwingli", "C": "Thomas Müntzer", "D": "Philipp Melanchthon" },
    correct: "B"
  },
  "431": {
    type: "quiz",
    question: "Was war der Hauptkritikpunkt Luthers an der katholischen Kirche?",
    options: { "A": "Der Ablasshandel", "B": "Die zu hohe Steuerlast", "C": "Das Fehlen von Bibellesungen", "D": "Die übertriebene Verehrung von Heiligen" },
    correct: "A"
  },
  // --- Original Event-Karten ---
  "738": {
    type: "event",
    description: "Die Kirche droht mit dem Bann! Würfle eine gerade Zahl, sonst musst du eine Runde aussetzen."
  },
  "215": {
    type: "event",
    description: "Die Druckerpresse brummt – Du darfst sofort nochmal würfeln und den zusätzlichen Wert addieren."
  },
  "659": {
    type: "event",
    description: "Bauernaufstand im Dorf – Alle Spieler verlieren 1 Feld, während du 2 Felder vorziehst."
  },
  "384": {
    type: "event",
    description: "Ein geheimnisvoller Patron tritt auf – Entscheide: Erhalte 2 zusätzliche Felder oder zwinge einen Gegner, 1 Feld zurückzugehen."
  },
  "902": {
    type: "event",
    description: "Die Weissagung des Predigers – Beantworte eine zusätzliche Quizfrage: richtig = +4 Felder, falsch = -2 Felder."
  },
  "167": {
    type: "event",
    description: "Ein Feuer der Leidenschaft – Wähle: Runde aussetzen oder 3 Felder zurück."
  },
  "500": {
    type: "event",
    description: "Die Intrige am Hof – Du verlierst 3 Felder, bekommst aber einen Sonderzug (nochmal würfeln)."
  },
  // --- Original Luck-Karten ---
  "321": {
    type: "luck",
    description: "Engelsgesang – Du rückst 3 Felder vor."
  },
  "444": {
    type: "luck",
    description: "Erfolgreiche Predigt – Alle Gegner verlieren 1 Feld."
  },
  "278": {
    type: "luck",
    description: "Verkaufte Schriften – Du erhältst 2 zusätzliche Felder."
  },
  "577": {
    type: "luck",
    description: "Gottes Segen – Du darfst einen zusätzlichen Zug machen."
  },
  "119": {
    type: "luck",
    description: "Starker Glaube – Ziehe 3 Felder vorwärts."
  },

  // --- Neue Quiz-Karten ---
  "929": {
    type: "quiz",
    question: "GROß JOKER: Was markiert symbolisch den Beginn der Reformation?",
    options: {
      "A": "Die Einsetzung eines neuen Papstes",
      "B": "Die Veröffentlichung der 95 Thesen",
      "C": "Ein königlicher Erlass",
      "D": "Die Schlacht bei Frankenhausen"
    },
    correct: "B",
    bonus: 4
  },
  "991": {
    type: "quiz",
    question: "Welches war das wichtigste Dokument der Reformation neben den 95 Thesen?",
    options: {
      "A": "Das Augsburger Bekenntnis",
      "B": "Die Confessio Augustana",
      "C": "Die Leipziger Disputation",
      "D": "Die Berner Reformulierung"
    },
    correct: "B"
  },
  "867": {
    type: "quiz",
    question: "Welcher Begriff beschreibt Luthers zentrale Lehre des 'sola fide'?",
    options: {
      "A": "Sola scriptura",
      "B": "Rechtfertigung",
      "C": "Sola gratia",
      "D": "Solus Christus"
    },
    correct: "B"
  },
  "817": {
    type: "quiz",
    question: "Welcher Reformator wirkte maßgeblich in Genf?",
    options: {
      "A": "Ulrich Zwingli",
      "B": "John Calvin",
      "C": "Martin Bucer",
      "D": "Philipp Melanchthon"
    },
    correct: "B"
  },
  "815": {
    type: "quiz",
    question: "Welche Lehre wird mit 'sola scriptura' verbunden?",
    options: {
      "A": "Nur die Schrift hat Autorität",
      "B": "Nur der Glaube zählt",
      "C": "Nur Werke machen gerecht",
      "D": "Die Tradition ist maßgeblich"
    },
    correct: "A"
  },
  "812": {
    type: "quiz",
    question: "Welche Wirkung hatte der Buchdruck auf die Reformation?",
    options: {
      "A": "Er verlangsamt die Verbreitung",
      "B": "Er förderte die Verbreitung",
      "C": "Er hatte keinen Einfluss",
      "D": "Er wurde boykottiert"
    },
    correct: "B"
  },
  "809": {
    type: "quiz",
    question: "Was bedeutet 'sola fide'?",
    options: {
      "A": "Allein durch Gottes Wort",
      "B": "Allein durch den Glauben",
      "C": "Allein durch Werke",
      "D": "Allein durch Sakramente"
    },
    correct: "B"
  },
  "806": {
    type: "quiz",
    question: "Wie nennt man das Prinzip, wonach allein der Glaube zur Erlösung führt?",
    options: {
      "A": "Sola scriptura",
      "B": "Sola fide",
      "C": "Sola gratia",
      "D": "Soli Deo gloria"
    },
    correct: "B"
  },
  "804": {
    type: "quiz",
    question: "Welcher Reformuspfad führte zur Spaltung der Kirche?",
    options: {
      "A": "Die Konsolierung",
      "B": "Die Reformation",
      "C": "Die Mystifikation",
      "D": "Die Inquisition"
    },
    correct: "B"
  },
  "802": {
    type: "quiz",
    question: "Welchen Einfluss hatte die Reformation auf die Bildung?",
    options: {
      "A": "Sie verbesserte die Alphabetisierung",
      "B": "Sie reduzierte das Bildungsniveau",
      "C": "Sie hatte keinen Einfluss",
      "D": "Sie führte zu Chaos in den Schulen"
    },
    correct: "A"
  },
  "789": {
    type: "quiz",
    question: "Welcher Reformator war maßgeblich an der Übersetzung der Bibel ins Deutsche beteiligt?",
    options: {
      "A": "Martin Luther",
      "B": "John Calvin",
      "C": "Ulrich Zwingli",
      "D": "Philipp Melanchthon"
    },
    correct: "A"
  },
  "742": {
    type: "quiz",
    question: "Welches Prinzip war zentral in Luthers Theologie?",
    options: {
      "A": "Sola scriptura",
      "B": "Sola fide",
      "C": "Sola gratia",
      "D": "Solus Christus"
    },
    correct: "B"
  },
  "681": {
    type: "quiz",
    question: "Welche Rolle spielte der Buchdruck in der Verbreitung der Reformation?",
    options: {
      "A": "Er veränderte nichts",
      "B": "Er verbreitete Luthers Ideen rasant",
      "C": "Er verursachte Chaos",
      "D": "Er blockierte den Informationsfluss"
    },
    correct: "B"
  },
  "635": {
    type: "quiz",
    question: "Wie trug Melanchthon zur Ausbreitung der Reformation bei?",
    options: {
      "A": "Durch Predigten",
      "B": "Durch schriftliche Arbeiten",
      "C": "Durch milde Reformen",
      "D": "Durch Unterdrückung"
    },
    correct: "B"
  },
  "602": {
    type: "quiz",
    question: "Was war eines der zentralen Anliegen der protestantischen Reformation?",
    options: {
      "A": "Die Reformierung des Ablasshandels",
      "B": "Die Wiederherstellung der Papstherrschaft",
      "C": "Die Verbesserung der Kirchenarchitektur",
      "D": "Die Einführung der sieben Sakramente"
    },
    correct: "A"
  },
  "413": {
    type: "quiz",
    question: "Welcher Vorfall löste symbolisch den Widerstand der Reformatoren aus?",
    options: {
      "A": "Ein päpstlicher Erlass",
      "B": "Die Veröffentlichung der 95 Thesen",
      "C": "Der königliche Erlass",
      "D": "Eine kirchliche Synode"
    },
    correct: "B"
  },
  "354": {
    type: "quiz",
    question: "Was versteht man unter 'sola scriptura'?",
    options: {
      "A": "Nur die Schrift hat Autorität",
      "B": "Die Schrift ist nebensächlich",
      "C": "Nur mündliche Überlieferung zählt",
      "D": "Die Schrift verrauscht die Wahrheit"
    },
    correct: "A"
  },
  "329": {
    type: "quiz",
    question: "Welche Bewegung wird als Teil der 'Radikalen Reformation' angesehen?",
    options: {
      "A": "Die Täuferbewegung",
      "B": "Die reformatorische Bewegung",
      "C": "Die Jesuiten",
      "D": "Die Inquisition"
    },
    correct: "A"
  },
  "317": {
    type: "quiz",
    question: "Wie beeinflusste die Reformation die Kirchenarchitektur?",
    options: {
      "A": "Sie wurden opulent gestaltet",
      "B": "Sie erhielten einen schlichten Stil",
      "C": "Es gab keine Veränderung",
      "D": "Die Kirchen wurden zerstört"
    },
    correct: "B"
  },
  "205": {
    type: "quiz",
    question: "Welches Merkmal zeichnet den reformatorischen Gottesdienst aus?",
    options: {
      "A": "Opulente Liturgie",
      "B": "Schlichte Andacht",
      "C": "Prunkvolle Zeremonien",
      "D": "Heidnische Rituale"
    },
    correct: "B"
  },

  // --- Neue Luck-Karten ---
  "909": {
    type: "luck",
    description: "Segen des Reformers – Du erhältst 2 zusätzliche Felder."
  },
  "843": {
    type: "luck",
    description: "Erneuertes Vertrauen – Ziehe 3 Felder vor."
  },
  "832": {
    type: "luck",
    description: "Himmlische Eingebung – Du rückst 4 Felder vor."
  },
  "577": {
    type: "luck",
    description: "Göttlicher Bonus – Du erhältst 3 Felder zusätzlich."
  },

  // --- Neue Event-Karten ---
  "820": {
    type: "event",
    description: "Pechsträhne: Du verlierst 4 Felder."
  },
  "818": {
    type: "event",
    description: "Die Predigt eines Skeptikers lähmt deine Fortschritte – du gehst 2 Felder zurück."
  },
  "816": {
    type: "event",
    description: "Knistern in der Kirche – Du verlierst 3 Felder."
  },
  "813": {
    type: "event",
    description: "Ein unerwarteter Rückschlag – Du verlierst 2 Felder."
  },
  "811": {
    type: "event",
    description: "JOKER EVENT: Die Gunst des Herrn – Rücke 4 Felder vor.",
    bonus: 4
  },
  "807": {
    type: "event",
    description: "Die Missgunst der Menge trifft dich – Du gehst 2 Felder zurück."
  },
  "805": {
    type: "event",
    description: "Die Inquisition schlägt zu – Du verlierst 3 Felder."
  },
  "803": {
    type: "event",
    description: "Die hitzige Predigt sorgt für Unruhe – Du verlierst 2 Felder."
  },
  "801": {
    type: "event",
    description: "Ein stürmischer Tag – Du gehst 2 Felder zurück."
  }
};

// --- Szenensteuerung: Hilfsfunktionen ---
function showOnly(sceneId) {
  const scenes = document.querySelectorAll("#gameContainer > .scene");
  scenes.forEach(scene => scene.classList.add("hidden"));
  document.getElementById(sceneId).classList.remove("hidden");
}

function hideScene(sceneId) {
  document.getElementById(sceneId).classList.add("hidden");
}

function hideAllGameScenes() {
  const scenes = document.querySelectorAll("#gameContainer > .scene");
  scenes.forEach(scene => scene.classList.add("hidden"));
}

function updatePlayerList() {
  const list = document.getElementById("playerList");
  let html = "<h3>Spieler:</h3>";
  players.forEach(player => {
    html += `<p>${player.name} – Position: ${player.position}</p>`;
  });
  list.innerHTML = html;
}

// --- Phase 1: Spielerzahl wählen ---
function setPlayerCount(count) {
  playerCount = count;
  players = new Array(count);
  currentNameIndex = 0;
  document.getElementById("homescreen").classList.add("hidden");
  document.getElementById("nameInput").classList.remove("hidden");
  document.getElementById("namePrompt").innerText = `Spieler ${currentNameIndex + 1}, wie heißt du?`;
}

// --- Phase 2-5: Namenseingabe (sequentiell) ---
function nextName() {
  const input = document.getElementById("playerNameInput").value.trim();
  if (!/^[A-Za-z]+$/.test(input) || input.length === 0) {
    alert("Ungültiger Name. Bitte nur Buchstaben (max. 12 Zeichen) verwenden.");
    return;
  }
  players[currentNameIndex] = { name: input, position: 0 };
  currentNameIndex++;
  document.getElementById("playerNameInput").value = "";
  if (currentNameIndex < playerCount) {
    document.getElementById("namePrompt").innerText = `Spieler ${currentNameIndex + 1}, wie heißt du?`;
  } else {
    document.getElementById("nameInput").classList.add("hidden");
    document.getElementById("gameArea").classList.remove("hidden");
    updatePlayerList();
    startTurn();
  }
}

// --- Phase 6: "Du bist am Zug!" (4 Sekunden) ---
function startTurn() {
  updatePlayerList();
  document.getElementById("turnInfoText").innerText = `${players[currentPlayerIndex].name}, du bist am Zug!`;
  showOnly("turnInfo");
  setTimeout(() => {
    hideAllGameScenes();
    showDiceRoll();
  }, 4000);
}

// --- Phase 7: Würfeln – manuelle Eingabe der gewürfelten Zahl ---
function showDiceRoll() {
  document.getElementById("diceRollText").innerText = `${players[currentPlayerIndex].name}, du musst würfeln!`;
  showOnly("diceRoll");
}

function rollDice(number) {
  hideScene("diceRoll");
  players[currentPlayerIndex].position += number;
  updatePlayerList();
  // Wird der Spieler auf ein Ereignisfeld gesetzt?
  if (eventFieldPositions.includes(players[currentPlayerIndex].position)) {
    showOnly("eventCheck");
  } else {
    nextTurn();
  }
}

// --- Phase 8: Kartencode eingeben ---
function checkEvent() {
  const code = document.getElementById("cardCodeInput").value.trim();
  hideScene("eventCheck");

  if (!cards.hasOwnProperty(code)) {
    alert("Ungültiger Kartencode!");
    nextTurn();
    return;
  }
  const card = cards[code];
  if (card.type === "quiz") {
    currentCard = card;  // Speichere die aktuell verwendete Quizkarte
    showCardType("Quizkarte", "blue");
    setTimeout(() => {
      showQuestionArea(card);
    }, 2000);
  } else if (card.type === "event") {
    showCardType("Ereigniskarte", "red");
    setTimeout(() => {
      processEventCard(card);
    }, 2000);
  } else if (card.type === "luck") {
    showCardType("Glückskarte", "green");
    processLuckCard(card);
  }
}

// --- Szene 9: Kartentyp anzeigen ---
function showCardType(text, color) {
  const ct = document.getElementById("cardTypeText");
  ct.innerText = text;
  ct.style.backgroundColor = color;
  showOnly("cardType");
  setTimeout(() => { hideScene("cardType"); }, 2000);
}

// --- Szene 9a: Quizfrage anzeigen ---
function showQuestionArea(card) {
  document.getElementById("questionText").innerText = card.question;
  const optionsDiv = document.getElementById("answerOptions");
  optionsDiv.innerHTML = "";
  for (const key in card.options) {
    const btn = document.createElement("button");
    btn.innerText = `${key}) ${card.options[key]}`;
    btn.onclick = () => submitQuizAnswer(key === card.correct);
    optionsDiv.appendChild(btn);
  }
  showOnly("questionArea");
  start
