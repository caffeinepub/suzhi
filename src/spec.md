# Specification

## Summary
**Goal:** Deploy the SUZHI dApp on ICP with Internet Identity onboarding, a sequential Citizen Registry, an ICRC-1 SUZHI token, Proof-of-Contribution rewards, and a token-based DAO, all presented in an eco-city themed dashboard UI.

**Planned changes:**
- Integrate Internet Identity sign-in/out in the frontend and use the authenticated principal for all authenticated actions.
- Add a Motoko Citizen Registry that onboards principals and assigns/persists unique sequential citizen IDs in stable memory.
- Implement the SUZHI ICRC-1 token in Motoko with max supply 1,000,000,000, transferable balances, and a configurable transfer fee (default 0.0001 tokens in base units).
- Mint the full SUZHI supply at initialization to a configured owner principal (with a safe, controller-restricted one-time method if the placeholder owner principal is still present).
- Add an owner-restricted `bulkAirdrop(recipients: [Principal], amount: Nat)` method with clear error handling for failed transfers.
- Implement Proof of Contribution work logs (Physical, Knowledge, Creative, Wellness) with creation, storage in stable memory, and exactly two unique peer verifications triggering an automatic SUZHI reward transfer.
- Add deterministic, configurable (admin-only) reward parameters and record the reward amount paid per work log.
- Implement a One Token, One Vote DAO: proposal submission (description, budget, timeline), 7-day discussion, 5-day voting, >50% approval rule, and automatic on-chain execution (at minimum: mark executed and perform a deterministic action such as transferring budget from a defined treasury/owner account).
- Build the dashboard UI (English-only) using the Gold (#D4AF37), Brown (#4B3621), and Earthy (#C2B280) palette with sections: User Profile (principal + citizen ID), Token Wallet (balance + transfer + optional buy placeholder), Contribution Logger (create/view/verify), and Governance Portal (list/view/submit/vote with phase countdowns), styled with a coherent eco-city theme.

**User-visible outcome:** Users can sign in with Internet Identity, onboard to receive a sequential Citizen ID, view and transfer SUZHI, log contributions that get rewarded after two peer verifications, and participate in governance by submitting and voting on proposals from an eco-city themed dashboard.
