'use client'
import React, { useState, useEffect } from 'react'
import { useAppKitAccount } from '@reown/appkit/react'
import { PayCreator } from './PayCreator'
import { TransactionHistory } from './TransactionHistory'
import { TransactionStats } from './TransactionStats'
import { InvestmentComponent } from './InvestmentComponent'

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
  status: 'created' | 'executed' | 'failed'
  txHash?: string
  error?: string
}

export const Dashboard = () => {
  const { address, isConnected } = useAppKitAccount()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filter, setFilter] = useState<'all' | 'created' | 'executed' | 'failed'>('all')
  const [loading, setLoading] = useState(true)

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
  }

  const updateTransactionStatus = (
    id: string,
    status: 'created' | 'executed' | 'failed',
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

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Stats Overview */}
      <TransactionStats transactions={transactions} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          marginTop: '2rem',
        }}
      >
        {/* Pay Creator */}
        <div>
          <PayCreator
            address={address as string}
            onTransactionCreated={addTransaction}
            onStatusUpdate={updateTransactionStatus}
          />
        </div>

        {/* Transactions History */}
        <div>
          <div
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '1px solid #334155',
              borderRadius: '12px',
              padding: '1.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <h2 style={{ margin: 0, color: '#e2e8f0', fontSize: '1.3rem' }}>
                Transaction History
              </h2>
              <button
                onClick={downloadTransactions}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#0ea5e9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              >
                Download All
              </button>
            </div>

            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              {(['all', 'created', 'executed', 'failed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    background: filter === f ? '#00EE96' : 'rgba(2, 132, 199, 0.1)',
                    color: filter === f ? '#0f172a' : '#0ea5e9',
                    border: `1px solid ${filter === f ? '#00EE96' : 'rgba(2, 132, 199, 0.3)'}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    transition: 'all 0.2s',
                  }}
                >
                  {f} ({transactions.filter((t) => f === 'all' || t.status === f).length})
                </button>
              ))}
            </div>

            {/* Transactions Table */}
            <TransactionHistory
              transactions={filteredTransactions}
              onStatusUpdate={updateTransactionStatus}
            />
          </div>
        </div>
      </div>
    </div>
  )
}