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
        backgroundColor: 'var(--color-panel)',
        border: '6px solid var(--color-border)',
        padding: '1.5rem',
        boxShadow: `
          inset 0 0 30px rgba(139, 92, 246, 0.2),
          0 0 20px rgba(139, 92, 246, 0.3),
          0 8px 16px rgba(0, 0, 0, 0.6)
        `,
        backgroundImage: `
          linear-gradient(45deg, transparent 48%, rgba(139, 92, 246, 0.05) 49%, rgba(139, 92, 246, 0.05) 51%, transparent 52%),
          linear-gradient(-45deg, transparent 48%, rgba(0, 217, 255, 0.03) 49%, rgba(0, 217, 255, 0.03) 51%, transparent 52%)
        `,
        backgroundSize: '20px 20px',
        ...style,
      }}
    >
      {/* Natural Corner Runes - like sun-touched leaves */}
      <div style={{
        position: 'absolute',
        top: -3,
        left: -3,
        width: 12,
        height: 12,
        background: 'var(--color-sun-gold)',
        boxShadow: '0 0 10px rgba(124, 179, 66, 0.6)',
        animation: 'pulse-glow 3s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        top: -3,
        right: -3,
        width: 12,
        height: 12,
        background: 'var(--color-sun-gold)',
        boxShadow: '0 0 10px rgba(124, 179, 66, 0.6)',
        animation: 'pulse-glow 3s ease-in-out infinite 0.75s'
      }} />
      <div style={{
        position: 'absolute',
        bottom: -3,
        left: -3,
        width: 12,
        height: 12,
        background: 'var(--color-sun-gold)',
        boxShadow: '0 0 10px rgba(124, 179, 66, 0.6)',
        animation: 'pulse-glow 3s ease-in-out infinite 1.5s'
      }} />
      <div style={{
        position: 'absolute',
        bottom: -3,
        right: -3,
        width: 12,
        height: 12,
        background: 'var(--color-sun-gold)',
        boxShadow: '0 0 10px rgba(124, 179, 66, 0.6)',
        animation: 'pulse-glow 3s ease-in-out infinite 2.25s'
      }} />

      {/* Energy Flow Border Effect - like flowing water */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        border: '2px solid transparent',
        background: 'linear-gradient(90deg, var(--color-moss-green), var(--color-river-blue), var(--color-grass-green), var(--color-moss-green)) border-box',
        WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
        opacity: 0.3,
        pointerEvents: 'none',
        animation: 'energy-flow 4s linear infinite'
      }} />

      {title && (
        <div
          style={{
            backgroundColor: 'var(--color-panel-light)',
            color: 'var(--color-sun-gold)',
            padding: '0.5rem 1rem',
            border: '4px solid var(--color-border)',
            display: 'inline-block',
            marginBottom: '1.5rem',
            marginTop: '-2.5rem',
            marginLeft: '-0.5rem',
            fontFamily: 'var(--font-heading)',
            fontSize: '0.9rem',
            boxShadow: `
              inset 0 0 15px rgba(124, 179, 66, 0.3),
              0 0 15px rgba(124, 179, 66, 0.5),
              4px 4px 0 rgba(0, 0, 0, 0.4)
            `,
            textShadow: '0 0 10px rgba(124, 179, 66, 0.6)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Title shimmer effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
            animation: 'shimmer 3s infinite'
          }} />
          {title}
        </div>
      )}
      {children}
    </div>
  )
}
