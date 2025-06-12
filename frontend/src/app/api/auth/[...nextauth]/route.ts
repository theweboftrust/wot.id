import NextAuth from 'next-auth';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials'; // Import CredentialsProvider
import GoogleProvider from 'next-auth/providers/google';
// import AppleProvider from "next-auth/providers/apple"; // Deferred for now

export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt', // Using JWT for session management, essential for wot.id's stateless approach
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials', // Used for email/password
      credentials: {
        email: { label: "Email", type: "email" },
        // These fields are expected to be populated by the client after an initial challenge step
        // and passed programmatically to signIn. They are marked 'hidden' as they are not for direct user input on this form.
        did: { label: "DID", type: "hidden" }, 
        challenge: { label: "Challenge", type: "hidden" },
        signedChallenge: { label: "Signed Challenge", type: "hidden" },
        // Optional: if the DID has multiple verification methods, client might need to specify which one was used.
        // publicKeyId: { label: "Public Key ID", type: "hidden" }, 
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.did || !credentials?.challenge || !credentials?.signedChallenge) {
          console.error("[NextAuth] Missing credentials for challenge-response authentication", { email: !!credentials?.email, did: !!credentials?.did, challenge: !!credentials?.challenge, signedChallenge: !!credentials?.signedChallenge });
          // It's often better to throw an error that NextAuth can catch and display or redirect.
          // For now, returning null will lead to a generic auth error on client.
          return null;
        }

        const { email, did, challenge, signedChallenge /*, publicKeyId */ } = credentials;

        try {
          const identityServiceUrl = process.env.IDENTITY_SERVICE_URL;
          if (!identityServiceUrl) {
            console.error("[NextAuth] IDENTITY_SERVICE_URL is not set");
            // Consider throwing a specific error for easier debugging or user feedback.
            // throw new Error("Configuration error: Identity service URL missing.");
            return null;
          }

          // Call the identity-service to verify the signed challenge
          const response = await fetch(`${identityServiceUrl}/api/v1/identity/verify-signature`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              did,
              challenge,
              signature: signedChallenge,
              // publicKeyId: publicKeyId, // Uncomment if publicKeyId is used and sent by client
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: "Unknown error from identity service" }));
            console.error(`[NextAuth] Identity service verification failed: ${response.status}`, errorData);
            // Example: throw new Error(errorData.message || "Invalid credentials");
            return null;
          }

          const verificationResult = await response.json();

          if (verificationResult.isValid) {
            // The identity service should confirm the email is linked to the DID
            // and ideally return verified user details.
            // The user object's 'id' field MUST be the DID for JWT/session consistency.
            console.log("[NextAuth] Signature verification successful for DID:", did);
            return {
              id: did, // This is crucial: NextAuth user.id becomes the DID
              email: verificationResult.user?.email || email, // Prefer email verified by identity service
              name: verificationResult.user?.name, // Optional: if provided by identity service
            };
          } else {
            console.error("[NextAuth] Signature verification returned invalid for DID:", did);
            return null;
          }
        } catch (error) {
          console.error("[NextAuth] Error during identity service call or processing:", error);
          // Example: throw new Error("Authentication service error. Please try again later.");
          return null;
        }
      },    
    }),
    // AppleProvider({ // Apple OAuth deferred for now
    //   clientId: process.env.APPLE_ID || "",
    //   clientSecret: process.env.APPLE_SECRET || "", 
    // }),
  ],
  callbacks: {
    // Called when a JWT is created or updated.
    async jwt({ token, user, account, profile }) {
      // `user`, `account`, `profile` are only passed on initial sign-in
      if (user) {
        token.id = user.id; // Persist user ID to the JWT
        // Future: Persist wot.id DID to the JWT
        // if (user.did) token.did = user.did;
      }
      return token; // This token is encrypted and sent to the client via cookie
    },
    // Called when a session is checked.
    async session({ session, token, user }) {
      // `token` contains the decrypted JWT payload (from the `jwt` callback)
      // `user` is the user object from the database (not always available depending on strategy/adapter)

      // Make custom data from the token available on the client-side session object
      if (token && session.user) {
        (session.user as any).id = token.id; // Add user ID to session
        // Future: Add wot.id DID to session
        // if (token.did) (session.user as any).did = token.did;
      }
      return session;
    },
  },
  // A secret is required for JWT, ensure NEXTAUTH_SECRET is set in your .env file
  secret: process.env.NEXTAUTH_SECRET,

  // Optional: Configure custom pages for NextAuth.js flows
  // pages: {
  //   signIn: '/auth/signin', // Custom sign-in page
  //   signOut: '/auth/signout',
  //   error: '/auth/error', // Error code passed in query string as ?error=
  //   verifyRequest: '/auth/verify-request', // Used for email/passwordless login
  //   newUser: undefined, // Redirect new users to a specific page or disable
  // },

  // Optional: Enable debug messages for development
  // debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
