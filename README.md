# Interval Timer

A CrossFit & HIIT interval timer built with Next.js. Clean, fast, and works great on mobile Safari.

## Features

- **6 built-in presets** — Tabata Classic, EMOM 10, Quick HIIT, 30-20-10, Tabata Extended, AMRAP 12
- **Custom workouts** — configure work/rest intervals, rounds, and prepare time, save to your list
- **Full-screen timer** — phase colors (orange/teal/yellow), Orbitron countdown, smooth transitions
- **Audio cues** — countdown ticks, phase transitions, completion melody via Web Audio API
- **Safari-native** — proper toolbar tinting, `100dvh`, safe area insets, swipe-back navigation
- **PWA** — installable on iPhone home screen

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — preset grid + your saved workouts |
| `/config` | Configure a workout before starting |
| `/timer` | Full-screen active countdown |
| `/complete` | Workout finished screen |

## Dev

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build & Deploy

Deployed to GitHub Pages via the Actions workflow on every push to `main`.

```bash
npm run build   # produces out/
```

The `basePath` (`/interval-timer`) is only applied in production — dev runs at the root.
