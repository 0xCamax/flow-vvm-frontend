'use client'
import React from 'react'
import { PixelCard } from './pixel-ui/PixelCard'
import { PixelButton } from './pixel-ui/PixelButton'

export const PowerEvvmSwap = () => {
  const handleOpenUniswap = () => {
    window.open('https://app.uniswap.org/swap', '_blank')
  }

  return (
    <PixelCard title="⚡ Power the EVVM Grid ⚡">
      <div style={{ textAlign: 'center', padding: '1rem' }}>
        <p style={{ 
          fontSize: '1.1rem', 
          marginBottom: '1.5rem', 
          color: 'var(--color-soil)',
          lineHeight: '1.6'
        }}>
          Your transaction is queued! <br/>
          <strong>Execute a swap on Uniswap</strong> to trigger the EVVM hook and process your payment.
        </p>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '1rem', 
          marginBottom: '2rem',
          fontSize: '2rem'
        }}>
          <span>🪙</span>
          <span style={{ fontSize: '1.5rem', color: 'var(--color-wood)' }}>➔</span>
          <span>💰</span>
        </div>

        <PixelButton 
          onClick={handleOpenUniswap}
          variant="primary"
          style={{ 
            width: '100%', 
            fontSize: '1.2rem',
            padding: '1rem',
            background: 'var(--color-gold)',
            color: 'var(--color-soil)',
            borderColor: 'var(--color-soil)'
          }}
        >
          Open Uniswap
        </PixelButton>
      </div>
    </PixelCard>
  )
}
