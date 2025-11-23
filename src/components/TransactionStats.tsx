'use client'
import type { Transaction } from './Dashboard'

interface TransactionStatsProps {
  transactions: Transaction[]
}

export const TransactionStats = ({ transactions }: TransactionStatsProps) => {
  const stats = {
    total: transactions.length,
    created: transactions.filter((t) => t.status === 'created').length,
    executed: transactions.filter((t) => t.status === 'executed').length,
    failed: transactions.filter((t) => t.status === 'failed').length,
    totalAmount: transactions.reduce((sum, t) => sum + BigInt(t.amount), 0n),
  }

  const StatCard = ({
    label,
    value,
    color,
    bgColor,
  }: {
    label: string
    value: string
    color: string
    bgColor: string
  }) => (
    <div
      style={{
        background: bgColor,
        border: `2px solid ${color}`,
        borderRadius: '12px',
        padding: '1.5rem',
        textAlign: 'center',
      }}
    >
      <p style={{ margin: '0 0 0.5rem 0', color: '#94a3b8', fontSize: '0.9rem' }}>
        {label}
      </p>
      <p
        style={{
          margin: 0,
          color,
          fontSize: '2rem',
          fontWeight: 700,
        }}
      >
        {value}
      </p>
    </div>
  )

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
      }}
    >
      <StatCard
        label="Total Transactions"
        value={stats.total.toString()}
        color="#0ea5e9"
        bgColor="rgba(14, 165, 233, 0.1)"
      />
      <StatCard
        label="Created"
        value={stats.created.toString()}
        color="#00EE96"
        bgColor="rgba(0, 238, 150, 0.1)"
      />
      <StatCard
        label="Executed"
        value={stats.executed.toString()}
        color="#10b981"
        bgColor="rgba(16, 185, 129, 0.1)"
      />
      <StatCard
        label="Failed"
        value={stats.failed.toString()}
        color="#ef4444"
        bgColor="rgba(239, 68, 68, 0.1)"
      />
      <StatCard
        label="Total Amount"
        value={stats.totalAmount.toString()}
        color="#8b5cf6"
        bgColor="rgba(139, 92, 246, 0.1)"
      />
    </div>
  )
}