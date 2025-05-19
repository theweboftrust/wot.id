# Backend Health Monitoring System

## Overview

The Backend Health System provides a comprehensive health monitoring solution for the wot.id platform. It checks the status of all critical components and services, providing real-time status information.

## Endpoints

### GET /health

Returns the health status of all system components.

#### Response Format

```json
{
  "status": "ok",
  "components": {
    "backend": "ok",
    "identity_service": "ok",
    "iota_node": "ok"
  }
}
```

Possible status values:
- `"ok"`: Component is functioning properly
- `"degraded"`: Component is functioning but with limitations
- `"error"`: Component is experiencing errors
- `null`: Component could not be reached

## Component Health Checks

### Backend
- Always returns "ok" if the endpoint is reachable, as this indicates the backend is running

### Identity Service
- Connection test to identity service's `/health` endpoint
- Timeout: 5 seconds
- Failure: Returns `null` for the identity_service status

### IOTA Node
- JSON-RPC 2.0 request to `rpc.discover` method
- Tests connectivity and basic API functionality
- Timeout: 5 seconds
- Failure: Returns `null` for the iota_node status

## Integration

The health module is integrated into the main backend via the routes() function, which returns a Router that can be included in the main application.

## Implementation Details

- Uses reqwest for making HTTP requests to other services
- All timeouts are set to 5 seconds to prevent request hanging
- JSON-RPC 2.0 is used specifically for IOTA node communication
