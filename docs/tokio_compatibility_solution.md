# Tokio Compatibility Solution

## Problem Statement

The wot.id project faces a critical dependency conflict:

- **Identity.rs Library**: Requires tokio 1.43.0 exactly
- **Backend Requirements**: Needs tokio 1.45.0+ (for axum 0.8+ and reqwest 0.12+)

This conflict is tracked as [issue #1665](https://github.com/iotaledger/identity.rs/issues/1665) in the identity.rs repository. The identity.rs library has not been updated to support newer tokio versions.

## Solution Architecture

To resolve this issue, we've implemented a process isolation approach:

1. **Separate Microservice**: Created an identity-service microservice that uses tokio 1.43.0 and contains all identity.rs functionality
2. **HTTP API Communication**: Established REST API communication between the main backend (using tokio 1.45+) and the identity service
3. **Dependency Isolation**: Removed direct identity.rs dependencies from the main backend
4. **Client Integration**: Added client code in the backend to communicate with the isolated service

## System Components

| Component | Tokio Version | Communication |
|-----------|---------------|--------------|
| Backend API | 1.45.0+ | HTTP client (reqwest) |
| Identity Service | 1.43.0 | HTTP server (axum 0.7.x) |

## Benefits of this Architecture

1. **Complete Dependency Isolation**: Each service has its own dependency tree
2. **System Resilience**: Identity service failures don't crash the main backend
3. **Future Compatibility**: Easy to merge functionality when identity.rs is updated
4. **Simplified Upgrades**: Backend can freely upgrade to newer tokio versions

## Implementation Details

### Identity Service 

The identity service runs on port 8081 by default and exposes endpoints for:
- `/health`: Health check endpoint
- `/create-did`: Creates a new DID

### Backend Identity Client

The backend includes an `identity_client.rs` that handles communication with the identity service:
- Abstracts the HTTP communication details
- Provides a clean API for the rest of the backend code
- Handles error cases and retries

## Environment Configuration

Configuration is managed through environment variables:
```
IDENTITY_SERVICE_URL=http://127.0.0.1:8081  # Identity service URL
```

## Future Plans

This is a temporary solution until the IOTA team addresses issue #1665 and updates identity.rs to be compatible with newer tokio versions. Once resolved, we can:

1. Evaluate if direct integration is preferred
2. Potentially keep the microservice architecture for its resilience benefits
3. Simplify by using the same tokio version across all components
