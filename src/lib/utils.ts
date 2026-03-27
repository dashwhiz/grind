import type { Workout, IntervalSegment } from './types'

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return `${s}s`
  if (s === 0) return `${m}m`
  return `${m}m ${s}s`
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function totalSeconds(workout: Workout): number {
  const segmentTotal = workout.segments.reduce((sum, s) => sum + s.durationSeconds, 0)
  return workout.prepareSeconds + segmentTotal * workout.rounds
}

export function fullSequence(workout: Workout): IntervalSegment[] {
  const seq: IntervalSegment[] = []
  if (workout.prepareSeconds > 0) {
    seq.push({ type: 'prepare', durationSeconds: workout.prepareSeconds })
  }
  for (let r = 0; r < workout.rounds; r++) {
    seq.push(...workout.segments)
  }
  return seq
}

export function encodeWorkout(workout: Workout): string {
  return encodeURIComponent(JSON.stringify(workout))
}

export function decodeWorkout(param: string): Workout | null {
  try {
    return JSON.parse(decodeURIComponent(param)) as Workout
  } catch {
    return null
  }
}
