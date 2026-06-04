const loginAttempts = new Map<string, { count: number; resetAt: number }>();

export function checkLoginRateLimit(ip: string, max = 5, windowMs = 60_000) {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + windowMs });
    return null;
  }
  entry.count += 1;
  if (entry.count > max) return "Too many login attempts. Try again later.";
  return null;
}

const apiAttempts = new Map<string, { count: number; resetAt: number }>();

export function checkApiRateLimit(key: string, max = 100, windowMs = 60_000) {
  const now = Date.now();
  const entry = apiAttempts.get(key);
  if (!entry || now > entry.resetAt) {
    apiAttempts.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }
  entry.count += 1;
  if (entry.count > max) return "Rate limit exceeded";
  return null;
}
