import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const identityServiceUrl = process.env.IDENTITY_SERVICE_URL;
    if (!identityServiceUrl) {
      console.error('[API InitiateChallenge] IDENTITY_SERVICE_URL is not set');
      return NextResponse.json({ error: 'Identity service configuration error' }, { status: 500 });
    }

    const serviceResponse = await fetch(`${identityServiceUrl}/api/v1/identity/initiate-challenge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const responseData = await serviceResponse.json();

    if (!serviceResponse.ok) {
      console.error(`[API InitiateChallenge] Identity service error: ${serviceResponse.status}`, responseData);
      return NextResponse.json(
        { error: responseData.error || 'Failed to initiate challenge with identity service' }, 
        { status: serviceResponse.status }
      );
    }

    // Expecting { did: string, challenge: string } from the identity service
    if (!responseData.did || !responseData.challenge) {
        console.error('[API InitiateChallenge] Invalid response from identity service. Missing did or challenge.', responseData);
        return NextResponse.json({ error: 'Invalid response from identity service' }, { status: 500 });
    }

    return NextResponse.json({ did: responseData.did, challenge: responseData.challenge }, { status: 200 });

  } catch (error) {
    console.error('[API InitiateChallenge] Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
