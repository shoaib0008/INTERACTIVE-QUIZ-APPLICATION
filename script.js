/**
 * BRAINSPRINT - INTERACTIVE QUIZ APPLICATION CORE ENGINE
 * 
 * This script runs the entire quiz application. It is structured into logical,
 * modular segments to ensure professional code quality, maintainability, and clarity.
 * 
 * SECTIONS:
 * 1. CONFIGURATION & STATE MANAGEMENT
 * 2. DOM SELECTORS
 * 3. WEB AUDIO API SYNTH (SOUNDS MANAGER)
 * 4. LOCAL STORAGE UTILITIES
 * 5. CORE UTILITY FUNCTIONS (SHUFFLERS, HELPERS)
 * 6. TIMER ENGINE
 * 7. CORE QUIZ ENGINE (LOGIC)
 * 8. DOM RENDERERS (UI HANDLERS)
 * 9. KEYBOARD CONTROLLER & ACCESSIBILITY
 * 10. EVENT LISTENERS REGISTER
 * 11. INITIALIZER
 */

// ==========================================================================
// 1. CONFIGURATION & STATE MANAGEMENT
// ==========================================================================

/**
 * Global Configuration Parameters
 */
const CONFIG = {
  SEC_PER_QUESTION: 15, // Countdown duration per question
  MAX_HIGH_SCORES: 5,   // Maximum leaderboard entries saved
  MAX_HISTORY_LOGS: 10, // Maximum activity items saved
  BASE_SCORE: 100,      // Base score per correct answer
  STREAK_MULTIPLIER: 15 // Extra points per active streak multiplier
};

/**
 * Application State Container (Single Source of Truth)
 */
let state = {
  // Configured Parameters
  selectedCategory: 'all',
  selectedDifficulty: 'all',
  shuffleQuestions: true,
  shuffleOptions: true,
  
  // Game Play Registers
  activeQuestions: [], // Filtered, shuffled subset of questions
  currentQuestionIndex: 0,
  score: 0,
  correctCount: 0,
  wrongCount: 0,
  skippedCount: 0,
  currentStreak: 0,
  maxStreak: 0,
  totalTimeTaken: 0, // In seconds, across answered questions
  questionStartTime: null, // Timestamp when current question loaded
  
  // User Inputs tracker
  // Structure: { questionId: { selectedOptionIndex, isCorrect, timeTaken } }
  userAnswers: {},
  
  // Timer registers
  timerValue: CONFIG.SEC_PER_QUESTION,
  timerInterval: null,
  
  // Audio state
  isMuted: false,
  
  // Quiz Modes
  isReviewMode: false,
  isRetryIncorrectOnly: false,
  originalQuestionsSubset: [] // Saves reference for retry sub-sessions
};

// ==========================================================================
// 2. DOM SELECTORS
// ==========================================================================

const DOM = {
  // Global Shell & Controls
  body: document.body,
  themeBtn: document.getElementById('theme-btn'),
  soundBtn: document.getElementById('sound-btn'),
  kbdBtn: document.getElementById('kbd-btn'),
  
  // Screens Containers
  startScreen: document.getElementById('start-screen'),
  quizScreen: document.getElementById('quiz-screen'),
  resultScreen: document.getElementById('result-screen'),
  
  // Start Screen Elements
  categorySelect: document.getElementById('category-select'),
  difficultyCards: document.querySelectorAll('.diff-card'),
  shuffleQToggle: document.getElementById('shuffle-q-toggle'),
  shuffleOToggle: document.getElementById('shuffle-o-toggle'),
  startBtn: document.getElementById('start-btn'),
  dashboardToggle: document.getElementById('dashboard-toggle'),
  dashboardContent: document.getElementById('dashboard-content'),
  highScoresList: document.getElementById('high-scores-list'),
  historyList: document.getElementById('history-list'),
  clearStatsBtn: document.getElementById('clear-stats-btn'),
  
  // Quiz Screen Elements
  categoryBadge: document.getElementById('category-badge'),
  difficultyBadge: document.getElementById('difficulty-badge'),
  streakWrapper: document.getElementById('streak-wrapper'),
  streakCount: document.getElementById('streak-count'),
  liveScore: document.getElementById('live-score'),
  currentQNum: document.getElementById('current-q-num'),
  totalQNum: document.getElementById('total-q-num'),
  pctCompleteTxt: document.getElementById('pct-complete-txt'),
  progressBarFill: document.getElementById('progress-bar-fill'),
  timerClock: document.getElementById('timer-clock'),
  timerText: document.getElementById('timer-text'),
  timerBarFill: document.getElementById('timer-bar-fill'),
  questionText: document.getElementById('question-text'),
  optionsContainer: document.getElementById('options-container'),
  feedbackCard: document.getElementById('feedback-card'),
  feedbackIconWrapper: document.getElementById('feedback-icon-wrapper'),
  feedbackStatusText: document.getElementById('feedback-status-text'),
  explanationText: document.getElementById('explanation-text'),
  quitBtn: document.getElementById('quit-btn'),
  skipBtn: document.getElementById('skip-btn'),
  nextBtn: document.getElementById('next-btn'),
  
  // Result Screen Elements
  resultGreeting: document.getElementById('result-greeting'),
  gradeBadge: document.getElementById('grade-badge'),
  scoreCircleFill: document.getElementById('score-circle-fill'),
  resultPct: document.getElementById('result-pct'),
  resultCorrect: document.getElementById('result-correct'),
  resultTotal: document.getElementById('result-total'),
  statCorrect: document.getElementById('stat-correct'),
  statWrong: document.getElementById('stat-wrong'),
  statSkipped: document.getElementById('stat-skipped'),
  statPoints: document.getElementById('stat-points'),
  statMaxStreak: document.getElementById('stat-max-streak'),
  statAvgTime: document.getElementById('stat-avg-time'),
  highscoreBadge: document.getElementById('highscore-badge'),
  retryIncorrectBtn: document.getElementById('retry-incorrect-btn'),
  homeBtn: document.getElementById('home-btn'),
  restartBtn: document.getElementById('restart-btn'),
  toggleReviewBtn: document.getElementById('toggle-review-btn'),
  reviewPanelContainer: document.getElementById('review-panel-container'),
  reviewListContainer: document.getElementById('review-list-container'),
  
  // Keyboard Modal
  kbdModal: document.getElementById('kbd-modal'),
  closeKbdBtn: document.getElementById('close-kbd-btn'),
  closeKbdFooterBtn: document.getElementById('close-kbd-footer-btn'),
  audioToast: document.getElementById('audio-toast')
};

