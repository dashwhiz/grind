'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import DurationPicker from '@/components/DurationPicker'
import RoundsPicker from '@/components/RoundsPicker'
import { decodeWorkout, encodeWorkout, totalSeconds, formatDuration } from '@/lib/utils'
import { addWorkout, updateWorkout } from '@/lib/storage'
import { initAudio } from '@/lib/audio'
import type { Workout } from '@/lib/types'

function TimerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#888888">
      <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
    </svg>
  )
}

function deriveSimpleParams(workout: Workout) {
  const workSeg = workout.segments.find(s => s.type === 'work')
  const restSeg = workout.segments.find(s => s.type === 'rest')
  return {
    workSeconds: workSeg?.durationSeconds ?? 30,
    restSeconds: restSeg?.durationSeconds ?? 0,
  }
}

function buildWorkout(name: string, type: Workout['type'], workSeconds: number, restSeconds: number, rounds: number, prepareSeconds: number): Workout {
  const segments: Workout['segments'] = [{ type: 'work', durationSeconds: workSeconds }]
  if (restSeconds > 0) segments.push({ type: 'rest', durationSeconds: restSeconds })
  return { name, type, segments, rounds, prepareSeconds }
}

export default function ConfigClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const wParam = searchParams.get('w')
  const editIndexParam = searchParams.get('editIndex')

  const passedWorkout = wParam ? decodeWorkout(wParam) : null
  const editIndex = editIndexParam !== null ? parseInt(editIndexParam) : null

  const mode: 'new' | 'edit' | 'preset' = !passedWorkout ? 'new' : editIndex !== null ? 'edit' : 'preset'

  const derived = passedWorkout ? deriveSimpleParams(passedWorkout) : { workSeconds: 30, restSeconds: 15 }

  const [name, setName] = useState(passedWorkout?.name ?? 'My Workout')
  const [workSeconds, setWorkSeconds] = useState(derived.workSeconds)
  const [restSeconds, setRestSeconds] = useState(derived.restSeconds)
  const [rounds, setRounds] = useState(passedWorkout?.rounds ?? 3)
  const [prepareSeconds, setPrepareSeconds] = useState(passedWorkout?.prepareSeconds ?? 10)
  const [saveChecked, setSaveChecked] = useState(true)

  // For Mode B: detect changes from original
  const origName = passedWorkout?.name ?? ''
  const origWork = derived.workSeconds
  const origRest = derived.restSeconds
  const origRounds = passedWorkout?.rounds ?? 3
  const origPrepare = passedWorkout?.prepareSeconds ?? 10

  const hasChanges =
    name !== origName ||
    workSeconds !== origWork ||
    restSeconds !== origRest ||
    rounds !== origRounds ||
    prepareSeconds !== origPrepare

  const workoutType = passedWorkout?.type ?? 'custom'

  const total = totalSeconds(buildWorkout(name, workoutType, workSeconds, restSeconds, rounds, prepareSeconds))

  function handleStart() {
    initAudio()
    const workout = buildWorkout(name, workoutType, workSeconds, restSeconds, rounds, prepareSeconds)

    if (mode === 'new' && saveChecked) {
      addWorkout(workout)
    } else if (mode === 'edit') {
      // Save happens via UPDATE button; START just starts without re-saving unless changed
    }

    router.push(`/timer?w=${encodeWorkout(workout)}`)
  }

  function handleSaveOnly() {
    const workout = buildWorkout(name, workoutType, workSeconds, restSeconds, rounds, prepareSeconds)
    addWorkout(workout)
    router.push('/')
  }

  function handleUpdate() {
    if (editIndex === null) return
    const workout = buildWorkout(name, workoutType, workSeconds, restSeconds, rounds, prepareSeconds)
    updateWorkout(editIndex, workout)
    router.back()
  }

  const outlinedBtnStyle = (disabled: boolean): React.CSSProperties => ({
    flex: 1,
    height: 56,
    background: 'transparent',
    border: `1.5px solid ${disabled ? '#252525' : '#2ECC71'}`,
    borderRadius: 16,
    color: disabled ? 'rgba(136,136,136,0.3)' : '#2ECC71',
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: 1,
    cursor: disabled ? 'default' : 'pointer',
    paddingLeft: 16,
    paddingRight: 16,
    transition: 'border-color 120ms, color 120ms',
  })

  const filledBtnStyle: React.CSSProperties = {
    flex: 1,
    height: 56,
    background: '#2ECC71',
    border: 'none',
    borderRadius: 16,
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: 2,
    cursor: 'pointer',
    paddingLeft: 16,
    paddingRight: 16,
  }

  return (
    <div className="full-screen safe-bottom" style={{ background: '#0F0F0F', padding: '0 16px 48px' }}>
      <div style={{ maxWidth: 500, margin: '0 auto', paddingTop: 64 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Workout name */}
          {mode !== 'preset' && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#888888', letterSpacing: 0.5, marginBottom: 8 }}>
                WORKOUT NAME
              </div>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                style={{
                  width: '100%',
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#F5F5F5',
                  background: '#1A1A1A',
                  border: 'none',
                  borderRadius: 12,
                  padding: '12px 16px',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          )}

          {mode === 'preset' && (
            <div style={{ fontSize: 20, fontWeight: 700, color: '#F5F5F5' }}>
              {name}
            </div>
          )}

          <DurationPicker
            label="WORK INTERVAL"
            value={workSeconds}
            step={5}
            min={5}
            max={600}
            onChange={setWorkSeconds}
          />

          <DurationPicker
            label="REST INTERVAL"
            value={restSeconds}
            step={5}
            min={0}
            max={300}
            onChange={setRestSeconds}
          />

          <RoundsPicker value={rounds} onChange={setRounds} />

          <DurationPicker
            label="PREPARE TIME"
            value={prepareSeconds}
            step={5}
            min={0}
            max={30}
            onChange={setPrepareSeconds}
          />

          {/* Total time */}
          <div style={{
            background: '#1A1A1A',
            borderRadius: 12,
            padding: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
            <TimerIcon />
            <span style={{
              fontFamily: 'var(--font-roboto-mono)',
              fontSize: 16,
              fontWeight: 600,
              color: '#F5F5F5',
            }}>
              Total: {formatDuration(total)}
            </span>
          </div>

          {/* Save checkbox (Mode A only) */}
          {mode === 'new' && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
              <div
                onClick={() => setSaveChecked(v => !v)}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  border: `2px solid ${saveChecked ? '#2ECC71' : '#444'}`,
                  background: saveChecked ? '#2ECC71' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'background 120ms, border-color 120ms',
                }}
              >
                {saveChecked && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#0F0F0F">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                )}
              </div>
              <span style={{ fontSize: 14, color: '#F5F5F5' }}>Save to my workouts</span>
            </label>
          )}

          {/* Buttons */}
          {mode === 'new' && (
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={outlinedBtnStyle(!saveChecked)} disabled={!saveChecked} onClick={handleSaveOnly}>
                SAVE ONLY
              </button>
              <button style={filledBtnStyle} onClick={handleStart}>
                START
              </button>
            </div>
          )}

          {mode === 'edit' && (
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={outlinedBtnStyle(!hasChanges)} disabled={!hasChanges} onClick={handleUpdate}>
                UPDATE
              </button>
              <button style={filledBtnStyle} onClick={handleStart}>
                START
              </button>
            </div>
          )}

          {mode === 'preset' && (
            <button style={{ ...filledBtnStyle, flex: 'unset', width: '100%' }} onClick={handleStart}>
              START
            </button>
          )}

        </div>
      </div>
    </div>
  )
}
