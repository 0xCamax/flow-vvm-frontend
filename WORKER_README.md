Worker instructions
===================

This project includes a simple queue-based worker to process swap execution jobs that are enqueued by the frontend.

Running the worker (simulation mode)
-----------------------------------

1. Add any queued jobs by using the app (the frontend posts to `/api/queue-swap` and writes `.swap-queue.json`).
2. Run the worker (will simulate executions):

```bash
npm run worker
```

On-chain execution (optional, opt-in)
------------------------------------

If you want the worker to actually attempt on-chain transactions, provide the following env vars and enable `ONCHAIN_EXECUTE`:

```bash
export PRIVATE_KEY="0x..."
export ARBITRUM_RPC_URL="https://arb1.example.rpc"
export ONCHAIN_EXECUTE=true
npm run worker
```

Caveats
-------
- The worker will attempt to call the `dispatchOrder_fillPropotionalFee` function on the contract address included in the queued job payload. Make sure the target contract and payload fields match the required ABI; otherwise the transaction will likely revert.
- This implementation is intended for development and prototyping. For production, use a hardened queue (Redis/BullMQ), proper retry/backoff, robust logging, secrets management (do not store private keys in plain env on shared systems), and guardian checks.
