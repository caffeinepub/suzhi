# Specification

## Summary
**Goal:** Replace the current in-memory SUZHI balance behavior with a real, persistent ICRC-1-compatible ledger, mint the initial supply once to the configured owner, and ensure the existing wallet UI shows correct balances and supports transfers.

**Planned changes:**
- Implement an ICRC-1-compatible SUZHI ledger inside the existing single-actor Motoko canister, exposing standard token info, balance, and transfer endpoints.
- Persist ledger state across upgrades (balances, total supply, token metadata, and an `initialMintCompleted` guard), including any required migration to preserve existing balances where possible.
- Mint the full initial supply (1_000_000_000) exactly once to owner principal `2psws-zhgt3-afmzp-mjr66-z74ph-qbyjh-zdc6u-b4yku-y7qm3-zl2ev-2ae`, preventing double-mint on redeploy/upgrade.
- Wire the wallet balance/transfer flow to the ICRC-1 ledger (either via backend-compatible wrapper methods or by updating frontend hooks to call ICRC-1 endpoints), ensuring English user-facing errors (e.g., insufficient balance).

**User-visible outcome:** Signed-in users see their correct SUZHI balance in the Wallet section and can transfer SUZHI to another principal, with clear English errors for insufficient balance; balances remain correct after canister upgrades.
