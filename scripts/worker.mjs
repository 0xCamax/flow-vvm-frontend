import { readFile, writeFile } from 'fs/promises'
import path from 'path'

const QUEUE_FILE = path.join(process.cwd(), '.swap-queue.json')

async function readQueue() {
  try {
    const raw = await readFile(QUEUE_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch (e) {
    return []
  }
}

async function writeQueue(queue) {
  await writeFile(QUEUE_FILE, JSON.stringify(queue, null, 2), 'utf-8')
}

async function processQueue() {
  const queue = await readQueue()
  let changed = false

  const PRIVATE_KEY = process.env.PRIVATE_KEY
  const RPC_URL = process.env.ARBITRUM_RPC_URL
  const ONCHAIN = (process.env.ONCHAIN_EXECUTE || 'false').toLowerCase() === 'true'

  // If on-chain execution is requested but missing config, warn and fall back to simulation
  const canOnchain = ONCHAIN && PRIVATE_KEY && RPC_URL
  if (ONCHAIN && !canOnchain) {
    console.warn('[worker] ONCHAIN_EXECUTE=true but PRIVATE_KEY or ARBITRUM_RPC_URL missing — falling back to simulation')
  }

  // Lazily import viem and ABI only if on-chain execution is enabled
  let viem
  let P2PSwapABI
  if (canOnchain) {
    viem = await import('viem')
    P2PSwapABI = (await import('@evvm/viem-signature-library')).P2PSwapABI
  }

  for (const item of queue) {
    if (item.status !== 'queued') continue

    console.log('[worker] Processing', item.id)
    try {
      // If on-chain capability and explicitly enabled, attempt to send the contract tx
      if (canOnchain) {
        const { createPublicClient, createWalletClient, http, encodeFunctionData } = viem
        const { privateKeyToAccount } = await import('viem/accounts')

        const publicClient = createPublicClient({ transport: http(RPC_URL) })
        const walletClient = createWalletClient({
          transport: http(RPC_URL),
          account: privateKeyToAccount(PRIVATE_KEY),
        })

        // Build minimal metadata and args similar to client-side execution
        const metadata = {
          nonce: BigInt(Date.now()),
          tokenA: item.payload.token || '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
          tokenB: item.payload.token || '0x0000000000000000000000000000000000000000',
          orderId: BigInt(1),
          amountOfTokenBToFill: BigInt(item.payload.amount || '0'),
          signature: item.payload.signature || '0x',
        }

        const args = [
          item.payload.user,
          metadata,
          BigInt(item.payload.priorityFee || 0),
          BigInt(0),
          !!(item.payload.priority === 'high'),
          item.payload.signature || '0x',
        ]

        // p2p address: prefer payload.to (user-supplied), otherwise fallback to universal router
        const toAddress = item.payload.to
        const data = encodeFunctionData({ abi: P2PSwapABI, functionName: 'dispatchOrder_fillPropotionalFee', args })

        // Send transaction
        const tx = await walletClient.sendTransaction({ to: toAddress, data })
        console.log('[worker] Sent tx', tx)

        // Optionally wait for inclusion (not implemented to keep worker lean)
        item.status = 'executed'
        item.executedAt = new Date().toISOString()
        item.tx = tx
        changed = true
      } else {
        // Simulated execution
        await new Promise((r) => setTimeout(r, 1200))
        item.status = 'executed'
        item.executedAt = new Date().toISOString()
        item.result = { note: 'Simulated execution (no on-chain tx sent)' }
        changed = true
        console.log('[worker] Simulated execution for', item.id)
      }
    } catch (err) {
      console.error('[worker] Failed executing', item.id, err)
      item.status = 'failed'
      item.error = (err && err.message) || String(err)
      changed = true
    }
  }

  if (changed) await writeQueue(queue)
}

async function main() {
  console.log('[worker] Starting queue worker')
  await processQueue()
  console.log('[worker] Done')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
