# BrainSprint - Premium Interactive Quiz Application

BrainSprint is a zero-dependency, professional-grade, highly interactive **Vanilla JavaScript** web application. It features a modern **glassmorphism** user interface design with complete responsive adaptability, a custom browser-synthesized audio effects engine utilizing the **Web Audio API**, and robust state-driven quiz mechanics. 

Built as a portfolio-ready showcase, BrainSprint highlights advanced client-side JavaScript concepts including local storage persistence, modular structures, dynamic rendering, array manipulations, and complete keyboard accessibility support.

---

## 🌟 Key Features

### 1. Game Configurations
*   **Dynamic Category Filtering**: Focus your sprint on Technology & Coding, Science, Geography, History, or General Knowledge.
*   **Difficulty Scaling**: Adjust complexity between **Easy**, **Medium**, and **Hard** tiers, or play a **Mixed** deck of questions.
*   **Parameter Shufflers**: Choose to shuffle the question order randomly and/or scramble option order choices for unique gameplay.

### 2. State-Driven Game Play Engine
*   **Instant Visual Feedback**: Options turn green (correct) or red (incorrect) dynamically. Select cards animate with keyframe shakes upon wrong guesses.
*   **Detailed Explanations**: Rich card fly-out reveals detailed historical/scientific explanations for every choice.
*   **Smart Scoring**: An advanced score calculator rewarding both speed (fast answers earn higher points) and active consecutive **Hot Streaks**.
*   **Question Skip**: Skip through challenging prompts without penalty, and review them at the final board.

### 3. Visual & Aesthetic Excellence
*   **Glassmorphism UI**: High-end translucent elements featuring backdrop blurring, frosted-glass card borders, subtle drop shadows, and harmonized dark/light HSL theme colors.
*   **Dynamic Backgrounds**: Floating, rotating gradient orbs pulsing softly in the backdrop.
*   **Sweep Result SVG**: Circular SVG progress dial that fills up dynamically on the final metrics page.
*   **Responsive Adaptation**: Custom flexbox, modern CSS grids, and viewport media breakpoints to support Mobile, Tablet, and Desktop screen matrices.

### 4. Advanced Technical Features
*   **Web Audio Synth**: A custom synthesizer engine that uses the browser's native **Web Audio API** to generate nostalgic, clean retro beep/chime/buzz wave sounds on-the-fly without downloading any external `.wav` or `.mp3` assets.
*   **Keyboard Controls**: Complete keyboard accessibility support! Play the entire game using keys `1` to `4` (or `A` to `D`), `Enter`/`Space` to advance, `ArrowRight` to skip, and `Esc` to quit.
*   **Incorrect Retries**: Made mistakes? Start a sub-quiz containing *only* the questions you got wrong to refine your knowledge.
*   **Detailed Review Log**: A scrollable breakdown of all answers with color-coded markers (correct/wrong/skipped), option selections, and explanations.
*   **Storage registers**: Leaderboards and history activity sheets are cached in the browser's local storage database and retrieved on startup.

---

## 📂 Folder Structure

```text
/Quiz Application/
  ├── index.html       # Semantic HTML5 Skeleton & Keyboard helper modal
  ├── style.css        # Responsive, variable-driven theme stylesheet
  ├── script.js        # Core Modular Quiz Engine, sound synthesizers & storage tools
  ├── questions.js     # Structured dataset containing 25+ graded question items
  └── README.md        # Comprehensive project documentation
```

---

## 🚀 Advanced JavaScript Concepts Demonstrated

This project is built from scratch with zero framework dependencies to showcase strong front-end JavaScript foundations:

