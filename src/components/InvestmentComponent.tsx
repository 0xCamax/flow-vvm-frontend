'use client'
import React from 'react'
import { PixelButton } from './pixel-ui/PixelButton'

interface InvestmentComponentProps {
  hookAddress?: string
  chainId?: number
  amount0?: string
  amount1?: string
  minPrice?: string
  maxPrice?: string
  initialPrice?: string
  openInNewTab?: boolean
}

export const InvestmentComponent = ({
  hookAddress = '0x756fDfcF1E742F9B02A4f652f914D896534B4080',
  chainId = 1,
  amount0,
  amount1,
  minPrice,
  maxPrice,
  initialPrice,
  openInNewTab = true,
}: InvestmentComponentProps) => {
  const chainMap: Record<number, string> = {
    1: 'ethereum',
    42161: 'arbitrum',
    10: 'optimism',
    137: 'polygon',
    8453: 'base',
  }

  const chainName = chainMap[chainId] || 'ethereum'

  const buildUniswapUrl = () => {
    const baseUrl = 'https://app.uniswap.org/positions/create'
    const params = new URLSearchParams()

    params.append('currencyA', 'NATIVE')
    params.append('currencyB', '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')
    params.append('chain', chainName)

    params.append('fee', JSON.stringify({ feeAmount: 3000, tickSpacing: 60, isDynamic: false }))
    params.append('hook', hookAddress)

    const priceRangeState = {
      priceInverted: false,
      fullRange: !minPrice && !maxPrice,
      minPrice: minPrice || '',
      maxPrice: maxPrice || '',
      initialPrice: initialPrice || '',
      inputMode: 'price',
    }
    params.append('priceRangeState', JSON.stringify(priceRangeState))

    const depositState = {
      exactField: 'TOKEN0',
      exactAmounts: {
        ...(amount0 ? { TOKEN0: amount0 } : {}),
        ...(amount1 ? { TOKEN1: amount1 } : {}),
      },
    }
    params.append('depositState', JSON.stringify(depositState))

    params.append('step', '1')

    return `${baseUrl}?${params.toString()}`
  }

  const handleInvest = () => {
    const url = buildUniswapUrl()
    if (openInNewTab) window.open(url, '_blank')
    else window.location.href = url
  }

  return (
    <PixelButton
      onClick={handleInvest}
      variant="primary"
      style={{
        padding: '0.45rem 0.9rem',
        fontSize: '0.9rem',
        background: 'var(--color-gold)',
        color: 'var(--color-soil)',
        borderColor: 'var(--color-soil)',
      }}
    >
      Invest
    </PixelButton>
  )
}