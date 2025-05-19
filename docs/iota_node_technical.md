# IOTA Node Technical Documentation

## API Interface

The IOTA rebased nodes (version 5.5.25+) exclusively use the JSON-RPC API. The REST(-like) HTTP API is fully deprecated and not available on rebased nodes.

### JSON-RPC Interface

All interactions with the IOTA node must use the JSON-RPC API:

- **Port**: 19000 (exposed from container port 9000)
- **Protocol**: JSON-RPC 2.0
- **Content-Type**: application/json

### Example JSON-RPC Request

```bash
curl -s http://localhost:19000 -X POST -H "Content-Type: application/json" -d '{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "rpc.discover",
  "params": {}
}'
```

## Health Check Implementation

For health monitoring, the backend uses the `rpc.discover` method to verify that the IOTA node is responsive and properly functioning. This method returns information about the available RPC methods and is lightweight enough for regular health checks.

### Health Check Response Handling

1. A successful health check will return a 200 OK status from the node with a JSON response containing available methods
2. Failures are identified by:
   - Timeouts (node not responding)
   - Non-200 status codes
   - JSON-RPC error responses

## Integration Requirements

1. **JSON-RPC Only**: Remember that rebased nodes only support JSON-RPC, not REST APIs
2. **No Legacy Endpoints**: Do not attempt to use deprecated endpoints like `/api/v2/info`
3. **Proper Error Handling**: Implement timeouts and handle connection failures gracefully
4. **Method-based Interaction**: All operations require using specific JSON-RPC methods

## Integration with the Backend

The backend integrates with the IOTA node through:

1. Health checks using `rpc.discover`
2. Additional methods will be added as needed for identity and credential operations

## Environment Configuration

The IOTA node connection is configured through the `IOTA_NODE_URL` environment variable, which should point to the JSON-RPC endpoint (typically `http://127.0.0.1:19000`).
