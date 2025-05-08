// frontend/src/app/api/wotid.ts

export async function getHealth() {
  // Placeholder: returns a fake health status
  return { status: 'ok' };
}

export async function getIdentity(did: string) {
  // Placeholder: returns a fake identity object
  return { did, name: 'Example Identity' };
}
