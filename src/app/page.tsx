'use client'
import { useState } from 'react'
import { ConnectButton } from '@/components/ConnectButton'
import { InvestmentComponent } from '@/components/InvestmentComponent'
import { Dashboard } from '@/components/Dashboard'
import { LandingPage } from '@/components/LandingPage'
import Image from 'next/image'

export default function Home() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing')

  return (
    <div>
      <header
        style={{
          width: '100%',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(180deg, var(--panel), rgba(0,0,0,0.25))',
          borderBottom: '3px solid var(--accent)',
          padding: '1rem 2.5rem',
          minHeight: 70,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setCurrentView('landing')
            }}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <Image src="/logo.jpeg" alt="FlowVVM Logo" width={50} height={50} priority />
          </a>
          <div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {currentView === 'dashboard' && <InvestmentComponent />}
          <div
            style={{
              background: 'rgba(2, 132, 199, 0.1)',
              borderRadius: '6px',
              padding: '0.25rem',
              border: '1px solid rgba(2, 132, 199, 0.3)',
            }}
          >
            <ConnectButton />
          </div>
        </div>
      </header>

      {currentView === 'landing' ? (
        <LandingPage onNavigateToDashboard={() => setCurrentView('dashboard')} />
      ) : (
        <Dashboard />
      )}
    </div>
  )
}
