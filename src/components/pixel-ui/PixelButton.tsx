import React from 'react'

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
  
  let bgColor = 'var(--color-gold)'
  let textColor = 'var(--color-soil)'

  if (variant === 'secondary') {
    bgColor = 'var(--color-wood)'
    textColor = 'var(--color-cloud)'
  } else if (variant === 'danger') {
    bgColor = 'var(--color-orange)'
    textColor = 'var(--color-white)'
  } else if (variant === 'success') {
    bgColor = 'var(--color-green)'
    textColor = 'var(--color-soil)'
  }

  return (
    <button
      style={{
        position: 'relative',
        backgroundColor: bgColor,
        color: textColor,
        border: '4px solid var(--color-soil)',
        padding: '0.75rem 1.5rem',
        fontFamily: 'var(--font-heading)',
        fontSize: '0.8rem',
        cursor: props.disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: props.disabled || isLoading ? 0.7 : 1,
        boxShadow: '0 4px 0 var(--color-soil)',
        transition: 'transform 0.1s, box-shadow 0.1s',
        ...style,
      }}
      onMouseDown={(e) => {
        if (!props.disabled && !isLoading) {
          e.currentTarget.style.transform = 'translateY(4px)'
          e.currentTarget.style.boxShadow = '0 0 0 var(--color-soil)'
        }
      }}
      onMouseUp={(e) => {
        if (!props.disabled && !isLoading) {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 4px 0 var(--color-soil)'
        }
      }}
      onMouseLeave={(e) => {
        if (!props.disabled && !isLoading) {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 4px 0 var(--color-soil)'
        }
      }}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  )
}
