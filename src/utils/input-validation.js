/**
 * Input Validation & Sanitization Utilities
 * Protects against XSS, injection attacks, and invalid data
 */

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

export const inputValidation = {
  /**
   * Validate email format
   */
  validateEmail: (email) => {
    if (!email || typeof email !== 'string') {
      return { valid: false, error: 'Email is required' };
    }

    const trimmed = email.trim();

    if (trimmed.length > 254) {
      return { valid: false, error: 'Email is too long' };
    }

    if (!EMAIL_REGEX.test(trimmed)) {
      return { valid: false, error: 'Invalid email format' };
    }

    return { valid: true, value: trimmed };
  },

  /**
   * Validate password strength
   */
  validatePassword: (password) => {
    if (!password || typeof password !== 'string') {
      return { valid: false, error: 'Password is required' };
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      return {
        valid: false,
        error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
      };
    }

    if (password.length > 128) {
      return { valid: false, error: 'Password is too long' };
    }

    // Optional: Enforce strong password (uncomment if needed)
    // if (!PASSWORD_REGEX.test(password)) {
    //   return {
    //     valid: false,
    //     error: 'Password must contain uppercase, lowercase, number, and special character',
    //   };
    // }

    return { valid: true };
  },

  /**
   * Sanitize string input - remove potentially harmful characters
   */
  sanitizeString: (input, maxLength = 1000) => {
    if (!input || typeof input !== 'string') {
      return '';
    }

    let sanitized = input
      .trim()
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Decode HTML entities
      .replace(/&[^;]+;/g, (match) => {
        const decoded = decodeHTMLEntity(match);
        return decoded === match ? match : decoded;
      })
      // Remove control characters
      .replace(/[\x00-\x1F\x7F]/g, '')
      // Remove multiple spaces
      .replace(/\s+/g, ' ');

    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength).trim();
    }

    return sanitized;
  },

  /**
   * Validate search query
   */
  validateSearchQuery: (query) => {
    if (!query || typeof query !== 'string') {
      return { valid: false, error: 'Search query is required' };
    }

    const sanitized = inputValidation.sanitizeString(query, 100);

    if (sanitized.length === 0) {
      return { valid: false, error: 'Search query cannot be empty' };
    }

    if (sanitized.length < 2) {
      return { valid: false, error: 'Search query must be at least 2 characters' };
    }

    return { valid: true, value: sanitized };
  },

  /**
   * Validate URL - basic check
   */
  validateUrl: (url) => {
    if (!url || typeof url !== 'string') {
      return { valid: false, error: 'URL is required' };
    }

    try {
      const parsed = new URL(url);
      // Only allow http and https
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return { valid: false, error: 'Invalid URL protocol' };
      }
      return { valid: true, value: url };
    } catch (e) {
      return { valid: false, error: 'Invalid URL format' };
    }
  },

  /**
   * Validate form data object
   */
  validateFormData: (data, schema) => {
    const errors = {};
    const validatedData = {};

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];

      if (rules.required && (!value || value.trim?.() === '')) {
        errors[field] = `${rules.label || field} is required`;
        continue;
      }

      if (rules.type === 'email' && value) {
        const emailResult = inputValidation.validateEmail(value);
        if (!emailResult.valid) {
          errors[field] = emailResult.error;
          continue;
        }
        validatedData[field] = emailResult.value;
      } else if (rules.type === 'password' && value) {
        const passwordResult = inputValidation.validatePassword(value);
        if (!passwordResult.valid) {
          errors[field] = passwordResult.error;
          continue;
        }
        validatedData[field] = value;
      } else if (rules.type === 'string' && value) {
        validatedData[field] = inputValidation.sanitizeString(value, rules.maxLength || 1000);
      } else if (rules.type === 'number' && value) {
        const num = Number(value);
        if (isNaN(num)) {
          errors[field] = `${rules.label || field} must be a number`;
        } else if (rules.min !== undefined && num < rules.min) {
          errors[field] = `${rules.label || field} must be at least ${rules.min}`;
        } else if (rules.max !== undefined && num > rules.max) {
          errors[field] = `${rules.label || field} must be at most ${rules.max}`;
        } else {
          validatedData[field] = num;
        }
      } else {
        validatedData[field] = value;
      }

      if (rules.minLength && validatedData[field]?.length < rules.minLength) {
        errors[field] = `${rules.label || field} must be at least ${rules.minLength} characters`;
      }

      if (rules.maxLength && validatedData[field]?.length > rules.maxLength) {
        errors[field] = `${rules.label || field} must be at most ${rules.maxLength} characters`;
      }

      if (rules.pattern && !rules.pattern.test(validatedData[field])) {
        errors[field] = rules.patternError || `${rules.label || field} format is invalid`;
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
      data: validatedData,
    };
  },

  /**
   * Rate limiting check (client-side)
   */
  checkRateLimit: (key, maxAttempts = 5, windowMs = 60000) => {
    if (typeof window === 'undefined') return true;

    const now = Date.now();
    const storage = sessionStorage.getItem(`rateLimit:${key}`);
    const attempts = storage ? JSON.parse(storage) : [];

    // Remove old attempts outside the window
    const recentAttempts = attempts.filter((time) => now - time < windowMs);

    if (recentAttempts.length >= maxAttempts) {
      return false; // Rate limited
    }

    recentAttempts.push(now);
    sessionStorage.setItem(`rateLimit:${key}`, JSON.stringify(recentAttempts));
    return true;
  },

  /**
   * Get rate limit status
   */
  getRateLimitStatus: (key, windowMs = 60000) => {
    if (typeof window === 'undefined') return { limited: false, remaining: -1 };

    const storage = sessionStorage.getItem(`rateLimit:${key}`);
    const attempts = storage ? JSON.parse(storage) : [];
    const now = Date.now();

    const recentAttempts = attempts.filter((time) => now - time < windowMs);

    return {
      limited: false,
      attempts: recentAttempts.length,
      resetIn: recentAttempts.length > 0 ? windowMs - (now - recentAttempts[0]) : 0,
    };
  },
};

/**
 * Helper to decode HTML entities
 */
function decodeHTMLEntity(entity) {
  const htmlEntities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
  };
  return htmlEntities[entity] || entity;
}

export default inputValidation;
