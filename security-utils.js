// Security and Validation Utilities
// This file contains advanced security measures and validation functions

class SecurityManager {
    constructor() {
        this.rateLimitData = new Map();
        this.suspiciousIPs = new Set();
        this.sessionToken = this.generateSessionToken();
    }

    // Generate unique session token for CSRF protection
    generateSessionToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Check rate limiting
    checkRateLimit(identifier = 'default') {
        const now = Date.now();
        const limit = this.rateLimitData.get(identifier) || { count: 0, lastReset: now };

        // Reset counter every hour
        if (now - limit.lastReset > 3600000) {
            limit.count = 0;
            limit.lastReset = now;
        }

        // Check if limit exceeded
        if (limit.count >= 5) {
            this.logSecurityEvent('RATE_LIMIT_EXCEEDED', { identifier, count: limit.count });
            return false;
        }

        // Increment counter
        limit.count++;
        this.rateLimitData.set(identifier, limit);
        return true;
    }

    // Advanced input sanitization
    sanitizeInput(input, type = 'default') {
        if (typeof input !== 'string') return '';

        let sanitized = input.trim();

        // Remove null bytes
        sanitized = sanitized.replace(/\0/g, '');

        // Type-specific sanitization
        switch (type) {
            case 'name':
                // Allow only letters, spaces, hyphens, and apostrophes
                sanitized = sanitized.replace(/[^a-zA-Z\s'\-]/g, '');
                break;
            case 'email':
                // Basic email character allowlist
                sanitized = sanitized.replace(/[^a-zA-Z0-9@.\-_]/g, '');
                break;
            case 'phone':
                // Allow only digits, spaces, parentheses, hyphens, and plus
                sanitized = sanitized.replace(/[^0-9\s()\-+]/g, '');
                break;
            case 'regNumber':
                // VIT registration number format
                sanitized = sanitized.replace(/[^0-9A-Za-z]/g, '').toUpperCase();
                break;
            case 'text':
                // Remove HTML tags and dangerous characters (but allow common punctuation)
                sanitized = sanitized.replace(/<[^>]*>/g, '');
                sanitized = sanitized.replace(/[<>\"'%;()]/g, ''); // Removed & and + from removal list
                break;
            default:
                // General sanitization (allow common punctuation)
                sanitized = sanitized.replace(/[<>\"'%;()]/g, ''); // Removed & and + from removal list
        }

        return sanitized;
    }

    // Validate input against patterns and rules
    validateField(value, fieldName, rules) {
        const errors = [];

        // Required field check
        if (rules.required && (!value || value.trim().length === 0)) {
            errors.push(`${fieldName} is required`);
            return errors;
        }

        // Skip further validation if field is empty and not required
        if (!value || value.trim().length === 0) {
            return errors;
        }

        // Length validation
        if (rules.minLength && value.length < rules.minLength) {
            errors.push(`${fieldName} must be at least ${rules.minLength} characters`);
        }

        if (rules.maxLength && value.length > rules.maxLength) {
            errors.push(`${fieldName} must be no more than ${rules.maxLength} characters`);
        }

        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
            errors.push(`${fieldName} format is invalid`);
        }

        // Custom validation for specific fields
        switch (fieldName.toLowerCase()) {
            case 'email':
                if (!this.isValidEmail(value)) {
                    errors.push('Email address is invalid');
                }
                break;
            case 'regnumber':
                if (!this.isValidRegNumber(value)) {
                    errors.push('Registration number must follow VIT format (e.g., 22BCE1234)');
                }
                break;
            case 'phone':
                if (!this.isValidPhone(value)) {
                    errors.push('Phone number is invalid');
                }
                break;
        }

        return errors;
    }

    // Email validation with comprehensive checks
    isValidEmail(email) {
        // Basic format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return false;

        // Length check
        if (email.length > 254) return false;

        // Check for consecutive dots
        if (email.includes('..')) return false;

        // Check domain part
        const [local, domain] = email.split('@');
        if (local.length > 64 || domain.length > 253) return false;

        return true;
    }

    // VIT registration number validation
    isValidRegNumber(regNumber) {
        const regRegex = /^[0-9]{2}[A-Z]{3}[0-9]{4}$/;
        return regRegex.test(regNumber);
    }

    // Phone number validation
    isValidPhone(phone) {
        // Remove all non-digit characters for validation
        const digits = phone.replace(/\D/g, '');
        
        // Check for valid length (10-15 digits)
        if (digits.length < 10 || digits.length > 15) return false;

        // Check if it's all the same digit (likely fake)
        if (new Set(digits).size === 1) return false;

        return true;
    }

    // Detect suspicious patterns
    detectSuspiciousActivity(formData) {
        const suspiciousPatterns = [
            // SQL injection patterns (more specific)
            /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\s+\w+)/i,
            // XSS patterns
            /<script[^>]*>.*?<\/script>/gi,
            /javascript:/i,
            /on\w+\s*=/i,
            // Command injection patterns (more specific - avoid false positives)
            /(\||&|;|`|\$\(){2,}/,  // Multiple consecutive suspicious chars
            /(;\s*(rm|del|format|shutdown|reboot))/i,  // Dangerous commands
            // Path traversal patterns
            /\.\.\//g,
            // Excessive repetition (spam)
            /(.)\1{15,}/  // Increased threshold from 10 to 15
        ];

        for (const [field, value] of Object.entries(formData)) {
            if (typeof value === 'string') {
                for (const pattern of suspiciousPatterns) {
                    if (pattern.test(value)) {
                        console.warn('Suspicious pattern detected:', {
                            field,
                            pattern: pattern.toString(),
                            value: value.substring(0, 100),
                            fullValue: value
                        });
                        this.logSecurityEvent('SUSPICIOUS_ACTIVITY', {
                            field,
                            pattern: pattern.toString(),
                            value: value.substring(0, 100)
                        });
                        return true;
                    }
                }
            }
        }

        return false;
    }

    // Log security events
    logSecurityEvent(eventType, details) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            type: eventType,
            details,
            userAgent: navigator.userAgent,
            sessionToken: this.sessionToken
        };

        // In a real application, this would send to a security monitoring service
        console.warn('Security Event:', logEntry);

        // Store in localStorage for demo purposes
        try {
            const existingLogs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
            existingLogs.push(logEntry);
            
            // Keep only last 100 logs
            if (existingLogs.length > 100) {
                existingLogs.splice(0, existingLogs.length - 100);
            }
            
            localStorage.setItem('securityLogs', JSON.stringify(existingLogs));
        } catch (error) {
            console.error('Failed to log security event:', error);
        }
    }

    // Honeypot field validation (trap for bots)
    validateHoneypot(honeypotValue) {
        // Honeypot field should always be empty
        if (honeypotValue && honeypotValue.trim() !== '') {
            this.logSecurityEvent('BOT_DETECTED', { honeypotValue });
            return false;
        }
        return true;
    }

    // Generate application ID with security considerations
    generateApplicationId() {
        const timestamp = Date.now();
        const random = crypto.getRandomValues(new Uint8Array(8));
        const randomHex = Array.from(random, byte => byte.toString(16).padStart(2, '0')).join('');
        return `APP_${timestamp}_${randomHex.toUpperCase()}`;
    }

    // Validate file uploads (if implemented later)
    validateFile(file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            return { valid: false, error: 'File type not allowed' };
        }

        if (file.size > maxSize) {
            return { valid: false, error: 'File size too large' };
        }

        return { valid: true };
    }

    // Clean up old rate limit data
    cleanupRateLimitData() {
        const now = Date.now();
        for (const [key, data] of this.rateLimitData.entries()) {
            if (now - data.lastReset > 3600000) {
                this.rateLimitData.delete(key);
            }
        }
    }
}

// Export singleton instance (make available globally)
window.securityManager = new SecurityManager();

// Additional utility functions (make available globally)
window.securityUtils = {
    // Generate secure random string
    generateSecureRandom: (length = 32) => {
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    },

    // Debounce function for input validation
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Check if running in secure context
    isSecureContext: () => {
        return window.isSecureContext || location.protocol === 'https:';
    },

    // Fingerprint browser for additional security
    generateFingerprint: () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Browser fingerprint', 2, 2);
        
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screen: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            canvas: canvas.toDataURL(),
            timestamp: Date.now()
        };
    }
};

// Clean up rate limit data every hour
setInterval(() => {
    securityManager.cleanupRateLimitData();
}, 3600000);
