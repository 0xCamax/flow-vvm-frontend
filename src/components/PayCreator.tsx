'use client'
import React, { useState } from 'react'
import { getWalletClient } from '@wagmi/core'
import { config } from '@/config/index'
import { EVVMSignatureBuilder } from '@evvm/viem-signature-library'
import { getAccountWithRetry } from '@/utils/getAccountWithRetry'
import type { Transaction } from './Dashboard'
import { PixelCard } from './pixel-ui/PixelCard'
import { PixelInput } from './pixel-ui/PixelInput'
import { PixelButton } from './pixel-ui/PixelButton'
import { useEvvmBalance } from '@/hooks/useEvvmBalance'

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
  const [evvmID, setEvvmID] = useState(69420)
  
  // Controlled inputs for balance fetching
  const [tokenAddress, setTokenAddress] = useState('0xaf88d065e77c8cC2239327C5EDb3A432268e5831')
  const [recipientAddress, setRecipientAddress] = useState('0xEC08EfF77496601BE56c11028A516366DbF03F13')

  // Fetch Balances
  const { balance: userBalance } = useEvvmBalance(address, tokenAddress)
  const { balance: recipientBalance } = useEvvmBalance(recipientAddress, tokenAddress)

  const handleCreateSignature = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const to = formData.get('to') as string
      const toIdentity = formData.get('toIdentity') as string
      // tokenAddress is already in state
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
      // Reset form manually if needed, but controlled inputs might need reset logic
    } catch (error) {
      console.error('Error creating signature:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Balance Monitor Box */}
      <div className="pixel-border" style={{ 
        background: 'var(--color-wood-light)', 
        padding: '1.5rem',
        position: 'relative'
      }}>
        <h3 style={{ 
          fontSize: '1rem', 
          marginBottom: '1rem', 
          color: 'var(--color-soil)',
          borderBottom: '2px solid var(--color-soil)',
          paddingBottom: '0.5rem'
        }}>
          EVVM Balance Monitor
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ 
            background: 'var(--color-white)', 
            padding: '1rem', 
            border: '2px solid var(--color-wood)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>YOUR BALANCE</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-soil)' }}>
              {userBalance ? userBalance.toString() : '0'}
            </p>
          </div>
          <div style={{ 
            background: 'var(--color-white)', 
            padding: '1rem', 
            border: '2px solid var(--color-wood)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>RECIPIENT BALANCE</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-soil)' }}>
              {recipientBalance ? recipientBalance.toString() : '0'}
            </p>
          </div>
        </div>
        {!tokenAddress && (
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#ef4444', marginTop: '1rem' }}>
            * Select a Token Address to view balances
          </p>
        )}
      </div>

      <PixelCard title="Create Payment Signature">
        <form onSubmit={handleCreateSignature} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* EVVM Configuration */}
          <PixelInput
            label="EVVM Contract Address"
            value={evvmAddress}
            onChange={(e) => setEvvmAddress(e.target.value)}
            placeholder="0x..."
            style={{ fontFamily: 'monospace' }}
          />

          <PixelInput
            label="EVVM ID"
            value={evvmID}
            onChange={(e) => setEvvmID(e.target.value)}
            placeholder="Enter EVVM ID"
          />

          {/* Recipient */}
          <PixelInput
            label="Recipient Address"
            name="to"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="0x..."
            required
            style={{ fontFamily: 'monospace' }}
          />

          <PixelInput
            label="Recipient Identity (Optional)"
            name="toIdentity"
            placeholder="Username or identity"
          />

          {/* Token & Amount */}
          <PixelInput
            label="Token Address"
            name="tokenAddress"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            placeholder="0x..."
            required
            style={{ fontFamily: 'monospace' }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <PixelInput
              label="Amount"
              type="number"
              name="amount"
              placeholder="0"
              required
            />

            <PixelInput
              label="Priority Fee"
              type="number"
              name="priorityFee"
              placeholder="0"
              required
            />
          </div>

          {/* Nonce & Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <PixelInput
              label="Nonce"
              type="number"
              name="nonce"
              placeholder="0"
              required
            />

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontFamily: 'var(--font-heading)', 
                fontSize: '0.7rem', 
                color: 'var(--color-soil)',
                textTransform: 'uppercase'
              }}>
                Priority
              </label>
              <select
                name="priority"
                defaultValue="low"
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
                  cursor: 'pointer'
                }}
              >
                <option value="low">Synchronous (Low)</option>
                <option value="high">Asynchronous (High)</option>
              </select>
            </div>
          </div>

          {/* Executor */}
          <PixelInput
            label="Executor Address (Optional)"
            name="executor"
            placeholder="0x..."
            defaultValue="0x0000000000000000000000000000000000000000"
            style={{ fontFamily: 'monospace' }}
          />

          {/* Submit Button */}
          <PixelButton
            type="submit"
            disabled={loading || !evvmID}
            isLoading={loading}
            style={{ marginTop: '1rem', width: '100%' }}
          >
            Create Signature
          </PixelButton>
        </form>
      </PixelCard>
    </div>
  )
}