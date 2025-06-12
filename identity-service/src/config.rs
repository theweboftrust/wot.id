use std::env;
use anyhow::Context;

#[derive(Clone, Debug)]
pub struct AppConfig {
    pub iota_api_endpoint: String,
    pub iota_identity_pkg_id: String,
    pub service_port: u16,
}

impl AppConfig {
    pub fn load() -> Result<Self, anyhow::Error> {
        dotenvy::dotenv().ok(); // Load .env file if present

        let iota_api_endpoint = env::var("API_ENDPOINT")
            .with_context(|| "API_ENDPOINT must be set")?;
        let iota_identity_pkg_id = env::var("IOTA_IDENTITY_PKG_ID")
            .with_context(|| "IOTA_IDENTITY_PKG_ID must be set")?;
        let service_port_str = env::var("PORT").unwrap_or_else(|_| "8081".to_string());
        let service_port = service_port_str
            .parse::<u16>()
            .with_context(|| format!("Invalid PORT value: {}", service_port_str))?;

        Ok(Self {
            iota_api_endpoint,
            iota_identity_pkg_id,
            service_port,
        })
    }
}
