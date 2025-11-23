'use client'
import React, { useState, useEffect } from 'react'
import { PixelCard } from './pixel-ui/PixelCard'
import { PixelInput } from './pixel-ui/PixelInput'
import { PixelButton } from './pixel-ui/PixelButton'
import { useAppKitAccount } from '@reown/appkit/react'
import { writeContract } from '@wagmi/core'
import { config } from '@/config'
import { parseAbi, encodeAbiParameters, parseAbiParameters, parseUnits } from 'viem'
import { encodeSingleTransaction } from '@/utils/encodeHookData'
import type { Transaction } from './Dashboard'

// Uniswap Universal Router on Arbitrum
const UNIVERSAL_ROUTER = '0xA51afAFe0263b40EdaEf0Df8781eA9aa03E381a3' as `0x${string}`

// FIX #1: Commands should be numbers, not strings
const Commands = {
    V3_SWAP_EXACT_IN: 0x00,
    V3_SWAP_EXACT_OUT: 0x01,
    PERMIT2_TRANSFER_FROM: 0x02,
    PERMIT2_PERMIT_BATCH: 0x03,
    SWEEP: 0x04,
    TRANSFER: 0x05,
    PAY_PORTION: 0x06,
    V2_SWAP_EXACT_IN: 0x08,
    V2_SWAP_EXACT_OUT: 0x09,
    PERMIT2_PERMIT: 0x0a,
    WRAP_ETH: 0x0b,
    UNWRAP_WETH: 0x0c,
    PERMIT2_TRANSFER_FROM_BATCH: 0x0d,
    BALANCE_CHECK_ERC20: 0x0e,
    V4_SWAP: 0x10, // ← CORRECT COMMAND
    V3_POSITION_MANAGER_PERMIT: 0x11,
    V3_POSITION_MANAGER_CALL: 0x12,
    V4_INITIALIZE_POOL: 0x13,
    V4_POSITION_MANAGER_CALL: 0x14,
    EXECUTE_SUB_PLAN: 0x21,
}

interface PoolKey {
    currency0: `0x${string}`
    currency1: `0x${string}`
    fee: number
    tickSpacing: number
    hooks: `0x${string}`
}

const UNIVERSAL_ROUTER_ABI = parseAbi([
    'function execute(bytes calldata commands, bytes[] calldata inputs, uint256 deadline) external payable',
])

interface UniswapV4SwapProps {
    latestTransaction?: Transaction
}

