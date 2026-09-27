# ⚡ DOOMSDAY — GFG × Bennett University

<div align="center">

### **THE MULTIVERSE IS COLLAPSING.**
### **FOUR HEROES. ONE MISSION.**

**A cinematic Marvel-inspired recruitment experience for the GeeksforGeeks Student Chapter × Bennett University.**

<br>

`BUILD` • `BREAK` • `UNDERSTAND` • `IMPROVE`

</div>

---

## 🎬 What is DOOMSDAY?

**DOOMSDAY** is a cinematic recruitment microsite created for the **GeeksforGeeks Student Chapter, Bennett University — Junior Core Recruitment 2026**.

Instead of following the usual event-website structure:

> Hero → About → Events → Register

the project treats recruitment as an **interactive narrative**.

The visitor enters through a cinematic opening sequence, encounters a collapsing multiverse, explores four character-inspired realms, interacts with 3D objects, discovers the recruitment mission, and finally enters a dedicated recruitment portal.

The entire experience was designed around one idea:

> **Don't just tell the visitor about the event. Make them experience it.**

---

# 🦸 The Concept

The fictional narrative is based around a **multiverse incursion**.

Each character represents a different recruitment realm:

| Realm | Character | Direction |
|---|---|---|
| 🟢 | **Doctor Doom** | Technical / Systems |
| 🔴 | **Spider-Man** | Creative / Web |
| 🟣 | **Thor** | Algorithms / Competitive Programming |
| 🔵 | **Captain America** | Strategy / Event Operations |

The character system isn't only visual.

Selecting a realm changes the visual language of the recruitment portal, including accent color, glow, messaging and suggested specialization.

---

# ✨ Experience Breakdown

## 01 — Cinematic Intro

The website opens with a full-screen **comic / flipbook-inspired sequence**.

The introduction uses:

- Rapid character panels
- SVG-based artwork
- GFG × Bennett University branding
- CRT / film-grain treatment
- Progress indicators
- Cinematic typography
- Transition effects
- Intro skip control

The objective is to establish the story before the user even reaches the main page.

---

## 02 — DOOMSDAY Hero

The main hero introduces the central narrative:

### **THE MULTIVERSE IS COLLAPSING.**

Doctor Doom becomes the visual anchor of the experience through an interactive 3D scene.

The hero includes:

- Interactive 3D model
- Mouse-look / parallax
- Pointer interaction
- Scroll-driven movement
- Ambient energy effects
- Cinematic typography
- Primary recruitment CTA

---

## 03 — Multiverse Breach

The hero transition moves into the **multiverse selection system**.

Instead of presenting ordinary cards, the four characters are treated as different realms / dossiers.

The experience uses:

- 3D character/object previews
- Hover states
- Card tilt
- Idle floating motion
- 360° interaction
- Scroll-based animation
- Character-specific accent systems

---

# 🧊 3D SYSTEM

The 3D experience is powered by **native Three.js + GLTFLoader + DRACO support**.

The models are loaded as local `.glb` assets rather than depending entirely on external embedded viewers.

### Interactive Features

Each supported 3D scene can provide:

- 🖱️ Mouse drag rotation
- 👆 Touch / pointer interaction
- 🔄 360° orbit movement
- 🌀 Inertia after dragging
- 🌊 Idle floating motion
- 📜 Scroll-driven transforms
- ✨ Character-specific lighting / energy
- 📐 Automatic model normalization
- 📱 Responsive resizing
- ♿ Reduced-motion handling
- 🛡️ Graceful fallback when a model fails

A shared model-loading approach is used with a reusable **DRACO decoder** and normalization/pivot logic so different models can be placed consistently inside the scene.

---

# 🧙 Character Visual System

### 🟢 Doctor Doom

The Doom system uses a 3D Doom mask with an emerald visual language.

Effects include:

- Emerald glow
- Energy rings
- Mouse interaction
- 360° rotation
- Scroll transforms
- Technical HUD treatment

---

### 🔴 Spider-Man

Spider-Man uses a dedicated 3D character presentation combined with web-inspired visual effects.

The Spider-Man realm uses:

- Crimson accent lighting
- Web-line graphics
- Character interaction
- Cinematic reveal animation
- Creative/web-oriented recruitment messaging

---

