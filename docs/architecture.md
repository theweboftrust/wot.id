# wot.id System Architecture

## System Components

| Component | Port | Description |
|-----------|------|-------------|
| Backend API | 8080 | Rust-based API server using Axum |
| Identity Service | 8081 | Isolated service for identity.rs operations |
| IOTA Node | 19000 | IOTA node JSON-RPC endpoint (JSON-RPC 2.0) |
| IOTA REST API | 18080 | IOTA node REST API (mapped from 8080 in Docker) |

## Communication Protocols

### Backend → Identity Service
Communication uses a REST API with the following endpoints:
- `/health`: Health check endpoint
- `/create-did`: Creates a new DID

### Backend → IOTA Node
Communication uses JSON-RPC 2.0 with the following methods:
- Method: `rpc.discover` - Used for health checks and capability discovery
- All requests are sent as POST with JSON-RPC 2.0 format

## Environment Variables

```
IOTA_NODE_URL=http://127.0.0.1:19000  # IOTA node JSON-RPC endpoint
BACKEND_PORT=8080                     # Backend service port
IDENTITY_SERVICE_URL=http://127.0.0.1:8081  # Identity service URL
```

## Required Services

- **Docker**: Running IOTA node (`iota-node-v7-docker-fullnode-1`)
- **Identity Service**: Must be running for DID operations
- **Backend**: Main application server

## Starting the System

1. Start the IOTA node (Docker container)
2. Start the Identity Service
3. Start the Backend

## Security Considerations

- All services run on localhost with no external access by default
- For production deployment, proper authentication and TLS should be implemented
