'use client'
import React, { useState } from 'react'
import { executePay } from '@/utils/TransactionExecuter/useEVVMTransactionExecuter'
import { config } from '@/config/index'
import type { Transaction } from './Dashboard'

interface TransactionHistoryProps {
  transactions: Transaction[]
  onStatusUpdate: (
    id: string,
    status: 'created' | 'executed' | 'failed',
    txHash?: string,
    error?: string
  ) => void
}

export const TransactionHistory = ({
  transactions,
  onStatusUpdate,
}: TransactionHistoryProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [executingId, setExecutingId] = useState<string | null>(null)

  const handleExecute = async (tx: Transaction) => {
    setExecutingId(tx.id)
    try {
      const payData = {
        from: tx.user as `0x${string}`,
        to_address: tx.to as `0x${string}`,
        to_identity: tx.toIdentity,
        token: tx.token as `0x${string}`,
        amount: BigInt(tx.amount),
        priorityFee: BigInt(tx.priorityFee),
        nonce: BigInt(
          transactions.find((t) => t.id === tx.id)?.['nonce'] || '0'
        ),
        priority: tx.priority === 'high',
        executor: tx.executor as `0x${string}`,
        signature: tx.signature,
      }

      const hash = await executePay(payData, tx.to as `0x${string}`)
      onStatusUpdate(tx.id, 'executed', hash as string)
    } catch (error) {
      onStatusUpdate(
        tx.id,
        'failed',
        undefined,
        (error as Error).message
      )
    } finally {
      setExecutingId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created':
        return '#0ea5e9'
      case 'executed':
        return '#10b981'
      case 'failed':
        return '#ef4444'
      default:
        return '#94a3b8'
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'created':
        return 'rgba(14, 165, 233, 0.1)'
      case 'executed':
        return 'rgba(16, 185, 129, 0.1)'
      case 'failed':
        return 'rgba(239, 68, 68, 0.1)'
      default:
        return 'rgba(148, 163, 184, 0.1)'
    }
  }

  if (transactions.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '2rem',
          color: '#94a3b8',
        }}
      >
        <p>No transactions yet</p>
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.85rem',
        }}
      >
        <thead>
          <tr style={{ borderBottom: '2px solid #334155' }}>
            <th
              style={{
                textAlign: 'left',
                padding: '0.75rem',
                color: '#cbd5e1',
                fontWeight: 600,
              }}
            >
              Time
            </th>
            <th
              style={{
                textAlign: 'left',
                padding: '0.75rem',
                color: '#cbd5e1',
                fontWeight: 600,
              }}
            >
              To
            </th>
            <th
              style={{
                textAlign: 'left',
                padding: '0.75rem',
                color: '#cbd5e1',
                fontWeight: 600,
              }}
            >
              Amount
            </th>
            <th
              style={{
                textAlign: 'left',
                padding: '0.75rem',
                color: '#cbd5e1',
                fontWeight: 600,
              }}
            >
              Status
            </th>
            <th
              style={{
                textAlign: 'center',
                padding: '0.75rem',
                color: '#cbd5e1',
                fontWeight: 600,
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <React.Fragment key={tx.id}>
              <tr
                style={{
                  borderBottom: '1px solid #334155',
                  cursor: 'pointer',
                }}
                onClick={() =>
                  setExpandedId(expandedId === tx.id ? null : tx.id)
                }
              >
                <td style={{ padding: '0.75rem', color: '#cbd5e1' }}>
                  {new Date(tx.timestamp).toLocaleString()}
                </td>
                <td style={{ padding: '0.75rem', color: '#cbd5e1' }}>
                  <code style={{ fontSize: '0.75rem' }}>
                    {tx.toIdentity || tx.to.slice(0, 10) + '...'}
                  </code>
                </td>
                <td style={{ padding: '0.75rem', color: '#cbd5e1' }}>
                  {tx.amount}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <span
                    style={{
                      padding: '0.25rem 0.75rem',
                      background: getStatusBg(tx.status),
                      color: getStatusColor(tx.status),
                      borderRadius: '4px',
                      textTransform: 'capitalize',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    {tx.status}
                  </span>
                </td>
                <td
                  style={{
                    padding: '0.75rem',
                    textAlign: 'center',
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (tx.status === 'created') {
                        handleExecute(tx)
                      }
                    }}
                    disabled={tx.status !== 'created' || executingId === tx.id}
                    style={{
                      padding: '0.4rem 0.8rem',
                      background:
                        tx.status !== 'created' || executingId === tx.id
                          ? '#64748b'
                          : '#00EE96',
                      color:
                        tx.status !== 'created' || executingId === tx.id
                          ? '#94a3b8'
                          : '#0f172a',
                      border: 'none',
                      borderRadius: '4px',
                      cursor:
                        tx.status !== 'created' || executingId === tx.id
                          ? 'not-allowed'
                          : 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    {executingId === tx.id ? 'Executing...' : 'Execute'}
                  </button>
                </td>
              </tr>

              {/* Expanded Row */}
              {expandedId === tx.id && (
                <tr
                  style={{
                    background: 'rgba(51, 65, 85, 0.3)',
                    borderBottom: '1px solid #334155',
                  }}
                >
                  <td
                    colSpan={5}
                    style={{
                      padding: '1rem',
                      color: '#cbd5e1',
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1rem',
                        fontSize: '0.8rem',
                      }}
                    >
                      <div>
                        <p style={{ margin: '0 0 0.5rem 0', color: '#94a3b8' }}>
                          Token:
                        </p>
                        <code style={{ color: '#e2e8f0' }}>{tx.token}</code>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 0.5rem 0', color: '#94a3b8' }}>
                          Priority Fee:
                        </p>
                        <code style={{ color: '#e2e8f0' }}>{tx.priorityFee}</code>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 0.5rem 0', color: '#94a3b8' }}>
                          Executor:
                        </p>
                        <code style={{ color: '#e2e8f0', wordBreak: 'break-all' }}>
                          {tx.executor}
                        </code>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 0.5rem 0', color: '#94a3b8' }}>
                          Recipient:
                        </p>
                        <code style={{ color: '#e2e8f0', wordBreak: 'break-all' }}>
                          {tx.to}
                        </code>
                      </div>
                      {tx.txHash && (
                        <div style={{ gridColumn: '1 / -1' }}>
                          <p style={{ margin: '0 0 0.5rem 0', color: '#94a3b8' }}>
                            Tx Hash:
                          </p>
                          <code
                            style={{
                              color: '#10b981',
                              wordBreak: 'break-all',
                              fontSize: '0.75rem',
                            }}
                          >
                            {tx.txHash}
                          </code>
                        </div>
                      )}
                      {tx.error && (
                        <div style={{ gridColumn: '1 / -1' }}>
                          <p style={{ margin: '0 0 0.5rem 0', color: '#94a3b8' }}>
                            Error:
                          </p>
                          <code
                            style={{
                              color: '#ef4444',
                              wordBreak: 'break-all',
                              fontSize: '0.75rem',
                            }}
                          >
                            {tx.error}
                          </code>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}