### 🟣 Thor

Thor's realm uses a lightning / Mjolnir visual system.

The section combines:

- 3D Thor-related object/model
- Lightning effects
- Violet energy
- Particle atmosphere
- Rotation interaction
- Storm-inspired motion

---

### 🔵 Captain America

Captain America's section uses a 3D character/shield presentation.

The visual system combines:

- Navy / silver tones
- Shield-based graphics
- Tactical HUD styling
- Interactive rotation
- Strategic-command visual language

---

# ⚡ Animation Architecture

The animation system is built around three main technologies:

### GSAP

Used for:

- Entrance animations
- Element reveals
- Transform sequences
- Character transitions
- Interactive micro-animations

### ScrollTrigger

Used for:

- Scroll-driven character movement
- Section reveals
- Progress-based transforms
- Hero transitions
- Timeline interactions

### Lenis

Used for:

- Smooth scrolling
- Cinematic scroll inertia
- Synchronization with GSAP / ScrollTrigger

The project synchronizes Lenis scrolling with GSAP's ticker and ScrollTrigger updates so the animation system behaves as one continuous experience.

---

# 🌌 Visual Effects

The site combines CSS, SVG, Canvas and WebGL instead of relying on a single visual technique.

### CSS

Used for:

- Layout
- Responsive design
- Typography
- HUD components
- Glows
- Cards
- Buttons
- Transitions
- Film grain
- Realm theming

### SVG

Used for:

- Intro artwork
- Character glyphs
- Icons
- Decorative UI
- Fallback visual elements

### Canvas

Used for:

- 3D rendering
- Cosmic / collision visuals
- Interactive model presentation

### WebGL / Three.js

Used for:

- 3D models
- Lighting
- Cameras
- Scene rendering
- Interactive object movement

---

# 📝 Recruitment Portal

The registration page is not a generic external form.

It continues the same **DOOMSDAY visual system**.

The portal includes:

- Realm selection
- Dynamic theme switching
- Character-specific messaging
- Domain suggestions
- Form validation
- Character counters
- Draft saving
- Submission protection
- Live protocol clock
- Responsive form layout
- Cinematic HUD styling

Selecting a realm dynamically updates the portal's:

- Accent color
- Glow
- Background tint
- Transmission message
- Suggested domain

---

# 🔐 Registration Flow

The registration system includes basic client-side protections such as:

- Submission cooldown
- Minimum form-fill time check
- Validation
- Draft persistence
- Character limits
- Submission state handling

The project is also configured to send submissions through a **Google Apps Script / Google Sheets webhook flow**.

> The endpoint configuration is intentionally kept in the project code because this is a student recruitment prototype. For production use, the endpoint should be protected and configured with appropriate server-side validation and access controls.

---

# 🎨 Design System

The entire website uses a unified design-token system.

### Base

```text
Background       #0A0A0A
Charcoal         #121212
Surface          #181818
Elevated         #222222
Primary Text     #F5F5F0
Secondary Text   #B4B4AD
```

### Character Accents

```text
Doctor Doom      #3AFFA0
Spider-Man       #D91E36
Thor             #7B5CFF
Captain America  #1B2A4A
```

The visual language intentionally uses a dark cinematic base so that character-specific accents become part of the storytelling.

---

# 🔤 Typography

The project uses three Google Fonts:

### Bebas Neue
Used for:

- Hero titles
- Section headings
- Large cinematic typography

### Inter
Used for:

- Body content
- Form content
- Supporting information
- Interface text

### Space Grotesk
Used for:

- HUD elements
- Technical labels
- Status indicators
- System-style metadata

Fonts are loaded from **Google Fonts**.

---

# 📦 Assets & Resources

## 3D Models

The project uses local `.glb` models for the interactive 3D scenes.

The source code contains an in-site **IP & 3D Model Attribution** section.

The documented sources include:

- **Doctor Doom Mask** — credited to `patromes` on Sketchfab
- **Thor / Mjolnir assets** — credited to `OmaxxFF` and other 3D community creators on Sketchfab
- **Spider-Man / Spider insignia** — documented in the project's attribution section
- **Captain America Shield** — documented in the project's attribution section

Where applicable, the project documents **Creative Commons Attribution (CC-BY 4.0)** information.

