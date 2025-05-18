# IOTA Node Startup Documentation

## Overview
This document provides comprehensive details about the IOTA node configuration, startup process, and relevant files based on the investigation performed on May 11, 2025.

## Startup Process

The IOTA node automatically starts when the Mac boots through the following process:

1. A LaunchAgent (`com.iota.fullnode.autostart.plist`) located at `/Users/axelnoack/Library/LaunchAgents/` activates at system boot
2. This agent first starts Colima (`/opt/homebrew/bin/colima start`)
3. It then runs Docker Compose (`/opt/homebrew/bin/docker compose up -d`) in the directory `/Users/axelnoack/CascadeProjects/iota/setups/fullnode/docker`
4. Docker Compose uses `docker-compose.yaml` to launch the `iotaledger/iota-node:latest` image
5. The container starts with the command `/usr/local/bin/iota-node --config-path /opt/iota/config/fullnode.yaml`
6. The configuration is mounted from `./data` (local) to `/opt/iota/` (container)

## Key Configuration Files

### Launch Agent
**Path**: `/Users/axelnoack/Library/LaunchAgents/com.iota.fullnode.autostart.plist`
**Purpose**: Starts the IOTA node automatically at system boot and retries every 60 seconds
**Working Directory**: `/Users/axelnoack/CascadeProjects/iota/setups/fullnode/docker`
**Logs**: 
- Standard output: `/tmp/iota-fullnode-autostart.log`
- Standard error: `/tmp/iota-fullnode-autostart.err`

### Docker Compose
**Path**: `/Users/axelnoack/CascadeProjects/iota/setups/fullnode/docker/docker-compose.yaml`
**Image**: `iotaledger/iota-node:latest`
**Exposed Ports**: 
- 8084 (P2P/UDP)
- 9000 (JSON-RPC)
- 9184 (Metrics)
- 8080 (REST API)
**Volume Mount**: `./data:/opt/iota/:rw`

### Node Configuration
**Path**: `/Users/axelnoack/.iota/iota_config/fullnode.yaml`
**Last Modified**: May 7, 2025 at 10:53:34
**Key Settings**:
- `network-address: /ip4/127.0.0.1/tcp/50728/http` (HTTP API)
- `json-rpc-address: "0.0.0.0:9000"` (JSON-RPC API)
- `enable-rest-api: true`

## Current Status

As of May 11, 2025:
- The node is running with process ID 241374 inside Colima
- The configuration files were last modified on May 7, 2025
- The node is configured to use both the required network-address and json-rpc-address fields

## Verification Steps

To verify the node is running properly:
```bash
# Check if the process is running
colima ssh "ps aux | grep iota-node | grep -v grep"

# Check HTTP API endpoint
curl -v http://127.0.0.1:50728/api/v2/info

# Check JSON-RPC endpoint
curl -v -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"help"}' http://localhost:9000
```

## Update Policy

Per project requirements, the node environment (IOTA node image, config templates, and peer list) must be checked for updates regularly. All updates should be applied in accordance with the IOTA rebased node (5.5.25+) requirements.