// ==========================================================================
// 3. WEB AUDIO API SYNTH (SOUNDS MANAGER)
// ==========================================================================

/**
 * SoundEffectsManager synthesizes professional retro sound effects directly
 * in the browser using the Web Audio API. This eliminates external audio download requirements.
 */
const SoundSynth = {
  ctx: null, // AudioContext created lazily on interaction

  /**
   * Initializes the AudioContext upon user request/interaction
   */
  init() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    // Resume context if suspended (Chrome's strict autoplay policy)
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  /**
   * Triggers a synthesized sound wave
   * @param {string} type - Sound effect keyword
   */
  play(type) {
    if (state.isMuted) return;
    
    this.init();
    if (!this.ctx) return; // Fallback if browser doesn't support Web Audio

    const now = this.ctx.currentTime;
    const gainNode = this.ctx.createGain();
    gainNode.connect(this.ctx.destination);

    switch (type) {
      case 'click': {
        // Quick, sharp organic chirp
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
        
        gainNode.gain.setValueAtTime(0.12, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        
        osc.connect(gainNode);
        osc.start(now);
        osc.stop(now + 0.08);
        break;
      }
      
      case 'correct': {
        // Double tone cheerful bell arpeggio
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        
        osc1.type = 'sine';
        osc2.type = 'sine';
        
        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc1.frequency.setValueAtTime(659.25, now + 0.08); // E5
        
        osc2.frequency.setValueAtTime(783.99, now + 0.15); // G5
        
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        
        osc1.start(now);
        osc1.stop(now + 0.35);
        osc2.start(now + 0.15);
        osc2.stop(now + 0.35);
        break;
      }
      
      case 'wrong': {
        // Harsh retro buzz sweep downwards
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(70, now + 0.3);
        
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        
        // Lowpass filter to soften the harsh sawtooth edge
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, now);
        
        osc.connect(filter);
        filter.connect(gainNode);
        
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      }
      
      case 'skip': {
        // High to low swoosh tone
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.2);
        
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        
        osc.connect(gainNode);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }
      
      case 'tick': {
        // Subtle woodblock percussion for countdown limits
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, now);
        
        gainNode.gain.setValueAtTime(0.05, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        
        osc.connect(gainNode);
        osc.start(now);
        osc.stop(now + 0.04);
        break;
      }
      
      case 'success': {
        // Radiant multi-chord victory soundscape
        const rootFreqs = [261.63, 329.63, 392.00, 523.25]; // C major chord
        
        rootFreqs.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          osc.frequency.exponentialRampToValueAtTime(freq * 2, now + 0.6);
          
          const oscGain = this.ctx.createGain();
          oscGain.connect(this.ctx.destination);
          
          oscGain.gain.setValueAtTime(0.08, now + idx * 0.06);
          oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
          
          osc.connect(oscGain);
          osc.start(now + idx * 0.06);
          osc.stop(now + 0.8);
        });
        break;
      }
    }
  }
};

// ==========================================================================
// 4. LOCAL STORAGE UTILITIES
// ==========================================================================

