import React, { useEffect, useState } from 'react';
import { getHealth } from './api/wotid';

export default function HealthStatus() {
  const [status, setStatus] = useState<string>('loading...');

  useEffect(() => {
    getHealth().then((data) => setStatus(data.status)).catch(() => setStatus('error'));
  }, []);

  return <div>Backend health: {status}</div>;
}
