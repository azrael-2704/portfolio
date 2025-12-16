# Frontend Documentation & Architecture Guide
**Project:** Cyberpunk Portfolio (Neural Architect Theme)
**Version:** 1.0.0
**Last Updated:** Dec 2025

## 1. Project Overview
This is a Single Page Application (SPA) portfolio built with a strict **Cyberpunk / Neural Interface** aesthetic. It relies on high-performance animations, terminal-style aesthetics, and glassmorphism.

**Key Design Principles:**
*   **Theme**: "Neural Architect" - Deep space blue backgrounds, Cyan accents, terminal typography.
*   **Interactivity**: Hover effects, glitch text, scroll animations.
*   **Performance**: Lightweight animations using CSS and Framer Motion.
*   **Restriction**: The visual design is **LOCKED**. Do not modify padding, colors, fonts, or layout structures without explicit instruction.

## 2. Technology Stack
*   **Framework**: React 19 + TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS (v3.4)
*   **Animations**: Framer Motion
*   **Icons**: Lucide React
*   **PDF Rendering**: react-pdf
*   **3D Elements**: Custom Canvas/Particles (Background)
*   **Backend**: Firebase (Auth/Firestore) & EmailJS

## 3. Architecture & State Management

### A. System State Machine (`App.tsx`)
The application flow is controlled by a central `systemState` variable:
1.  `LANDING`: The initial "Press Start" / "Initialize" screen.
2.  `BOOTING`: The terminal initialization sequence (typing effect).
3.  `ONLINE`: The main interactive portfolio interface with navigation.

### B. Layered Layout System
`App.tsx` manages visual layers using specific z-indices:
*   **Layer 1 (z-0)**: `NeuralBackground` (Canvas 3D particles).
*   **Layer 2 (z-40)**: `TerminalIntro` (Persistent sidebar/overlay).
*   **Layer 3 (z-10)**: `NeuralNavigation` (Interactive node graph, Home only).
*   **Layer 4**: Main Content Area (Routing).
*   **Layer 5**: `AdminModal` (Overlays).

## 4. File Structure
```text
/src
  /admin           # Admin panel components (Login, Dashboard)
  /canvas          # Canvas-based visualizations
      NeuralBackground.tsx   # 3D Particle System
      NeuralNavigation.tsx   # Interactive Node Graph
  /components
    /layout
      MainLayout.tsx   # Wrapper for standard pages
    /sections
      Hero.tsx         # Landing page hero
      TerminalIntro.tsx # The core terminal component
      ... (Other sections: About, Skills, Projects, etc.)
  /lib
    firebase.ts      # Firebase initialization
    imageUtils.ts    # Image helper functions
  App.tsx            # Main Application Logic
  main.tsx           # Entry Point
```

## 5. Key Components Details

### `TerminalIntro.tsx`
*   **Role**: Acts as both the "loading screen" and the persistent navigation sidebar.
*   **Interactive**: Supports commands like `help`, `about`, `projects`.
*   **Admin Access**: Type `sudo apt -access admin [page]` to trigger admin login.
*   **Auth**: Handles Firebase Auth login flows within the terminal interface.

### `NeuralBackground.tsx`
*   **Tech**: Native HTML5 Canvas API (no Three.js for lighter weight).
*   **Logic**: Particle system with mouse interaction (magnetic pull) and proximity-based line drawing.
*   **Performance**: Uses `requestAnimationFrame` and optimized drawing checks.

## 6. Design System (Tailwind)
**Theme Colors:**
*   **Primary Accent**: `cyan-400` / `cyan-500`
*   **Secondary Borders**: `cyan-500/30`
*   **Backgrounds**: `black`, `#050a14` (Deep Navy), `#0c121e` (Panel BG)
*   **Text**: `white` (Headings), `gray-400` (Body), `font-mono` (Terminal text)

**Reusable Patterns:**
*   **Glassmorphism**: `backdrop-blur-md bg-[#050a14]/90`
*   **Glitch Text**: Custom `GlitchText` component for headers.

## 7. Configuration & Environment
Required `.env` variables:
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
```

## 8. Data Layer & Schemas

The application uses a **Hybrid Data Strategy**. It attempts to fetch real-time data from **Firebase Firestore** via the `usePortfolioData` hook. If the database is empty or unreachable, it falls back to the static data in `src/data/portfolio.ts`.

### Data Schemas (Implicit Interfaces)

**Profile Object**
```typescript
interface Profile {
  name: string;
  titles: string[]; // Rotated in Hero typewriter
  bio: string;
  social: { github: string; linkedin: string; ... };
  about: string; // Long form text
  stats: Array<{ label: string, value: string }>;
}
```

**Project Object**
```typescript
interface Project {
  id: string;
  title: string;
  desc: string;
  tech: string[]; // Displayed as tags
  domain: string;
  link?: string;
  github?: string;
  image: string; // URL
  featured: boolean; // Determines grid size
  type: 'research' | 'product' | 'experiment';
}
```

**Skill Object**
```typescript
interface Skill {
  id: string;
  name: string;
  level: number; // 0-100 (Determines progress bar width)
  category: 'ml' | 'ds' | 'dev' | 'ops' | 'core';
  version?: string; // e.g. "ES6+", "v18"
  desc?: string; // Tooltip text
}
```

## 9. Custom Hooks

### `src/hooks/usePortfolioData.ts`
Designed for real-time updates without redeployment.
-   **Functionality**: Subscribes to Firestore collections (`projects`, `skills`, etc.) using `onSnapshot`.
-   **Fallback**: If Firestore returns 0 items, it silently serves the `portfolio.ts` constants.
-   **Usage**:
    ```typescript
    const { data: projects, loading } = useProjects();
    const { profile } = useProfile();
    ```

## 10. Routing & Navigation Logic

The app uses `react-router-dom` v6 but with a twist to support the "System Boot" state.

**Routing Flow:**
1.  **Initial Load**: App checks `systemState`.
    -   If `LANDING`: Renders `<Hero>` inside `MainLayout`.
    -   If `BOOTING`: Renders nothing (or loader), allows `TerminalIntro` to play overlay animation.
    -   If `ONLINE`: Renders standard routes.
2.  **Navigation**:
    -   Home (`/`) -> Renders empty div (Content is handled by `NeuralNavigation` canvas overlay).
    -   Subpages (`/about`, `/projects`, etc.) -> Renders `<MainLayout>` with specific content components.

**MainLayout (`src/layouts/MainLayout.tsx`)**:
-   Wraps content in a responsive container.
-   Handles the "Shift Right" logic when the Terminal Sidebar is active.
-   On Mobile: Stacks content vertically.
-   On Desktop: Pushes content to the right (75% width) to accommodate the 25% terminal sidebar.

## 11. Asset Management
-   **Images**: Currently hosted externally (Unsplash/GitHub) and referenced via URL strings in `portfolio.ts`.
-   **Local Assets**: Placed in `public/` or imported in `src/assets`.
-   **PDFs**: `resume.pdf` should be in the `public/` folder for the PDF viewer to access it via relative path.

## 12. Developer Notes
*   **Resume**: Uses `react-pdf`. Ensure `pdf.worker.min.mjs` is correctly loaded.
*   **Logout**: Refreshing the admin page will trigger an automatic logout (implemented in `TerminalIntro.tsx` `useEffect`).
*   **Admin**: The admin panel is hidden behind terminal commands. It is not directly accessible via UI links.

