
// Security headers and utilities
export const securityHeaders = {
  // Content Security Policy
  getCSPHeader(): string {
    const nonce = crypto.randomUUID();
    return [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' https://js.stripe.com`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.stripe.com https://*.supabase.co wss://*.supabase.co",
      "frame-src https://js.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');
  },

  // Security response headers
  getSecurityHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': this.getCSPHeader()
    };
  }
};

// Rate limiting utilities
export const rateLimiter = {
  attempts: new Map<string, { count: number; resetTime: number }>(),

  // Simple rate limiting for client-side
  checkRateLimit(key: string, maxAttempts: number = 5, windowMs: number = 900000): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (attempt.count >= maxAttempts) {
      return false;
    }

    attempt.count++;
    return true;
  },

  // Reset rate limit for a key
  resetRateLimit(key: string): void {
    this.attempts.delete(key);
  }
};

// Error message sanitization
export const errorUtils = {
  // Sanitize error messages to prevent information leakage
  sanitizeErrorMessage(error: any): string {
    if (!error) return 'Une erreur inconnue s\'est produite';

    const message = typeof error === 'string' ? error : error.message || 'Erreur inconnue';
    
    // Remove sensitive information patterns
    const sanitized = message
      .replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '[CARTE MASQUÉE]') // Credit cards
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL MASQUÉ]') // Emails
      .replace(/\b\d{10,}\b/g, '[NUMÉRO MASQUÉ]') // Phone numbers
      .replace(/password|pwd|token|key|secret/gi, '[DONNÉES SENSIBLES]'); // Sensitive keywords

    return sanitized.length > 200 ? sanitized.substring(0, 200) + '...' : sanitized;
  },

  // Get user-friendly error message
  getUserFriendlyError(error: any): string {
    const message = this.sanitizeErrorMessage(error);
    
    // Map common errors to user-friendly messages
    const errorMappings: Record<string, string> = {
      'Invalid login credentials': 'Email ou mot de passe incorrect',
      'Email not confirmed': 'Veuillez confirmer votre email avant de vous connecter',
      'Too many requests': 'Trop de tentatives. Veuillez réessayer plus tard',
      'Network error': 'Erreur de connexion. Vérifiez votre connexion internet',
      'User not found': 'Utilisateur non trouvé',
      'Weak password': 'Le mot de passe doit contenir au moins 8 caractères',
    };

    for (const [key, value] of Object.entries(errorMappings)) {
      if (message.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }

    return message;
  }
};
