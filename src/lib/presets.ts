import type { Workout } from './types'

export const PRESETS: Workout[] = [
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
