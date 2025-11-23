'use client'
import React, { useState } from 'react'
import { PixelCard } from './pixel-ui/PixelCard'
import { PixelInput } from './pixel-ui/PixelInput'
import { PixelButton } from './pixel-ui/PixelButton'
import { useAppKitAccount } from '@reown/appkit/react'
import { writeContract } from '@wagmi/core'
import { config } from '@/config'
import { parseAbi } from 'viem'

const EVVM_ADDRESS = '0xfb505ae3d70ca90c90c4dd48d0d19f3686dfd682'

const EVVM_ABI = parseAbi([
  'function addBalance(address user, address token, uint256 amount) external'
])

export const AddBalanceComponent = () => {
  const { address } = useAppKitAccount()
  const [loading, setLoading] = useState(false)
  const [tokenAddress, setTokenAddress] = useState('0xaf88d065e77c8cC2239327C5EDb3A432268e5831')
  const [amount, setAmount] = useState('')
  const [targetAddress, setTargetAddress] = useState('')

  const handleAddBalance = async () => {
    if (!address || !tokenAddress || !amount) {
      alert('Please fill in all fields')
      return
    }

    const recipient = targetAddress || address

    setLoading(true)
    try {
      const tx = await writeContract(config, {
        address: EVVM_ADDRESS,
        abi: EVVM_ABI,
        functionName: 'addBalance',
        args: [
          recipient as `0x${string}`,
          tokenAddress as `0x${string}`,
          BigInt(amount)
        ]
      })

      alert(`Balance added successfully! TX: ${tx}`)
      setAmount('')
      setTargetAddress('')
    } catch (error) {
      console.error('Error adding balance:', error)
      alert('Error adding balance: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PixelCard title="Add EVVM Balance">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <PixelInput
          label="Token Address"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          placeholder="0x..."
          style={{ fontFamily: 'monospace' }}
        />

        <PixelInput
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
        />

        <PixelInput
          label="Target Address (Optional - defaults to your address)"
          value={targetAddress}
          onChange={(e) => setTargetAddress(e.target.value)}
          placeholder="0x..."
          style={{ fontFamily: 'monospace' }}
        />

        <PixelButton
          onClick={handleAddBalance}
          disabled={loading || !address || !tokenAddress || !amount}
          isLoading={loading}
          style={{ marginTop: '0.5rem', width: '100%' }}
        >
          Add Balance
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
    </PixelCard>
  )
}
