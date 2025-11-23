import React, { useState } from 'react'

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  isLoading?: boolean
}

export const PixelButton = ({
  children,
  variant = 'primary',
  isLoading,
  style,
  ...props
}: PixelButtonProps) => {
  const [isHovered, setIsHovered] = useState(false)

  let bgColor = 'var(--color-grass-green)'
  let textColor = 'var(--color-deep-forest)'
  let glowColor = 'var(--color-success-glow)'

  if (variant === 'secondary') {
    bgColor = 'var(--color-river-blue)'
    textColor = 'var(--color-text)'
    glowColor = 'rgba(74, 144, 226, 0.6)'
  } else if (variant === 'danger') {
    bgColor = 'var(--color-flower-pink)'
    textColor = 'var(--color-text)'
    glowColor = 'var(--color-error-glow)'
  } else if (variant === 'success') {
    bgColor = 'var(--color-grass-green)'
    textColor = 'var(--color-deep-forest)'
    glowColor = 'var(--color-success-glow)'
  }

  return (
    <button
      style={{
        position: 'relative',
        backgroundColor: bgColor,
        color: textColor,
        border: '4px solid var(--color-border)',
        padding: '0.75rem 1.5rem',
        fontFamily: 'var(--font-heading)',
        fontSize: '0.8rem',
        cursor: props.disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: props.disabled || isLoading ? 0.5 : 1,
        boxShadow: `
          0 6px 0 var(--color-dark-indigo),
          0 0 20px ${glowColor},
          inset 0 0 20px rgba(255, 255, 255, 0.1)
        `,
        transition: 'all 0.15s ease',
        overflow: 'hidden',
        textShadow: '2px 2px 0 rgba(0, 0, 0, 0.5)',
        letterSpacing: '1px',
        ...style,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={(e) => {
        if (!props.disabled && !isLoading) {
          e.currentTarget.style.transform = 'translateY(6px)'
          e.currentTarget.style.boxShadow = `
            0 0 0 var(--color-dark-indigo),
            0 0 30px ${glowColor},
            inset 0 0 30px rgba(255, 255, 255, 0.2)
          `
        }
      }}
      onMouseUp={(e) => {
        if (!props.disabled && !isLoading) {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = `
            0 6px 0 var(--color-dark-indigo),
            0 0 20px ${glowColor},
            inset 0 0 20px rgba(255, 255, 255, 0.1)
          `
        }
      }}
      {...props}
    >
      {/* Energy flow background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
        animation: isHovered ? 'shimmer 1.5s infinite' : 'none',
        pointerEvents: 'none'
      }} />

      {/* Magical particles on hover - like fireflies and water droplets */}
      {isHovered && !props.disabled && !isLoading && (
        <>
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '20%',
            width: '4px',
            height: '4px',
            background: 'var(--color-sun-gold)',
            borderRadius: '50%',
            boxShadow: '0 0 8px var(--color-sun-gold)',
            animation: 'float 2s ease-in-out infinite',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            top: '60%',
            right: '30%',
            width: '3px',
            height: '3px',
            background: 'var(--color-river-blue)',
            borderRadius: '50%',
            boxShadow: '0 0 6px var(--color-river-blue)',
            animation: 'float 2.5s ease-in-out infinite 0.5s',
            pointerEvents: 'none'
          }} />
        </>
      )}

      {/* Loading spinner */}
      {isLoading && (
        <span style={{
          display: 'inline-block',
          width: '12px',
          height: '12px',
          border: '2px solid transparent',
          borderTopColor: textColor,
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          marginRight: '8px'
        }} />
      )}

      {isLoading ? 'Loading...' : children}

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  )
}
