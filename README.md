# Portfolio Website

A highly interactive, terminal-themed portfolio website built with React, TypeScript, and 3D visualizations. This project features a unique "boot sequence" introduction, a persistent terminal sidebar, and immersive neural network background effects.

## 🚀 Features

-   **Immersive Terminal UI**: A functional-looking terminal sidebar that guides the user through the experience.
-   **3D Neural Background**: Interactive particle system built with Canvas API for a dynamic visual backdrop.
-   **"Boot Sequence" Intro**: innovative landing page experience simulating a system startup.
-   **Admin Panel**: Secured section for managing dynamic content (if applicable).
-   **Responsive Design**: Fully responsive layout adapting to different screen sizes.
-   **PDF Resume Generation**: Integrated React-PDF for on-the-fly resume rendering.

## 💻 Terminal Commands

The portfolio features a fully interactive integrated terminal. You can use the following commands to navigate and interact with the system:

| Command | Description |
| :--- | :--- |
| `help` / `ls` | Displays the list of available commands. |
| `about` | Navigates to the **About Me** section (Identity Module). |
| `experience` | Opens the **Experience** log (Work History). |
| `projects` | Accesses the **Project Archive**. |
| `skills` | Displays the **Technical Matrix** (Skills). |
| `roadmap` | Shows the **Future Nodes** (Roadmap/Goals). |
| `philosophy` | detailed view of **Core Axioms** (Values). |
| `achievements` | Lists **Honors & Awards**. |
| `blog` | Opens the **Data Logs** (Writings). |
| `resume` | Generates and displays the **Personnel File** (PDF Resume). |
| `contact` | Initiates the **Secure Uplink** (Contact Form). |
| `home` | Returns to the **Neural Navigation** (Home Screen). |
| `clear` | Clears the terminal history. |

### 🔐 Admin Commands

-   `sudo apt -access admin [page]`: Initiates the admin authentication sequence for a specific page.
    -   *Logic*: Checks for persistent auth first. If not found, requests email/password.
    -   *Security*: Uses Firebase Auth. Invalid attempts are logged to the terminal history.
-   `sudo admin -cmd logout`: Immediately terminates the current session.

## 🛠️ Tech Stack & Dependencies

-   **Core Framework**: [React 19](https://react.dev/)
    -   *Reasoning*: Latest concurrent features and optimizations.
-   **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
    -   *Config*: `ES2022` target, Bundler module resolution.
-   **Build Tool**: [Vite](https://vitejs.dev/)
    -   *Plugins*: `@vitejs/plugin-react`
-   **Styling**: 
    -   [Tailwind CSS v3.4](https://tailwindcss.com/) (Utility-first)
    -   **PostCSS**: Used for transforming CSS with Autoprefixer.
    -   **Lucide React**: Vector icons (lightweight).
-   **Animation**: 
    -   [Framer Motion](https://www.framer.com/motion/) (Complex UI transitions).
-   **Backend / Services**: 
    -   [Firebase](https://firebase.google.com/) (v12.6.0) - Auth & Firestore.
    -   [EmailJS](https://www.emailjs.com/) - Serverless contact form.
-   **Utilities**:
    -   `react-pdf`: Client-side PDF rendering.
    -   `react-router-dom`: SPA Client-side routing.

## ⚙️ Configuration Guide

### Environment Variables (.env)
Create a `.env` file in the root. **Do not commit this file.**

```env
# FIREBASE CONFIGURATION
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# EMAILJS CONFIGURATION
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### TypeScript Configuration (`tsconfig.app.json`)
The project uses `Strict` mode.
-   `noUnusedLocals`: True. Dead code will cause build errors.
-   `noFallthroughCasesInSwitch`: True. Safer switch statements.
-   `target`: ES2022. Modern browser support assumed.

### Tailwind Configuration (`tailwind.config.js`)
Currently uses default theme extension.
-   **Content**: Scans `./index.html` and `./src/**/*.{js,ts,jsx,tsx}`.
-   **Theme**: Default. Custom colors are currently defined in CSS variables or inline classes.

## 🚀 Deployment Guide

### Vercel (Recommended)
1.  Push code to GitHub.
2.  Import project in Vercel.
3.  **Build Command**: `npm run build`
4.  **Output Directory**: `dist`
5.  **Environment Variables**: Copy-paste your `.env` content into Vercel's settings.

### Netlify
1.  Drag and drop the `dist` folder after running `npm run build`.
2.  Or connect via Git similar to Vercel. ensure `npm run build` is set as the build command.

## 📦 Component Library Snippets

### `CyberAlert`
Used for displaying critical system messages or error states with a cyberpunk aesthetic.

```typescript
import CyberAlert from './components/ui/CyberAlert';

<CyberAlert 
  title="System Warning" 
  variant="destructive" // or "default", "warning"
>
  Unauthorized access attempt detected.
</CyberAlert>
```

## 🐛 Troubleshooting

**Issue: PDF Worker Error**
*Fix*: Ensure `pdfjs.GlobalWorkerOptions.workerSrc` is pointing to a valid CDN URL in `Resume.tsx`.

**Issue: Terminal typing looks glitchy**
*Fix*: This is intentional! The `TerminalIntro` component uses random `setTimeout` delays to simulate retro hardware.

**Issue: Firebase Auth Fails**
*Fix*: Check if the `authorized domains` in Firebase Console includes `localhost` and your production URL.


-   **Core**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) (Icons)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Backend / Services**: 
    -   [Firebase](https://firebase.google.com/) (Backend-as-a-Service)
    -   [EmailJS](https://www.emailjs.com/) (Contact form handling)

## 📂 Project Structure

```
src/
├── admin/          # Admin panel components and logic
├── canvas/         # Canvas-based visualizations (NeuralBackground, etc.)
├── components/     # Reusable UI components
├── layouts/        # Page layout wrappers
├── sections/       # Main page sections (Hero, About, Projects, etc.)
├── lib/            # Utility functions (Firebase, Image handling)
├── App.tsx         # Main application logic and layout layering
└── main.tsx        # Application entry point
```

## ⚡ Getting Started

### Prerequisites

-   Node.js (v18+ recommended)
-   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd portfolio
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory based on `.env.example`. You will need API keys for:
    -   Firebase Configuration
    -   EmailJS Configuration

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## 🧩 Key Concepts

### System State System
The application flow is controlled by a central state machine in `App.tsx`:
-   **LANDING**: The initial "Press Start" screen.
-   **BOOTING**: The terminal initialization sequence.
-   **ONLINE**: The main interactive portfolio interface.

### Layered Architecture
`App.tsx` manages visual layers using z-index:
1.  **Background**: 3D Neural Network Canvas.
2.  **Terminal**: Persistent sidebar/overlay.
3.  **Navigation**: Neural node navigation (Home only).
4.  **Content**: Main page content (Right side split).
5.  **Modals**: Admin interface overlays.

## 📄 License

[MIT](LICENSE)
