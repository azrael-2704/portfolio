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
*   **Framework**: React 18 + TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS (v3.4)
*   **Animations**: Framer Motion
*   **Icons**: Lucide React
*   **PDF Rendering**: react-pdf
*   **3D Elements**: Custom Canvas/Particles (Background)

## 3. File Structure
```text
/src
  /components
    /layout
      Header.tsx       # Top Navigation (Glassy, Responsive)
      Footer.tsx       # Simple copyright footer
      Background.tsx   # 3D Particle/Neural Network Canvas
    /sections
      Hero.tsx         # Typewriter effect, Glitch Text
      About.tsx        # "Identity Module", Hologram + Terminal
      Skills.tsx       # "Technical Matrix", 2-Col Grid
      Experience.tsx   # "Experience Log", Vertical Timeline
      Projects.tsx     # "Project Archive", Masonry-style Grid
      Roadmap.tsx      # "Future Nodes", Vertical Progress Line
      Philosophy.tsx   # "Core Axioms", Card Grid
      Achievements.tsx # "Honors", Award Cards
      Blog.tsx         # "Data Logs", Link Cards
      Resume.tsx       # "Personnel File", PDF Viewer
      Contact.tsx      # "Secure Uplink", Form + Status Log
  /data
    portfolio.ts       # SINGLE SOURCE OF TRUTH for all content
  index.css            # Global Tailwind imports & Scrollbar Styles
  App.tsx              # Main Layout Assembler
```

## 4. Design System (Tailwind Config)
**Theme Colors:**
*   **Primary Accent**: `cyan-400` / `cyan-500`
*   **Secondary Borders**: `cyan-500/30`
*   **Backgrounds**: `black`, `#050a14` (Deep Navy), `#0c121e` (Panel BG)
*   **Text**: `white` (Headings), `gray-400` (Body), `font-mono` (Terminal text)

**Reusable Visual Patterns:**
*   **Headers**: 
    *   Icon + Title (`text-4xl`, `font-mono`, `tracking-tighter`).
    *   Subline: `border-l-2 border-cyan-500/30 pl-4 py-1`.
    *   Margins: `mt-[-10px]` top visual correction.
*   **Cards**:
    *   Glassmorphism: `bg-[#0c121e]/50 backdrop-blur-sm`.
    *   Borders: `border border-white/10` (Default) -> `hover:border-cyan-500/50`.
*   **Scrollbars**: Custom webkit styling in `index.css` (Thin, Cyan thumb).

## 5. Data Layer (`src/data/portfolio.ts`)
All displayed content is static and typed.
*   `PROFILE`: Bio, social links, stats.
*   `SKILLS`: Array of skills with `level` (0-100) and `category` (ml, ds, dev, ops, core).
*   `PROJECTS`: Featured vs standard projects with tags and links.
*   `TIMELINE`: Work, Education, and Achievements mixed (controlled by `type` and `side`).

## 6. Critical Components & "Gotchas"
*   **Resume.tsx**: Uses `react-pdf`. Requires `pdf.worker.min.mjs` loaded from CDN (unpkg) to avoid build size issues.
*   **Contact.tsx**: The form is currently **Mocked**. It simulates encryption/sending (`setTimeout`) but creates no actual request.
    *   *Warning*: Do not confuse the "Status Log" on the left with a real console.
*   **Background.tsx**: Handles the resize logic for the canvas. Heavy computation is avoided by using simple 2D drawing contexts for the connections.

## 7. Future Admin System (Planned)
*   **Concept**: "Project NEURO-LINK"
*   **Goal**: Edit `portfolio.ts` data via a hidden web GUI.
*   **Trigger**: Terminal command `sudo access --admin`.
*   **Backend**: Firebase (Firestore) is the proposed data store to replace the static file.

---
*Use this document to onboard new agents or debug layout issues. Ensure strict adherence to the visual patterns defined in Section 4.*
