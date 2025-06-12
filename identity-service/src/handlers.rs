use axum::{extract::State, http::StatusCode, Json};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use uuid::Uuid;

use crate::state::AppState;
use identity_iota::did::CoreDID;
use identity_iota::prelude::IotaDID;
use identity_iota::iota::IotaDocument;
use identity_iota::document::verifiable::JwsVerificationOptions;
use identity_eddsa_verifier::EdDSAJwsVerifier;
use identity_iota::iota::rebased::client::{IdentityClientReadOnly};

// Health Check
#[derive(Serialize)]
pub struct HealthResponse {
    status: String,
}

pub async fn health_check_handler() -> Json<HealthResponse> {
    Json(HealthResponse { status: "UP".to_string() })
}

// Initiate Challenge
#[derive(Deserialize)]
pub struct InitiateChallengeRequest {
    pub email: String,
}

#[derive(Serialize)]
pub struct InitiateChallengeResponse {
    pub did: String,
    pub challenge: String,
}

// Placeholder for the custom Move contract interaction
async fn resolve_email_via_move_contract(
    _client: &IdentityClientReadOnly,
    email: &str,
    _package_id: &str,
) -> Result<String, anyhow::Error> {
    // TODO: Implement actual Move contract call
    // This function will use `_client` to:
    // - Construct a call to your specific Move contract function that maps emails to DIDs.
    // - This might involve `client.call_contract_view_function(...)` or similar,
    //   depending on how `IdentityClient` or `iota-sdk` exposes Move contract calls.
    // - Parse the result to get the DID string.
    println!("Attempting to resolve email: {}", email);
    // For now, returning a placeholder DID if email is recognized, otherwise error
    if email == "user@example.com" {
        Ok("did:iota:tst:0xplaceholderdidforuseratolecom".to_string())
    } else {
        Err(anyhow::anyhow!("Email not found or Move contract email resolution not implemented for this email"))
    }
}

pub async fn initiate_challenge_handler(
    State(app_state): State<Arc<AppState>>,
    Json(payload): Json<InitiateChallengeRequest>,
) -> Result<Json<InitiateChallengeResponse>, (StatusCode, String)> {
    let did_str = match resolve_email_via_move_contract(
        &app_state.identity_client, 
        &payload.email,
        &app_state.config.iota_identity_pkg_id,
    ).await {
        Ok(did) => did,
        Err(e) => {
            eprintln!("Error resolving email to DID: {}", e);
            return Err((StatusCode::NOT_FOUND, e.to_string()));
        }
    };

    let challenge = Uuid::new_v4().to_string();

    Ok(Json(InitiateChallengeResponse {
        did: did_str,
        challenge,
    }))
}


// Verify Signature
#[derive(Deserialize)]
pub struct VerifySignatureRequest {
    pub did: String,
    pub challenge: String,
    pub signature: String, // This is the JWS
}

#[derive(Serialize)]
pub struct VerifySignatureResponse {
    #[serde(rename = "isValid")]
    pub is_valid: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub user: Option<UserInfo>, 
}

#[derive(Serialize)]
pub struct UserInfo {
    pub email: Option<String>,
    pub name: Option<String>,
}

#[derive(Deserialize, Debug)]
struct JwsClaims {
    iss: String, 
    challenge: String,
    // Add other claims like aud, exp if needed for stricter validation
}

// JwsClaims struct defined above this point.

pub async fn verify_signature_handler(
    State(app_state): State<Arc<AppState>>,
    Json(payload): Json<VerifySignatureRequest>,
) -> Result<Json<VerifySignatureResponse>, (StatusCode, String)> {
    let core_did: CoreDID = match CoreDID::parse(&payload.did) {
        Ok(did) => did,
        Err(e) => {
            eprintln!("Error parsing CoreDID: {}", e);
            return Err((StatusCode::BAD_REQUEST, format!("Invalid CoreDID format: {}", e)));
        }
    };

    let did_to_resolve: IotaDID = match IotaDID::try_from(core_did.clone()) {
        Ok(iota_did) => iota_did,
        Err(e) => {
            eprintln!("Error converting CoreDID to IotaDID for {}: {}", core_did, e);
            return Err((StatusCode::BAD_REQUEST, format!("Invalid DID for IOTA context: {}", e)));
        }
    };

    let resolved_document: IotaDocument = match app_state.identity_client.resolve_did(&did_to_resolve).await {
        Ok(doc) => doc,
        Err(e) => {
            eprintln!("Error resolving DID document for {}: {}", did_to_resolve, e);
            return Err((StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to resolve DID document: {}", e)));
        }
    };
    
        // The JWS is taken directly from payload.signature
    // // let jws_to_verify = match Jws::from_encoded_jws(&payload.signature) {
    //     // Ok(jws) => jws,
    //     // Err(e) => {
    //         // eprintln!("Error parsing JWS from string: {}", e);
    //         // return Err((StatusCode::BAD_REQUEST, format!("Invalid JWS format: {}", e)));
    //     // }
    // // };
    
    let verification_options = JwsVerificationOptions::default();
    let verification_result = resolved_document.core_document().verify_jws(
        &payload.signature, // Full JWS string
        None, // Assuming challenge is in JWS payload, not detached
        &EdDSAJwsVerifier::default(), // Verifier
        &verification_options // Verification options
    );

    let mut is_valid = false; // Default to false

    match verification_result {
        Ok(decoded_jws) => {
            // JWS signature itself is cryptographically valid.
            // Now, deserialize claims and check the challenge.
            match serde_json::from_slice::<JwsClaims>(&decoded_jws.claims) {
                Ok(claims) => {
                    if claims.challenge == payload.challenge {
                        // Optional: Further check if claims.iss matches payload.did
                        // For now, matching challenge is the primary concern for this step.
                        is_valid = true;
                        println!("JWS claims successfully verified. Challenge matched for DID {}.
JWS: {}
Challenge: {}", did_to_resolve, payload.signature, payload.challenge);
                    } else {
                        eprintln!(
                            "JWS challenge mismatch. Expected: '{}', Got: '{}' in JWS claims for DID {}",
                            payload.challenge, claims.challenge, did_to_resolve
                        );
                    }
                }
                Err(e) => {
                    eprintln!("Failed to deserialize JWS claims for DID {}: {}. Claims data: {:?}", did_to_resolve, e, String::from_utf8_lossy(&decoded_jws.claims));
                }
            }
        },
        Err(e) => {
            eprintln!("JWS verification failed for DID {}: {}", did_to_resolve, e);
            eprintln!("Attempted to verify JWS: '{}' with challenge: '{}'", payload.signature, payload.challenge);
            // is_valid remains false
        }
    };

    if is_valid {
        Ok(Json(VerifySignatureResponse {
            is_valid: true,
            user: Some(UserInfo { email: None, name: None }), // Populate if desired/possible
        }))
    } else {
        Ok(Json(VerifySignatureResponse { is_valid: false, user: None }))
    }
}
