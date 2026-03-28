# Grind — Interval Timer

A customizable interval timer for workouts, focus, and more. Built with Next.js, designed for mobile.

**Live:** [dashwhiz.github.io/grind](https://dashwhiz.github.io/grind)

## Features

- **9 built-in presets** — Tabata, HIIT 40/20, 30-20-10, Boxing Rounds, Pomodoro, Stretch & Hold, 7-Minute Workout, Sprint Intervals, Jump Rope
- **Custom workouts** — add multiple work/rest intervals with different durations, optional labels, configurable rounds
- **Multi-segment support** — compose workouts like Rowing 3min → Bicep Curls 1min → Rest 30s, all repeating N rounds
- **Share workouts** — share via link (native share sheet on mobile, clipboard on desktop)
- **Full-screen timer** — phase colors (orange/teal/yellow), big countdown, "next up" preview, pulse on last 3s
- **Audio & haptics** — countdown ticks, phase transition sounds, completion melody, vibrate on transitions
- **Screen wake lock** — screen stays on during active workout
- **Safari-optimized** — toolbar tinting, `100dvh`, safe area insets, bfcache handling
- **PWA** — installable on home screen, works offline
- **Privacy-first** — no tracking, no cookies, no accounts, all data stays in your browser

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — your workouts + collapsible presets |
| `/config` | Configure workout — segments, rounds, labels |
| `/config?edit=0` | Edit saved workout |
| `/config?preset=0` | Customize a preset |
| `/config?share=...` | Open a shared workout |
| `/timer` | Full-screen active countdown |
| `/complete` | Workout finished screen |
| `/legal` | Impressum & Privacy Policy |

## Tech

- Next.js 16 (App Router, static export)
- React 19 (`useSyncExternalStore` for localStorage reactivity)
- Web Audio API for sounds
- Wake Lock API for screen
- Web Share API for sharing
- GitHub Pages deployment via Actions

## Dev

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build & Deploy

Deployed to GitHub Pages via Actions on every push to `main`.

```bash
npm run build   # produces out/
```

The `basePath` (`/grind`) is only applied in production — dev runs at the root.