const StorageManager = {
  KEYS: {
    HIGH_SCORES: 'brainsprint_highscores',
    HISTORY: 'brainsprint_history',
    THEME: 'brainsprint_theme',
    MUTED: 'brainsprint_muted'
  },

  /**
   * Retrieves high scores array from localStorage
   */
  getHighScores() {
    try {
      const data = localStorage.getItem(this.KEYS.HIGH_SCORES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Storage read failed", e);
      return [];
    }
  },

  /**
   * Appends score to board if eligible
   * @param {Object} scoreObj - Score specifications { category, difficulty, score, pct, date }
   * @returns {boolean} True if it registers as a new personal record
   */
  saveHighScore(scoreObj) {
    const scores = this.getHighScores();
    scores.push(scoreObj);
    
    // Sort descending by raw score, then by date
    scores.sort((a, b) => b.score - a.score);
    
    const sliced = scores.slice(0, CONFIG.MAX_HIGH_SCORES);
    localStorage.setItem(this.KEYS.HIGH_SCORES, JSON.stringify(sliced));
    
    // Returns true if the current entry becomes the absolute top high score
    return sliced[0] && sliced[0].score === scoreObj.score;
  },

  /**
   * Retrieves history entries list
   */
  getHistory() {
    try {
      const data = localStorage.getItem(this.KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Storage read failed", e);
      return [];
    }
  },

  /**
   * Registers a finished game inside activity logs
   * @param {Object} historyObj - Log specifications { category, difficulty, correct, total, score, date }
   */
  addHistoryLog(historyObj) {
    const history = this.getHistory();
    history.unshift(historyObj); // Add to beginning of array
    
    const sliced = history.slice(0, CONFIG.MAX_HISTORY_LOGS);
    localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(sliced));
  },

  /**
   * Wipes high scores and historical activity
   */
  clearAllStats() {
    localStorage.removeItem(this.KEYS.HIGH_SCORES);
    localStorage.removeItem(this.KEYS.HISTORY);
  }
};

// ==========================================================================
// 5. CORE UTILITY FUNCTIONS (SHUFFLERS, HELPERS)
// ==========================================================================

/**
 * Shuffles arrays in-place using Fisher-Yates algorithm
 * @param {Array} array 
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Format timestamp into standard readable local format
 * @param {string|number} timestamp 
 */
function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

/**
 * Map category keys to human-friendly text strings
 * @param {string} catKey 
 */
function formatCategory(catKey) {
  const mapping = {
    'all': 'All Categories',
    'tech': 'Tech & Coding',
    'science': 'Science & Nature',
    'geography': 'Geography',
    'history': 'History',
    'general': 'General Knowledge'
  };
  return mapping[catKey] || catKey;
}

// ==========================================================================
// 6. TIMER ENGINE
// ==========================================================================

const Timer = {
  /**
   * Initializes countdown timer loop for active question
   */
  start() {
    this.stop(); // Clean standard intervals first
    
    state.timerValue = CONFIG.SEC_PER_QUESTION;
    this.updateUI();
    
    state.timerInterval = setInterval(() => {
      state.timerValue--;
      this.updateUI();
      
      // Sound ticking for last 3 seconds
      if (state.timerValue <= 3 && state.timerValue > 0) {
        SoundSynth.play('tick');
        DOM.timerClock.classList.add('danger-pulse');
      } else {
        DOM.timerClock.classList.remove('danger-pulse');
      }
      
      if (state.timerValue <= 0) {
        this.stop();
        QuizEngine.handleTimeout();
      }
    }, 1000);
  },

  /**
   * Cleans countdown interval loops
   */
  stop() {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
    DOM.timerClock.classList.remove('danger-pulse');
  },

  /**
   * Renders the countdown and updates width/color bounds of the timer bar
   */
  updateUI() {
    DOM.timerText.textContent = state.timerValue;
    
    // Percentage calculated
    const percentage = (state.timerValue / CONFIG.SEC_PER_QUESTION) * 100;
    
    // Direct CSS injection with width transitions
    DOM.timerBarFill.style.transition = 'width 1s linear, background-color 0.3s ease';
    DOM.timerBarFill.style.width = `${percentage}%`;
    
    // Color thresholds
    DOM.timerBarFill.classList.remove('warning', 'danger');
    if (state.timerValue <= 4) {
      DOM.timerBarFill.classList.add('danger');
    } else if (state.timerValue <= 8) {
      DOM.timerBarFill.classList.add('warning');
    }
  }
};

// ==========================================================================
// 7. CORE QUIZ ENGINE (LOGIC)
// ==========================================================================

const QuizEngine = {
  /**
   * Filters and constructs questions based on category, difficulty, and shufflers.
   */
  buildQuiz() {
    let filtered = [];
    
    // Grab external questions defined in window.quizQuestions
    const pool = window.quizQuestions || [];
    
    // Standard Higher-order Array filter methods
    filtered = pool.filter(q => {
      const matchCat = (state.selectedCategory === 'all' || q.category === state.selectedCategory);
      const matchDiff = (state.selectedDifficulty === 'all' || q.difficulty === state.selectedDifficulty);
      return matchCat && matchDiff;
    });

    if (filtered.length === 0) {
      return false; // Error condition handled by renderer
    }

    // Question Shuffling
    if (state.shuffleQuestions) {
      filtered = shuffleArray([...filtered]);
    }
    
    // Limit to 10 questions to maintain a swift "sprint" game design
    state.activeQuestions = filtered.slice(0, 10);
    state.originalQuestionsSubset = [...state.activeQuestions]; // Maintain reference
    return true;
  },

  /**
   * Sets up a sub-quiz using ONLY incorrect questions from the last session
   */
  buildRetryQuiz() {
    const pool = state.originalQuestionsSubset;
    const incorrect = pool.filter(q => {
      const ans = state.userAnswers[q.id];
      return ans && !ans.isCorrect; // Got it wrong
    });
    
    if (incorrect.length === 0) return false;
    
    // Load incorrect questions back into the stream
    state.activeQuestions = incorrect;
    state.isRetryIncorrectOnly = true;
    return true;
  },

  /**
   * Resets active game registers
   */
  resetStats() {
    state.currentQuestionIndex = 0;
    state.score = 0;
    state.correctCount = 0;
    state.wrongCount = 0;
    state.skippedCount = 0;
    state.currentStreak = 0;
    state.maxStreak = 0;
    state.totalTimeTaken = 0;
    state.userAnswers = {};
    state.isReviewMode = false;
  },

  /**
   * Processes selected option and registers points
   * @param {number} selectedIdx - Selected answer choice
   */
  submitAnswer(selectedIdx) {
    Timer.stop();
    
    const currentQ = state.activeQuestions[state.currentQuestionIndex];
    const isCorrect = (selectedIdx === currentQ.correctAnswer);
    
    // Metrics calculations
    const timeTaken = CONFIG.SEC_PER_QUESTION - state.timerValue;
    state.totalTimeTaken += timeTaken;
    
    // State values updated
    if (isCorrect) {
      state.correctCount++;
      state.currentStreak++;
      if (state.currentStreak > state.maxStreak) {
        state.maxStreak = state.currentStreak;
      }
      
      // Advanced Score Engine:
      // Base score modified by speed bonus and active streak combos
      const speedBonus = Math.max(0, CONFIG.SEC_PER_QUESTION - timeTaken);
      const streakBonus = (state.currentStreak > 1) ? (state.currentStreak - 1) * CONFIG.STREAK_MULTIPLIER : 0;
      
      const earned = CONFIG.BASE_SCORE + (speedBonus * 5) + streakBonus;
      state.score += earned;
      
      SoundSynth.play('correct');
    } else {
      state.wrongCount++;
      state.currentStreak = 0; // Streak broken
      SoundSynth.play('wrong');
    }
    
    // Save to user registry
    state.userAnswers[currentQ.id] = {
      selectedOptionIndex: selectedIdx,
      isCorrect: isCorrect,
      timeTaken: timeTaken
    };

    // Render option cards in DOM with feedback states
    UIRenderer.revealAnswerFeedback(selectedIdx, currentQ.correctAnswer);
  },

  /**
   * Processes question skip command
   */
  skipAnswer() {
    Timer.stop();
    SoundSynth.play('skip');
    
    const currentQ = state.activeQuestions[state.currentQuestionIndex];
    state.skippedCount++;
    state.currentStreak = 0; // Streak broken
    
    const timeTaken = CONFIG.SEC_PER_QUESTION - state.timerValue;
    state.totalTimeTaken += timeTaken;

    // Register inside user registry as skipped
    state.userAnswers[currentQ.id] = {
      selectedOptionIndex: null, // Skipped
      isCorrect: false,
      timeTaken: timeTaken
    };

    // Render option cards in DOM with skip feedback (reveal correct answer)
    UIRenderer.revealAnswerFeedback(null, currentQ.correctAnswer);
  },

  /**
   * Triggered when timer expires
   */
  handleTimeout() {
    const currentQ = state.activeQuestions[state.currentQuestionIndex];
    state.wrongCount++;
    state.currentStreak = 0; // Streak broken
    SoundSynth.play('wrong');

    state.userAnswers[currentQ.id] = {
      selectedOptionIndex: -1, // Timeout marker
      isCorrect: false,
      timeTaken: CONFIG.SEC_PER_QUESTION
    };

    UIRenderer.revealAnswerFeedback(-1, currentQ.correctAnswer);
  },

  /**
   * Increments current question index and processes transition
   */
  nextQuestion() {
    state.currentQuestionIndex++;
    
    if (state.currentQuestionIndex < state.activeQuestions.length) {
      UIRenderer.showQuestion();
    } else {
      this.finishQuiz();
    }
  },

  /**
   * Finalizes active quiz and logs dashboard stats
   */
  finishQuiz() {
    Timer.stop();
    SoundSynth.play('success');
    
    const totalQuestions = state.activeQuestions.length;
    const finalPct = Math.round((state.correctCount / totalQuestions) * 100);
    
    const dateStamp = Date.now();
    
    // Save Leaderboard High Score entry
    const isNewBest = StorageManager.saveHighScore({
      category: state.selectedCategory,
      difficulty: state.selectedDifficulty,
      score: state.score,
      pct: finalPct,
      date: dateStamp
    });
    
    // Save history logs
    StorageManager.addHistoryLog({
      category: state.selectedCategory,
      difficulty: state.selectedDifficulty,
      correct: state.correctCount,
      total: totalQuestions,
      score: state.score,
      date: dateStamp
    });
    
    // Populate start screen accordion data instantly
    UIRenderer.renderDashboard();
    
    // Load result panel
    UIRenderer.loadResultScreen(isNewBest);
  }
};

// ==========================================================================
// 8. DOM RENDERERS (UI HANDLERS)
// ==========================================================================

const UIRenderer = {
  /**
   * Sets active navigation view index
   * @param {HTMLElement} targetScreen 
   */
  switchScreen(targetScreen) {
    DOM.startScreen.classList.remove('active');
    DOM.quizScreen.classList.remove('active');
    DOM.resultScreen.classList.remove('active');
    
    targetScreen.classList.add('active');
  },

  /**
   * Pulls dynamic variables and draws the initial Start screen high scores and activities
   */
  renderDashboard() {
    const scores = StorageManager.getHighScores();
    const history = StorageManager.getHistory();
    
    // Clear list grids
    DOM.highScoresList.innerHTML = '';
    DOM.historyList.innerHTML = '';
    
    // 1. LEADERS BOARD RENDER
    if (scores.length === 0) {
      DOM.highScoresList.innerHTML = `<li class="empty-msg">No high scores registered yet!</li>`;
    } else {
      // Advanced Array higher-order mapping
      scores.forEach((item, idx) => {
        const medalIcons = ['🥇', '🥈', '🥉', '🎖️', '🎖️'];
        const li = document.createElement('li');
        li.innerHTML = `
          <span>${medalIcons[idx] || '🏆'} <strong>${formatCategory(item.category)}</strong> (${item.difficulty})</span>
          <span class="score-badge">${item.score} pts (${item.pct}%)</span>
        `;
        DOM.highScoresList.appendChild(li);
      });
    }
    
    // 2. ACTIVITIES HISTORY LOG RENDER
    if (history.length === 0) {
      DOM.historyList.innerHTML = `<li class="empty-msg">No recent activity. Start playing to build a history!</li>`;
      DOM.clearStatsBtn.style.display = 'none';
    } else {
      DOM.clearStatsBtn.style.display = 'inline-flex';
      history.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
          <div class="history-item">
            <div class="history-top">
              <span>Sprint: ${formatCategory(item.category)}</span>
              <span class="text-accent">${item.score} pts</span>
            </div>
            <div class="history-sub">
              <span>Accuracy: ${item.correct}/${item.total} (${Math.round(item.correct/item.total*100)}%)</span>
              <span>${formatDate(item.date)}</span>
            </div>
          </div>
        `;
        DOM.historyList.appendChild(li);
      });
    }
  },

  /**
   * Draws active quiz question block and configures card structure
   */
  showQuestion() {
    const currentQ = state.activeQuestions[state.currentQuestionIndex];
    const totalQ = state.activeQuestions.length;
    
    // 1. Reset dynamic options and elements state
    DOM.optionsContainer.innerHTML = '';
    DOM.feedbackCard.style.display = 'none';
    DOM.feedbackCard.className = 'feedback-card'; // Reset styles
    
    // Disable Next button, enable Skip
    DOM.nextBtn.disabled = true;
    DOM.skipBtn.disabled = false;
    
    // 2. Set dynamic labels
    DOM.categoryBadge.textContent = formatCategory(currentQ.category);
    DOM.difficultyBadge.textContent = currentQ.difficulty;
    DOM.difficultyBadge.className = `status-badge ${currentQ.difficulty}`;
    
    // Active streaks
    if (state.currentStreak >= 2) {
      DOM.streakCount.textContent = state.currentStreak;
      DOM.streakWrapper.style.opacity = '1';
      DOM.streakWrapper.style.transform = 'scale(1.08)';
      setTimeout(() => { DOM.streakWrapper.style.transform = 'scale(1)'; }, 200);
    } else {
      DOM.streakWrapper.style.opacity = '0';
    }
    
    DOM.liveScore.textContent = state.score.toString().padStart(2, '0');
    DOM.currentQNum.textContent = state.currentQuestionIndex + 1;
    DOM.totalQNum.textContent = totalQ;
    
    // Update active percentage progress bar
    const progressPct = Math.round(((state.currentQuestionIndex) / totalQ) * 100);
    DOM.pctCompleteTxt.textContent = `${progressPct}% Complete`;
    DOM.progressBarFill.style.width = `${progressPct}%`;
    
    // Draw Question Prompt
    DOM.questionText.textContent = currentQ.question;
    
    // 3. Construct dynamic options choices cards
    let choices = currentQ.options.map((opt, idx) => ({ text: opt, originalIndex: idx }));
    
    // Shuffle Options logic
    if (state.shuffleOptions) {
      choices = shuffleArray([...choices]);
    }
    
    // High-order forEach loops drawing elements
    choices.forEach((choice, displayIdx) => {
      const alphabet = ['A', 'B', 'C', 'D'];
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', 'false');
      btn.id = `option-${choice.originalIndex}`;
      btn.innerHTML = `
        <span class="option-idx">${alphabet[displayIdx]}</span>
        <span class="option-text">${choice.text}</span>
      `;
      
      // Inject keyboard numbers helper hint overlays
      const kbdHint = document.createElement('kbd');
      kbdHint.style.position = 'absolute';
      kbdHint.style.right = '20px';
      kbdHint.style.opacity = '0.4';
      kbdHint.style.fontSize = '0.68rem';
      kbdHint.textContent = `${displayIdx + 1}`;
      btn.appendChild(kbdHint);

      // DOM Click Event register
      btn.addEventListener('click', () => {
        SoundSynth.play('click');
        QuizEngine.submitAnswer(choice.originalIndex);
      });
      
      DOM.optionsContainer.appendChild(btn);
    });
    
    // Log start time timestamp for active question metrics
    state.questionStartTime = Date.now();
    
    // Switch Screen
    this.switchScreen(DOM.quizScreen);
    
    // Kickstart Timer loops
    Timer.start();
  },

  /**
   * Modifies dynamic state filters, disables choice options, and renders instant feedbacks
   * @param {number|null} selected - Index selected (null if skipped, -1 if timeout)
   * @param {number} correct - Index of correct option
   */
  revealAnswerFeedback(selected, correct) {
    const buttons = DOM.optionsContainer.querySelectorAll('.option-btn');
    
    // Disable all options immediately to prevent duplicates
    buttons.forEach(btn => {
      btn.disabled = true;
      btn.setAttribute('aria-checked', 'false');
      
      // Remove the kbd visual overlay hints
      const kbd = btn.querySelector('kbd');
      if (kbd) kbd.remove();
    });

    const isSkipped = (selected === null);
    const isTimeout = (selected === -1);
    const isCorrect = (selected === correct);
    
    // Select specific elements to apply styles
    const correctBtn = DOM.optionsContainer.querySelector(`#option-${correct}`);
    if (correctBtn) {
      correctBtn.classList.add('correct');
    }
    
    if (!isCorrect && !isSkipped && !isTimeout) {
      const wrongBtn = DOM.optionsContainer.querySelector(`#option-${selected}`);
      if (wrongBtn) {
        wrongBtn.classList.add('wrong', 'shake');
      }
    }
    
    // Set feedback text panel layout styles
    DOM.feedbackCard.classList.remove('correct-style', 'wrong-style');
    DOM.feedbackCard.style.display = 'flex';
    
    if (isCorrect) {
      DOM.feedbackCard.classList.add('correct-style');
      DOM.feedbackIconWrapper.innerHTML = `<i class="fa-solid fa-check"></i>`;
      DOM.feedbackStatusText.textContent = "Correct Answer!";
    } else if (isSkipped) {
      DOM.feedbackCard.classList.add('wrong-style'); // Yellow alert in css fallback
      DOM.feedbackIconWrapper.innerHTML = `<i class="fa-solid fa-forward"></i>`;
      DOM.feedbackStatusText.textContent = "Question Skipped";
      DOM.feedbackStatusText.style.color = "var(--color-warning)";
      DOM.feedbackIconWrapper.style.backgroundColor = "var(--color-warning)";
    } else if (isTimeout) {
      DOM.feedbackCard.classList.add('wrong-style');
      DOM.feedbackIconWrapper.innerHTML = `<i class="fa-solid fa-hourglass-end"></i>`;
      DOM.feedbackStatusText.textContent = "Time Expired!";
    } else {
      DOM.feedbackCard.classList.add('wrong-style');
      DOM.feedbackIconWrapper.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
      DOM.feedbackStatusText.textContent = "Incorrect Answer";
    }
    
    // Populate explanation string
    const currentQ = state.activeQuestions[state.currentQuestionIndex];
    DOM.explanationText.textContent = currentQ.explanation;
    
    // Switch state actions buttons
    DOM.nextBtn.disabled = false;
    DOM.skipBtn.disabled = true;
    DOM.nextBtn.focus(); // A11y auto-focus for progression
  },

  /**
   * populates results, grades percentages, draws metrics dashboard, and setups review cards lists
   * @param {boolean} isNewBest - Flag if record has been shattered
   */
  loadResultScreen(isNewBest) {
    const totalQ = state.activeQuestions.length;
    const correct = state.correctCount;
    const wrong = state.wrongCount;
    const skipped = state.skippedCount;
    const pct = Math.round((correct / totalQ) * 100);
    
    // 1. Switch Screen view
    this.switchScreen(DOM.resultScreen);
    
    // Reset reviews container toggles
    DOM.reviewPanelContainer.classList.remove('open');
    DOM.toggleReviewBtn.querySelector('i:last-child').className = 'fa-solid fa-chevron-down';
    
    // 2. Set dynamic greetings and grade systems
    let greeting = "";
    let grade = "";
    
    if (pct >= 90) {
      greeting = "Magnificent Sprint!";
      grade = "EXCELLENT";
    } else if (pct >= 70) {
      greeting = "Strong Finish!";
      grade = "GOOD";
    } else if (pct >= 50) {
      greeting = "Decent Effort!";
      grade = "AVERAGE";
    } else {
      greeting = "Keep Practicing!";
      grade = "NEEDS IMPROVEMENT";
    }
    
    DOM.resultGreeting.textContent = greeting;
    DOM.gradeBadge.textContent = grade;
    DOM.gradeBadge.className = `grade-badge ${grade.toLowerCase().replace(' ', '-')}`;
    
    // 3. Score summary wheels animation properties
    DOM.resultPct.textContent = `${pct}%`;
    DOM.resultCorrect.textContent = correct;
    DOM.resultTotal.textContent = totalQ;
    
    // Animate Circle dial fill dynamically
    // Stroke circumference is 534 in style sheet registers. Calculate offset:
    const circumference = 534;
    const strokeOffset = circumference - (pct / 100) * circumference;
    
    // Trigger dynamic CSS sweep with micro-delay for animation
    DOM.scoreCircleFill.style.strokeDasharray = circumference;
    DOM.scoreCircleFill.style.strokeDashoffset = circumference; // Start empty
    
    setTimeout(() => {
      DOM.scoreCircleFill.style.strokeDashoffset = strokeOffset;
    }, 150);
    
    // 4. Metrics grids
    DOM.statCorrect.textContent = correct;
    DOM.statWrong.textContent = wrong;
    DOM.statSkipped.textContent = skipped;
    DOM.statPoints.textContent = state.score;
    DOM.statMaxStreak.textContent = state.maxStreak;
    
    const avgTime = (totalQ - skipped) > 0 ? Math.round(state.totalTimeTaken / (totalQ - skipped)) : 0;
    DOM.statAvgTime.textContent = `${avgTime}s`;
    
    // 5. New High score badge flashers
    DOM.highscoreBadge.style.display = isNewBest ? 'flex' : 'none';
    
    // 6. Retry incorrect button toggle visibility
    DOM.retryIncorrectBtn.style.display = (wrong > 0) ? 'inline-flex' : 'none';
    
    // 7. Inject and build the dynamic Review Log Cards List
    this.renderReviewSection();
  },

  /**
   * Higher-order array structures mapping results to complex static HTML markup cards inside the review accordion
   */
  renderReviewSection() {
    DOM.reviewListContainer.innerHTML = '';
    
    state.activeQuestions.forEach((q, idx) => {
      const ans = state.userAnswers[q.id] || { selectedOptionIndex: null, isCorrect: false, timeTaken: 0 };
      const isSkipped = (ans.selectedOptionIndex === null);
      const isTimeout = (ans.selectedOptionIndex === -1);
      const isCorrect = ans.isCorrect;
      
      let statusClass = "wrong";
      let badgeLabel = "Incorrect";
      
      if (isCorrect) {
        statusClass = "correct";
        badgeLabel = "Correct";
      } else if (isSkipped) {
        statusClass = "skipped";
        badgeLabel = "Skipped";
      } else if (isTimeout) {
        statusClass = "wrong";
        badgeLabel = "Timeout";
      }
      
      const card = document.createElement('div');
      card.className = `review-card ${statusClass}`;
      
      let answersHTML = '';
      const alphabet = ['A', 'B', 'C', 'D'];
      
      q.options.forEach((opt, oIdx) => {
        let optClass = '';
        let optIcon = '';
        
        const isUserSelected = (ans.selectedOptionIndex === oIdx);
        const isCorrectOption = (q.correctAnswer === oIdx);
        
        if (isCorrectOption) {
          optClass = 'correct-select';
          optIcon = '<i class="fa-solid fa-circle-check"></i>';
        } else if (isUserSelected && !isCorrectOption) {
          optClass = 'user-select';
          optIcon = '<i class="fa-solid fa-circle-xmark"></i>';
        }
        
        answersHTML += `
          <div class="review-ans-item ${optClass}">
            <span style="font-weight: 700; margin-right: 8px;">${alphabet[oIdx]}.</span>
            <span style="flex-grow: 1;">${opt}</span>
            ${optIcon}
          </div>
        `;
      });
      
      card.innerHTML = `
        <div class="review-q-top">
          <span class="review-q-num">Question ${idx + 1}</span>
          <span class="review-q-badge">${badgeLabel}</span>
        </div>
        <h5>${q.question}</h5>
        <div class="review-answers-grid">
          ${answersHTML}
        </div>
        <div class="review-expl">
          <strong>Explanation:</strong> ${q.explanation}
        </div>
      `;
      
      DOM.reviewListContainer.appendChild(card);
    });
  }
};

// ==========================================================================
// 9. KEYBOARD CONTROLLER & ACCESSIBILITY
// ==========================================================================

const KeyboardController = {
  /**
   * Central Keydown router mapping buttons to active state modes
   * @param {KeyboardEvent} e 
   */
  handleKeyDown(e) {
    const key = e.key;
    const lowerKey = key.toLowerCase();
    
    // Close Modals on ESC
    if (key === 'Escape') {
      if (DOM.kbdModal.classList.contains('open')) {
        DOM.kbdModal.classList.remove('open');
        return;
      }
      if (DOM.quizScreen.classList.contains('active')) {
        DOM.quitBtn.click();
        return;
      }
    }
    
    // Global hotkey toggles (active outside typing elements)
    if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'SELECT') {
      
      // Sound Toggle [M]
      if (lowerKey === 'm') {
        e.preventDefault();
        DOM.soundBtn.click();
        return;
      }
      
      // Theme Toggle [T]
      if (lowerKey === 't') {
        e.preventDefault();
        DOM.themeBtn.click();
        return;
      }
    }
    
    // --- MODE 1: ACTIVE GAME BOARD SHORTCUTS ---
    if (DOM.quizScreen.classList.contains('active')) {
      
      // Option choices keys mapping
      const optionKeys = ['1', '2', '3', '4'];
      const altKeys = ['a', 'b', 'c', 'd'];
      
      const optionIdx = optionKeys.indexOf(key);
      const altIdx = altKeys.indexOf(lowerKey);
      
      const finalIdx = (optionIdx !== -1) ? optionIdx : altIdx;
      
      if (finalIdx !== -1) {
        e.preventDefault();
        // Grab current active option button in grid dynamically
        const optBtn = DOM.optionsContainer.querySelector(`#option-${finalIdx}`);
        // Only click if answers have not been locked (i.e. button is not disabled)
        if (optBtn && !optBtn.disabled) {
          optBtn.click();
        }
        return;
      }
      
      // Submit/Proceed progression keys [Enter] or [Space]
      if (key === 'Enter' || key === ' ') {
        e.preventDefault();
        if (!DOM.nextBtn.disabled) {
          DOM.nextBtn.click();
        }
        return;
      }
      
      // Skip question bindings [S] or [ArrowRight]
      if (lowerKey === 's' || key === 'ArrowRight') {
        e.preventDefault();
        if (!DOM.skipBtn.disabled) {
          DOM.skipBtn.click();
        }
        return;
      }
    }

    // --- MODE 2: RESULTS SCREEN SHORTCUTS ---
    if (DOM.resultScreen.classList.contains('active')) {
      // Allow enter to trigger restart game
      if (key === 'Enter' && !DOM.restartBtn.disabled) {
        e.preventDefault();
        DOM.restartBtn.click();
      }
      
      // Allow reviewing navigation scrolls
      if (key === 'ArrowDown' || key === 'ArrowUp') {
        // Smoothly pass normal scroll actions
      }
    }
  }
};

// ==========================================================================
// 10. EVENT LISTENERS REGISTER
// ==========================================================================

function registerEventListeners() {
  
  // A. Quick Shell Action Header Toggles
  
  // Theme Light/Dark Mode Switcher
  DOM.themeBtn.addEventListener('click', () => {
    const isDark = DOM.body.getAttribute('data-theme') === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';
    
    DOM.body.setAttribute('data-theme', nextTheme);
    localStorage.setItem(StorageManager.KEYS.THEME, nextTheme);
    
    // Modify icon dynamically
    const icon = DOM.themeBtn.querySelector('i');
    icon.className = nextTheme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    
    SoundSynth.play('click');
  });
  
  // Volume Mute/Unmute sound synthesizers
  DOM.soundBtn.addEventListener('click', () => {
    state.isMuted = !state.isMuted;
    localStorage.setItem(StorageManager.KEYS.MUTED, state.isMuted);
    
    const icon = DOM.soundBtn.querySelector('i');
    icon.className = state.isMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
    
    if (!state.isMuted) {
      // User turned on sound, activate context and play confirmation chirp
      SoundSynth.init();
      SoundSynth.play('click');
      
      // Show dynamic browser toast
      DOM.audioToast.style.display = 'block';
      DOM.audioToast.style.opacity = '1';
      setTimeout(() => {
        DOM.audioToast.style.opacity = '0';
        setTimeout(() => { DOM.audioToast.style.display = 'none'; }, 400);
      }, 3000);
    }
  });
  
  // Keyboard Modal controls
  DOM.kbdBtn.addEventListener('click', () => {
    DOM.kbdModal.classList.add('open');
    SoundSynth.play('click');
  });
  
  DOM.closeKbdBtn.addEventListener('click', () => {
    DOM.kbdModal.classList.remove('open');
    SoundSynth.play('click');
  });
  DOM.closeKbdFooterBtn.addEventListener('click', () => {
    DOM.kbdModal.classList.remove('open');
    SoundSynth.play('click');
  });
  
  DOM.kbdModal.addEventListener('click', (e) => {
    // Click outside modal card to close
    if (e.target === DOM.kbdModal) {
      DOM.kbdModal.classList.remove('open');
    }
  });

  // B. Start Config Screen Handlers
  
  // Difficulty cards radio switches selector
  DOM.difficultyCards.forEach(card => {
    card.addEventListener('click', () => {
      DOM.difficultyCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      
      const radio = card.querySelector('input');
      radio.checked = true;
      state.selectedDifficulty = radio.value;
      
      SoundSynth.play('click');
    });
  });

  // Category Selector Value Sync
  DOM.categorySelect.addEventListener('change', (e) => {
    state.selectedCategory = e.target.value;
    SoundSynth.play('click');
  });
  
  // Game parameters sync
  DOM.shuffleQToggle.addEventListener('change', (e) => {
    state.shuffleQuestions = e.target.checked;
    SoundSynth.play('click');
  });
  DOM.shuffleOToggle.addEventListener('change', (e) => {
    state.shuffleOptions = e.target.checked;
    SoundSynth.play('click');
  });
  
  // Dashboard Accordion toggle
  DOM.dashboardToggle.addEventListener('click', () => {
    const parent = DOM.dashboardToggle.parentElement;
    const isOpen = parent.classList.contains('open');
    
    if (isOpen) {
      parent.classList.remove('open');
      DOM.dashboardContent.style.maxHeight = '0';
    } else {
      parent.classList.add('open');
      DOM.dashboardContent.style.maxHeight = '800px';
    }
    
    SoundSynth.play('click');
  });
  
  // Dashboard Reset high scores utilities
  DOM.clearStatsBtn.addEventListener('click', () => {
    if (confirm("Are you absolutely sure you want to clear your local stats and high scores history?")) {
      StorageManager.clearAllStats();
      UIRenderer.renderDashboard();
      SoundSynth.play('wrong');
    }
  });
  
  // Game Start Button Trigger
  DOM.startBtn.addEventListener('click', () => {
    SoundSynth.play('click');
    
    // Set active state variables from selections
    state.selectedCategory = DOM.categorySelect.value;
    const activeDiffInput = document.querySelector('input[name="difficulty"]:checked');
    state.selectedDifficulty = activeDiffInput ? activeDiffInput.value : 'all';
    state.shuffleQuestions = DOM.shuffleQToggle.checked;
    state.shuffleOptions = DOM.shuffleOToggle.checked;
    
    state.isRetryIncorrectOnly = false;
    
    // Construct questions pool
    const success = QuizEngine.buildQuiz();
    
    if (success) {
      QuizEngine.resetStats();
      UIRenderer.showQuestion();
    } else {
      alert(`No questions found matching Category: "${formatCategory(state.selectedCategory)}" and Difficulty: "${state.selectedDifficulty}". Please select different game parameters.`);
    }
  });

  // C. Quiz Card Panel Handlers
  
  // Skip Question
  DOM.skipBtn.addEventListener('click', () => {
    QuizEngine.skipAnswer();
  });
  
  // Next Question Progression
  DOM.nextBtn.addEventListener('click', () => {
    SoundSynth.play('click');
    QuizEngine.nextQuestion();
  });
  
  // Quit current sprint midway
  DOM.quitBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to quit this quiz sprint? Current progress will be lost.")) {
      Timer.stop();
      SoundSynth.play('wrong');
      QuizEngine.resetStats();
      UIRenderer.switchScreen(DOM.startScreen);
    }
  });

  // D. Result Screen Handlers
  
  // Home Screen Reset
  DOM.homeBtn.addEventListener('click', () => {
    SoundSynth.play('click');
    QuizEngine.resetStats();
    UIRenderer.switchScreen(DOM.startScreen);
  });
  
  // Play Again (Restarts the exact same quiz category parameters)
  DOM.restartBtn.addEventListener('click', () => {
    SoundSynth.play('click');
    
    // Build fresh quiz
    const success = QuizEngine.buildQuiz();
    if (success) {
      QuizEngine.resetStats();
      UIRenderer.showQuestion();
    } else {
      UIRenderer.switchScreen(DOM.startScreen);
    }
  });
  
  // Retry Incorrect Answers ONLY (Super user feature)
  DOM.retryIncorrectBtn.addEventListener('click', () => {
    SoundSynth.play('click');
    
    const success = QuizEngine.buildRetryQuiz();
    if (success) {
      // Retain cumulative score or wipe parameters
      state.currentQuestionIndex = 0;
      state.correctCount = 0;
      state.wrongCount = 0;
      state.skippedCount = 0;
      state.currentStreak = 0;
      state.totalTimeTaken = 0;
      state.userAnswers = {};
      
      UIRenderer.showQuestion();
    } else {
      alert("No incorrect answers to retry!");
    }
  });
  
  // Review log accordion toggle
  DOM.toggleReviewBtn.addEventListener('click', () => {
    const container = DOM.reviewPanelContainer;
    const icon = DOM.toggleReviewBtn.querySelector('i:last-child');
    
    const isOpen = container.classList.contains('open');
    if (isOpen) {
      container.classList.remove('open');
      icon.className = 'fa-solid fa-chevron-down';
    } else {
      container.classList.add('open');
      icon.className = 'fa-solid fa-chevron-up';
      
      // Smooth scroll down to review
      setTimeout(() => {
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
    
    SoundSynth.play('click');
  });

  // E. Keyboard listeners binding
  document.addEventListener('keydown', KeyboardController.handleKeyDown);
}

// ==========================================================================
// 11. INITIALIZER
// ==========================================================================

function initApp() {
  // 1. Fetch values from localStorage if available
  const savedTheme = localStorage.getItem(StorageManager.KEYS.THEME) || 'dark';
  const savedMuted = localStorage.getItem(StorageManager.KEYS.MUTED) === 'true';
  
  // Apply saved Theme settings
  DOM.body.setAttribute('data-theme', savedTheme);
  const themeIcon = DOM.themeBtn.querySelector('i');
  themeIcon.className = savedTheme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  
  // Apply saved audio parameters
  state.isMuted = savedMuted;
  const soundIcon = DOM.soundBtn.querySelector('i');
  soundIcon.className = savedMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
  
  // 2. Setup initial leaderboard and activities lists
  UIRenderer.renderDashboard();
  
  // 3. Register DOM Event Listeners
  registerEventListeners();
}

// Fire initializations on DOM complete
document.addEventListener('DOMContentLoaded', initApp);
