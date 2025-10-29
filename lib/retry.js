export async function retryWithBackoff(fn, options = {}) {
  const {
    maxRetries = 3,
    backoffType = 'exponential',
    baseDelay = 2000,
    onRetry = null
  } = options;

  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        break;
      }
      
      const delay = backoffType === 'exponential'
        ? baseDelay * Math.pow(2, attempt)
        : baseDelay * (attempt + 1);
      
      if (onRetry) {
        onRetry(attempt + 1, error, delay);
      }
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

export async function withCircuitBreaker(key, fn, options = {}) {
  const {
    failureThreshold = 5,
    resetTimeout = 30 * 60 * 1000
  } = options;
  
  if (!globalThis.circuitBreakers) {
    globalThis.circuitBreakers = {};
  }
  
  const breaker = globalThis.circuitBreakers[key] || {
    failures: 0,
    lastFailureTime: null,
    state: 'closed'
  };
  
  if (breaker.state === 'open') {
    const timeSinceFailure = Date.now() - breaker.lastFailureTime;
    if (timeSinceFailure < resetTimeout) {
      throw new Error(`Circuit breaker open for ${key}. Try again in ${Math.ceil((resetTimeout - timeSinceFailure) / 1000)}s`);
    }
    breaker.state = 'half-open';
  }
  
  try {
    const result = await fn();
    breaker.failures = 0;
    breaker.state = 'closed';
    globalThis.circuitBreakers[key] = breaker;
    return result;
  } catch (error) {
    breaker.failures++;
    breaker.lastFailureTime = Date.now();
    
    if (breaker.failures >= failureThreshold) {
      breaker.state = 'open';
    }
    
    globalThis.circuitBreakers[key] = breaker;
    throw error;
  }
}
