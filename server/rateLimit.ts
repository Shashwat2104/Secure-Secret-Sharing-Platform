// Simple in-memory rate limiter for demonstration (per IP or per secretId)
// In production, use Redis or a distributed store

const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 5;

// Map: key -> { count, firstAttempt }
const attemptsMap = new Map<string, { count: number; firstAttempt: number }>();

export function checkRateLimit(key: string) {
  const now = Date.now();
  let entry = attemptsMap.get(key);
  if (!entry) {
    entry = { count: 1, firstAttempt: now };
    attemptsMap.set(key, entry);
    return { allowed: true };
  }
  if (now - entry.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    // Reset window
    entry.count = 1;
    entry.firstAttempt = now;
    attemptsMap.set(key, entry);
    return { allowed: true };
  }
  if (entry.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfter: RATE_LIMIT_WINDOW_MS - (now - entry.firstAttempt),
    };
  }
  entry.count++;
  attemptsMap.set(key, entry);
  return { allowed: true };
}
