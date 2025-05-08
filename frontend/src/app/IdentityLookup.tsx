import React, { useState } from 'react';
import { getIdentity } from './api/wotid';

export default function IdentityLookup() {
  const [did, setDid] = useState('did:example:123');
  const [result, setResult] = useState<any>(null);

  const handleLookup = async () => {
    setResult('loading...');
    const data = await getIdentity(did);
    setResult(data);
  };

  return (
    <div>
      <input value={did} onChange={e => setDid(e.target.value)} placeholder="Enter DID" />
      <button onClick={handleLookup}>Lookup Identity</button>
      <pre>{result ? JSON.stringify(result, null, 2) : ''}</pre>
    </div>
  );
}
