export interface IntervalSegment {
  type: 'work' | 'rest' | 'prepare'
  durationSeconds: number
  label?: string
}

export interface Workout {
  name: string
  type: 'tabata' | 'emom' | 'amrap' | 'forTime' | 'custom'
  segments: IntervalSegment[]
  rounds: number
  prepareSeconds: number
  description?: string
}

export const SEGMENT_CONFIG = {
  work:    { label: 'WORK',      color: '#27AE60', textColor: '#FFFFFF' },
  rest:    { label: 'REST',      color: '#5B9BD5', textColor: '#FFFFFF' },
  prepare: { label: 'GET READY', color: '#F0AD4E', textColor: '#000000' },
} as const

export const TYPE_LABELS: Record<Workout['type'], string> = {
  tabata:  'TABATA',
  emom:    'EMOM',
  amrap:   'AMRAP',
  forTime: 'FOR TIME',
  custom:  'CUSTOM',
}
