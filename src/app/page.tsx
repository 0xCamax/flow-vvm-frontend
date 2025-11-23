import { ConnectButton } from '@/components/ConnectButton'
import { InvestmentComponent } from '@/components/InvestmentComponent'
import { Dashboard } from '@/components/Dashboard'
import { LandingPage } from '@/components/LandingPage'
import Image from 'next/image'
import { headers } from 'next/headers'

export default function Home() {
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
            href="https://www.evvm.info/docs/intro"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Image src="/evvm.svg" alt="EVVM" width={50} height={50} priority />
          </a>
          <div>
            <h1 style={{ margin: 0, color: '#00EE96', fontSize: '1.5rem' }}>
              FlowVVM Protocol
            </h1>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>
              Arbitrum Mainnet
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <InvestmentComponent />
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

      <LandingPage />
    </div>
  )
}
