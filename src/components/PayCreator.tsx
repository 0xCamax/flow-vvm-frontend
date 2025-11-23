'use client'
import React, { useState } from 'react'
import { getWalletClient } from '@wagmi/core'
import { config } from '@/config/index'
import { EVVMSignatureBuilder } from '@evvm/viem-signature-library'
import { getAccountWithRetry } from '@/utils/getAccountWithRetry'
import type { Transaction } from './Dashboard'

interface PayCreatorProps {
  address: string
  onTransactionCreated: (tx: Omit<Transaction, 'id'>) => void
  onStatusUpdate: (
    id: string,
    status: 'created' | 'executed' | 'failed',
    txHash?: string,
    error?: string
  ) => void
}

export const PayCreator = ({
  address,
  onTransactionCreated,
  onStatusUpdate,
}: PayCreatorProps) => {
  const [loading, setLoading] = useState(false)
  const [evvmAddress, setEvvmAddress] = useState('0xfB505AE3d70cA90c90c4dd48D0d19f3686dfD682')
  const [evvmID, setEvvmID] = useState('')

  const handleCreateSignature = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const to = formData.get('to') as string
      const toIdentity = formData.get('toIdentity') as string
      const tokenAddress = formData.get('tokenAddress') as string
      const amount = formData.get('amount') as string
      const priorityFee = formData.get('priorityFee') as string
      const nonce = formData.get('nonce') as string
      const priority = formData.get('priority') as 'low' | 'high'
      const executor = formData.get('executor') as string

      const walletData = await getAccountWithRetry(config)
      if (!walletData) {
        alert('Wallet not connected')
        return
      }

      const walletClient = await getWalletClient(config)
      const signatureBuilder = new (EVVMSignatureBuilder as any)(
        walletClient,
        walletData
      )

      const signature = await signatureBuilder.signPay(
        BigInt(evvmID),
        toIdentity || to,
        tokenAddress as `0x${string}`,
        BigInt(amount),
        BigInt(priorityFee),
        BigInt(nonce),
        priority === 'high',
        executor as `0x${string}`
      )

      const newTx: Omit<Transaction, 'id'> = {
        timestamp: new Date().toISOString(),
        user: address,
        to,
        toIdentity,
        amount,
        token: tokenAddress,
        priorityFee,
        priority,
        executor,
        signature,
        status: 'created',
      }

      onTransactionCreated(newTx)
      ;(e.target as HTMLFormElement).reset()
      alert('Signature created successfully!')
    } catch (error) {
      console.error('Error creating signature:', error)
      alert('Error creating signature: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '1.5rem',
      }}
    >
      <h2 style={{ margin: '0 0 1.5rem 0', color: '#e2e8f0', fontSize: '1.3rem' }}>
        Create Payment Signature
      </h2>

      <form onSubmit={handleCreateSignature} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* EVVM Configuration */}
        <div>
          <label style={{ color: '#cbd5e1', display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            EVVM Contract Address
          </label>
          <input
            type="text"
            value={evvmAddress}
            onChange={(e) => setEvvmAddress(e.target.value)}
            placeholder="0x..."
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#e2e8f0',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <label style={{ color: '#cbd5e1', display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            EVVM ID
          </label>
          <input
            type="text"
            value={evvmID}
            onChange={(e) => setEvvmID(e.target.value)}
            placeholder="Enter EVVM ID"
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#e2e8f0',
              fontSize: '0.9rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Recipient */}
        <div>
          <label style={{ color: '#cbd5e1', display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            Recipient Address
          </label>
          <input
            type="text"
            name="to"
            placeholder="0x..."
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#e2e8f0',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <label style={{ color: '#cbd5e1', display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            Recipient Identity (Optional)
          </label>
          <input
            type="text"
            name="toIdentity"
            placeholder="Username or identity"
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#e2e8f0',
              fontSize: '0.9rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Token & Amount */}
        <div>
          <label style={{ color: '#cbd5e1', display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            Token Address
          </label>
          <input
            type="text"
            name="tokenAddress"
            placeholder="0x..."
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#e2e8f0',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ color: '#cbd5e1', display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Amount
            </label>
            <input
              type="number"
              name="amount"
              placeholder="0"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#e2e8f0',
                fontSize: '0.9rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ color: '#cbd5e1', display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Priority Fee
            </label>
            <input
              type="number"
              name="priorityFee"
              placeholder="0"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#e2e8f0',
                fontSize: '0.9rem',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Nonce & Priority */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ color: '#cbd5e1', display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Nonce
            </label>
            <input
              type="number"
              name="nonce"
              placeholder="0"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#e2e8f0',
                fontSize: '0.9rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ color: '#cbd5e1', display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Priority
            </label>
            <select
              name="priority"
              defaultValue="low"
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#e2e8f0',
                fontSize: '0.9rem',
                boxSizing: 'border-box',
              }}
            >
              <option value="low">Synchronous (Low)</option>
              <option value="high">Asynchronous (High)</option>
            </select>
          </div>
        </div>

        {/* Executor */}
        <div>
          <label style={{ color: '#cbd5e1', display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            Executor Address (Optional)
          </label>
          <input
            type="text"
            name="executor"
            placeholder="0x..."
            defaultValue="0x0000000000000000000000000000000000000000"
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#e2e8f0',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !evvmID}
          style={{
            padding: '0.75rem',
            background: loading || !evvmID ? '#64748b' : '#00EE96',
            color: loading || !evvmID ? '#94a3b8' : '#0f172a',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: loading || !evvmID ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            marginTop: '1rem',
          }}
        >
          {loading ? 'Creating...' : 'Create Signature'}
        </button>
      </form>
    </div>
  )
}