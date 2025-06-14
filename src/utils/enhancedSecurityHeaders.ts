
// Enhanced security headers and utilities
export const enhancedSecurityHeaders = {
  // Content Security Policy with nonce support
  getCSPHeader(nonce?: string): string {
    const nonceValue = nonce || crypto.randomUUID();
    return [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonceValue}' https://js.stripe.com https://www.google.com https://maps.googleapis.com`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.stripe.com https://*.supabase.co wss://*.supabase.co https://api.openai.com",
      "frame-src https://js.stripe.com https://www.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; ');
  },

  // Comprehensive security response headers
  getSecurityHeaders(nonce?: string): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Content-Security-Policy': this.getCSPHeader(nonce),
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-origin'
    };
  }
};

// Enhanced rate limiting with sliding window
export const enhancedRateLimiter = {
  attempts: new Map<string, { timestamps: number[]; blocked: boolean; blockUntil?: number }>(),

  // Sliding window rate limiting
  checkRateLimit(
    key: string, 
    maxAttempts: number = 5, 
    windowMs: number = 900000, // 15 minutes
    blockDurationMs: number = 3600000 // 1 hour
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const record = this.attempts.get(key) || { timestamps: [], blocked: false };

    // Check if currently blocked
    if (record.blocked && record.blockUntil && now < record.blockUntil) {
      return { 
        allowed: false, 
        remaining: 0, 
        resetTime: record.blockUntil 
      };
    }

    // Reset block if expired
    if (record.blocked && record.blockUntil && now >= record.blockUntil) {
      record.blocked = false;
      record.blockUntil = undefined;
      record.timestamps = [];
    }

    // Clean old timestamps
    record.timestamps = record.timestamps.filter(timestamp => now - timestamp < windowMs);

    // Check if rate limit exceeded
    if (record.timestamps.length >= maxAttempts) {
      record.blocked = true;
      record.blockUntil = now + blockDurationMs;
      this.attempts.set(key, record);
      return { 
        allowed: false, 
        remaining: 0, 
        resetTime: record.blockUntil 
      };
    }

    // Add current attempt
    record.timestamps.push(now);
    this.attempts.set(key, record);

    return {
      allowed: true,
      remaining: maxAttempts - record.timestamps.length,
      resetTime: now + windowMs
    };
  },

  // Reset rate limit for a key
  resetRateLimit(key: string): void {
    this.attempts.delete(key);
  }
};

// Enhanced error handling with sanitization
export const enhancedErrorUtils = {
  // Sanitize error messages to prevent information leakage
  sanitizeErrorMessage(error: any): string {
    if (!error) return 'Une erreur inconnue s\'est produite';

    const message = typeof error === 'string' ? error : error.message || 'Erreur inconnue';
    
    // Remove sensitive information patterns
    const sanitized = message
      .replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '[CARTE MASQUÉE]') // Credit cards
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL MASQUÉ]') // Emails
      .replace(/\b\d{10,}\b/g, '[NUMÉRO MASQUÉ]') // Phone numbers
      .replace(/password|pwd|token|key|secret|api/gi, '[DONNÉES SENSIBLES]') // Sensitive keywords
      .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, '[ID MASQUÉ]'); // UUIDs

    return sanitized.length > 200 ? sanitized.substring(0, 200) + '...' : sanitized;
  },

  // Get user-friendly error message with enhanced mappings
  getUserFriendlyError(error: any): string {
    const message = this.sanitizeErrorMessage(error);
    
    // Enhanced error mappings
    const errorMappings: Record<string, string> = {
      'Invalid login credentials': 'Email ou mot de passe incorrect',
      'Email not confirmed': 'Veuillez confirmer votre email avant de vous connecter',
      'Too many requests': 'Trop de tentatives. Veuillez réessayer plus tard',
      'Network error': 'Erreur de connexion. Vérifiez votre connexion internet',
      'User not found': 'Utilisateur non trouvé',
      'Weak password': 'Le mot de passe doit contenir au moins 8 caractères avec majuscules, minuscules et chiffres',
      'Password should be at least 8 characters': 'Le mot de passe doit contenir au moins 8 caractères',
      'Signup requires a valid password': 'Un mot de passe valide est requis pour l\'inscription',
      'User already registered': 'Un compte existe déjà avec cette adresse email',
      'Invalid email': 'Adresse email invalide',
      'Token expired': 'Votre session a expiré. Veuillez vous reconnecter',
      'Unauthorized': 'Accès non autorisé',
      'Forbidden': 'Action non autorisée',
      'Rate limit exceeded': 'Trop de tentatives. Veuillez patienter avant de réessayer'
    };

    for (const [key, value] of Object.entries(errorMappings)) {
      if (message.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }

    return message;
  },

  // Log security events
  logSecurityEvent(event: string, details?: any): void {
    console.warn(`[SECURITY] ${event}`, details ? this.sanitizeErrorMessage(details) : '');
  }
};

// Password strength validation
export const passwordValidator = {
  validatePasswordStrength(password: string): { 
    isValid: boolean; 
    score: number; 
    feedback: string[] 
  } {
    const feedback: string[] = [];
    let score = 0;

    if (!password) {
      return { isValid: false, score: 0, feedback: ['Le mot de passe est requis'] };
    }

    if (password.length >= 8) score += 1;
    else feedback.push('Au moins 8 caractères requis');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Au moins une lettre minuscule requise');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Au moins une lettre majuscule requise');

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('Au moins un chiffre requis');

    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    else feedback.push('Au moins un caractère spécial recommandé');

    if (password.length >= 12) score += 1;

    // Check for common weak patterns
    const weakPatterns = [
      /123456/, /password/, /qwerty/, /azerty/, /admin/,
      /(.)\1{3,}/, // Repeated characters
    ];

    for (const pattern of weakPatterns) {
      if (pattern.test(password.toLowerCase())) {
        score = Math.max(0, score - 2);
        feedback.push('Évitez les motifs courants et répétitifs');
        break;
      }
    }

    return {
      isValid: score >= 4,
      score: Math.min(5, score),
      feedback
    };
  }
};

// Input sanitization utilities
export const inputSanitizer = {
  // Sanitize HTML and prevent XSS
  sanitizeHtml(input: string): string {
    if (!input) return '';
    
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .replace(/\\/g, '&#x5C;')
      .trim()
      .substring(0, 1000); // Limit length
  },

  // Sanitize user input with strict validation
  sanitizeUserInput(input: string, maxLength: number = 500): string {
    if (!input) return '';
    
    return input
      .replace(/[<>{}]/g, '') // Remove dangerous characters
      .replace(/javascript:/gi, '') // Remove javascript protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
      .substring(0, maxLength);
  },

  // Validate email format with enhanced checks
  validateEmail(email: string): { isValid: boolean; error?: string } {
    if (!email) {
      return { isValid: false, error: 'Email requis' };
    }

    if (email.length > 254) {
      return { isValid: false, error: 'Email trop long' };
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Format d\'email invalide' };
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /\.{2,}/, // Multiple consecutive dots
      /^\./, // Starting with dot
      /\.$/, // Ending with dot
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(email)) {
        return { isValid: false, error: 'Format d\'email invalide' };
      }
    }

    return { isValid: true };
  }
};
