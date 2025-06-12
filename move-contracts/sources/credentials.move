module wot_id::credentials {
    use std::string::{Self, String};

    use iota::hash;
    use iota::bcs;
    use wot_id::identity::{Self, Identity};

    // Errors
    const E_NOT_AUTHORIZED: u64 = 1;

    /// A claim within a credential
    public struct Claim has store, drop {
        name: String,
        value: String,
        kind: String,
    }

    /// Proof of a credential
    public struct Proof has store, drop {
        kind: String,
        verification_method: String,
        signature: vector<u8>,
        created: u64,
        nonce: vector<u8>,
    }

    /// Verifiable Credential object
    public struct Credential has key {
        id: UID,
        
        // W3C Verifiable Credential standard fields
        credential_id: String,
        issuer: String,         // DID of issuer
        holder: String,         // DID of holder
        issuance_date: u64,
        expiration_date: Option<u64>,
        
        // Claims contained in this credential
        claims: vector<Claim>,
        
        // Revocation information
        revocation_id: Option<String>,
        status: u8,  // 0: Active, 1: Suspended, 2: Revoked
        
        // Proof of the credential
        proof: Proof,
    }
    
    /// Issue a new credential
    public entry fun issue_credential(
        issuer_identity: &Identity,
        holder_did: vector<u8>,
        credential_type: vector<u8>,
        claim_names: vector<vector<u8>>,
        claim_values: vector<vector<u8>>,
        claim_types: vector<vector<u8>>,
        expiration_date: Option<u64>,
        signature: vector<u8>,
        verification_method: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);

        // === Authorization Check ===
        // Ensure the sender is the controller of the issuer identity.
        identity::assert_is_controller(issuer_identity, sender);

        let now = tx_context::epoch(ctx);
        
        // Generate unique object ID
        let id = object::new(ctx);
        let object_id = object::uid_to_inner(&id);
        
        // Create credential ID
        let mut cred_id = string::utf8(b"vc:iota:0x");
        string::append(&mut cred_id, object_id_to_hex(object::id_to_address(&object_id)));
        
        // Get issuer DID
        let issuer_did = identity::get_did(issuer_identity);
        
        // Convert holder DID to string
        let holder = string::utf8(holder_did);
        
        // Create claims
        let mut claims = vector::empty<Claim>();
        let mut i = 0;
        let len = vector::length(&claim_names);
        
        while (i < len) {
            let claim = Claim {
                name: string::utf8(*vector::borrow(&claim_names, i)),
                value: string::utf8(*vector::borrow(&claim_values, i)),
                kind: string::utf8(*vector::borrow(&claim_types, i)),
            };
            vector::push_back(&mut claims, claim);
            i = i + 1;
        };
        
        // Create proof
        let proof = Proof {
            kind: string::utf8(credential_type),
            verification_method: string::utf8(verification_method),
            signature,
            created: now,
            nonce: create_nonce(ctx),
        };
        
        // Create credential
        let credential = Credential {
            id,
            credential_id: cred_id,
            issuer: issuer_did,
            holder,
            issuance_date: now,
            expiration_date,
            claims,
            revocation_id: option::none(),
            status: 0, // Active
            proof,
        };
        
        // Share the credential object
        transfer::share_object(credential);
    }

    /// Revoke a credential
    public entry fun revoke_credential(
        credential: &mut Credential,
        revocation_id: String
    ) {
        credential.status = 2; // Revoked
        credential.revocation_id = option::some(revocation_id);
    }

    /// Verify a credential
    public fun verify_credential(credential: &Credential, now: u64): bool {
        // Check if the credential is active
        if (credential.status != 0) {
            return false
        };
        
        // Check if the credential is expired
        if (option::is_some(&credential.expiration_date)) {
            let expiration = *option::borrow(&credential.expiration_date);
            if (now > expiration) {
                return false
            }
        };
        
        // In a real implementation, we would verify the signature here
        // For now, we return true if the credential is active and not expired
        true
    }

    /// Helper function to create a nonce from the transaction context.
    /// A secure nonce should be unpredictable. We can generate it by hashing
    /// the transaction digest with the current epoch timestamp.
    fun create_nonce(ctx: &TxContext): vector<u8> {
        let mut data_to_hash = *tx_context::digest(ctx);
        let epoch_bytes = bcs::to_bytes(&tx_context::epoch(ctx));
        vector::append(&mut data_to_hash, epoch_bytes);
        hash::keccak256(&data_to_hash)
    }

    /// Helper function to convert an address to a hex string.
    fun object_id_to_hex(object_id: address): String {
        let hex_chars = b"0123456789abcdef";
        let bytes = bcs::to_bytes(&object_id);
        let mut result = string::utf8(b"");
        let mut i = 0;
        let len = vector::length(&bytes);

        while (i < len) {
            let byte = *vector::borrow(&bytes, i);
            let high_nibble = (byte >> 4);
            let low_nibble = (byte & 0x0F);

            let high_char_vec = vector::singleton(*vector::borrow(&hex_chars, (high_nibble as u64)));
            let low_char_vec = vector::singleton(*vector::borrow(&hex_chars, (low_nibble as u64)));

            string::append(&mut result, string::utf8(high_char_vec));
            string::append(&mut result, string::utf8(low_char_vec));
            
            i = i + 1;
        };

        result
    }
}
