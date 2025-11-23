#!/usr/bin/env node
const fs = require('fs').promises
const path = require('path')

const QUEUE_FILE = path.join(process.cwd(), '.swap-queue.json')

async function readQueue() {
  try {
    const raw = await fs.readFile(QUEUE_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch (e) {
    return []
  }
}

async function writeQueue(queue) {
  await fs.writeFile(QUEUE_FILE, JSON.stringify(queue, null, 2), 'utf-8')
}

async function processQueue() {
  const queue = await readQueue()
  let changed = false

  for (const item of queue) {
    if (item.status !== 'queued') continue

    console.log('[worker] Processing', item.id)
    try {
      // Simulate processing time
      await new Promise((r) => setTimeout(r, 1500))

      // TODO: Replace with actual on-chain execution using a server-side signer (viem/wagmi)
      // If env vars PRIVATE_KEY and RPC_URL are provided, you could create a wallet and send txs here.

      item.status = 'executed'
      item.executedAt = new Date().toISOString()
      item.result = { note: 'Executed by local worker (simulation)' }
      changed = true
      console.log('[worker] Executed', item.id)
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
