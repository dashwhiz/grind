import { Suspense } from 'react'
import TimerClient from './TimerClient'

export default function TimerPage() {
  return (
    <Suspense fallback={<div style={{ background: '#0d1117', minHeight: '100vh' }} />}>
      <TimerClient />
    </Suspense>
  )
}
