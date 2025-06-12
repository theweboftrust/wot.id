use axum::{routing::get, Json, Router};
use serde::{Deserialize, Serialize};
use std::time::Duration;
use reqwest::Client;
use serde_json::json;

#[derive(Debug, Serialize, Deserialize)]
pub struct HealthStatus {
    pub status: String,
    pub components: ComponentStatus,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ComponentStatus {
    pub backend: String,
    pub identity_service: Option<String>,
    pub iota_node: Option<String>,
}

pub fn routes() -> Router {
    tracing::info!("[health::routes] Health routes function called.");
    Router::new().route("/health", get(health_check))
}

// Overall health check handler
#[axum::debug_handler]
async fn health_check() -> Json<HealthStatus> {
    tracing::info!("[health::health_check] Detailed health_check function called.");
    let client = Client::new();
    
    // Check identity service
    let identity_status = check_identity_service(&client).await;
    
    // Check IOTA node
    let iota_status = check_iota_node().await;
    
    // Overall status is OK only if all checked components report "ok"
    let overall_status = if identity_status.as_deref() == Some("ok") 
                           && iota_status.as_deref() == Some("ok") {
        "ok".to_string()
    } else {
        // If any component is None or not "ok", the system is degraded or has an error.
        // We can refine this further if specific error states from components need different overall statuses.
        if identity_status.is_none() || iota_status.is_none() {
            "degraded (component missing)".to_string()
        } else {
            "error (component failure)".to_string()
        }
    };
    
    Json(HealthStatus {
        status: overall_status,
        components: ComponentStatus {
            backend: "ok".to_string(),
            identity_service: identity_status,
            iota_node: iota_status,
        },
    })
}

// Check identity service health
async fn check_identity_service(client: &Client) -> Option<String> {
    let identity_url = std::env::var("IDENTITY_SERVICE_URL")
        .unwrap_or_else(|_| "http://127.0.0.1:8081".to_string());
    
    match client
        .get(format!("{}/health", identity_url))
        .timeout(Duration::from_secs(5))
        .send()
        .await
    {
        Ok(response) => {
            if response.status().is_success() {
                Some("ok".to_string())
            } else {
                Some("error".to_string())
            }
        }
        Err(_) => None,
    }
}

// Check IOTA node health using JSON-RPC rpc.discover method
async fn check_iota_node() -> Option<String> {
    let node_url_str = match std::env::var("IOTA_NODE_URL") {
        Ok(url) => {
            tracing::info!(target: "backend::health::iota_node", "IOTA_NODE_URL for JSON-RPC: {}", url);
            url
        }
        Err(e) => {
            tracing::error!(target: "backend::health::iota_node", "IOTA_NODE_URL environment variable not set: {:?}", e);
            return Some("error_env_var_missing".to_string());
        }
    };

    let client = reqwest::Client::new();
    let payload = json!({
        "jsonrpc": "2.0",
        "id": 1,
        "method": "rpc.discover",
        "params": {}
    });

    tracing::info!(target: "backend::health::iota_node", "Attempting JSON-RPC 'rpc.discover' to {}", node_url_str);

    match client.post(&node_url_str).json(&payload).send().await {
        Ok(response) => {
            if response.status().is_success() {
                match response.text().await {
                    Ok(text) => {
                        if !text.is_empty() {
                            tracing::info!(target: "backend::health::iota_node", "IOTA node JSON-RPC 'rpc.discover' successful.");
                            Some("ok".to_string())
                        } else {
                            tracing::error!(target: "backend::health::iota_node", "IOTA node JSON-RPC 'rpc.discover' returned success status but empty body.");
                            Some("error_rpc_empty_response".to_string())
                        }
                    }
                    Err(e) => {
                        tracing::error!(target: "backend::health::iota_node", "IOTA node JSON-RPC 'rpc.discover' failed to read response body: {:?}", e);
                        Some("error_rpc_read_body_failed".to_string())
                    }
                }
            } else {
                let status = response.status();
                let error_text = response.text().await.unwrap_or_else(|_| "Failed to read error body".to_string());
                tracing::error!(target: "backend::health::iota_node", "IOTA node JSON-RPC 'rpc.discover' failed with status: {}. Body (truncated): {}", status, error_text.chars().take(200).collect::<String>());
                Some(format!("error_rpc_failed_status_{}", status.as_u16()))
            }
        }
        Err(e) => {
            tracing::error!(target: "backend::health::iota_node", "IOTA node JSON-RPC 'rpc.discover' request failed: {:?}", e);
            Some("error_rpc_request_failed".to_string())
        }
    }
}
