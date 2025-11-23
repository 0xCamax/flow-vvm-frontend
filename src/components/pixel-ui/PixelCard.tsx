import React from 'react'

interface PixelCardProps {
  children: React.ReactNode
  title?: string
  style?: React.CSSProperties
  className?: string
}

export const PixelCard = ({ children, title, style, className = '' }: PixelCardProps) => {
  return (
    <div
      className={`pixel-card ${className}`}
      style={{
        position: 'relative',
        backgroundColor: 'var(--color-wood-light)',
        border: '4px solid var(--color-soil)',
        padding: '1.5rem',
        boxShadow: '8px 8px 0 rgba(0,0,0,0.2)',
        ...style,
      }}
    >
      {/* Corner Decorations (optional pixel screws) */}
      <div style={{ position: 'absolute', top: 4, left: 4, width: 4, height: 4, background: 'var(--color-soil)' }} />
      <div style={{ position: 'absolute', top: 4, right: 4, width: 4, height: 4, background: 'var(--color-soil)' }} />
      <div style={{ position: 'absolute', bottom: 4, left: 4, width: 4, height: 4, background: 'var(--color-soil)' }} />
      <div style={{ position: 'absolute', bottom: 4, right: 4, width: 4, height: 4, background: 'var(--color-soil)' }} />

      {title && (
        <div
          style={{
            backgroundColor: 'var(--color-wood)',
            color: 'var(--color-cloud)',
            padding: '0.5rem 1rem',
            border: '4px solid var(--color-soil)',
            display: 'inline-block',
            marginBottom: '1.5rem',
            marginTop: '-2.5rem',
            marginLeft: '-0.5rem',
            fontFamily: 'var(--font-heading)',
            fontSize: '0.9rem',
            boxShadow: '4px 4px 0 rgba(0,0,0,0.2)',
          }}
        >
          {title}
        </div>
      )}
      {children}
    </div>
  )
}
