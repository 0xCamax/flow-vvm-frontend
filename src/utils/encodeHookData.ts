import { encodeAbiParameters, parseAbiParameters } from 'viem'
import type { Transaction } from '@/components/Dashboard'

/**
 * Encodes EVVM transaction data for the FlowVVM Executor Hook
 * 
 * The hook expects:
 * - evvmId: uint256
 * - txArray: EvvmStructs.PayData[]
 * 
 * Each PayData contains:
 * - from: address
 * - to_address: address
 * - to_identity: string
 * - token: address
 * - amount: uint256
 * - priorityFee: uint256
 * - nonce: uint256
 * - priorityFlag: bool
 * - executor: address
 * - signature: bytes
 */

export interface EvvmPayData {
  from: `0x${string}`
  to_address: `0x${string}`
  to_identity: string
  token: `0x${string}`
  amount: bigint
  priorityFee: bigint
  nonce: bigint
  priorityFlag: boolean
  executor: `0x${string}`
  signature: `0x${string}`
}

export function encodeHookData(evvmId: bigint, transactions: Transaction[]): `0x${string}` {
  // Convert Transaction[] to EvvmPayData[]
  const payDataArray: EvvmPayData[] = transactions.map(tx => ({
    from: tx.user as `0x${string}`,
    to_address: tx.to as `0x${string}`,
    to_identity: tx.toIdentity || '',
    token: tx.token as `0x${string}`,
    amount: BigInt(tx.amount),
    priorityFee: BigInt(tx.priorityFee),
    nonce: BigInt(0), // You may want to track nonce properly
    priorityFlag: tx.priority === 'high',
    executor: tx.executor as `0x${string}`,
    signature: tx.signature as `0x${string}`
  }))

  // Encode as (uint256, tuple[])
  // The tuple structure matches EvvmStructs.PayData
  const encoded = encodeAbiParameters(
    parseAbiParameters('uint256, (address,address,string,address,uint256,uint256,uint256,bool,address,bytes)[]'),
    [
      evvmId,
      payDataArray.map(pd => [
        pd.from,
        pd.to_address,
        pd.to_identity,
        pd.token,
        pd.amount,
        pd.priorityFee,
        pd.nonce,
        pd.priorityFlag,
        pd.executor,
        pd.signature
      ])
    ]
  )

  return encoded
}

/**
 * Encodes a single transaction for hookData
 */
export function encodeSingleTransaction(evvmId: bigint, tx: Transaction): `0x${string}` {
  return encodeHookData(evvmId, [tx])
}
