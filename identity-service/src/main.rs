use axum::{routing::{get, post}, Router};
use std::sync::Arc;
use tokio::net::TcpListener;
use tower_http::trace::TraceLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod config;
mod handlers;
mod state;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Initialize tracing (adapted from existing main.rs)
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG")
                .unwrap_or_else(|_| "identity_service=debug,tower_http=debug,info".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    tracing::info!("Starting identity-service...");

    // Load configuration
    let app_config = match config::AppConfig::load() {
        Ok(cfg) => cfg,
        Err(e) => {
            tracing::error!(error = %e, "Failed to load application configuration.");
            return Err(e);
        }
    };
    tracing::info!(port = app_config.service_port, iota_node = %app_config.iota_api_endpoint, "Application configuration loaded.");

    // Build application state
    let shared_state = match state::build_app_state(app_config.clone()).await {
        Ok(state) => Arc::new(state),
        Err(e) => {
            tracing::error!(error = %e, "Failed to build application state.");
            return Err(e);
        }
    };
    tracing::info!("Application state built successfully.");

    // Define routes
    let app = Router::new()
        .route("/health", get(handlers::health_check_handler))
        .route("/api/v1/identity/initiate-challenge", post(handlers::initiate_challenge_handler))
        .route("/api/v1/identity/verify-signature", post(handlers::verify_signature_handler))
        .with_state(shared_state)
        .layer(TraceLayer::new_for_http());

    let addr_str = format!("0.0.0.0:{}", app_config.service_port);
    tracing::info!("Attempting to bind to TCP listener at: {}", addr_str);

    let listener = match TcpListener::bind(&addr_str).await {
        Ok(l) => {
            let local_addr = l.local_addr().expect("Failed to get local address from listener");
            tracing::info!("Successfully bound TCP listener to {}", local_addr);
            l
        }
        Err(e) => {
            tracing::error!(address = %addr_str, error = %e, "Failed to bind TCP listener.");
            return Err(e.into());
        }
    };
    
    let actual_addr = listener.local_addr().expect("Listener has no local address after bind");
    tracing::info!("Identity service listening on {}", actual_addr);

    axum::serve(listener, app.into_make_service())
        .await
        .map_err(|e| {
            tracing::error!(error = %e, "Axum server error.");
            anyhow::anyhow!(e)
        })?;

    tracing::info!("Axum server stopped gracefully.");
    Ok(())
}
