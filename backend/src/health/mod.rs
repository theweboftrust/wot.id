use axum::{routing::get, Json, Router};
use serde::{Deserialize, Serialize};
use std::time::Duration;
use reqwest::Client;

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
    Router::new().route("/health", get(health_check))
}

// Overall health check handler
async fn health_check() -> Json<HealthStatus> {
    let client = Client::new();
    
    // Check identity service
    let identity_status = check_identity_service(&client).await;
    
    // Check IOTA node
    let iota_status = check_iota_node(&client).await;
    
    // Overall status is OK only if both components are OK
    let overall_status = if identity_status.is_some() && iota_status.is_some() {
        "ok".to_string()
    } else {
        "degraded".to_string()
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

// Check IOTA node health using JSON-RPC
async fn check_iota_node(client: &Client) -> Option<String> {
    let node_url = std::env::var("IOTA_NODE_URL")
        .unwrap_or_else(|_| "http://127.0.0.1:19000".to_string());
    
    // JSON-RPC 2.0 discovery request
    let payload = serde_json::json!({
        "jsonrpc": "2.0",
        "id": "1",
        "method": "rpc.discover",
        "params": {}
    });
    
    match client
        .post(&node_url)
        .json(&payload)
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
