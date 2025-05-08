# Move/IOTA Node Integration Plan

## Overview
This document describes how the Rust backend will interact with Move contracts and the rebased IOTA node for wot.id identity and credential flows.

## Steps
1. Add Move SDK (or FFI bindings) as dependency to backend when available.
2. Initialize client in AppState.
3. For `/identity/:did`, call Move contract to resolve DID and fetch document.
4. For `/credential`, call Move contract to issue a new credential.
5. For `/move`, allow generic Move contract invocation for advanced flows.
6. Handle errors, transaction status, and state updates.

## TODO
- Update this doc as Move SDKs and contract patterns are released by IOTA Foundation.
- Add code samples for contract calls as soon as SDK is available.
