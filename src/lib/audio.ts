let audioCtx: AudioContext | null = null

export function initAudio(): void {
  if (audioCtx) return
  audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
}

export function playTone(freq: number, ms: number, type: OscillatorType, delayMs: number): void {
  if (!audioCtx) return
  const t = audioCtx.currentTime + delayMs / 1000
  const o = audioCtx.createOscillator()
  const g = audioCtx.createGain()
  o.type = type
  o.frequency.value = freq
  g.gain.setValueAtTime(0.3, t)
  g.gain.exponentialRampToValueAtTime(0.001, t + ms / 1000)
  o.connect(g)
  g.connect(audioCtx.destination)
  o.start(t)
  o.stop(t + ms / 1000 + 0.05)
}

export function playCountdownTick(secondsLeft: number): void {
  if (secondsLeft >= 4 && secondsLeft <= 10) {
    playTone(800, 80, 'sine', 0)
  } else if (secondsLeft >= 1 && secondsLeft <= 3) {
    playTone(1200, 100, 'sine', 0)
  }
}

export function playTransition(): void {
  playTone(1000, 200, 'square', 0)
}

export function playCompleteMelody(): void {
  playTone(523, 150, 'sine', 0)
  playTone(659, 150, 'sine', 180)
  playTone(784, 300, 'sine', 360)
}
