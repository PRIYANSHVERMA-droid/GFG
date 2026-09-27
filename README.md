<div align="center">

# ⚡ DOOMSDAY
### GeeksforGeeks Student Chapter × Bennett University

**A cinematic, Marvel-inspired recruitment experience — built to make you want to sign up before you finish scrolling.**

*"The multiverse is collapsing. Answer the call."*

[![Made with HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](#)
[![Made with CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](#)
[![Made with JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](#)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat&logo=three.js&logoColor=white)](#)
[![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat&logo=greensock&logoColor=white)](#)
[![Non-commercial fan project](https://img.shields.io/badge/Fan%20Project-Non--Commercial-3AFFA0?style=flat)](#legal--attribution)

</div>

---

## 🌌 What Is This

**DOOMSDAY** is the official Junior Core recruitment site for the **GeeksforGeeks Student Chapter at Bennett University**. Instead of a plain "apply here" form, it's staged as a Marvel Studios–style event: four heroes, a collapsing multiverse, and a mission that only new recruits can save.

Built entirely with vanilla HTML/CSS/JS — no framework, no build step, no bundler. Just open `index.html` and it runs.

| | |
|---|---|
| 🎬 **Vibe** | Marvel Studios trailer meets terminal hacker aesthetic |
| 🧑‍🚀 **Heroes** | Doctor Doom · Spider-Man · Thor · Captain America |
| 🎯 **Purpose** | Recruit the next batch of builders for the chapter's Junior Core |
| 📅 **Event** | October 15, 2026 · 5:30 PM IST · Main Auditorium, BU (in-person) |

---

## ✨ Features

### 🎥 Cinematic Intro
A rapid comic-panel flipbook (Doom → Spider-Man → Thor → Cap → GFG terminal boot sequence) plays on load, styled like a Marvel Studios opening card, with a live progress rail and skip control (`ESC` supported).

### 🌠 Scroll-Synced Cosmic Collision
Two glowing planets — Doom's emerald and a rival crimson — drift apart in the hero, converge as you scroll, and **collide in perfect sync** with the multiverse-fracture crack animation, complete with a screen-flash and shake. Fully driven by scroll position via GSAP ScrollTrigger; fades out gracefully into the ambient ember particle field for the rest of the page.

### 🃏 Interactive Hero Roster
Four flippable, tiltable, 360°-twirlable hero cards, each backed by a live Three.js/GLB 3D model, a classified "dossier" back face, and full keyboard + screen-reader support (`role="tab"`, arrow-key navigation, ARIA live regions throughout).

### 🧠 Smooth Everything
Lenis-powered inertial scrolling synced with GSAP ScrollTrigger for buttery scroll-linked reveals, parallax tilts, decrypting stat counters, and a magnetic CTA button — all switched off automatically for `prefers-reduced-motion` users.

### 📋 A Registration Portal That Actually Works
`register.html` is a full multi-field "cadet dossier" form with realm-based theming (pick your hero, the whole form re-skins), live validation, character counters, autosave-to-draft (so a refresh never loses your answers), and direct submission to Google Sheets — no backend required.

### ⚖️ Built-In Legal Transparency
A dedicated IP/licensing modal documents the fan-parody/non-commercial nature of the project and credits every third-party 3D asset (Creative Commons, Sketchfab) by name.

---

## 🛠️ Tech Stack

| Layer | Tool | Why |
|---|---|---|
| Structure | Semantic HTML5 | Accessible landmarks, ARIA throughout |
| Styling | Hand-written CSS3 | Custom properties, `clamp()` fluid type, zero CSS framework bloat |
| Scroll | [Lenis](https://github.com/darkroomengineering/lenis) | Buttery inertial smooth-scroll |
| Motion | [GSAP](https://gsap.com/) + ScrollTrigger | Scroll-scrubbed timelines, stagger reveals |
| 3D | [Three.js](https://threejs.org/) r147 + DRACOLoader + GLTFLoader | Native GLB hero models in `<canvas>` |
| Forms | Vanilla JS + Google Apps Script webhook | Zero-backend submissions straight to Sheets |
| Fonts | Bebas Neue · Inter · Space Grotesk (Google Fonts) | Cinematic display + clean body text |

All CDN scripts ship with automatic local-vendor fallbacks (`onerror` chains), so the site degrades gracefully on flaky campus wifi instead of breaking outright.

---

## 📁 Project Structure

```
.
├── index.html          # Landing page — intro, hero, roster, timeline, perks
├── register.html       # Cadet registration portal
├── styles.css           # All landing-page styling
├── register.css         # Registration portal styling
├── script.js             # Landing-page logic (scroll, animation, nav, modal)
├── register.js           # Form validation, draft autosave, submission
├── models3d.js           # Three.js / GLB model loading + lazy Sketchfab embeds
└── assets/
    └── Modles/            # .glb 3D model files (doom_mask, spider_logo3d, etc.)
```

---

## 🚀 Getting Started

No build tools, no `npm install`, no server required for local viewing:

```bash
# clone / download the repo, then simply open it
open index.html          # macOS
start index.html          # Windows
xdg-open index.html       # Linux
```

For the registration form's Google Sheets submission to work locally (some browsers block `fetch` on `file://` origins), serve it over a local server instead:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

### Connecting your own Google Sheet
Open `register.js` and replace the webhook constant with your own deployed Apps Script Web App URL:
```js
const GOOGLE_SHEET_WEBHOOK_URL = "YOUR_DEPLOYED_APPS_SCRIPT_URL_HERE";
```

### Updating event details
All event metadata lives in one place at the top of `script.js`:
```js
const EVENT_DATE  = "OCTOBER 15, 2026";
const EVENT_TIME  = "05:30 PM IST";
const EVENT_VENUE = "MAIN AUDITORIUM, BU";
const EVENT_MODE  = "OFFLINE // IN-PERSON (CAMPUS)";
```

---

## ♿ Accessibility & Performance Notes

- Respects `prefers-reduced-motion` — all decorative animation, particles, and the cosmic collision effect switch off cleanly
- Pixel ratio capped and antialiasing disabled on mobile to protect frame rate on lower-end devices
- 3D scenes properly `dispose()` their geometry/materials/renderer to avoid memory leaks on repeated interaction
- Full keyboard support on the hero card roster (tab, arrow keys, Enter/Space, Escape)
- Animations pause when the browser tab is backgrounded, to save battery/CPU

---

## ⚖️ Legal & Attribution

**DOOMSDAY** is a non-commercial, educational fan-parody project created by student organizers for campus community engagement. Marvel characters, names, and likenesses referenced throughout are trademarks of **Marvel Characters, Inc.** and **The Walt Disney Company**. This project is not produced, sponsored, or endorsed by Marvel, Disney, or GeeksforGeeks corporate. No merchandise, ticketing, or commercial profit is associated with this site.

Third-party 3D models are used under Creative Commons Attribution (CC-BY 4.0) — full attributions are listed in-app via the **"Legal Disclaimer & 3D Model Credits"** link in the site footer.

---

<div align="center">

**Built by the GeeksforGeeks Student Chapter, Bennett University**
*for the next generation of builders and engineering leaders.*

</div>
