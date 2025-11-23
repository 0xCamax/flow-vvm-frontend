'use client'
import React, { useState } from 'react'
import { PixelCard } from './pixel-ui/PixelCard'
import { PixelInput } from './pixel-ui/PixelInput'
import { PixelButton } from './pixel-ui/PixelButton'
import { useAppKitAccount } from '@reown/appkit/react'
import { writeContract, readContract } from '@wagmi/core'
import { config } from '@/config'
import { parseAbi, encodePacked, keccak256 } from 'viem'

// Uniswap V4 PoolManager on Arbitrum
const POOL_MANAGER_ADDRESS = '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865'

// Pool Key structure for Uniswap V4
interface PoolKey {
    currency0: `0x${string}`
    currency1: `0x${string}`
    fee: number
    tickSpacing: number
    hooks: `0x${string}`
}

const POOL_MANAGER_ABI = parseAbi([
    'function swap(tuple(address currency0, address currency1, uint24 fee, int24 tickSpacing, address hooks) key, tuple(bool zeroForOne, int256 amountSpecified, uint160 sqrtPriceLimitX96) params, bytes hookData) external returns (int256)',
    'function unlock(bytes data) external returns (bytes)'
])

export const UniswapV4Swap = () => {
    const { address } = useAppKitAccount()
    const [loading, setLoading] = useState(false)

    // Pool configuration
    const [currency0, setCurrency0] = useState('0x0000000000000000000000000000000000000000') // Native ETH
    const [currency1, setCurrency1] = useState('0xaf88d065e77c8cC2239327C5EDb3A432268e5831') // USDC
    const [fee, setFee] = useState('3000') // 0.3%
    const [tickSpacing, setTickSpacing] = useState('60')
    const [hooksAddress, setHooksAddress] = useState('0x0000000000000000000000000000000000000000')

    // Swap parameters
    const [amountIn, setAmountIn] = useState('')
    const [zeroForOne, setZeroForOne] = useState(true)

    // EVVM HookData
    const [evvmSignature, setEvvmSignature] = useState('')

    const handleSwap = async () => {
        if (!address || !amountIn) {
            alert('Please connect wallet and enter amount')
            return
        }

        setLoading(true)
        try {
            const poolKey: PoolKey = {
                currency0: currency0 as `0x${string}`,
                currency1: currency1 as `0x${string}`,
                fee: parseInt(fee),
                tickSpacing: parseInt(tickSpacing),
                hooks: hooksAddress as `0x${string}`
            }

            const swapParams = {
                zeroForOne: zeroForOne,
                amountSpecified: BigInt(amountIn),
                sqrtPriceLimitX96: zeroForOne
                    ? BigInt('4295128739') // MIN_SQRT_RATIO + 1
                    : BigInt('1461446703485210103287273052203988822378723970342') // MAX_SQRT_RATIO - 1
            }

            // Encode EVVM signature as hookData
            const hookData = evvmSignature
                ? (evvmSignature.startsWith('0x') ? evvmSignature : `0x${evvmSignature}`) as `0x${string}`
                : '0x' as `0x${string}`

            const tx = await writeContract(config, {
                address: POOL_MANAGER_ADDRESS,
                abi: POOL_MANAGER_ABI,
                functionName: 'swap',
                args: [poolKey, swapParams, hookData],
                value: zeroForOne && currency0 === '0x0000000000000000000000000000000000000000'
                    ? BigInt(amountIn)
                    : BigInt(0)
            })

            alert(`Swap executed! TX: ${tx}`)
            setAmountIn('')
        } catch (error) {
            console.error('Swap error:', error)
            alert('Swap failed: ' + (error as Error).message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <PixelCard title="Uniswap V4 Swap with EVVM Hook">
            <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Pool Configuration */}
                    <div style={{
                        background: 'var(--color-cloud)',
                        padding: '1rem',
                        border: '2px solid var(--color-wood)',
                        marginBottom: '1rem'
                    }}>
                        <h4 style={{
                            fontSize: '1rem',
                            color: 'var(--color-soil)',
                            marginBottom: '0.75rem',
                            fontFamily: 'var(--font-heading)'
                        }}>
                            Pool Configuration
                        </h4>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <PixelInput
                                label="Currency 0"
                                value={currency0}
                                onChange={(e) => setCurrency0(e.target.value)}
                                placeholder="0x..."
                                style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                            />

                            <PixelInput
                                label="Currency 1"
                                value={currency1}
                                onChange={(e) => setCurrency1(e.target.value)}
                                placeholder="0x..."
                                style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                            />

                            <PixelInput
                                label="Fee (bps)"
                                value={fee}
                                onChange={(e) => setFee(e.target.value)}
                                placeholder="3000"
                            />

                            <PixelInput
                                label="Tick Spacing"
                                value={tickSpacing}
                                onChange={(e) => setTickSpacing(e.target.value)}
                                placeholder="60"
                            />
                        </div>

                        <PixelInput
                            label="Hooks Address"
                            value={hooksAddress}
                            onChange={(e) => setHooksAddress(e.target.value)}
                            placeholder="0x..."
                            style={{ fontFamily: 'monospace', fontSize: '0.85rem', marginTop: '0.75rem' }}
                        />
                    </div>

                    {/* Swap Parameters */}
                    <div style={{
                        background: 'var(--color-wood-light)',
                        padding: '1rem',
                        border: '2px solid var(--color-soil)',
                        marginBottom: '1rem'
                    }}>
                        <h4 style={{
                            fontSize: '1rem',
                            color: 'var(--color-soil)',
                            marginBottom: '0.75rem',
                            fontFamily: 'var(--font-heading)'
                        }}>
                            Swap Parameters
                        </h4>

                        <div style={{ marginBottom: '0.75rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontFamily: 'var(--font-heading)',
                                fontSize: '0.7rem',
                                color: 'var(--color-soil)',
                                textTransform: 'uppercase'
                            }}>
                                Direction
                            </label>
                            <select
                                value={zeroForOne ? 'true' : 'false'}
                                onChange={(e) => setZeroForOne(e.target.value === 'true')}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    backgroundColor: 'var(--color-white)',
                                    border: '4px solid var(--color-soil)',
                                    color: 'var(--color-soil)',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '1rem',
                                    boxShadow: 'inset 4px 4px 0 rgba(0,0,0,0.1)',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="true">Currency 0 → Currency 1</option>
                                <option value="false">Currency 1 → Currency 0</option>
                            </select>
                        </div>

                        <PixelInput
                            label="Amount In (wei)"
                            type="number"
                            value={amountIn}
                            onChange={(e) => setAmountIn(e.target.value)}
                            placeholder="1000000000000000000"
                        />
                    </div>

                    {/* EVVM HookData */}
                    <div style={{
                        background: 'var(--color-gold)',
                        padding: '1rem',
                        border: '2px solid var(--color-soil)',
                        marginBottom: '1rem'
                    }}>
                        <h4 style={{
                            fontSize: '1rem',
                            color: 'var(--color-soil)',
                            marginBottom: '0.75rem',
                            fontFamily: 'var(--font-heading)'
                        }}>
                            EVVM HookData
                        </h4>

                        <PixelInput
                            label="EVVM Signature (hex)"
                            value={evvmSignature}
                            onChange={(e) => setEvvmSignature(e.target.value)}
                            placeholder="0x..."
                            style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                        />

                        <p style={{
                            fontSize: '0.75rem',
                            color: 'var(--color-soil)',
                            marginTop: '0.5rem',
                            lineHeight: '1.4'
                        }}>
                            This data will be passed to the Hook's beforeSwap callback. Include your EVVM-signed transaction payload here.
                        </p>
                    </div>

                    {/* Execute Button */}
                    <PixelButton
                        onClick={handleSwap}
                        disabled={loading || !address || !amountIn}
                        isLoading={loading}
                        style={{
                            width: '100%',
                            fontSize: '1.1rem',
                            padding: '1rem',
                            background: 'var(--color-green)',
                            color: 'var(--color-white)'
                        }}
                    >
                        Execute Swap with EVVM Hook
                    </PixelButton>

                    {!address && (
                        <p style={{
                            textAlign: 'center',
                            fontSize: '0.8rem',
                            color: '#ef4444',
                            marginTop: '0.5rem'
                        }}>
                            * Please connect your wallet
                        </p>
                    )}
                </div>
            </div>
        </PixelCard>
    )
}
