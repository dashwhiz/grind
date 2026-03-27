import { Suspense } from 'react'
import TimerClient from './TimerClient'

export default function TimerPage() {
  return (
    <Suspense fallback={<div style={{ background: '#0F0F0F', minHeight: '100vh' }} />}>
      <TimerClient />
    </Suspense>
  )
}
