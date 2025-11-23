import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const QUEUE_FILE = path.join(process.cwd(), '.swap-queue.json')

async function readQueue() {
  try {
    const raw = await fs.readFile(QUEUE_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch (e) {
    return []
  }
}

async function writeQueue(queue: any[]) {
  await fs.writeFile(QUEUE_FILE, JSON.stringify(queue, null, 2), 'utf-8')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body || !body.id) {
      return NextResponse.json({ error: 'Invalid payload, missing id' }, { status: 400 })
    }

    const queue = await readQueue()

    const entry = {
      id: body.id,
      createdAt: new Date().toISOString(),
      status: 'queued',
      payload: body,
    }

    queue.push(entry)
    await writeQueue(queue)

    return NextResponse.json({ success: true, queued: true, id: entry.id })
  } catch (error) {
    console.error('[queue-swap] Error enqueuing swap:', error)
    return NextResponse.json({ error: 'Failed to enqueue' }, { status: 500 })
  }
}
