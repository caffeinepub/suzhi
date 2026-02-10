# Specification

## Summary
**Goal:** Mint the full initial supply of 1,000,000,000 SUZHI to the specified owner Principal exactly once, and align owner validation/error messaging with that Principal.

**Planned changes:**
- Set the SUZHI token initial owner Principal to `2psws-zhgt3-afmzp-mjr66-z74ph-qbyjh-zdc6u-b4yku-y7qm3-zl2ev-2ae` and mint `1_000_000_000` SUZHI to that Principal during initialization.
- Ensure the initialization/mint logic is idempotent so canister redeploy/upgrade does not mint the initial supply again.
- Update any owner/principal validation and related error messages to recognize the configured owner Principal and remove any references to `"[INSERT_YOUR_PRINCIPAL_ID_HERE]"` (keeping messages in English).

**User-visible outcome:** After deployment, the specified Principal holds exactly `1_000_000_000` SUZHI with no unintended balances for others, and upgrading the canister does not duplicate the initial mint.
