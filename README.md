# wot.id (Clean Slate)

This is the new, IOTA-native, Move- and Rust-powered wot.id project. It is fully aligned with the wot.id core and design principles:

- Canonical, composable identity (IOTA DID, Move assets)
- Modular, atomic data (no monolithic profiles)
- Strict decentralization (on-chain, no DB, no Ceramic)
- Crypto-agility and PQC readiness
- Peer-to-peer, device-to-device attestation flows

## Stack
- IOTA rebased node (Move, Rust)
- Move contracts for identity, credentials, trust
- (Planned) Modern React/Next.js frontend
- (Planned) Rust backend (optional)

## Migration Plan
- Legacy codebase is archived as `wot.id_0.1`.
- Only atomic, reviewed CSS and UI fragments will be migrated, with no legacy JS/TS logic.
- All modules reference documented wot.id principles.

---

See `/principles` for core and design principles. See `/docs` for migration and architecture notes.
