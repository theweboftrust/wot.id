use axum::{routing::get, Router, Json};
use std::net::SocketAddr;
use serde_json::json;
use axum::extract::Path;
// use std::env; // Add back if needed




#[tokio::main]
async fn main() {
    // Minimal backend startup (no dotenv/env, no IOTA health check)
    let addr = "127.0.0.1:8080".parse::<SocketAddr>().expect("Invalid BACKEND_PORT");

    let app = Router::new()
        .route("/health", get(health_check));

    println!("[wot.id backend] Rust backend running at http://{}", addr);
    axum::serve(tokio::net::TcpListener::bind(addr).await.unwrap(), app)
        .await
        .unwrap();
}


async fn health_check() -> Json<serde_json::Value> {
    Json(json!({ "status": "ok" }))
}














