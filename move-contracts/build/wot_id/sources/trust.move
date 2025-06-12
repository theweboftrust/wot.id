module wot_id::trust {
    use std::string::{Self, String};

    use wot_id::identity::{Self, Identity};
    
    // Error codes
    const E_INVALID_TRUST_LEVEL: u64 = 0;
    const E_NOT_AUTHORIZED: u64 = 1;

    const E_INVALID_EVIDENCE: u64 = 3;

    const E_EXPIRED: u64 = 6;
    
    // Trust level constants

    const MAX_TRUST_LEVEL: u64 = 100000; // Represents 100.000 (scaled for precision)
    
    /// Trust level with universal scale (0.000-100.000)
    /// Internally represented as u64 (0-100000) for precision
    public struct TrustLevel has copy, drop, store {
        value: u64,  // 0-100000 representing 0.000-100.000
    }
    
    /// Evidence supporting a trust assertion
    public struct TrustEvidence has store, drop {
        kind: String,           // e.g., "credential", "interaction", "endorsement"
        source: String,         // DID of evidence provider
        content_hash: vector<u8>, // Hash of evidence content
        weight: u64,            // Impact on trust calculation (0-100)
        timestamp: u64,         // When evidence was recorded
    }
    
    /// Attestation supporting claim-level trust
    public struct Attestation has store, drop {
        kind: String,           // e.g., "verification", "corroboration"
        attestor: String,       // DID of attestor
        method: String,         // How attestation was performed
        timestamp: u64,         // When attestation was made
        strength: u64,          // Strength of attestation (0-100)
    }
    
    /// Record of trust level change
    public struct TrustUpdate has store, drop {
        previous_value: u64,
        new_value: u64,
        reason: String,
        timestamp: u64,
    }
    
    /// Entity-to-entity trust relationship
    public struct TrustRelationship has key {
        id: UID,
        source: String,         // DID of source (who is trusting)
        target: String,         // DID of target (who is trusted)
        trust_level: TrustLevel, // On universal scale 0.000-100.000
        context: String,        // Domain of trust (e.g., "professional")
        context_tags: vector<String>, // Additional categorization
        evidence: vector<TrustEvidence>,
        trust_history: vector<TrustUpdate>,
        established: u64,
        last_updated: u64,
        expires: Option<u64>,
        transferable: bool,     // Whether this trust can be used in path calculations
        max_path_length: u8,    // Maximum path length for transitive trust
    }
    
    /// Trust in a specific claim (information piece)
    public struct ClaimTrust has key {
        id: UID,
        credential_id: String,   // Which credential contains the claim
        claim_name: String,      // Which claim this trust assessment is for
        trust_level: TrustLevel, // Trust in this specific claim
        attestations: vector<Attestation>, // Supporting evidence
        context: String,         // Context for this trust assessment
        established: u64,
        last_updated: u64,
        verifier: String,        // Who assessed this trust level
    }
    
    // === Trust Level Operations ===
    
    /// Create a new trust level with validation
    public fun new_trust_level(value: u64): TrustLevel {
        assert!(value <= MAX_TRUST_LEVEL, E_INVALID_TRUST_LEVEL);
        TrustLevel { value }
    }
    
    /// Get the numeric value of a trust level
    public fun get_trust_value(trust: &TrustLevel): u64 {
        trust.value
    }
    
    /// Compare two trust levels
    /// Returns: 0 if a < b, 1 if a = b, 2 if a > b
    public fun compare(a: &TrustLevel, b: &TrustLevel): u8 {
        if (a.value < b.value) { 0 }
        else if (a.value > b.value) { 2 }
        else { 1 }
    }
    
    /// Convert trust level to human-readable format (e.g., "75.432")
    public fun to_string(trust: &TrustLevel): String {
        // This is a simplified implementation
        // In a real system, we would properly format with 3 decimal places
        let whole = trust.value / 1000;
        let frac = trust.value % 1000;
        
        let mut result = string::utf8(b"");
        string::append(&mut result, num_to_string(whole));
        string::append(&mut result, string::utf8(b"."));
        
        // Pad with leading zeros if needed
        if (frac < 10) {
            string::append(&mut result, string::utf8(b"00"));
        } else if (frac < 100) {
            string::append(&mut result, string::utf8(b"0"));
        };
        
        string::append(&mut result, num_to_string(frac));
        result
    }
    
    /// Helper to convert number to string
    fun num_to_string(num: u64): String {
        // Simplified implementation
        // In a real system, this would convert number to string
        if (num == 0) {
            return string::utf8(b"0")
        };
        
        let mut result = string::utf8(b"");
        let mut temp = num;
        let mut digits = vector::empty<u8>();
        
        while (temp > 0) {
            let digit = (temp % 10) as u8;
            vector::push_back(&mut digits, digit + 48); // ASCII for '0' is 48
            temp = temp / 10;
        };
        
        let mut i = vector::length(&digits);
        while (i > 0) {
            i = i - 1;
            let char = vector::singleton(*vector::borrow(&digits, i));
            string::append(&mut result, string::utf8(char));
        };
        
        result
    }
    
    // === Entity-Relational Trust Operations ===
    
    /// Establish a trust relationship between two entities
    public entry fun establish_trust(
        source_identity: &Identity,
        target_did: vector<u8>,
        trust_value: u64,
        context: vector<u8>,
        context_tags: vector<vector<u8>>,
        evidence_type: vector<u8>,
        evidence_content: vector<u8>,
        evidence_weight: u64,
        transferable: bool,
        max_path_length: u8,
        expiration: Option<u64>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);

        // === Authorization Check ===
        // Ensure the sender is the controller of the source identity.
        identity::assert_is_controller(source_identity, sender);

        let now = tx_context::epoch(ctx);
        
        // Validate trust level
        assert!(trust_value <= MAX_TRUST_LEVEL, E_INVALID_TRUST_LEVEL);
        
        // Generate unique object ID
        let id = object::new(ctx);
        
        // Get source DID
        let source_did = identity::get_did(source_identity);
        
        // Convert target DID to string
        let target = string::utf8(target_did);
        
        // Process context tags
        let mut tags = vector::empty<String>();
        let mut i = 0;
        let len = vector::length(&context_tags);
        
        while (i < len) {
            let tag = string::utf8(*vector::borrow(&context_tags, i));
            vector::push_back(&mut tags, tag);
            i = i + 1;
        };
        
        // Create evidence
        let evidence_entry = TrustEvidence {
            kind: string::utf8(evidence_type),
            source: source_did,
            content_hash: evidence_content,
            weight: evidence_weight,
            timestamp: now,
        };
        
        let evidence = vector::singleton(evidence_entry);
        
        // Create initial trust update
        let update = TrustUpdate {
            previous_value: 0,
            new_value: trust_value,
            reason: string::utf8(b"Initial trust establishment"),
            timestamp: now,
        };
        
        let history = vector::singleton(update);
        
        // Create trust relationship
        let relationship = TrustRelationship {
            id,
            source: source_did,
            target,
            trust_level: TrustLevel { value: trust_value },
            context: string::utf8(context),
            context_tags: tags,
            evidence,
            trust_history: history,
            established: now,
            last_updated: now,
            expires: expiration,
            transferable,
            max_path_length,
        };
        
        // Share the trust relationship object
        transfer::share_object(relationship);
    }
    
    /// Update an existing trust relationship
    public entry fun update_trust(
        relationship: &mut TrustRelationship,
        source_identity: &Identity,
        new_trust_value: u64,
        reason: vector<u8>,
        ctx: &mut TxContext
    ) {
        let _sender = tx_context::sender(ctx);
        let now = tx_context::epoch(ctx);
        
        // Validate trust level
        assert!(new_trust_value <= MAX_TRUST_LEVEL, E_INVALID_TRUST_LEVEL);
        
        // Get source DID
        let source_did = identity::get_did(source_identity);
        
        // Verify the caller is the source of the trust relationship
        assert!(relationship.source == source_did, E_NOT_AUTHORIZED);
        
        // Check if expired
        if (option::is_some(&relationship.expires)) {
            let expiration = *option::borrow(&relationship.expires);
            assert!(now <= expiration, E_EXPIRED);
        };
        
        // Create trust update record
        let update = TrustUpdate {
            previous_value: relationship.trust_level.value,
            new_value: new_trust_value,
            reason: string::utf8(reason),
            timestamp: now,
        };
        
        // Add to history
        vector::push_back(&mut relationship.trust_history, update);
        
        // Update trust level
        relationship.trust_level = TrustLevel { value: new_trust_value };
        relationship.last_updated = now;
    }
    
    /// Add evidence to a trust relationship
    public entry fun add_trust_evidence(
        source_identity: &Identity,
        relationship: &mut TrustRelationship,
        evidence_type: vector<u8>,
        evidence_content: vector<u8>,
        evidence_weight: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);

        // === Authorization Check ===
        // Ensure the sender is the controller of the identity adding evidence.
        identity::assert_is_controller(source_identity, sender);

        let now = tx_context::epoch(ctx);
        
        // Get source DID
        let source_did = identity::get_did(source_identity);
        
        // Verify the caller is the source of the trust relationship
        assert!(relationship.source == source_did, E_NOT_AUTHORIZED);
        
        // Create evidence
        let evidence = TrustEvidence {
            kind: string::utf8(evidence_type),
            source: source_did,
            content_hash: evidence_content,
            weight: evidence_weight,
            timestamp: now,
        };
        
        // Add to evidence collection
        vector::push_back(&mut relationship.evidence, evidence);
        relationship.last_updated = now;
    }
    
    /// Verify if trust level meets a minimum threshold
    public fun verify_trust_level(
        relationship: &TrustRelationship,
        minimum_trust: u64,
        ctx: &mut TxContext
    ): bool {
        let now = tx_context::epoch(ctx);
        
        // Check if expired
        if (option::is_some(&relationship.expires)) {
            let expiration = *option::borrow(&relationship.expires);
            if (now > expiration) {
                return false
            };
        };
        
        relationship.trust_level.value >= minimum_trust
    }
    
    // === Claim-Level Trust Operations ===
    
    /// Establish trust in a specific claim
    public entry fun establish_claim_trust(
        verifier_identity: &Identity,
        credential_id: vector<u8>,
        claim_name: vector<u8>,
        trust_value: u64,
        attestation_type: vector<u8>,
        attestation_method: vector<u8>,
        attestation_strength: u64,
        context: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);

        // === Authorization Check ===
        // Ensure the sender is the controller of the verifier identity.
        identity::assert_is_controller(verifier_identity, sender);

        let now = tx_context::epoch(ctx);
        
        // Validate trust level
        assert!(trust_value <= MAX_TRUST_LEVEL, E_INVALID_TRUST_LEVEL);
        assert!(attestation_strength <= 100, E_INVALID_EVIDENCE);
        
        // Generate unique object ID
        let id = object::new(ctx);
        
        // Get verifier DID
        let verifier_did = identity::get_did(verifier_identity);
        
        // Create attestation
        let attestation = Attestation {
            kind: string::utf8(attestation_type),
            attestor: verifier_did,
            method: string::utf8(attestation_method),
            timestamp: now,
            strength: attestation_strength,
        };
        
        let attestations = vector::singleton(attestation);
        
        // Create claim trust object
        let claim_trust = ClaimTrust {
            id,
            credential_id: string::utf8(credential_id),
            claim_name: string::utf8(claim_name),
            trust_level: TrustLevel { value: trust_value },
            attestations,
            context: string::utf8(context),
            established: now,
            last_updated: now,
            verifier: verifier_did,
        };
        
        // Share the claim trust object
        transfer::share_object(claim_trust);
    }
    
    /// Add attestation to a claim trust
    public entry fun add_claim_attestation(
        attestor_identity: &Identity,
        claim_trust: &mut ClaimTrust,
        attestation_method: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);

        // === Authorization Check ===
        // Ensure the sender is the controller of the attestor identity.
        identity::assert_is_controller(attestor_identity, sender);

        let now = tx_context::epoch(ctx);
        
        // Get attestor DID
        let attestor_did = identity::get_did(attestor_identity);
        
        // Create attestation
        let attestation = Attestation {
            kind: string::utf8(b"corroboration"), // Default kind for additional attestations
            attestor: attestor_did,
            method: string::utf8(attestation_method),
            timestamp: now,
            strength: 100, // Default strength, could be a parameter
        };
        
        // Add to attestations
        vector::push_back(&mut claim_trust.attestations, attestation);
        claim_trust.last_updated = now;
    }
    
    /// Update trust level for a claim
    public entry fun update_claim_trust(
        claim_trust: &mut ClaimTrust,
        verifier_identity: &Identity,
        new_trust_value: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);

        // === Authorization Check ===
        // Ensure the sender is the controller of the verifier identity.
        identity::assert_is_controller(verifier_identity, sender);

        let now = tx_context::epoch(ctx);
        
        // Validate trust level
        assert!(new_trust_value <= MAX_TRUST_LEVEL, E_INVALID_TRUST_LEVEL);
        
        // Get verifier DID
        let verifier_did = identity::get_did(verifier_identity);
        
        // Verify the caller is the verifier
        assert!(claim_trust.verifier == verifier_did, E_NOT_AUTHORIZED);
        
        // Update trust level
        claim_trust.trust_level = TrustLevel { value: new_trust_value };
        claim_trust.last_updated = now;
    }
    
    // === Trust Path and Verification Functions ===
    
    /// Calculate direct trust between source and target in a specific context
    /// Returns Option<TrustLevel> - None if no direct relationship exists
    public fun get_direct_trust(
        _source_did: String,
        _target_did: String,
        _context: String
    ): Option<TrustLevel> {
        // This is a placeholder for the real implementation
        // In a real system, we would:
        // 1. Search for trust relationships where source = source_did and target = target_did
        // 2. Filter by context
        // 3. Return the trust level if found, None otherwise
        
        // For now, we return None
        option::none<TrustLevel>()
    }
    
    /// Check if a claim meets minimum trust requirements
    public fun verify_claim_trust(
        claim_trust: &ClaimTrust,
        minimum_trust: u64
    ): bool {
        claim_trust.trust_level.value >= minimum_trust
    }
    
    // Additional functions for trust path calculation and aggregation
    // would be implemented here in a complete system
}
