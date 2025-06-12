use std::sync::Arc;
use anyhow::Context;
use identity_iota::iota::rebased::client::IdentityClientReadOnly;
use identity_iota::iota_interaction::{IotaClient as SdkClient, IotaClientBuilder}; // Correct builder and client type

use crate::config::AppConfig;

#[derive(Clone)]
pub struct AppState {
    pub identity_client: Arc<IdentityClientReadOnly>,
    pub config: Arc<AppConfig>,
}

pub async fn build_app_state(config: AppConfig) -> Result<AppState, anyhow::Error> {
    // Construct the SdkClient (identity_iota::iota_interaction::IotaClient)
    // using the IotaClientBuilder from identity_iota::iota_interaction.
    let sdk_client: SdkClient = IotaClientBuilder::default()
        .build(&config.iota_api_endpoint)
        .await
        .with_context(|| format!("Failed to build SdkClient for node {}", config.iota_api_endpoint))?;

    let identity_client = IdentityClientReadOnly::new(sdk_client.clone()).await
        .context("Failed to create IdentityClientReadOnly")?;

    Ok(AppState {
        identity_client: Arc::new(identity_client),
        config: Arc::new(config),
    })
}
