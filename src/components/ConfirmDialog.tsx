'use client'

interface Props {
  title: string
  message: string
  confirmLabel: string
  confirmColor?: string
  cancelLabel?: string
  icon?: React.ReactNode
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel,
  confirmColor = '#E74C3C',
  cancelLabel = 'CANCEL',
  icon,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.54)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 16,
      }}
      onClick={onCancel}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 340,
          width: '100%',
          padding: 28,
          background: '#1A1A1A',
          borderRadius: 20,
          border: '1px solid #252525',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        {icon && (
          <div style={{ marginBottom: 4 }}>
            {icon}
          </div>
        )}
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#F5F5F5', margin: 0, textAlign: 'center' }}>
          {title}
        </h2>
        <p style={{ fontSize: 14, color: '#888888', lineHeight: 1.4, margin: 0, textAlign: 'center' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: 12, width: '100%', marginTop: 4 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              height: 48,
              background: '#252525',
              border: 'none',
              borderRadius: 12,
              color: '#F5F5F5',
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 0.5,
              cursor: 'pointer',
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              height: 48,
              background: confirmColor,
              border: 'none',
              borderRadius: 12,
              color: '#F5F5F5',
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 0.5,
              cursor: 'pointer',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
