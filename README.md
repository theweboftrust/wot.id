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

## Documentation
- `/principles/wotid_core_principles.md`: The 10 fundamental principles guiding the wot.id ecosystem, including open technological environment, strict peer-to-peer operation, guaranteed human identity, and decentralized governance.
- `/principles/wotid_technical_design_principles.md`: The 10 technical design principles that define the implementation approach, covering DAG architecture, data storage strategy, crypto-agility, and interoperability standards.
- `/docs`: Contains migration guides and architecture documentation.
