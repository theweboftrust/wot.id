use reqwest::Client;
use serde::{Deserialize, Serialize};
use anyhow::Result;

// Client for communicating with the identity-service
pub struct IdentityClient {
    client: Client,
    base_url: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateDidRequest {
    // Empty for now, can be extended with optional parameters later
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateDidResponse {
    pub did: String,
    pub document: String,
}

impl IdentityClient {
    pub fn new() -> Self {
        let base_url = std::env::var("IDENTITY_SERVICE_URL")
            .unwrap_or_else(|_| "http://127.0.0.1:8081".to_string());
        
        Self {
            client: Client::new(),
            base_url,
        }
    }
    
    // Check if the identity service is healthy
    pub async fn health_check(&self) -> Result<bool> {
        let resp = self.client
            .get(format!("{}/health", self.base_url))
            .send()
            .await?;
        
        Ok(resp.status().is_success())
    }
    
    // Create a new DID via the identity service
    pub async fn create_did(&self, _request: CreateDidRequest) -> Result<CreateDidResponse> {
        let resp = self.client
            .post(format!("{}/create-did", self.base_url))
            .json(&_request)
            .send()
            .await?;
        
        if resp.status().is_success() {
            let did_response = resp.json::<CreateDidResponse>().await?;
            Ok(did_response)
        } else {
            anyhow::bail!("Failed to create DID: {}", resp.status())
        }
    }
}
