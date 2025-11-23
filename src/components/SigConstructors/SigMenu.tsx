'use client'
import { useState } from 'react'
import { readContracts } from '@wagmi/core'
import { config } from '@/config/index'
import { EvvmABI } from '@evvm/viem-signature-library'
import { PaySignaturesComponent } from './PaymentFunctions/PaySignaturesComponent'

const boxStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  padding: '1rem',
  border: '1px solid #ccc',
  borderRadius: '8px',
  width: '100%',
  marginBottom: '1rem',
} as const

export const SigMenu = () => {
  const [evvmID, setEvvmID] = useState('')
  const [evvmAddress, setEvvmAddress] = useState('0xfB505AE3d70cA90c90c4dd48D0d19f3686dfD682')
  const [loadingIDs, setLoadingIDs] = useState(false)

  const fetchEvvmSummary = async () => {
    if (!evvmAddress) {
      alert('Please enter a valid EVVM address')
      return
    }
    setLoadingIDs(true)
    try {
      const contracts = [
        {
          abi: EvvmABI as any,
          address: evvmAddress as `0x${string}`,
          functionName: 'getEvvmID',
          args: [],
        },
      ]
      const results = await readContracts(config, { contracts })
      const [evvmIDResult] = results
      setEvvmID(
        evvmIDResult?.result !== undefined && evvmIDResult?.result !== null
          ? String(evvmIDResult.result)
          : ''
      )
    } catch (err) {
      setEvvmID('')
      alert('Could not fetch EVVM ID')
    } finally {
      setLoadingIDs(false)
    }
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: '0rem auto',
        padding: '2rem 1.5rem',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h1>EVVM Pay Signature Constructor</h1>
        <h3>Enter your EVVM contract address (Arbitrum Mainnet):</h3>
        
        {evvmID ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              background: '#f8fafc',
              border: '1.5px solid #d1d5db',
              borderRadius: 10,
              padding: '1rem 1.5rem',
              minWidth: 0,
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
            }}
          >
            <div
              style={{ fontSize: 15, color: '#444', fontFamily: 'monospace' }}
            >
              <strong>EVVM ID:</strong> {evvmID}
            </div>
            <div
              style={{ fontSize: 15, color: '#444', fontFamily: 'monospace' }}
            >
              <strong>EVVM Address:</strong> {evvmAddress}
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              placeholder="EVVM Address"
              value={evvmAddress}
              onChange={(e) => setEvvmAddress(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 8,
                background: '#f9fafb',
                color: '#222',
                border: '1.5px solid #d1d5db',
                flex: 1,
                fontFamily: 'monospace',
                fontSize: 16,
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
            <button
              onClick={fetchEvvmSummary}
              style={{
                padding: '0.7rem 1.5rem',
                borderRadius: 8,
                border: '1.5px solid #d1d5db',
                background: loadingIDs ? '#e5e7eb' : '#f3f4f6',
                color: '#222',
                fontWeight: 600,
                fontSize: 15,
                cursor: loadingIDs ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
                minWidth: 140,
              }}
              disabled={loadingIDs}
            >
              {loadingIDs ? 'Loading...' : 'Use this EVVM'}
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div
          style={{
            ...boxStyle,
            background: '#f9fafb',
            boxShadow: '0 1px 4px 0 rgba(0,0,0,0.03)',
          }}
        >
          <PaySignaturesComponent
            evvmID={evvmID}
            evvmAddress={evvmAddress}
          />
        </div>
      </div>
    </div>
  )
}