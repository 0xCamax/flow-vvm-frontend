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
      className="pixel-border"
      style={{
        background: 'var(--color-cloud)',
        padding: '1.5rem',
        textAlign: 'center',
        position: 'relative',
        boxShadow: '4px 4px 0 rgba(0,0,0,0.1)',
      }}
    >
      <p style={{ 
        margin: '0 0 0.5rem 0', 
        color: 'var(--color-soil)', 
        fontSize: '0.9rem',
        fontFamily: 'var(--font-heading)',
        opacity: 0.8
      }}>
        {label}
      </p>
      <p
        style={{
          margin: 0,
          color: color,
          fontSize: '2rem',
          fontWeight: 700,
          textShadow: '2px 2px 0 rgba(0,0,0,0.1)'
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
        color="var(--color-wood)"
        bgColor="var(--color-cloud)"
      />
      <StatCard
        label="Created"
        value={stats.created.toString()}
        color="var(--color-wood)"
        bgColor="var(--color-cloud)"
      />
      <StatCard
        label="Executed"
        value={stats.executed.toString()}
        color="var(--color-green)"
        bgColor="var(--color-cloud)"
      />
      <StatCard
        label="Failed"
        value={stats.failed.toString()}
        color="#ef4444"
        bgColor="var(--color-cloud)"
      />
      <StatCard
        label="Total Amount"
        value={stats.totalAmount.toString()}
        color="var(--color-soil)"
        bgColor="var(--color-cloud)"
      />
    </div>
  )
}