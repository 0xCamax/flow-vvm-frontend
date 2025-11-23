import React from 'react'

interface PixelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const PixelInput = ({ label, style, ...props }: PixelInputProps) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontFamily: 'var(--font-heading)',
            fontSize: '0.7rem',
            color: 'var(--color-soil)',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </label>
      )}
      <input
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: 'var(--color-white)',
          border: '4px solid var(--color-soil)',
          color: 'var(--color-soil)',
          fontFamily: 'var(--font-body)',
          fontSize: '1.2rem',
          boxShadow: 'inset 4px 4px 0 rgba(0,0,0,0.1)',
          outline: 'none',
          ...style,
        }}
        {...props}
      />
    </div>
  )
}
