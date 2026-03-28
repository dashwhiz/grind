'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ConfigClient from './ConfigClient'

function ConfigWithKey() {
  const searchParams = useSearchParams()
  const key = searchParams.toString() || 'new'
  return <ConfigClient key={key} />
}

export default function ConfigPage() {
  return (
    <Suspense fallback={<div style={{ background: '#0d1117', minHeight: '100vh' }} />}>
      <ConfigWithKey />
    </Suspense>
  )
}
