use std::net::SocketAddr;
use std::env;
use dotenvy::dotenv; // Keep this if you are only using the dotenv function directly

mod health;

#[tokio::main]
async fn main() {
    // Initialize tracing subscriber
    tracing_subscriber::fmt::init();

    // Load .env file
    match dotenvy::dotenv() { // Use dotenvy::dotenv() here
        Ok(path) => tracing::info!(".env file loaded successfully from {:?}", path),
        Err(e) => tracing::error!("Failed to load .env file: {}", e),
    }

    match env::var("IOTA_NODE_URL") {
        Ok(val) => tracing::info!("IOTA_NODE_URL in main after dotenv: {}", val),
        Err(_) => tracing::error!("IOTA_NODE_URL NOT FOUND in main after dotenv"),
    }

    // Get backend port from environment or use default
    let port = env::var("BACKEND_PORT").unwrap_or_else(|_| "8080".to_string());
    let addr_str = format!("0.0.0.0:{}", port);
    let addr = addr_str.parse::<SocketAddr>().expect("Invalid BACKEND_PORT format");

    // Set up the application router with health routes
    tracing::info!("[main] About to define 'app' using health::routes().");
    let app = health::routes();
    tracing::info!("[main] 'app' defined. Router should be using health::routes().");

    println!("[wot.id backend] Rust backend running at http://{}", addr);
    axum::serve(tokio::net::TcpListener::bind(addr).await.unwrap(), app)
        .await
        .unwrap();
}
