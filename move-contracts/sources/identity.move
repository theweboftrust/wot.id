module wot_id::identity {
    use std::string::{Self, String};

    use iota::bcs;


    // Errors
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_INVALID_CONTROLLER: u64 = 2;
    const E_LAST_CONTROLLER: u64 = 3;
    const E_NOT_FOUND: u64 = 4;

    /// Attribute policy for selective disclosure
    public struct AttributePolicy has store, drop {
        // NOTE: Fields were removed as they were unused placeholders.
    }

    /// Privacy settings for selective disclosure
    /// Aligns with wot.id principle of "maximal confidentiality"
    public struct PrivacySettings has store, drop {
        // Configurable disclosure settings for credential attributes
        default_disclosure_level: u8,  // 0: None, 1: Minimal, 2: Standard, 3: Full
        attribute_policies: vector<AttributePolicy>,
        requires_consent: bool,
        zk_proofs_enabled: bool,  // Support for zero-knowledge proofs
    }

    /// Verification methods for authentication
    public struct VerificationMethod has store, drop {
        id: String,              // Method identifier
        kind: String,            // Key type (e.g., Ed25519)
        controller: String,      // DID of the controller
        public_key: vector<u8>,  // Public key material
        purposes: vector<u8>,    // What this key can be used for
    }

    /// The core Identity object following wot.id principles
    public struct Identity has key {
        // Required unique identifier
        id: UID,
        
        // W3C DID identifier (formatted as did:iota:<object-id>)
        did: String,
        
        // Controllers authorized to modify this identity
        controllers: vector<address>,
        
        // Various verification methods (keys)
        verification_methods: vector<VerificationMethod>,
        
        // Privacy settings for selective disclosure
        privacy_settings: PrivacySettings,
        
        // Metadata about creation and updates
        created: u64,
        updated: u64,
    }

    /// Create a new DID from the provided object ID
    fun create_did_from_object_id(object_id: address): String {
        let mut did = string::utf8(b"did:iota:0x");
        let hex_id = object_id_to_hex(object_id);
        string::append(&mut did, hex_id);
        did
    }

    /// Helper function to convert an address to a hex string.
    fun object_id_to_hex(object_id: address): String {
        let hex_chars = b"0123456789abcdef"; // This is a vector<u8>
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

    /// Create default privacy settings
    fun default_privacy_settings(): PrivacySettings {
        PrivacySettings {
            default_disclosure_level: 1, // Minimal by default
            attribute_policies: vector::empty<AttributePolicy>(),
            requires_consent: true,
            zk_proofs_enabled: false,
        }
    }

    /// Create a new Identity with DID Document
    public entry fun create_identity(
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let now = tx_context::epoch(ctx);
        
        // Generate unique object ID
        let id = object::new(ctx);
        let object_id = object::uid_to_inner(&id);
        
        // Create DID from object ID
        let did = create_did_from_object_id(object::id_to_address(&object_id));
        
        // Create Identity object
        let identity = Identity {
            id,
            did,
            controllers: vector::singleton(sender),
            verification_methods: vector::empty(),
            privacy_settings: default_privacy_settings(),
            created: now,
            updated: now,
        };
        
        // Share the identity object to make it globally accessible
        transfer::share_object(identity);
    }

    /// Add a verification method to an Identity
    public entry fun add_verification_method(
        identity: &mut Identity,
        method_id: vector<u8>,
        method_type: vector<u8>,
        controller: vector<u8>,
        public_key: vector<u8>,
        purposes: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Verify that the sender is a controller
        assert!(is_controller(identity, sender), E_NOT_AUTHORIZED);
        
        // Create the verification method
        let verification_method = VerificationMethod {
            id: string::utf8(method_id),
            kind: string::utf8(method_type),
            controller: string::utf8(controller),
            public_key,
            purposes,
        };
        
        // Add the verification method to the Identity
        vector::push_back(&mut identity.verification_methods, verification_method);
        
        // Update the last updated timestamp
        identity.updated = tx_context::epoch(ctx);
    }

    /// Check if an address is a controller of the Identity
    fun is_controller(identity: &Identity, addr: address): bool {
        let mut i = 0;
        let len = vector::length(&identity.controllers);
        
        while (i < len) {
            if (*vector::borrow(&identity.controllers, i) == addr) {
                return true
            };
            i = i + 1;
        };

        false
    }

    /// Asserts that the given address is a controller of the identity
    public fun assert_is_controller(identity: &Identity, controller: address) {
        assert!(is_controller(identity, controller), E_NOT_AUTHORIZED);
    }

    /// Add a new controller to the Identity
    public entry fun add_controller(
        identity: &mut Identity,
        new_controller: address,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Verify that the sender is a controller
        assert!(is_controller(identity, sender), E_NOT_AUTHORIZED);
        
        // Verify that the new controller is not already a controller
        assert!(!is_controller(identity, new_controller), E_INVALID_CONTROLLER);
        
        // Add the new controller
        vector::push_back(&mut identity.controllers, new_controller);
        
        // Update the last updated timestamp
        identity.updated = tx_context::epoch(ctx);
    }

    /// Get the DID of an Identity
    public fun get_did(identity: &Identity): String {
        identity.did
    }

    /// Update privacy settings
    public entry fun update_privacy_settings(
        identity: &mut Identity,
        _default_level: u8,
        _requires_consent: bool,
        _zk_enabled: bool,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Verify that the sender is a controller
        assert!(is_controller(identity, sender), E_NOT_AUTHORIZED);
        
        // Update privacy settings
        identity.privacy_settings.default_disclosure_level = _default_level;
        identity.privacy_settings.requires_consent = _requires_consent;
        identity.privacy_settings.zk_proofs_enabled = _zk_enabled;
        
        // Update the last updated timestamp
        identity.updated = tx_context::epoch(ctx);
    }

    /// Removes a verification method from an Identity.
    /// The sender must be a controller of the identity.
    public entry fun remove_verification_method(
        identity: &mut Identity,
        method_id: String,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        assert_is_controller(identity, sender);

        let i = 0;
        let found = false;
        let len = vector::length(&identity.verification_method);
        while (i < len) {
            let vm = vector::borrow(&identity.verification_method, i);
            if (vm.id == method_id) {
                found = true;
                break
            };
            i = i + 1;
        };

        assert!(found, E_NOT_FOUND);

        vector::remove(&mut identity.verification_method, i);

        identity.updated = tx_context::epoch(ctx);
    }

    /// Removes a controller from an Identity.
    /// The sender must be a controller of the identity.
    /// This function prevents the removal of the last controller.
    public entry fun remove_controller(
        identity: &mut Identity,
        controller_to_remove: address,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        assert_is_controller(identity, sender);

        // Ensure we are not removing the last controller
        assert!(vector::length(&identity.controller) > 1, E_LAST_CONTROLLER);

        let maybe_index = vector::index_of(&identity.controller, &controller_to_remove);
        assert!(option::is_some(&maybe_index), E_NOT_FOUND);
        
        let index = option::destroy_some(maybe_index);
        vector::remove(&mut identity.controller, index);

        identity.updated = tx_context::epoch(ctx);
    }
}
