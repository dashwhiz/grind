import { Suspense } from 'react'
import ConfigClient from './ConfigClient'

export default function ConfigPage() {
  return (
    <Suspense fallback={<div style={{ background: '#0F0F0F', minHeight: '100vh' }} />}>
      <ConfigClient />
    </Suspense>
  )
}