export const UniswapV4Swap = ({ latestTransaction }: UniswapV4SwapProps) => {
    const { address } = useAppKitAccount()
    const [loading, setLoading] = useState(false)
    const [approving, setApproving] = useState(false)
    const [isApproved, setIsApproved] = useState(false)
    const [error, setError] = useState<string>('')

    const [currency0, setCurrency0] = useState('0x0000000000000000000000000000000000000000')
    const [currency1, setCurrency1] = useState('0xaf88d065e77c8cC2239327C5EDb3A432268e5831')
    const [fee, setFee] = useState('100')
    const [tickSpacing, setTickSpacing] = useState('1')
    const [hooksAddress, setHooksAddress] = useState('0x756fDfcF1E742F9B02A4f652f914D896534B4080')

    const [amountIn, setAmountIn] = useState('')
    const [zeroForOne, setZeroForOne] = useState(true)

    const [evvmSignature, setEvvmSignature] = useState('')
    const [evvmId, setEvvmId] = useState('69420')

    useEffect(() => {
        if (latestTransaction) {
            try {
                const encoded = encodeSingleTransaction(BigInt(evvmId), latestTransaction)
                setEvvmSignature(encoded)
                setError('')
            } catch (error) {
                console.error('Error encoding transaction:', error)
                setError('Failed to encode transaction')
            }
        }
    }, [latestTransaction, evvmId])

    const needsApproval = () => {
        if (zeroForOne && currency0 === '0x0000000000000000000000000000000000000000') {
            return false
        }
        if (!zeroForOne && currency1 === '0x0000000000000000000000000000000000000000') {
            return false
        }
        return true
    }

    const handleApprove = async () => {
        if (!address || !amountIn) {
            setError('Address or amount missing')
            return
        }

        const tokenToApprove = zeroForOne ? currency0 : currency1

        if (tokenToApprove === '0x0000000000000000000000000000000000000000') {
            setIsApproved(true)
            return
        }

        setApproving(true)
        setError('')
        try {
            const ERC20_ABI = parseAbi([
                'function approve(address spender, uint256 amount) external returns (bool)',
            ])

            const tx = await writeContract(config, {
                address: tokenToApprove as `0x${string}`,
                abi: ERC20_ABI,
                functionName: 'approve',
                args: [UNIVERSAL_ROUTER, BigInt(amountIn)],
            })

            console.log('Approval transaction:', tx)
            setIsApproved(true)
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error)
            console.error('Approval error:', error)
            setError(`Approval failed: ${msg}`)
        } finally {
            setApproving(false)
        }
    }

    const handleSwap = async () => {
        if (!address || !amountIn) {
            setError('Address or amount missing')
            return
        }

        setLoading(true)
        setError('')
        try {
            const poolKey: PoolKey = {
                currency0: currency0 as `0x${string}`,
                currency1: currency1 as `0x${string}`,
                fee: parseInt(fee),
                tickSpacing: parseInt(tickSpacing),
                hooks: hooksAddress as `0x${string}`,
            }

            // FIX #2: Validate fee is in correct range (0-1000000)
            if (poolKey.fee < 0 || poolKey.fee > 1000000) {
                setError(`Invalid fee: ${poolKey.fee}. Must be 0-1000000`)
                return
            }

            // Prepare hookData
            const hookData = evvmSignature && evvmSignature !== ''
                ? (evvmSignature.startsWith('0x') ? evvmSignature : `0x${evvmSignature}`)
                : '0x'

            console.log('Swap params:', {
                poolKey,
                zeroForOne,
                amountIn,
                hookData,
            })

            // FIX #3: Use negative amount for exact input swaps
            const amountSpecified = -BigInt(amountIn)

            // Encode V4_SWAP parameters
            const v4SwapParams = encodeAbiParameters(
                parseAbiParameters('(address,address,uint24,int24,address),bool,int128,uint128,bytes'),
                [
                    [poolKey.currency0, poolKey.currency1, poolKey.fee, poolKey.tickSpacing, poolKey.hooks],
                    zeroForOne,
                    amountSpecified, // FIX: Use negative for exact input
                    BigInt(0), // amountOutMinimum
                    hookData as `0x${string}`,
                ]
            )

            // FIX #4: Properly encode commands as packed bytes
            // For V4_SWAP alone: '0x10'
            const commands = '0x10' as `0x${string}`
            const inputs = [v4SwapParams] as `0x${string}`[]

            // Longer deadline
            const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600) // 1 hour

            const txValue = zeroForOne && currency0 === '0x0000000000000000000000000000000000000000'
                ? BigInt(amountIn)
                : BigInt(0)

            console.log('Executing V4_SWAP:', {
                command: commands,
                amountSpecified: amountSpecified.toString(),
                txValue: txValue.toString(),
                deadline: deadline.toString(),
            })

            const tx = await writeContract(config, {
                address: UNIVERSAL_ROUTER,
                abi: UNIVERSAL_ROUTER_ABI,
                functionName: 'execute',
                args: [commands, inputs, deadline],
                value: txValue,
            })

            console.log('Swap transaction sent:', tx)
            setAmountIn('')
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error)
            console.error('Swap error:', error)
            setError(`Swap failed: ${msg}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <PixelCard title="Uniswap V4 Swap via Universal Router">
            <div style={{ padding: '1rem' }}>
                {/* Info Banner */}
                <div style={{
                    background: '#dbeafe',
                    border: '2px solid #3b82f6',
                    padding: '1rem',
                    marginBottom: '1rem',
                    borderRadius: '4px'
                }}>
                    <p style={{
                        fontSize: '0.85rem',
                        color: '#1e40af',
                        margin: 0,
                        lineHeight: '1.5'
                    }}>
                        <strong>ℹ️ Universal Router:</strong> Swaps are executed through the Universal Router using the V4_SWAP command (0x10), which routes to your pool and passes hookData to your EVVM hook.
                    </p>
                </div>

                {/* Error Display */}
                {error && (
                    <div style={{
                        background: '#fee2e2',
                        border: '2px solid #ef4444',
                        padding: '1rem',
                        marginBottom: '1rem',
                        borderRadius: '4px'
                    }}>
                        <p style={{
                            fontSize: '0.85rem',
                            color: '#991b1b',
                            margin: 0,
                            lineHeight: '1.5',
                            wordBreak: 'break-word'
                        }}>
                            <strong>❌ Error:</strong> {error}
                        </p>
                    </div>
                )}
            </div>

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
                            onChange={(e) => { setCurrency0(e.target.value); setError(''); }}
                            placeholder="0x... (or 0x0 for ETH)"
                            style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                        />

                        <PixelInput
                            label="Currency 1"
                            value={currency1}
                            onChange={(e) => { setCurrency1(e.target.value); setError(''); }}
                            placeholder="0x..."
                            style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                        />

                        <PixelInput
                            label="Fee (basis points)"
                            value={fee}
                            onChange={(e) => { setFee(e.target.value); setError(''); }}
                            placeholder="100 = 0.01%"
                        />

                        <PixelInput
                            label="Tick Spacing"
                            value={tickSpacing}
                            onChange={(e) => { setTickSpacing(e.target.value); setError(''); }}
                            placeholder="1"
                        />
                    </div>

                    <PixelInput
                        label="Hooks Address"
                        value={hooksAddress}
                        onChange={(e) => { setHooksAddress(e.target.value); setError(''); }}
                        placeholder="0x... (your EVVM hook contract)"
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
                            onChange={(e) => { setZeroForOne(e.target.value === 'true'); setError(''); }}
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
                        label="Amount (in smallest unit)"
                        type="number"
                        value={amountIn}
                        onChange={(e) => { setAmountIn(e.target.value); setError(''); }}
                        placeholder="e.g., 1000000 for 1 USDC (6 decimals)"
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
                        EVVM Configuration
                    </h4>

                    <PixelInput
                        label="EVVM ID"
                        value={evvmId}
                        onChange={(e) => { setEvvmId(e.target.value); setError(''); }}
                        placeholder="69420"
                        style={{ marginBottom: '0.75rem' }}
                    />

                    <PixelInput
                        label="EVVM HookData (auto-filled from transaction)"
                        value={evvmSignature}
                        onChange={(e) => { setEvvmSignature(e.target.value); setError(''); }}
                        placeholder="0x... (auto-filled when transaction is created)"
                        style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                    />

                    <p style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-soil)',
                        marginTop: '0.5rem',
                        lineHeight: '1.4'
                    }}>
                        {latestTransaction
                            ? `✅ Auto-filled with transaction from ${latestTransaction.user.slice(0, 6)}...${latestTransaction.user.slice(-4)}`
                            : '⚠️ Create a payment signature above to auto-fill this field'
                        }
                    </p>
                </div>

                {/* Approve & Execute Buttons */}
                {needsApproval() && !isApproved && (
                    <PixelButton
                        onClick={handleApprove}
                        disabled={approving || !address || !amountIn}
                        isLoading={approving}
                        style={{
                            width: '100%',
                            fontSize: '1.1rem',
                            padding: '1rem',
                            background: 'var(--color-gold)',
                            color: 'var(--color-soil)',
                            marginBottom: '0.5rem'
                        }}
                    >
                        {approving ? 'Approving...' : 'Approve Token'}
                    </PixelButton>
                )}

                <PixelButton
                    onClick={handleSwap}
                    disabled={loading || !address || !amountIn || (needsApproval() && !isApproved)}
                    isLoading={loading}
                    style={{
                        width: '100%',
                        fontSize: '1.1rem',
                        padding: '1rem',
                        background: 'var(--color-green)',
                        color: 'var(--color-white)'
                    }}
                >
                    Execute Swap via Universal Router
                </PixelButton>

                {needsApproval() && !isApproved && (
                    <p style={{
                        textAlign: 'center',
                        fontSize: '0.8rem',
                        color: '#f59e0b',
                        marginTop: '0.5rem'
                    }}>
                        ⚠️ You need to approve the token before swapping
                    </p>
                )}

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
        </PixelCard>
    )
}