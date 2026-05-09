(function () {
  // Screens
  const startScreen = document.getElementById("start-screen");
  const gameScreen = document.getElementById("game-screen");
  const endScreen = document.getElementById("end-screen");

  // Buttons
  const startBtn = document.getElementById("start-btn");
  const restartBtn = document.getElementById("restart-btn");
  const walkAwayBtn = document.getElementById("walk-away-btn");
  const lockBtn = document.getElementById("lock-btn");
  const unlockBtn = document.getElementById("unlock-btn");
  const lockControls = document.getElementById("lock-controls");

  // Game UI
  const questionNumberEl = document.getElementById("question-number");
  const questionTextEl = document.getElementById("question-text");
  const answerButtons = Array.from(document.querySelectorAll(".answer"));
  const ladderList = document.getElementById("ladder-list");
  const prizesList = document.getElementById("prizes-list");
  const riosPollEl = document.getElementById("rios-poll");
  const lifelineMessageEl = document.getElementById("lifeline-message");
  const lifelineButtons = Array.from(document.querySelectorAll(".lifeline"));

  // End screen
  const endTitle = document.getElementById("end-title");
  const endMessage = document.getElementById("end-message");
  const endPrizesEl = document.getElementById("end-prizes");

  // Modals
  const familyModal = document.getElementById("family-modal");
  const familyListEl = document.getElementById("family-list");
  const familyCancelBtn = document.getElementById("family-cancel");
  const milestoneOverlay = document.getElementById("milestone-overlay");
  const milestoneTitleEl = document.getElementById("milestone-title");
  const milestoneTextEl = document.getElementById("milestone-text");
  const prizeSelectionEl = document.getElementById("prize-selection");
  const prizeChosenConfirm = document.getElementById("prize-chosen-confirm");
  const milestoneContinueBtn = document.getElementById("milestone-continue");

  const LETTERS = ["A", "B", "C", "D"];

  let state;

  function showScreen(screen) {
    [startScreen, gameScreen, endScreen].forEach((s) => s.classList.remove("active"));
    screen.classList.add("active");
  }

  function buildLadder() {
    ladderList.innerHTML = "";
    QUESTIONS.forEach((_, idx) => {
      const li = document.createElement("li");
      li.dataset.index = idx;
      const milestone = MILESTONES.find((m) => m.questionIndex === idx);
      if (milestone) {
        li.classList.add("milestone");
        li.innerHTML = `<span>Q${idx + 1}</span><span class="prize-tag">🎁 Prize ${milestone.prizeIndex + 1}</span>`;
      } else {
        li.innerHTML = `<span>Q${idx + 1}</span>`;
      }
      ladderList.appendChild(li);
    });
  }

  function buildPrizesList() {
    prizesList.innerHTML = "";
    PRIZE_POOLS.forEach((_, idx) => {
      const li = document.createElement("li");
      li.dataset.prizeIndex = idx;
      li.textContent = `${idx + 1}. Not yet earned`;
      prizesList.appendChild(li);
    });
  }

  function updateLadder() {
    Array.from(ladderList.children).forEach((li, idx) => {
      li.classList.remove("current", "passed");
      if (idx < state.questionIndex) li.classList.add("passed");
      if (idx === state.questionIndex) li.classList.add("current");
    });
  }

  function updatePrizesUI() {
    Array.from(prizesList.children).forEach((li, idx) => {
      const chosen = state.chosenPrizes[idx];
      li.classList.toggle("earned", !!chosen);
      li.textContent = chosen ? `${idx + 1}. ${chosen}` : `${idx + 1}. Not yet earned`;
    });
  }

  function buildFamilyList() {
    familyListEl.innerHTML = "";
    FAMILY_MEMBERS.forEach((name) => {
      const btn = document.createElement("button");
      btn.textContent = name;
      btn.addEventListener("click", () => {
        familyModal.classList.add("hidden");
        deliverFamilyHint(name);
      });
      familyListEl.appendChild(btn);
    });
  }

  function startGame() {
    state = {
      questionIndex: 0,
      selected: null,
      locked: false,
      answered: false,
      prizesWon: 0,
      chosenPrizes: [],
      pendingPrize: null,
      lifelines: { justino: true, rios: true, family: true, romulus: true },
      hiddenByFifty: [],
    };
    buildLadder();
    buildPrizesList();
    buildFamilyList();
    lifelineButtons.forEach((btn) => (btn.disabled = false));
    showScreen(gameScreen);
    loadQuestion();
  }

  function loadQuestion() {
    const q = QUESTIONS[state.questionIndex];
    state.selected = null;
    state.locked = false;
    state.answered = false;
    state.hiddenByFifty = [];

    const milestone = MILESTONES.find((m) => m.questionIndex === state.questionIndex);
    const milestoneNote = milestone
      ? ` · 🎁 Win Prize #${milestone.prizeIndex + 1}!`
      : "";
    questionNumberEl.textContent = `Question ${state.questionIndex + 1} of ${QUESTIONS.length}${milestoneNote}`;
    questionTextEl.textContent = q.question;

    answerButtons.forEach((btn, i) => {
      btn.classList.remove("selected", "correct", "wrong", "hidden-fifty");
      btn.disabled = false;
      btn.querySelector(".answer-text").textContent = q.answers[i];
    });

    lockControls.classList.add("hidden");
    riosPollEl.classList.add("hidden");
    lifelineMessageEl.classList.add("hidden");
    walkAwayBtn.style.display = state.chosenPrizes.length > 0 ? "inline-block" : "none";
    updateLadder();
    updatePrizesUI();
  }

  function selectAnswer(idx) {
    if (state.answered || state.locked) return;
    if (answerButtons[idx].disabled) return;
    state.selected = idx;
    answerButtons.forEach((b, i) => b.classList.toggle("selected", i === idx));
    lockControls.classList.remove("hidden");
  }

  function lockAnswer() {
    if (state.selected === null) return;
    state.locked = true;
    state.answered = true;
    lockControls.classList.add("hidden");
    walkAwayBtn.style.display = "none";
    answerButtons.forEach((b) => (b.disabled = true));

    const q = QUESTIONS[state.questionIndex];
    const chosen = state.selected;

    setTimeout(() => {
      if (chosen === q.correct) {
        answerButtons[chosen].classList.remove("selected");
        answerButtons[chosen].classList.add("correct");

        const milestone = MILESTONES.find((m) => m.questionIndex === state.questionIndex);
        if (milestone) {
          state.prizesWon = milestone.prizeIndex + 1;
          updatePrizesUI();
          setTimeout(() => showMilestone(milestone), 1200);
        } else {
          setTimeout(advance, 1500);
        }
      } else {
        answerButtons[chosen].classList.remove("selected");
        answerButtons[chosen].classList.add("wrong");
        answerButtons[q.correct].classList.add("correct");
        setTimeout(() => endGame("lost"), 2400);
      }
    }, 800);
  }

  function unlockAnswer() {
    state.selected = null;
    answerButtons.forEach((b) => b.classList.remove("selected"));
    lockControls.classList.add("hidden");
  }

  function advance() {
    state.questionIndex++;
    if (state.questionIndex >= QUESTIONS.length) {
      endGame("won");
    } else {
      loadQuestion();
    }
  }

  function showMilestone(milestone) {
    const isLast = state.questionIndex === QUESTIONS.length - 1;
    const level = milestone.prizeIndex + 1;
    const pool = PRIZE_POOLS[milestone.prizeIndex];

    const titles = [
      "🎉 You've earned a prize — choose your reward!",
      "🎉🎉 Another prize — choose your reward!",
      "🏆🦬 MOLL-IONAIRE!! Choose your grand prize! 🦬🏆",
    ];
    milestoneTitleEl.textContent = titles[milestone.prizeIndex];
    milestoneTextEl.textContent = "";

    // Reset prize selection UI
    state.pendingPrize = null;
    prizeChosenConfirm.classList.add("hidden");
    milestoneContinueBtn.classList.add("hidden");
    milestoneContinueBtn.textContent = isLast ? "🦬 Claim my prizes! 🦬" : "Keep going →";

    prizeSelectionEl.innerHTML = "";
    pool.forEach((prize) => {
      const card = document.createElement("button");
      card.className = "prize-card";
      card.textContent = prize;
      card.addEventListener("click", () => {
        // Allow changing selection before confirming
        Array.from(prizeSelectionEl.querySelectorAll(".prize-card")).forEach((c) => c.classList.remove("selected"));
        card.classList.add("selected");
        state.pendingPrize = prize;
        prizeChosenConfirm.textContent = `✓ You chose: "${prize}"`;
        prizeChosenConfirm.classList.remove("hidden");
        milestoneContinueBtn.classList.remove("hidden");
      });
      prizeSelectionEl.appendChild(card);
    });

    milestoneOverlay.classList.remove("hidden");

    const modalContent = milestoneOverlay.querySelector(".modal-content");
    BuffaloShow.play(level, modalContent);

    const snd = new Audio("buffalo.mp3");
    snd.volume = 1.0;
    snd.play().catch(() => {});
  }

  function endGame(result) {
    let title;
    let message;
    if (result === "won") {
      title = "🏆 You're a Moll-ionaire!";
      message = "All 15 questions answered correctly. Legendary.";
    } else if (result === "lost") {
      title = "Game over";
      message = state.chosenPrizes.length > 0
        ? "Wrong answer — but you keep the prizes you've already locked in."
        : "Wrong answer — and no prizes locked in yet. Tough break.";
    } else {
      title = "You walked away";
      message = state.chosenPrizes.length > 0
        ? "Smart move. You walk away with everything you've earned."
        : "You walked away before earning any prizes. Maybe next time!";
    }
    endTitle.textContent = title;
    endMessage.textContent = message;

    endPrizesEl.innerHTML = "";
    if (state.chosenPrizes.length === 0) {
      const li = document.createElement("li");
      li.classList.add("empty");
      li.textContent = "No prizes earned this round.";
      endPrizesEl.appendChild(li);
    } else {
      state.chosenPrizes.forEach((prize) => {
        const li = document.createElement("li");
        li.textContent = `🎁 ${prize}`;
        endPrizesEl.appendChild(li);
      });
    }
    showScreen(endScreen);
  }

  // ----- Lifelines -----

  function disableLifeline(name) {
    state.lifelines[name] = false;
    document.querySelector(`[data-lifeline="${name}"]`).disabled = true;
  }

  function showLifelineMessage(html) {
    lifelineMessageEl.innerHTML = html;
    lifelineMessageEl.classList.remove("hidden");
  }

  function useJustino() {
    if (!state.lifelines.justino || state.answered) return;
    disableLifeline("justino");

    const q = QUESTIONS[state.questionIndex];
    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== q.correct);
    const shuffled = wrongIndices.sort(() => Math.random() - 0.5);
    const toHide = shuffled.slice(0, 2);
    toHide.forEach((i) => {
      answerButtons[i].classList.add("hidden-fifty");
      answerButtons[i].disabled = true;
    });
    state.hiddenByFifty = toHide;

    showLifelineMessage(`<strong>Justino:</strong> "Easy. It's down to two — pick one."`);
  }

  function useRios() {
    if (!state.lifelines.rios || state.answered) return;
    disableLifeline("rios");
    showLifelineMessage(`<strong>👨‍👩‍👧 Ask the Rios</strong> — lifeline used. Ask them in person!`);
  }

  function useFamily() {
    if (!state.lifelines.family || state.answered) return;
    familyModal.classList.remove("hidden");
  }

  function deliverFamilyHint(name) {
    disableLifeline("family");
    showLifelineMessage(`<strong>📞 Calling ${name}</strong> — lifeline used. Ask them in person!`);
  }

  function useRomulus() {
    if (!state.lifelines.romulus || state.answered) return;
    disableLifeline("romulus");

    const q = QUESTIONS[state.questionIndex];
    const correctLetter = LETTERS[q.correct];
    // Romulus is reliable but cryptic
    const isOnPoint = Math.random() < 0.85;
    let response;
    if (isOnPoint) {
      const barks = [
        `*tilts head, paws determinedly at letter <strong>${correctLetter}</strong>* WOOF!`,
        `*sniffs each option, plants himself in front of <strong>${correctLetter}</strong>* 🐾`,
        `*tail wags furiously when you hover over <strong>${correctLetter}</strong>*`,
        `*one decisive bark while staring at <strong>${correctLetter}</strong>*`,
      ];
      response = barks[Math.floor(Math.random() * barks.length)];
    } else {
      const others = [0, 1, 2, 3].filter((i) => i !== q.correct && !state.hiddenByFifty.includes(i));
      const wrong = others.length ? others[Math.floor(Math.random() * others.length)] : (q.correct + 1) % 4;
      response = `*looks confused, sniffs at both <strong>${LETTERS[Math.min(q.correct, wrong)]}</strong> and <strong>${LETTERS[Math.max(q.correct, wrong)]}</strong>, then yawns*`;
    }
    showLifelineMessage(`<strong>🐶 Romulus:</strong> ${response}`);
  }

  // Wire up events
  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", startGame);
  walkAwayBtn.addEventListener("click", () => endGame("walked"));
  lockBtn.addEventListener("click", lockAnswer);
  unlockBtn.addEventListener("click", unlockAnswer);

  answerButtons.forEach((btn) => {
    btn.addEventListener("click", () => selectAnswer(parseInt(btn.dataset.index, 10)));
  });

  document.querySelector('[data-lifeline="justino"]').addEventListener("click", useJustino);
  document.querySelector('[data-lifeline="rios"]').addEventListener("click", useRios);
  document.querySelector('[data-lifeline="family"]').addEventListener("click", useFamily);
  document.querySelector('[data-lifeline="romulus"]').addEventListener("click", useRomulus);

  familyCancelBtn.addEventListener("click", () => familyModal.classList.add("hidden"));

  milestoneContinueBtn.addEventListener("click", () => {
    if (!state.pendingPrize) return; // must select a prize first
    state.chosenPrizes.push(state.pendingPrize);
    state.prizesWon = state.chosenPrizes.length;
    state.pendingPrize = null;
    updatePrizesUI();

    milestoneOverlay.classList.add("hidden");
    const reels = milestoneOverlay.querySelector(".b-reels");
    if (reels) reels.remove();

    if (state.questionIndex === QUESTIONS.length - 1) {
      endGame("won");
    } else {
      advance();
    }
  });
})();
