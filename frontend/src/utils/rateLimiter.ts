// Simple in-memory rate limiter (production'da Redis kullanılmalı)

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export const rateLimiter = (
  windowMs: number = 60000,
  maxRequests: number = 100
) => {
  return (identifier: string): boolean => {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    if (!entry || now > entry.resetTime) {
      // Yeni window veya expired entry
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
      return true;
    }

    if (entry.count >= maxRequests) {
      return false; // Rate limit exceeded
    }

    entry.count++;
    return true;
  };
};

// IP-based rate limiting
export const getClientIP = (req: any): string => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.headers["x-real-ip"] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    "unknown"
  );
};

// Cleanup expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Her dakika temizle