> Always verify the original model page and current license before redistributing the individual model files outside this project.

---

## Libraries

The project uses:

- **Three.js** — 3D rendering
- **GLTFLoader** — `.glb/.gltf` model loading
- **DRACOLoader** — compressed geometry decoding
- **GSAP** — animation engine
- **GSAP ScrollTrigger** — scroll-based animation
- **Lenis** — smooth scrolling

The project includes local vendor copies / fallbacks for the major libraries while also using CDN loading with fallback logic where configured.

---

## Icons & UI

Most UI icons and visual elements are created directly using:

- SVG
- CSS
- Inline vector paths
- Existing HTML components

This keeps the visual system lightweight and consistent.

---

# 🧱 Project Architecture

```text
DOOMSDAY
│
├── index.html
│   └── Main cinematic experience
│
├── styles.css
│   └── Global design system + responsive UI
│
├── script.js
│   └── Core interaction + animation controller
│
├── models3d.js
│   └── Three.js / GLB integration
│
├── register.html
│   └── Recruitment portal
│
├── register.css
│   └── Registration-specific styling
│
├── register.js
│   └── Registration logic
│
├── 404.html
│   └── Themed fallback page
│
├── assets/
│   ├── Modles/
│   │   └── 3D GLB assets
│   │
│   └── vendor/
│       ├── Three.js
│       ├── GLTFLoader
│       ├── DRACOLoader
│       ├── GSAP
│       ├── ScrollTrigger
│       ├── Lenis
│       └── Draco decoder
│
└── GOOGLE_SHEET_SETUP.md
    └── Registration integration notes
```

---

# 📱 Responsive Design

The experience is designed for:

- Desktop
- Laptop
- Tablet
- Mobile

Responsive behavior includes:

- Fluid typography
- Adaptive layouts
- Mobile navigation
- Responsive 3D canvases
- Touch interaction
- Mobile-specific rendering considerations
- Reduced-motion support
- Graceful 2D fallbacks

The 3D system also responds to container size changes and can reduce visual complexity when required.

---

# ♿ Accessibility & Graceful Degradation

The project includes several defensive design decisions:

- `prefers-reduced-motion` detection
- Alternative visual states when 3D loading fails
- Semantic labels for interactive controls
- Accessible dialog structure
- ARIA labels for navigation and controls
- Responsive touch interactions
- CSS/SVG visual fallbacks

If Three.js or GLTFLoader is unavailable, the application can retain its abstract visual presentation instead of leaving empty canvases.

---

# 🚀 Run Locally

Clone the repository and run it through a local HTTP server.

### Python

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

A local server is recommended because the project loads local assets, GLB files and supporting resources.

---

# 🌐 Deployment

The project is a static frontend and can be deployed using services such as:

- Vercel
- Netlify
- GitHub Pages
- Any static hosting provider

Make sure the complete `assets/` directory is included during deployment.

---

# 🧠 Design Philosophy

The project follows one core principle:

> **Make the website feel like an event before it tells you about the event.**

Instead of adding effects randomly, each major visual system has a purpose:

```text
INTRO
  ↓
WORLD BUILDING
  ↓
DOOMSDAY
  ↓
MULTIVERSE BREACH
  ↓
HERO / REALM SELECTION
  ↓
CHARACTER EXPERIENCES
  ↓
MISSION
  ↓
RECRUITMENT
  ↓
REGISTRATION
```

The result is intended to feel closer to an **interactive campaign microsite** than a conventional college recruitment page.

---

# ⚠️ IP / Creative Notice

This is a **student creative concept** inspired by Marvel characters and aesthetics.

Marvel, Doctor Doom, Spider-Man, Thor, Captain America and related intellectual property belong to their respective rights holders.

The project attribution section documents the third-party 3D assets and the educational/non-commercial nature of the concept.

This project is **not intended to imply endorsement or official affiliation with Marvel or Disney**.

---

# 🏁 Final

**DOOMSDAY** was built to explore how far a student event website can go when the goal is not simply:

> "Make a landing page."

but:

> **"Create an experience people remember."**

<br>

<div align="center">

### ⚡ ENTER THE MULTIVERSE
### **CHOOSE YOUR REALM.**
### **JOIN THE MISSION.**

<br>

**GFG × BENNETT UNIVERSITY**

</div>
