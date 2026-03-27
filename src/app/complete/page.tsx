import { Suspense } from 'react'
import CompleteClient from './CompleteClient'

export default function CompletePage() {
  return (
    <Suspense fallback={<div style={{ background: '#0F0F0F', minHeight: '100vh' }} />}>
      <CompleteClient />
    </Suspense>
  )
}
