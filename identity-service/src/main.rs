use axum::{
    routing::{get, post},
    Router, Json, extract::State,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use dotenv::dotenv;
use std::env;
use std::net::SocketAddr;
use identity_iota::iota::IotaClientExt;
use identity_iota::iota::IotaDocument;
use identity_iota::iota::NetworkName;
use identity_iota::credential::Credential;
use identity_iota::core::Timestamp;
use anyhow::Result;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[derive(Clone)]
struct AppState {
    network: NetworkName,
    node_url: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct HealthResponse {
    status: String,
    identity_version: String,
    tokio_version: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct CreateDidRequest {
    // Empty for now, can be extended with optional parameters
}

#[derive(Debug, Serialize, Deserialize)]
struct CreateDidResponse {
    did: String,
    document: String,
}

#[tokio::main]
async fn main() -> Result<()> {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "info".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Load environment variables
    dotenv().ok();
    
    // Get configuration from environment
    let port = env::var("IDENTITY_SERVICE_PORT").unwrap_or_else(|_| "8081".to_string());
    let node_url = env::var("IOTA_NODE_URL").expect("IOTA_NODE_URL must be set");
    
    // Identity service setup - using mainnet for now
    let network = NetworkName::try_from("iota").unwrap();
    
    // Create app state
    let state = Arc::new(AppState {
        network,
        node_url,
    });
    
    // Create router with routes
    let app = Router::new()
        .route("/health", get(health_check))
        .route("/create-did", post(create_did))
        .with_state(state);
    
    // Start server
    let addr = format!("0.0.0.0:{}", port).parse::<SocketAddr>()?;
    tracing::info!("Identity service listening on {}", addr);
    
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await?;
    
    Ok(())
}

async fn health_check() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "ok".to_string(),
        identity_version: env!("CARGO_PKG_VERSION").to_string(),
        tokio_version: "1.43.0".to_string(),
    })
}

async fn create_did(
    State(state): State<Arc<AppState>>,
    _json: Json<CreateDidRequest>,
) -> Json<CreateDidResponse> {
    // This is a stub implementation - in production, this would create an actual DID
    // For now, we're just returning a placeholder
    
    Json(CreateDidResponse {
        did: "did:iota:example".to_string(),
        document: "{}".to_string(),
    })
}
