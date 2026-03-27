# Fitness Timer - Complete Specification for Next.js Rewrite

## Why We're Switching from Flutter Web

### Bottlenecks Encountered

1. **Safari toolbar/bezel color**: Flutter renders everything into a `<canvas>` element. Safari determines toolbar color from the actual HTML/CSS background, not the canvas content. We had to add fixed-position invisible divs, `color-scheme: dark`, media-attributed theme-color meta tags, and dynamically update body/html background color via JS interop just to get the toolbar to match. It was fragile and hacky.

2. **Browser navigation completely broken**: Flutter's Navigator 1.0 does NOT support the browser forward button (officially documented). Safari's swipe-back gesture desyncs the route stack, breaking all subsequent navigation. We tried:
   - GetX routing (`GetMaterialApp` + `Get.toNamed`) — broke on Safari swipe-back
   - Flutter's built-in `MaterialApp` + `Navigator.pushNamed` — still broke
   - `go_router` with `MaterialApp.router` — best option but still has known open Flutter issues (#76478, #114324, #176819)

3. **No native scroll behavior**: Flutter's canvas doesn't participate in Safari's native scroll. Content can't scroll behind translucent toolbars like regular HTML pages (e.g. Google search results peek behind the Safari address bar). This is a fundamental Flutter web limitation.

4. **InkWell stuck state on mobile**: Flutter's `InkWell` widget gets stuck in highlighted state after navigating away and back on mobile Safari. Had to replace with manual `GestureDetector` + `MouseRegion` with `_pressed`/`_hovered` state tracking.

5. **Deprecated APIs**: `Color.value` deprecated, `withOpacity` deprecated in favor of `withValues(alpha:)`, frequent breaking changes in Flutter web APIs.

6. **Canvas rendering = no SEO, no native HTML behavior**: Everything is painted on a canvas. No DOM elements, no CSS, no native browser behaviors. Every HTML-native feature needs a workaround.

### Bottom Line
Flutter web is great for complex app-like interfaces but terrible for anything that needs to feel like a native web page in Safari. A fitness timer that's essentially 4 pages with simple animations is much better suited to Next.js + vanilla CSS.

---

## App Overview

**Name**: Interval Timer
**Purpose**: CrossFit & HIIT interval timer with configurable work/rest phases, presets, and custom workout builder
**Deployment**: GitHub Pages (static export)
**Storage**: localStorage for user-created workouts

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#0F0F0F` | Page background, Safari toolbar default |
| `surface` | `#1A1A1A` | Cards, input fields, containers |
| `surfaceLight` | `#252525` | Hover states, borders, disabled elements |
| `workColor` | `#FF6B35` | Work phase background, preset accent color |
| `restColor` | `#4ECDC4` | Rest phase background |
| `prepareColor` | `#FFE66D` | Prepare/get-ready phase background |
| `textPrimary` | `#F5F5F5` | Primary text |
| `textSecondary` | `#888888` | Labels, meta text, disabled text |
| `startGreen` | `#2ECC71` | Start button, save button, user workout accent, + button |
| `stopRed` | `#E74C3C` | Delete confirmation, quit confirmation |

### Phase Colors (Timer Screen)

- **WORK**: Background `#FF6B35` (orange), text `white`
- **REST**: Background `#4ECDC4` (teal), text `white`
- **GET READY**: Background `#FFE66D` (yellow), text `rgba(0,0,0,0.87)` (dark text on light bg)

---

## Typography

- **UI text**: Roboto (Google Fonts) — all headings, labels, buttons, body text
- **Timer countdown**: Orbitron (Google Fonts) — ONLY used for the big `MM:SS` display on the timer screen, weight 700
- **Monospace values**: Roboto Mono — used for duration displays in config screen (e.g. "1m 30s") and total time

---

## Pages / Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Preset grid + user workouts grid |
| `/config` | Config | Edit workout params before starting |
| `/timer` | Timer | Active countdown with phase colors |
| `/complete` | Complete | Workout finished celebration |

---

## Page 1: Home Screen (`/`)

### Layout
- No app bar / header bar
- Full dark background (`#0F0F0F`)
- Top padding from safe area + 48px

### Content (top to bottom)
1. **Header row**: "INTERVAL TIMER" (28px, weight 800, letter-spacing -0.5) on left, green `+` button (40x40, `#2ECC71`, rounded 12px, white plus icon 22px) on right
2. **Subtitle**: "Choose a workout or create your own" (14px, `#888888`)
3. **Section: "YOUR WORKOUTS"** (only if user has saved workouts)
   - Section label: 13px, weight 600, `#888888`, letter-spacing 0.5
   - Responsive grid of cards (see below)
   - Cards have **green** accent color (`#2ECC71`)
   - Each card has an X delete button
4. **Section: "PRESETS"**
   - Same section label style
   - Responsive grid of cards
   - Cards have **orange** accent color (`#FF6B35`)
   - No delete button

### Responsive Grid
- Width > 900px: 3 columns
- Width > 550px: 2 columns
- Width <= 550px: 1 column
- Gap: 10px
- Aspect ratio: 1 column = 3.5:1, multi-column = 2.4:1

### Preset Card Design
- Background: `#1A1A1A`, rounded 14px
- Hover/press: background `#252525`, border `accentColor` at 30% opacity
- Transition: 120ms
- Padding: 16px
- Top row: Workout name (16px, weight 600, white) + type badge (accent color pill: 10px text, weight 700, letter-spacing 0.5, bg at 12% opacity, rounded 6px)
- Bottom row: Timer icon + formatted total time + repeat icon + rounds count (all 12px, `#888888`)
- User workout cards also show X delete icon (16px, `#888888`) next to the badge
- Cursor: pointer on hover

### Delete Flow
- Tap X → confirmation dialog: "Delete Workout?" / '"WorkoutName" will be removed from your saved workouts.' / DELETE (red) + KEEP buttons

### Navigation
- Tap preset card → `/config` with workout data
- Tap user card → `/config` with workout data + edit index
- Tap + button → `/config` with no data (new custom)

---

## Page 2: Config Screen (`/config`)

### Three Modes

**Mode A: New Custom** (no data passed)
- Name field shown, editable, defaults to "My Workout"
- Checkbox: "Save to my workouts" (default checked)
- Buttons: SAVE ONLY (outlined, green, disabled if checkbox unchecked) + START (green filled)

**Mode B: Editing User Workout** (workout + editIndex passed)
- Name field shown, editable, pre-filled
- Buttons: UPDATE (outlined, green, disabled until changes detected) + START (green filled)
- Changes detected = any of: name, workSeconds, restSeconds, rounds, prepareSeconds differ from original

**Mode C: Built-in Preset** (workout passed, no editIndex)
- Name shown as text (not editable), pre-filled
- Button: START only (full-width green)

### Layout
- Centered, max-width 500px
- Scrollable list
- Top padding: safe area + 48px
- No app bar, browser back button works

### Fields (top to bottom)
1. **Workout name** (only modes A & B): Label "WORKOUT NAME" (12px, `#888888`, weight 500, letter-spacing 0.5) → text input (20px, weight 700, white text, `#1A1A1A` background, rounded 12px)
2. **WORK INTERVAL**: Duration picker, step 5s, min 5s, max 600s (10m)
3. **REST INTERVAL**: Duration picker, step 5s, min 0s, max 300s (5m)
4. **ROUNDS**: Integer picker, min 1, max 100
5. **PREPARE TIME**: Duration picker, step 5s, min 0s, max 30s
6. **Total time display**: Container `#1A1A1A`, rounded 12px, padding 16px, centered row: timer icon + "Total: Xm Xs" in Roboto Mono (16px, weight 600)
7. **Checkbox** (mode A only): "Save to my workouts"
8. **Buttons** (varies by mode)

### Duration Picker Component
- Label on top (same style as section labels)
- Container: `#1A1A1A`, rounded 12px, padding h8 v4
- Row: [-] button | value display (72px wide, Roboto Mono 16px weight 600) | [+] button
- Buttons disabled when at min/max, disabled color: `#888888` at 30% opacity
- Format: `5s`, `1m`, `1m 30s`

### Rounds Picker
- Same style as duration picker but shows integer, step 1

### Duplicate Name Handling
When saving, if name already exists in user workouts, auto-append number: "My Workout" → "My Workout 2" → "My Workout 3"

### Button Styles
- **START / elevated**: Green `#2ECC71` background, white text, 15-18px weight 700, letter-spacing 0.5-2, rounded 16px, height 56px
- **SAVE ONLY / UPDATE / outlined**: Green `#2ECC71` border 1.5px, green text, same size. Disabled: `#252525` border, `#888888` at 30% text
- When in split layout (two buttons), padding horizontal 16px to prevent text clipping on small screens

---

## Page 3: Timer Screen (`/timer`)

### Overview
Full-screen, no chrome. Background color = current phase color. Animated transitions (500ms ease-in-out) between phases.

### Timer State Machine
```
idle → running (tap play)
running → paused (tap pause)
paused → running (tap play)
running → finished (last segment timer reaches 0)
any → idle (tap reset)
```

### Segment Sequence (Pre-computed)
Flatten the workout into a single array:
```
[prepare (if > 0), ...segments × rounds]
Example: 10s prepare + 2 rounds of (20s work, 10s rest)
→ [prepare:10, work:20, rest:10, work:20, rest:10]
```

### Round Tracking
```
if (hasPrepare) adjustedIndex = currentSegmentIndex - 1
else adjustedIndex = currentSegmentIndex
if (adjustedIndex < 0) round = 0 (still in prepare)
else round = floor(adjustedIndex / segmentsPerRound) + 1
```

### Layout (top to bottom)
1. **Phase label**: "WORK" / "REST" / "GET READY" (20px, weight 700, text color at 70% opacity, letter-spacing 4)
2. **Round counter** (only if round > 0): "Round X / Y" (16px, weight 500, text color at 60% opacity)
3. **Timer display** (centered, fills remaining space): `MM:SS` in Orbitron 200px (scales down via CSS to fit), with text shadow (black 20% opacity, blur 20, offset 0,4)
4. **Controls** (bottom, padding-bottom: safe area + 48px): Reset | Play/Pause | Stop

### Timer Controls
Three circular buttons in a row, spacing 32px between each:
- **Reset** (left): Replay icon, 56×56, icon 28px
- **Play/Pause** (center): Play or Pause icon based on state, 72×72, icon 40px
- **Stop** (right): X icon, 56×56, icon 28px

Button style: Circle, background = text color at 15% opacity, icon color = text color. When disabled (play button in finished state): icon at 30% opacity. Cursor: pointer when enabled, default when disabled.

### Audio Cues
All synthesized via Web Audio API (oscillator + gain node):

| Event | Frequency | Duration | Type | Delay |
|-------|-----------|----------|------|-------|
| Countdown tick (10-4 seconds left) | 800 Hz | 80ms | sine | 0 |
| Countdown tick (3-1 seconds left) | 1200 Hz | 100ms | sine | 0 |
| Phase transition | 1000 Hz | 200ms | square | 0 |
| Workout complete — note 1 | 523 Hz | 150ms | sine | 0ms |
| Workout complete — note 2 | 659 Hz | 150ms | sine | 180ms |
| Workout complete — note 3 | 784 Hz | 300ms | sine | 360ms |

Audio gain: starts at 0.3, exponential ramp to 0.001 over duration.

**Important**: AudioContext must be created on a user gesture (tap START button) to satisfy browser autoplay policy. Call `initAudio()` when user taps START on the config screen.

### Dynamic Safari Toolbar Color
When phase changes, update the `theme-color` meta tag AND the html/body background AND the fixed Safari anchor divs to match the phase color. On timer close, reset to `#0F0F0F`.

### Keyboard Shortcuts (Desktop)
- **Space**: Toggle play/pause
- **R**: Reset timer
- **Escape**: Quit (shows confirmation if running)

### Quit Confirmation
If timer is running or paused, show dialog: "Quit Workout?" / "Your progress will be lost." / QUIT (red) + KEEP GOING. If user cancels, resume timer. If user confirms, navigate to home `/`.

### Auto-Complete
When last segment reaches 0:
1. Set state to finished
2. Play complete melody
3. Wait 2 seconds
4. Navigate to `/complete` with workoutName and totalElapsedSeconds

---

## Page 4: Complete Screen (`/complete`)

### Layout (centered vertically and horizontally)
1. **Checkmark icon**: Green circle (100×100, `#2ECC71` at 15% opacity bg), checkmark icon 56px in `#2ECC71`
2. **Title**: "WORKOUT\nCOMPLETE" (32px, weight 800, white, line-height 1.2, letter-spacing -0.5, centered)
3. **Workout name**: (16px, `#888888`, weight 500)
4. **Total time**: `MM:SS` in Roboto Mono (48px, weight 700, `#FF6B35` orange)
5. **DONE button**: 200×56, green elevated button, navigates to `/`

---

## Confirmation Dialog (Reusable)

### Design
- Backdrop: black 54% opacity
- Container: max-width 340px, padding 28px, background `#1A1A1A`, rounded 20px, border `#252525` 1px
- Optional icon at top: 56×56 circle, icon color bg at 12% opacity
- Title: 18px, weight 700, white, centered
- Message: 14px, `#888888`, line-height 1.4, centered
- Two buttons in a row, gap 12px, height 48px each:
  - Cancel: `#252525` bg, white text, weight 600, 14px, letter-spacing 0.5, rounded 12px
  - Confirm: colored bg (red for destructive), white text, same style

Used for:
1. Quit workout: icon exit_to_app, confirm red
2. Delete workout: icon delete_outline, confirm red

---

## Data Models

### Workout
```typescript
interface Workout {
  name: string
  type: 'tabata' | 'emom' | 'amrap' | 'forTime' | 'custom'
  segments: IntervalSegment[]
  rounds: number
  prepareSeconds: number // default 10
}
```

### IntervalSegment
```typescript
interface IntervalSegment {
  type: 'work' | 'rest' | 'prepare'
  durationSeconds: number
}
```

### Segment Type Properties
```typescript
const SEGMENT_CONFIG = {
  work:    { label: 'WORK',      color: '#FF6B35', textColor: '#FFFFFF' },
  rest:    { label: 'REST',      color: '#4ECDC4', textColor: '#FFFFFF' },
  prepare: { label: 'GET READY', color: '#FFE66D', textColor: 'rgba(0,0,0,0.87)' },
}
```

### Workout Type Labels
```typescript
const TYPE_LABELS = {
  tabata:  'TABATA',
  emom:    'EMOM',
  amrap:   'AMRAP',
  forTime: 'FOR TIME',
  custom:  'CUSTOM',
}
```

---

## Built-in Presets

```typescript
const PRESETS: Workout[] = [
  {
    name: 'Tabata Classic',
    type: 'tabata',
    rounds: 8,
    prepareSeconds: 10,
    segments: [
      { type: 'work', durationSeconds: 20 },
      { type: 'rest', durationSeconds: 10 },
    ],
  },
  {
    name: 'EMOM 10',
    type: 'emom',
    rounds: 10,
    prepareSeconds: 10,
    segments: [
      { type: 'work', durationSeconds: 60 },
    ],
  },
  {
    name: 'Quick HIIT',
    type: 'custom',
    rounds: 5,
    prepareSeconds: 10,
    segments: [
      { type: 'work', durationSeconds: 40 },
      { type: 'rest', durationSeconds: 20 },
    ],
  },
  {
    name: '30-20-10',
    type: 'custom',
    rounds: 3,
    prepareSeconds: 10,
    segments: [
      { type: 'work', durationSeconds: 30 },
      { type: 'work', durationSeconds: 20 },
      { type: 'work', durationSeconds: 10 },
      { type: 'rest', durationSeconds: 30 },
    ],
  },
  {
    name: 'Tabata Extended',
    type: 'tabata',
    rounds: 12,
    prepareSeconds: 10,
    segments: [
      { type: 'work', durationSeconds: 20 },
      { type: 'rest', durationSeconds: 10 },
    ],
  },
  {
    name: 'AMRAP 12',
    type: 'amrap',
    rounds: 1,
    prepareSeconds: 10,
    segments: [
      { type: 'work', durationSeconds: 720 },
    ],
  },
]
```

---

## localStorage Persistence

### Key
`user_workouts`

### Value
JSON array of Workout objects:
```json
[
  {
    "name": "My Workout",
    "type": "custom",
    "segments": [
      { "type": "work", "durationSeconds": 30 },
      { "type": "rest", "durationSeconds": 15 }
    ],
    "rounds": 6,
    "prepareSeconds": 10
  }
]
```

### Operations
- **Add**: Push to array. If name exists, auto-append number ("My Workout 2", "My Workout 3", etc.)
- **Remove**: Splice by index
- **Update**: Replace at index
- **Load**: Parse JSON on app start, recover gracefully if corrupted (start fresh)

---

## Web Audio API — Audio Service

### Setup
```javascript
let audioCtx

function initAudio() {
  if (audioCtx) return
  audioCtx = new (window.AudioContext || window.webkitAudioContext)()
}
```

### Tone Generator
```javascript
function playTone(freq, ms, type, delay) {
  if (!audioCtx) return
  const t = audioCtx.currentTime + (delay || 0) / 1000
  const o = audioCtx.createOscillator()
  const g = audioCtx.createGain()
  o.type = type || 'sine'
  o.frequency.value = freq
  g.gain.setValueAtTime(0.3, t)
  g.gain.exponentialRampToValueAtTime(0.001, t + ms / 1000)
  o.connect(g)
  g.connect(audioCtx.destination)
  o.start(t)
  o.stop(t + ms / 1000 + 0.05)
}
```

### Call `initAudio()` on the START button tap (user gesture required for AudioContext).

---

## Safari Toolbar Color (theme-color)

### HTML Head
```html
<meta name="theme-color" content="#0F0F0F" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0F0F0F" media="(prefers-color-scheme: dark)">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```

### CSS
```css
:root {
  color-scheme: dark;
  background-color: #0F0F0F;
}
html, body {
  background-color: #0F0F0F;
  margin: 0;
  padding: 0;
  min-height: 100%;
}
```

### Fixed Anchor Divs (Safari samples these for toolbar tinting)
```html
<div id="safari-top" style="position:fixed;top:0;left:0;right:0;height:1px;background:#0F0F0F;z-index:999999;pointer-events:none"></div>
<div id="safari-bottom" style="position:fixed;bottom:0;left:0;right:0;height:1px;background:#0F0F0F;z-index:999999;pointer-events:none"></div>
```

### Dynamic Update (call when timer phase changes)
```javascript
function setThemeColor(hex) {
  document.querySelectorAll('meta[name="theme-color"]').forEach(m => {
    m.setAttribute('content', hex)
  })
  document.documentElement.style.backgroundColor = hex
  document.body.style.backgroundColor = hex
  document.getElementById('safari-top').style.backgroundColor = hex
  document.getElementById('safari-bottom').style.backgroundColor = hex
}
```

---

## PWA Manifest

```json
{
  "name": "Interval Timer",
  "short_name": "Timer",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#0F0F0F",
  "theme_color": "#0F0F0F",
  "description": "CrossFit & HIIT Interval Timer",
  "orientation": "any",
  "prefer_related_applications": false,
  "icons": [
    { "src": "icons/Icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icons/Icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "icons/Icon-maskable-192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "icons/Icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

---

## Utility Functions

### Format Duration (for display)
```typescript
function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return `${s}s`
  if (s === 0) return `${m}m`
  return `${m}m ${s}s`
}
```

### Format Time (MM:SS for timer and complete screen)
```typescript
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
```

### Compute Total Seconds
```typescript
function totalSeconds(workout: Workout): number {
  const segmentTotal = workout.segments.reduce((sum, s) => sum + s.durationSeconds, 0)
  return workout.prepareSeconds + (segmentTotal * workout.rounds)
}
```

### Build Full Sequence
```typescript
function fullSequence(workout: Workout): IntervalSegment[] {
  const seq: IntervalSegment[] = []
  if (workout.prepareSeconds > 0) {
    seq.push({ type: 'prepare', durationSeconds: workout.prepareSeconds })
  }
  for (let r = 0; r < workout.rounds; r++) {
    seq.push(...workout.segments)
  }
  return seq
}
```

---

## Edge Cases to Handle

- **Pause during countdown beeps**: Timer stops, beeps resume naturally on play
- **Reset mid-workout**: Cancel interval, reset all state to segment 0
- **Browser tab hidden**: setInterval throttles in background tabs — acceptable for a fitness timer
- **Audio autoplay**: AudioContext MUST be created on user gesture (START tap)
- **Navigate back mid-workout**: Show confirmation dialog, pause timer while dialog shows
- **Rapid play/pause**: Clear interval before creating new one
- **Zero-duration segments**: Config enforces minimums (work >= 5s, rest >= 0s, rounds >= 1)
- **Duplicate workout names**: Auto-append incrementing number

---

## Recommended Next.js Architecture

```
app/
├── layout.tsx           (root layout, dark theme, fonts, meta tags)
├── page.tsx             (home — preset grid + user workouts)
├── config/
│   └── page.tsx         (config screen)
├── timer/
│   └── page.tsx         (timer screen)
├── complete/
│   └── page.tsx         (completion screen)
├── globals.css          (color variables, dark theme, Safari fixes)
├── components/
│   ├── PresetCard.tsx
│   ├── DurationPicker.tsx
│   ├── RoundsPicker.tsx
│   ├── TimerDisplay.tsx
│   ├── TimerControls.tsx
│   └── ConfirmDialog.tsx
├── lib/
│   ├── types.ts         (Workout, IntervalSegment, SegmentType interfaces)
│   ├── presets.ts       (built-in workout presets)
│   ├── storage.ts       (localStorage CRUD)
│   ├── audio.ts         (Web Audio API service)
│   ├── theme-color.ts   (Safari toolbar color management)
│   └── utils.ts         (formatTime, formatDuration, fullSequence, totalSeconds)
└── hooks/
    └── useTimer.ts      (timer state machine hook)
```

### Key Advantages Over Flutter Web
- Native browser routing — back/forward/swipe just works
- Native scroll — content flows behind Safari bars naturally
- Real DOM — Safari reads background colors directly, no hacks needed
- CSS animations — smooth phase color transitions natively
- Lighthouse/SEO friendly
- Smaller bundle, faster load
- Full PWA support with native install prompts

### State Management
- `useReducer` or `useState` for timer state machine
- `localStorage` + `useSyncExternalStore` for persisted workouts
- URL search params or route state for passing workout data between pages
- Context for audio service (initialized on user gesture)

### Fonts
- Google Fonts: `Roboto` (400, 500, 600, 700, 800) + `Orbitron` (700) + `Roboto Mono` (600)
- Next.js `next/font/google` for optimized loading

---

## GitHub Pages Deployment

For Next.js static export to GitHub Pages:
```javascript
// next.config.js
const nextConfig = {
  output: 'export',
  basePath: '/fitness-timer',
  assetPrefix: '/fitness-timer/',
  images: { unoptimized: true },
}
```

Build: `next build` generates `out/` folder, deploy to `gh-pages` branch.
