export function verifyBearerToken(request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Missing or invalid Authorization header' };
  }
  
  const token = authHeader.substring(7);
  const expectedToken = process.env.REPLIT_AGENT_KEY;
  
  if (!expectedToken) {
    return { valid: false, error: 'REPLIT_AGENT_KEY not configured on server' };
  }
  
  if (token !== expectedToken) {
    return { valid: false, error: 'Invalid bearer token' };
  }
  
  return { valid: true };
}

export function createAuthResponse(message, status = 401) {
  return new Response(
    JSON.stringify({ error: message, code: 'AUTH_FAILED' }),
    {
      status,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

export function extractTraceId(request) {
  return request.headers.get('x-trace-id') || crypto.randomUUID();
}

export function isTestMode() {
  return process.env.TEST_MODE === 'true' || process.env.NODE_ENV === 'test';
}
