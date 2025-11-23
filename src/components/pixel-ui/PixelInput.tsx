import React, { useState } from 'react'

interface PixelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const PixelInput = ({ label, style, ...props }: PixelInputProps) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div style={{ marginBottom: '1rem', position: 'relative' }}>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontFamily: 'var(--font-heading)',
            fontSize: '0.7rem',
            color: 'var(--color-sun-gold)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            textShadow: '0 0 8px rgba(124, 179, 66, 0.6)',
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <input
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: 'var(--color-deep-forest)',
            border: `4px solid ${isFocused ? 'var(--color-grass-green)' : 'var(--color-border)'}`,
            color: 'var(--color-text)',
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            boxShadow: isFocused
              ? `
                inset 0 0 20px rgba(124, 179, 66, 0.3),
                0 0 20px rgba(124, 179, 66, 0.6),
                0 4px 8px rgba(0, 0, 0, 0.4)
              `
              : `
                inset 0 0 10px rgba(85, 139, 47, 0.2),
                0 4px 8px rgba(0, 0, 0, 0.4)
              `,
            outline: 'none',
            transition: 'all 0.3s ease',
            ...style,
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Natural focus glow effect */}
        {isFocused && (
          <>
            <div style={{
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              border: '2px solid var(--color-grass-green)',
              opacity: 0.5,
              pointerEvents: 'none',
              animation: 'pulse-glow 2s ease-in-out infinite'
            }} />

            {/* Floating particles when focused - like pollen */}
            <div style={{
              position: 'absolute',
              top: '50%',
              right: '10px',
              width: '4px',
              height: '4px',
              background: 'var(--color-grass-green)',
              borderRadius: '50%',
              boxShadow: '0 0 8px var(--color-grass-green)',
              animation: 'float 2s ease-in-out infinite',
              pointerEvents: 'none'
            }} />
          </>
        )}
      </div>
    </div>
  )
}
