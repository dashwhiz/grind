import type { Workout } from './types'

export const PRESETS: Workout[] = [
  {
    name: 'Tabata',
    type: 'tabata',
    rounds: 8,
    prepareSeconds: 10,
    description: 'A Japanese high-intensity protocol: 20 seconds all-out effort, 10 seconds rest, repeated 8 times. Originally developed by Dr. Izumi Tabata for Olympic speed skaters. Takes just 4 minutes but pushes VO2max hard.',
    segments: [
      { type: 'work', durationSeconds: 20 },
      { type: 'rest', durationSeconds: 10 },
    ],
  },
  {
    name: 'HIIT 40/20',
    type: 'custom',
    rounds: 5,
    prepareSeconds: 10,
    description: 'A popular high-intensity interval format: 40 seconds of work followed by 20 seconds of rest. The 2:1 work-to-rest ratio keeps your heart rate elevated throughout. Great for bodyweight circuits or dumbbell work.',
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
    description: 'Developed by researchers at the University of Copenhagen. Each round has 3 descending intervals: 30s easy pace, 20s moderate, 10s all-out sprint, then 30s rest. Proven to improve fitness in less time than steady-state cardio.',
    segments: [
      { type: 'work', durationSeconds: 30 },
      { type: 'work', durationSeconds: 20 },
      { type: 'work', durationSeconds: 10 },
      { type: 'rest', durationSeconds: 30 },
    ],
  },
  {
    name: 'Boxing Rounds',
    type: 'custom',
    rounds: 3,
    prepareSeconds: 10,
    description: 'Standard boxing round structure: 3 minutes of work followed by 1 minute of rest. Used by boxers and kickboxers worldwide. Great for heavy bag work, shadow boxing, or any combat-style training.',
    segments: [
      { type: 'work', durationSeconds: 180 },
      { type: 'rest', durationSeconds: 60 },
    ],
  },
  {
    name: 'Pomodoro',
    type: 'custom',
    rounds: 1,
    prepareSeconds: 10,
    description: 'The famous focus technique invented by Francesco Cirillo: 25 minutes of deep work, then a 5-minute break. Not a workout — it\'s for studying, coding, writing, or any task that needs sustained concentration.',
    segments: [
      { type: 'work', durationSeconds: 1500 },
      { type: 'rest', durationSeconds: 300 },
    ],
  },
  {
    name: 'Stretch & Hold',
    type: 'custom',
    rounds: 6,
    prepareSeconds: 10,
    description: 'Hold each stretch for 45 seconds with 15 seconds to transition between positions. Ideal for post-workout cooldown, morning mobility, or yoga-style static stretching.',
    segments: [
      { type: 'work', durationSeconds: 45 },
      { type: 'rest', durationSeconds: 15 },
    ],
  },
  {
    name: '7-Minute Workout',
    type: 'custom',
    rounds: 12,
    prepareSeconds: 10,
    description: 'The viral scientific workout published in the American College of Sports Medicine journal. 12 exercises at 30 seconds each with 10-second transitions. Designed to hit every major muscle group with just bodyweight.',
    segments: [
      { type: 'work', durationSeconds: 30 },
      { type: 'rest', durationSeconds: 10 },
    ],
  },
  {
    name: 'Sprint Intervals',
    type: 'custom',
    rounds: 6,
    prepareSeconds: 10,
    description: 'Classic sprint training: 30 seconds of maximum effort followed by 90 seconds of recovery. The 1:3 work-to-rest ratio allows full recovery between sprints. Used in running, cycling, rowing, and swimming.',
    segments: [
      { type: 'work', durationSeconds: 30 },
      { type: 'rest', durationSeconds: 90 },
    ],
  },
  {
    name: 'Jump Rope',
    type: 'custom',
    rounds: 10,
    prepareSeconds: 10,
    description: 'A simple and effective cardio format: 1 minute jumping, 30 seconds rest. Mix up single unders, double unders, criss-cross, or high knees between rounds to keep it interesting.',
    segments: [
      { type: 'work', durationSeconds: 60 },
      { type: 'rest', durationSeconds: 30 },
    ],
  },
]