1.  **State Management**: Centralized store object managing active game parameters (streaks, indices, times, user logs) with pure update routines.
2.  **Web Audio API Synthesizers**: Direct generation of sound waves utilizing `OscillatorNode`, sound envelope modifications via `GainNode`, and bi-quad low-pass filter routing to control retro chime acoustic properties.
3.  **Keyboard Key Listeners**: Integrated keyboard routers parsing keycodes (`1-4`, `A-D`, `ArrowRight`, `Esc`) to manipulate dynamic DOM interactions cleanly.
4.  **Array Manipulations**: Higher-order Array methods including `.filter()` for category lookups, `.map()` for layout preparation, `.forEach()` for draw iterations, and Fisher-Yates algorithm for random sorting.
5.  **DOM Manipulation & Event Routing**: Event Delegation, dynamic option button creation, structural class toggles, and direct dynamic styling overlays.
6.  **Local Storage Accessors**: Safe serialization and retrieval of leaderboard registries and historic timelines.
7.  **Interval Management**: Custom timer intervals synchronizing countdowns with visual CSS width percentage sweeps.

---

## 🛠️ Installation & Local Setup

Since BrainSprint is written in native HTML5, CSS3, and JavaScript, it is completely self-contained and has **zero developer dependencies** (no `npm install` needed).

1.  **Clone or Download** the folder to your local machine:
    ```bash
    git clone https://github.com/your-username/brainsprint-quiz-app.git
    cd brainsprint-quiz-app
    ```
2.  **Run the Project**:
    *   *Option A*: Simply double-click `index.html` to open it directly in any modern web browser.
    *   *Option B (Recommended)*: Open the project in VS Code, right-click `index.html` and select **Open with Live Server** to run it on a local server.

---

## 🖥️ Keyboard Shortcuts Guide

Make your sprint lightning-fast by utilizing these built-in keyboard shortcuts:

| Key Binding | Action Triggered |
| :--- | :--- |
| `1` / `2` / `3` / `4` | Select Choice A, B, C, or D respectively |
| `A` / `B` / `C` / `D` | Select Choice A, B, C, or D respectively (Alternative) |
| `Enter` / `Space` | Confirm selection / Proceed to next question |
| `S` / `ArrowRight` | Skip current question |
| `Esc` | Quit active quiz round / Close keyboard helpers modal |
| `M` | Mute / Unmute synthesized retro sound effects |
| `T` | Toggle Dark / Light visual color themes |

---

## 🌐 Professional Deployment Guide

You can deploy BrainSprint in minutes to any free static web hosting service:

### 1. GitHub Pages (Simplest)
1.  Initialize a Git repository and commit your files:
    ```bash
    git init
    git add .
    git commit -m "feat: initial commit of BrainSprint Quiz App"
    ```
2.  Create a repository on GitHub and link it:
    ```bash
    git branch -M main
    git remote add origin https://github.com/your-username/brainsprint-quiz-app.git
    git push -u origin main
    ```
3.  On GitHub, go to your repository **Settings** -> **Pages** (under the "Code and automation" section).
4.  Under **Build and deployment**, set the source to **Deploy from a branch**.
5.  Select the **main** branch and `/ (root)` folder, then click **Save**. Your site will be live in a couple of minutes!

### 2. Netlify
1.  Sign in to [Netlify](https://www.netlify.com/).
2.  Click **Add new site** -> **Import from Git** OR simply drag and drop the folder containing your three files directly into the Netlify dropzone.
3.  Netlify automatically builds and hosts your project with an SSL certificate.

### 3. Vercel
1.  Install the Vercel CLI or link your GitHub account to [Vercel](https://vercel.com/).
2.  Import your GitHub repository and click **Deploy**. The project will build instantly.

---

## 📈 Future Enhancements

*   **REST API Integration**: Pull questions dynamically from public quiz APIs (like Open Trivia Database) when online.
*   **Custom Question Creator**: A separate visual screen allowing users to write custom questions and export them as a JSON file.
*   **Multiplayer Pass & Play**: Local offline multiplayer mode tracking stats for two players taking alternating turns.
*   **Advanced Analytics Dashboards**: Plot correct/incorrect categories over time using lightweight chart libraries.
