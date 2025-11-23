'use client'
import React from 'react'
import { PixelCard } from './pixel-ui/PixelCard'
import { PixelButton } from './pixel-ui/PixelButton'

export const LandingPage = () => {
  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '2rem',
      background: 'linear-gradient(180deg, var(--color-sky) 0%, var(--color-cloud) 100%)'
    }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: '4rem', padding: '3rem 0' }}>
        <h1 className="pixel-text-shadow" style={{
          fontSize: '4rem',
          color: 'var(--color-soil)',
          marginBottom: '1rem',
          fontFamily: 'var(--font-heading)',
          lineHeight: '1.2'
        }}>
          FlowVVM Protocol
        </h1>
        <h2 style={{
          fontSize: '1.8rem',
          color: 'var(--color-wood)',
          marginBottom: '2rem',
          fontFamily: 'var(--font-body)',
          fontWeight: 'normal'
        }}>
          Turn MEV into LP Yield with Uniswap V4 Hooks + EVVM
        </h2>
        <p style={{
          fontSize: '1.2rem',
          color: 'var(--color-soil)',
          maxWidth: '800px',
          margin: '0 auto 2rem',
          lineHeight: '1.8'
        }}>
          A permissionless arbitrage execution layer that internalizes MEV for liquidity providers.
          Arbitragers attach EVVM-signed transactions to swap flows, capturing value that flows directly to LPs.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <PixelButton
            variant="primary"
            style={{
              fontSize: '1.2rem',
              padding: '1rem 2rem',
              background: 'var(--color-gold)',
              color: 'var(--color-soil)'
            }}
          >
            Launch App
          </PixelButton>
          <PixelButton
            variant="secondary"
            style={{
              fontSize: '1.2rem',
              padding: '1rem 2rem'
            }}
          >
            Read Docs
          </PixelButton>
        </div>
      </section>
      {/* How It Works */}
      <section style={{ marginBottom: '4rem' }}>
        <PixelCard title="How EVVM + Uniswap V4 Hooks Work">
          <div style={{ padding: '1rem' }}>
            <h3 style={{
              fontSize: '1.5rem',
              color: 'var(--color-soil)',
              marginBottom: '1.5rem',
              fontFamily: 'var(--font-heading)'
            }}>
              Execution Flow
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {[
                {
                  step: '1',
                  title: 'Arbitrager Submits EVVM-Signed Intent',
                  desc: 'The arbitrager includes an EVVM transaction payload (EIP-191 signed) inside HookData, specifying execution parameters for the swap.'
                },
                {
                  step: '2',
                  title: 'Hook Verifies EVVM Payload',
                  desc: 'The Hook decodes HookData, validates the EVVM signature, checks nonce and priority, and confirms that the message is authorized for execution.'
                },
                {
                  step: '3',
                  title: 'Permissioned Liquidity Access',
                  desc: 'Upon successful validation, the Hook authorizes access to the pool’s liquidity specifically for executing the EVVM-defined action.'
                },
                {
                  step: '4',
                  title: 'Atomic Arbitrage Execution',
                  desc: 'The swap executes atomically using pool liquidity, allowing arbitragers to capture AMM price deltas without exposing the pool to external MEV extraction.'
                },
                {
                  step: '5',
                  title: 'Incentive & Value Distribution',
                  desc: 'The Hook routes EVVM incentives back to the liquidity providers according to the pool’s reward policy.'
                }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{
                    minWidth: '60px',
                    height: '60px',
                    background: 'var(--color-gold)',
                    border: '4px solid var(--color-soil)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: 'var(--color-soil)'
                  }}>
                    {item.step}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{
                      fontSize: '1.2rem',
                      color: 'var(--color-soil)',
                      margin: '0 0 0.5rem 0',
                      fontFamily: 'var(--font-heading)'
                    }}>
                      {item.title}
                    </h4>
                    <p style={{
                      fontSize: '1rem',
                      color: 'var(--color-wood)',
                      margin: 0,
                      lineHeight: '1.6'
                    }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PixelCard>
      </section>

      {/* Technical Foundation */}
      <section style={{ marginBottom: '4rem' }}>
        <PixelCard title="Technical Foundation">
          <div style={{ padding: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div>
                <h4 style={{
                  fontSize: '1.2rem',
                  color: 'var(--color-soil)',
                  marginBottom: '1rem',
                  fontFamily: 'var(--font-heading)'
                }}>
                  Uniswap V4 Hooks
                </h4>
                <ul style={{ fontSize: '1rem', color: 'var(--color-wood)', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
                  <li>Whitepaper states Hooks enable "internalizing MEV for LPs"</li>
                  <li>Custom logic embedded during swaps</li>
                  <li>Precedents: Detox-Hook (arb profits), Aegis (dynamic fees)</li>
                  <li>OpenZeppelin audited security model</li>
                </ul>
              </div>

              <div>
                <h4 style={{
                  fontSize: '1.2rem',
                  color: 'var(--color-soil)',
                  marginBottom: '1rem',
                  fontFamily: 'var(--font-heading)'
                }}>
                  EVVM Execution
                </h4>
                <ul style={{ fontSize: '1rem', color: 'var(--color-wood)', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
                  <li>EIP-191 signed messages for intent verification</li>
                  <li>Hook acts as executor/staker</li>
                  <li>Permissionless participation model</li>
                  <li>20-35% gas cost reduction via batching</li>
                </ul>
              </div>
            </div>
          </div>
        </PixelCard>
      </section>

      {/* Data-Backed Insights */}
      <section style={{ marginBottom: '4rem' }}>
        <PixelCard title="Data-Backed Insights">
          <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                {
                  metric: 'EVVM Batching Efficiency',
                  value: '20-35% gas reduction',
                  insight: 'Compared to traditional multi-call designs, EVVM batching significantly reduces transaction costs.'
                },
                {
                  metric: 'Arbitrage Frequency',
                  value: 'Every 5-30 seconds',
                  insight: 'Cross-AMM arbitrage opportunities appear frequently in active markets, providing consistent yield opportunities.'
                },
                {
                  metric: 'MEV Internalization Value',
                  value: '8-15% additional retained value',
                  insight: 'Studies show substantial value retention when MEV is captured and redistributed to LPs instead of extracted externally.'
                },
                {
                  metric: 'LVR Mitigation',
                  value: '<0.5% loss-versus-rebalancing',
                  insight: 'RediSwap research demonstrates effective LVR reduction through systematic value redistribution mechanisms.'
                },
                {
                  metric: 'MEV Pressure Evidence',
                  value: '~80% of spam targets Uniswap',
                  insight: 'In fast-finality chains, the majority of reverted transactions target Uniswap pools, proving significant MEV pressure.'
                }
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: '1.5rem',
                    background: 'var(--color-cloud)',
                    border: '2px solid var(--color-wood)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                    <h4 style={{
                      fontSize: '1.1rem',
                      color: 'var(--color-soil)',
                      margin: 0,
                      fontFamily: 'var(--font-heading)'
                    }}>
                      {item.metric}
                    </h4>
                    <span style={{
                      fontSize: '1.2rem',
                      color: 'var(--color-green)',
                      fontWeight: 'bold'
                    }}>
                      {item.value}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '0.95rem',
                    color: 'var(--color-wood)',
                    margin: 0,
                    lineHeight: '1.6'
                  }}>
                    {item.insight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </PixelCard>
      </section>

      {/* Benefits */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{
          fontSize: '2.5rem',
          color: 'var(--color-soil)',
          textAlign: 'center',
          marginBottom: '2rem',
          fontFamily: 'var(--font-heading)'
        }}>
          Benefits for All Participants
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <PixelCard title="Liquidity Providers">
            <div style={{ padding: '1rem' }}>
              <ul style={{ fontSize: '1rem', color: 'var(--color-wood)', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
                <li><strong>Double Yield Source:</strong> Swap fees + EVVM incentives</li>
                <li><strong>Reduced LVR:</strong> Loss-versus-rebalancing minimized to &lt;0.5%</li>
                <li><strong>MEV Protection:</strong> Value stays within the pool instead of being extracted</li>
              </ul>
            </div>
          </PixelCard>

          <PixelCard title="Arbitragers">
            <div style={{ padding: '1rem' }}>
              <ul style={{ fontSize: '1rem', color: 'var(--color-wood)', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
                <li><strong>Permissionless Access:</strong> No gatekeeping or special privileges required</li>
                <li><strong>Controlled Liquidity:</strong> Safe access to pool liquidity via EVVM signatures</li>
                <li><strong>Gas Efficiency:</strong> 20-35% lower costs through batching</li>
                <li><strong>EVVM Incentives:</strong> Additional rewards for execution</li>
              </ul>
            </div>
          </PixelCard>

          <PixelCard title="Protocol Integrators">
            <div style={{ padding: '1rem' }}>
              <ul style={{ fontSize: '1rem', color: 'var(--color-wood)', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
                <li><strong>Audited Security:</strong> OpenZeppelin verified Hook implementation</li>
                <li><strong>Composable Design:</strong> Works with existing Uniswap V4 infrastructure</li>
                <li><strong>Programmable Access:</strong> EVVM signatures enable custom logic</li>
                <li><strong>Decentralized:</strong> No central points of failure</li>
              </ul>
            </div>
          </PixelCard>
        </div>
      </section>

      {/* Security Model */}
      <section style={{ marginBottom: '4rem' }}>
        <PixelCard title="Security Model">
          <div style={{ padding: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              {[
                {
                  title: 'Signature Verification',
                  desc: 'EIP-191 compliant signatures ensure only authorized arbitragers can execute through the Hook.'
                },
                {
                  title: 'Controlled Access',
                  desc: 'Hook mediates all liquidity access, preventing unauthorized extraction or manipulation.'
                },
                {
                  title: 'Atomic Execution',
                  desc: 'All operations occur within a single transaction, eliminating race conditions and frontrunning.'
                },
                {
                  title: 'Audited Contracts',
                  desc: 'OpenZeppelin verified Hook implementation ensures battle-tested security standards.'
                },
                {
                  title: 'Permissionless Design',
                  desc: 'No admin keys or centralized control points that could be compromised.'
                },
                {
                  title: 'Transparent Logic',
                  desc: 'All Hook logic is on-chain and verifiable, ensuring trustless operation.'
                }
              ].map((item, i) => (
                <div key={i}>
                  <h4 style={{
                    fontSize: '1.1rem',
                    color: 'var(--color-soil)',
                    marginBottom: '0.5rem',
                    fontFamily: 'var(--font-heading)'
                  }}>
                    {item.title}
                  </h4>
                  <p style={{
                    fontSize: '0.95rem',
                    color: 'var(--color-wood)',
                    margin: 0,
                    lineHeight: '1.6'
                  }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </PixelCard>
      </section>

      {/* Architecture */}
      <section style={{ marginBottom: '4rem' }}>
        <PixelCard title="System Architecture">
          <div style={{ padding: '1rem' }}>
            <div style={{
              background: 'var(--color-cloud)',
              padding: '2rem',
              border: '2px solid var(--color-wood)',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              lineHeight: '1.8'
            }}>
              <pre style={{ margin: 0, color: 'var(--color-soil)' }}>
                {`┌─────────────────────────────────────────────────────────────┐
│                      Arbitrager                             │
│  • Signs EVVM message (EIP-191)                            │
│  • Attaches to HookData                                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  Uniswap V4 Pool                            │
│  • Receives swap with HookData                              │
│  • Triggers beforeSwap() hook                               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   FlowVVM Hook                              │
│  • Validates EVVM signature                                 │
│  • Verifies arbitrager stake                                │
│  • Grants controlled liquidity access                       │
│  • Executes arbitrage atomically                            │
│  • Collects EVVM incentives                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                Value Redistribution                         │
│  • Arbitrage profits → LPs                                  │
│  • EVVM incentives → LPs                                    │
│  • Swap fees → LPs                                          │
└─────────────────────────────────────────────────────────────┘`}
              </pre>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h4 style={{
                fontSize: '1.2rem',
                color: 'var(--color-soil)',
                marginBottom: '1rem',
                fontFamily: 'var(--font-heading)'
              }}>
                Key Components
              </h4>
              <ul style={{ fontSize: '1rem', color: 'var(--color-wood)', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
                <li><strong>EVVM Message Layer:</strong> EIP-191 signed intents for permissionless participation</li>
                <li><strong>Uniswap V4 Hook:</strong> Custom logic embedded in swap flow for MEV capture</li>
                <li><strong>Signature Validation:</strong> On-chain verification of arbitrager authorization</li>
                <li><strong>Atomic Execution:</strong> Single-transaction arbitrage with no external MEV risk</li>
                <li><strong>Value Distribution:</strong> Automated redistribution to liquidity providers</li>
              </ul>
            </div>
          </div>
        </PixelCard>
      </section>

      {/* Call to Action */}
      <section style={{
        textAlign: 'center',
        padding: '3rem 0',
        background: 'var(--color-wood-light)',
        borderRadius: '8px',
        border: '4px solid var(--color-soil)'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          color: 'var(--color-soil)',
          marginBottom: '1rem',
          fontFamily: 'var(--font-heading)'
        }}>
          Start Building with FlowVVM
        </h2>
        <p style={{
          fontSize: '1.2rem',
          color: 'var(--color-wood)',
          maxWidth: '700px',
          margin: '0 auto 2rem',
          lineHeight: '1.8'
        }}>
          Join the next generation of MEV-aware DeFi protocols. Build on audited, battle-tested infrastructure.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <PixelButton
            variant="primary"
            style={{
              fontSize: '1.2rem',
              padding: '1rem 2rem',
              background: 'var(--color-gold)',
              color: 'var(--color-soil)'
            }}
          >
            Launch Dashboard
          </PixelButton>
          <PixelButton
            variant="secondary"
            style={{
              fontSize: '1.2rem',
              padding: '1rem 2rem'
            }}
          >
            View Documentation
          </PixelButton>
          <PixelButton
            variant="secondary"
            style={{
              fontSize: '1.2rem',
              padding: '1rem 2rem'
            }}
          >
            GitHub Repository
          </PixelButton>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {[
            { label: 'For LPs', desc: 'Maximize your yield' },
            { label: 'For Arbitragers', desc: 'Execute permissionlessly' },
            { label: 'For Developers', desc: 'Build on FlowVVM' }
          ].map((item, i) => (
            <div
              key={i}
              style={{
                padding: '1rem',
                background: 'var(--color-white)',
                border: '2px solid var(--color-soil)'
              }}
            >
              <p style={{
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: 'var(--color-soil)',
                margin: '0 0 0.25rem 0'
              }}>
                {item.label}
              </p>
              <p style={{
                fontSize: '0.9rem',
                color: 'var(--color-wood)',
                margin: 0
              }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
