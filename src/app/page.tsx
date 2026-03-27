'use client'

import { useState, useSyncExternalStore } from 'react'
import { useRouter } from 'next/navigation'
import PresetCard from '@/components/PresetCard'
import ConfirmDialog from '@/components/ConfirmDialog'
import { PRESETS } from '@/lib/presets'
import { deleteWorkout, getWorkoutsSnapshot, getWorkoutsServerSnapshot, subscribeWorkouts } from '@/lib/storage'
import { encodeWorkout } from '@/lib/utils'
import type { Workout } from '@/lib/types'

function DeleteIcon() {
  return (
    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(231,76,60,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="#E74C3C">
        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
      </svg>
    </div>
  )
}

export default function HomePage() {
  const router = useRouter()
  const userWorkouts = useSyncExternalStore(subscribeWorkouts, getWorkoutsSnapshot, getWorkoutsServerSnapshot)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

  function goToConfig(workout?: Workout, editIndex?: number) {
    if (workout) {
      let url = `/config?w=${encodeWorkout(workout)}`
      if (editIndex !== undefined) url += `&editIndex=${editIndex}`
      router.push(url)
    } else {
      router.push('/config')
    }
  }

  function handleDeleteConfirm() {
    if (deleteTarget === null) return
    deleteWorkout(deleteTarget)
    setDeleteTarget(null)
  }

  const deleteTargetWorkout = deleteTarget !== null ? userWorkouts[deleteTarget] : null

  return (
    <div className="full-screen safe-bottom" style={{ background: '#0F0F0F', padding: '0 16px 48px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', paddingTop: 64 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5, color: '#F5F5F5', margin: 0 }}>
            INTERVAL TIMER
          </h1>
          <button
            onClick={() => goToConfig()}
            style={{
              width: 40,
              height: 40,
              background: '#2ECC71',
              border: 'none',
              borderRadius: 12,
              color: '#fff',
              fontSize: 22,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            aria-label="New workout"
          >
            +
          </button>
        </div>
        <p style={{ fontSize: 14, color: '#888888', margin: '0 0 32px' }}>
          Choose a workout or create your own
        </p>

        {/* User workouts */}
        {userWorkouts.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#888888', letterSpacing: 0.5, marginBottom: 12 }}>
              YOUR WORKOUTS
            </div>
            <WorkoutGrid>
              {userWorkouts.map((w, i) => (
                <PresetCard
                  key={i}
                  workout={w}
                  accentColor="#2ECC71"
                  showDelete
                  onPress={() => goToConfig(w, i)}
                  onDelete={() => setDeleteTarget(i)}
                />
              ))}
            </WorkoutGrid>
          </section>
        )}

        {/* Presets */}
        <section>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#888888', letterSpacing: 0.5, marginBottom: 12 }}>
            PRESETS
          </div>
          <WorkoutGrid>
            {PRESETS.map((w, i) => (
              <PresetCard
                key={i}
                workout={w}
                accentColor="#FF6B35"
                onPress={() => goToConfig(w)}
              />
            ))}
          </WorkoutGrid>
        </section>
      </div>

      {/* Delete confirmation */}
      {deleteTarget !== null && deleteTargetWorkout && (
        <ConfirmDialog
          title="Delete Workout?"
          message={`"${deleteTargetWorkout.name}" will be removed from your saved workouts.`}
          confirmLabel="DELETE"
          confirmColor="#E74C3C"
          cancelLabel="KEEP"
          icon={<DeleteIcon />}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

function WorkoutGrid({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 10,
    }}>
      {children}
    </div>
  )
}
