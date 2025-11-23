'use client'
import React, { useState, useEffect } from 'react'
import { useAppKitAccount } from '@reown/appkit/react'
import { PayCreator } from './PayCreator'
import { TransactionHistory } from './TransactionHistory'
import { TransactionStats } from './TransactionStats'
import { InvestmentComponent } from './InvestmentComponent'
import { PixelCard } from './pixel-ui/PixelCard'
import { PixelButton } from './pixel-ui/PixelButton'
import { PowerEvvmSwap } from './PowerEvvmSwap'

export interface Transaction {
  id: string
  timestamp: string
  user: string
  to: string
  toIdentity: string
  amount: string
  token: string
  priorityFee: string
  priority: 'low' | 'high'
  executor: string
  signature: string
  status: 'created' | 'queued' | 'executed' | 'failed'
  txHash?: string
  error?: string
}

export const Dashboard = () => {
  const { address, isConnected } = useAppKitAccount()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filter, setFilter] = useState<'all' | 'created' | 'queued' | 'executed' | 'failed'>('all')
  const [loading, setLoading] = useState(true)
  const [showPowerSwap, setShowPowerSwap] = useState(false)

  // Load transactions from storage
  useEffect(() => {
    if (address) {
      loadTransactions()
    }
    setLoading(false)
  }, [address])

  const loadTransactions = async () => {
    try {
      const key = `transactions:${address}`
      const result = await window.storage?.get(key)
      if (result?.value) {
        const txs = JSON.parse(result.value)
        setTransactions(txs)
      }
    } catch (error) {
      console.error('Failed to load transactions:', error)
    }
  }

  const saveTransactions = async (txs: Transaction[]) => {
    if (!address) return
    try {
      const key = `transactions:${address}`
      await window.storage?.set(key, JSON.stringify(txs))
    } catch (error) {
      console.error('Failed to save transactions:', error)
    }
  }

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `${address}_${Date.now()}_${Math.random()}`,
    }
    const updated = [newTx, ...transactions]
    setTransactions(updated)
    saveTransactions(updated)
    setShowPowerSwap(true)
  }

  const updateTransactionStatus = (
    id: string,
    status: 'created' | 'queued' | 'executed' | 'failed',
    txHash?: string,
    error?: string
  ) => {
    const updated = transactions.map((tx) =>
      tx.id === id ? { ...tx, status, txHash: txHash || tx.txHash, error } : tx
    )
    setTransactions(updated)
    saveTransactions(updated)
  }

  const downloadTransactions = () => {
    const dataStr = JSON.stringify(transactions, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `transactions_${address}_${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'all') return true
    return tx.status === filter
  })

  if (!isConnected) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
        <p style={{ fontSize: '1.1rem' }}>Please connect your wallet to get started</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}> {/* Updated main div styling */}
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}> {/* Updated header div styling */}
        <h1 className="pixel-text-shadow" style={{ // Updated h1 styling
          fontSize: '3.5rem', 
          color: 'var(--color-soil)',
          marginBottom: '0.5rem',
          fontFamily: 'var(--font-heading)'
        }}>
          FlowVVM Power Grid
        </h1>
        <p style={{ // Updated p styling
          fontSize: '1.2rem', 
          color: 'var(--color-wood)',
          fontFamily: 'var(--font-body)'
        }}>
          Renewable Energy for the Ethereum Virtual Machine
        </p>
      </div>

      {/* Stats Overview */}
      <TransactionStats transactions={transactions} />


      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', // Updated grid styling
          gap: '2rem',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}> {/* Added wrapper div */}
          <PayCreator
            address={address || ''}
            onTransactionCreated={addTransaction}
            onStatusUpdate={updateTransactionStatus}
          />
          
          {showPowerSwap && ( // Conditional rendering for PowerEvvmSwap
            <div className="animate-fade-in">
              <PowerEvvmSwap />
            </div>
          )}
        </div>

        {/* Transactions History */}
        <div>
          <PixelCard title="Transaction Log">
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: '1.5rem',
              }}
            >
              <PixelButton
                variant="secondary"
                onClick={downloadTransactions}
                style={{ fontSize: '0.7rem', padding: '0.5rem 1rem' }}
              >
                Download All
              </PixelButton>
            </div>

            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {(['all', 'created', 'queued', 'executed', 'failed'] as const).map((f) => (
                <PixelButton
                  key={f}
                  variant={filter === f ? 'primary' : 'secondary'}
                  onClick={() => setFilter(f)}
                  style={{
                    fontSize: '0.7rem',
                    padding: '0.4rem 0.8rem',
                    opacity: filter === f ? 1 : 0.8
                  }}
                >
                  {f} ({transactions.filter((t) => f === 'all' || t.status === f).length})
                </PixelButton>
              ))}
            </div>

            {/* Transactions Table */}
            <TransactionHistory
              transactions={filteredTransactions}
              onStatusUpdate={updateTransactionStatus}
            />
          </PixelCard>
        </div>
      </div>
    </div>
  )
}