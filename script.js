(function () {
  const startScreen = document.getElementById("start-screen");
  const gameScreen = document.getElementById("game-screen");
  const endScreen = document.getElementById("end-screen");

  const startBtn = document.getElementById("start-btn");
  const restartBtn = document.getElementById("restart-btn");
  const walkAwayBtn = document.getElementById("walk-away-btn");

  const questionNumberEl = document.getElementById("question-number");
  const questionTextEl = document.getElementById("question-text");
  const answerButtons = Array.from(document.querySelectorAll(".answer"));
  const ladderList = document.getElementById("ladder-list");

  const lockBtn = document.getElementById("lock-btn");
  const unlockBtn = document.getElementById("unlock-btn");
  const lockControls = document.getElementById("lock-controls");

  const audiencePollEl = document.getElementById("audience-poll");
  const phoneMessageEl = document.getElementById("phone-message");

  const lifelineButtons = Array.from(document.querySelectorAll(".lifeline"));

  const endTitle = document.getElementById("end-title");
  const endMessage = document.getElementById("end-message");
  const endAmount = document.getElementById("end-amount");

  let state;

  function formatMoney(n) {
    return "$" + n.toLocaleString("en-US");
  }

  function showScreen(screen) {
    [startScreen, gameScreen, endScreen].forEach((s) => s.classList.remove("active"));
    screen.classList.add("active");
  }

  function buildLadder() {
    ladderList.innerHTML = "";
    PRIZE_LADDER.forEach((amount, idx) => {
      const li = document.createElement("li");
      li.dataset.index = idx;
      if (MILESTONES.includes(idx)) li.classList.add("milestone");
      li.innerHTML = `<span>${idx + 1}</span><span>${formatMoney(amount)}</span>`;
      ladderList.appendChild(li);
    });
  }

  function updateLadder() {
    Array.from(ladderList.children).forEach((li, idx) => {
      li.classList.remove("current", "passed");
      if (idx < state.questionIndex) li.classList.add("passed");
      if (idx === state.questionIndex) li.classList.add("current");
    });
  }

  function startGame() {
    state = {
      questionIndex: 0,
      selected: null,
      locked: false,
      answered: false,
      lifelines: { fifty: true, audience: true, phone: true },
      hiddenByFifty: [],
    };
    buildLadder();
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

    questionNumberEl.textContent = `Question ${state.questionIndex + 1} · for ${formatMoney(PRIZE_LADDER[state.questionIndex])}`;
    questionTextEl.textContent = q.question;

    answerButtons.forEach((btn, i) => {
      btn.classList.remove("selected", "correct", "wrong", "hidden-fifty");
      btn.disabled = false;
      btn.querySelector(".answer-text").textContent = q.answers[i];
    });

    lockControls.classList.add("hidden");
    audiencePollEl.classList.add("hidden");
    phoneMessageEl.classList.add("hidden");
    walkAwayBtn.style.display = "inline-block";
    updateLadder();
  }

  function selectAnswer(idx) {
    if (state.answered || state.locked) return;
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
        setTimeout(advance, 1500);
      } else {
        answerButtons[chosen].classList.remove("selected");
        answerButtons[chosen].classList.add("wrong");
        answerButtons[q.correct].classList.add("correct");
        setTimeout(() => endGame(false), 2200);
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
      endGame(true);
    } else {
      loadQuestion();
    }
  }

  function winningsForLoss() {
    // Walk back to the highest milestone the player has passed.
    let amount = 0;
    for (const m of MILESTONES) {
      if (state.questionIndex > m) amount = PRIZE_LADDER[m];
    }
    return amount;
  }

  function endGame(won) {
    let amount;
    let title;
    let message;
    if (won) {
      amount = PRIZE_LADDER[PRIZE_LADDER.length - 1];
      title = "🏆 You're a Moll-ionaire!";
      message = "You answered all 15 questions correctly. Incredible.";
    } else if (state.answered) {
      amount = winningsForLoss();
      title = "Game over";
      message = "That wasn't the right answer — but you keep your guaranteed winnings.";
    } else {
      // Walked away
      amount = state.questionIndex > 0 ? PRIZE_LADDER[state.questionIndex - 1] : 0;
      title = "You walked away";
      message = "Smart move — taking the money and running.";
    }
    endTitle.textContent = title;
    endMessage.textContent = message;
    endAmount.textContent = formatMoney(amount);
    showScreen(endScreen);
  }

  // Lifelines
  function useFiftyFifty() {
    if (!state.lifelines.fifty || state.answered) return;
    state.lifelines.fifty = false;
    document.querySelector('[data-lifeline="fifty"]').disabled = true;

    const q = QUESTIONS[state.questionIndex];
    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== q.correct);
    // Keep two wrong, hide two
    const shuffled = wrongIndices.sort(() => Math.random() - 0.5);
    const toHide = shuffled.slice(0, 2);
    toHide.forEach((i) => {
      answerButtons[i].classList.add("hidden-fifty");
      answerButtons[i].disabled = true;
    });
    state.hiddenByFifty = toHide;
  }

  function useAudience() {
    if (!state.lifelines.audience || state.answered) return;
    state.lifelines.audience = false;
    document.querySelector('[data-lifeline="audience"]').disabled = true;

    const q = QUESTIONS[state.questionIndex];
    // Generate a poll weighted toward the correct answer, lower difficulty boost.
    const difficulty = state.questionIndex / QUESTIONS.length; // 0..~1
    const correctBase = 70 - difficulty * 35; // easier = more confident audience
    const correctPct = Math.max(25, correctBase + (Math.random() * 15 - 7));
    let remaining = 100 - correctPct;

    const percentages = [0, 0, 0, 0];
    percentages[q.correct] = correctPct;
    const others = [0, 1, 2, 3].filter((i) => i !== q.correct);
    others.forEach((i, idx) => {
      const isLast = idx === others.length - 1;
      let val;
      if (isLast) val = remaining;
      else {
        val = Math.random() * remaining * 0.7;
        remaining -= val;
      }
      // Hidden 50:50 answers get 0
      if (state.hiddenByFifty.includes(i)) {
        if (!isLast) remaining += val;
        val = 0;
      }
      percentages[i] = val;
    });
    // Renormalize if 50:50 zeroed out some
    const total = percentages.reduce((a, b) => a + b, 0);
    const scaled = percentages.map((p) => (p / total) * 100);

    audiencePollEl.innerHTML = "";
    audiencePollEl.classList.remove("hidden");
    ["A", "B", "C", "D"].forEach((letter, i) => {
      const bar = document.createElement("div");
      bar.className = "poll-bar";
      const fill = document.createElement("div");
      fill.className = "poll-fill";
      fill.style.height = "0%";
      const label = document.createElement("div");
      label.className = "poll-label";
      label.textContent = `${letter}: ${Math.round(scaled[i])}%`;
      bar.appendChild(fill);
      bar.appendChild(label);
      audiencePollEl.appendChild(bar);
      requestAnimationFrame(() => {
        fill.style.height = `${scaled[i]}%`;
      });
    });
  }

  function usePhone() {
    if (!state.lifelines.phone || state.answered) return;
    state.lifelines.phone = false;
    document.querySelector('[data-lifeline="phone"]').disabled = true;

    const q = QUESTIONS[state.questionIndex];
    const letters = ["A", "B", "C", "D"];
    // Confidence drops with difficulty
    const confidence = Math.max(0.5, 0.95 - state.questionIndex * 0.04);
    const isConfident = Math.random() < confidence;

    let message;
    if (isConfident) {
      message = `📞 "I'm pretty sure it's ${letters[q.correct]} — ${q.answers[q.correct]}. I'd go with that."`;
    } else {
      const guesses = [q.correct];
      const others = [0, 1, 2, 3].filter((i) => i !== q.correct && !state.hiddenByFifty.includes(i));
      if (others.length) guesses.push(others[Math.floor(Math.random() * others.length)]);
      const sorted = guesses.sort();
      message = `📞 "Hmm, tough one. It's either ${letters[sorted[0]]} or ${letters[sorted[1]]} — I'd lean toward ${letters[q.correct]} but I'm not certain."`;
    }
    phoneMessageEl.textContent = message;
    phoneMessageEl.classList.remove("hidden");
  }

  // Wire up events
  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", startGame);
  walkAwayBtn.addEventListener("click", () => endGame(false));
  lockBtn.addEventListener("click", lockAnswer);
  unlockBtn.addEventListener("click", unlockAnswer);

  answerButtons.forEach((btn) => {
    btn.addEventListener("click", () => selectAnswer(parseInt(btn.dataset.index, 10)));
  });

  document.querySelector('[data-lifeline="fifty"]').addEventListener("click", useFiftyFifty);
  document.querySelector('[data-lifeline="audience"]').addEventListener("click", useAudience);
  document.querySelector('[data-lifeline="phone"]').addEventListener("click", usePhone);
})();
