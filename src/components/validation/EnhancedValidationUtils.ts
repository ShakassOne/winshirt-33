
import DOMPurify from 'dompurify';

// Enhanced validation utilities with security improvements
export class EnhancedValidationUtils {
  // Email validation with strict pattern
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    if (!email) {
      return { isValid: false, error: 'Email requis' };
    }
    
    if (email.length > 254) {
      return { isValid: false, error: 'Email trop long (max 254 caractères)' };
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Format d\'email invalide' };
    }

    return { isValid: true };
  }

  // Phone validation with international support
  static validatePhone(phone: string): { isValid: boolean; error?: string } {
    if (!phone) {
      return { isValid: false, error: 'Numéro de téléphone requis' };
    }

    if (phone.length > 20) {
      return { isValid: false, error: 'Numéro trop long (max 20 caractères)' };
    }

    // Allow international phone numbers with + and digits
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    if (!phoneRegex.test(cleanPhone)) {
      return { isValid: false, error: 'Format de téléphone invalide' };
    }

    return { isValid: true };
  }

  // Enhanced postal code validation
  static validatePostalCode(postalCode: string, country: string = 'FR'): { isValid: boolean; error?: string } {
    if (!postalCode) {
      return { isValid: false, error: 'Code postal requis' };
    }

    if (postalCode.length > 10) {
      return { isValid: false, error: 'Code postal trop long' };
    }

    const patterns: { [key: string]: RegExp } = {
      FR: /^(?:0[1-9]|[1-8]\d|9[0-8])\d{3}$/,
      US: /^\d{5}(-\d{4})?$/,
      CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
      GB: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/,
      DE: /^\d{5}$/,
    };

    const pattern = patterns[country.toUpperCase()];
    if (!pattern) {
      // Generic pattern for unknown countries
      return /^[\w\s-]{3,10}$/.test(postalCode) 
        ? { isValid: true } 
        : { isValid: false, error: 'Format de code postal invalide' };
    }

    if (!pattern.test(postalCode)) {
      return { isValid: false, error: `Code postal invalide pour ${country}` };
    }

    return { isValid: true };
  }

  // Enhanced name validation
  static validateName(name: string, fieldName: string = 'nom'): { isValid: boolean; error?: string } {
    if (!name) {
      return { isValid: false, error: `${fieldName} requis` };
    }

    if (name.length < 2) {
      return { isValid: false, error: `${fieldName} trop court (min 2 caractères)` };
    }

    if (name.length > 50) {
      return { isValid: false, error: `${fieldName} trop long (max 50 caractères)` };
    }

    // Allow letters, spaces, hyphens, apostrophes
    const nameRegex = /^[a-zA-ZÀ-ÿ\u0100-\u017F\s'-]+$/;
    if (!nameRegex.test(name)) {
      return { isValid: false, error: `${fieldName} contient des caractères invalides` };
    }

    return { isValid: true };
  }

  // Address validation
  static validateAddress(address: string): { isValid: boolean; error?: string } {
    if (!address) {
      return { isValid: false, error: 'Adresse requise' };
    }

    if (address.length < 5) {
      return { isValid: false, error: 'Adresse trop courte (min 5 caractères)' };
    }

    if (address.length > 200) {
      return { isValid: false, error: 'Adresse trop longue (max 200 caractères)' };
    }

    // Basic address pattern - allow letters, numbers, spaces, common punctuation
    const addressRegex = /^[a-zA-Z0-9\u0080-\uFFFF\s\-,.'#/]+$/;
    if (!addressRegex.test(address)) {
      return { isValid: false, error: 'Adresse contient des caractères invalides' };
    }

    return { isValid: true };
  }

  // Password strength validation
  static validatePassword(password: string): { isValid: boolean; error?: string; strength?: string } {
    if (!password) {
      return { isValid: false, error: 'Mot de passe requis' };
    }

    if (password.length < 8) {
      return { isValid: false, error: 'Mot de passe trop court (min 8 caractères)' };
    }

    if (password.length > 128) {
      return { isValid: false, error: 'Mot de passe trop long (max 128 caractères)' };
    }

    let strength = 0;
    const checks = [
      /[a-z]/.test(password), // lowercase
      /[A-Z]/.test(password), // uppercase
      /\d/.test(password),    // numbers
      /[!@#$%^&*(),.?":{}|<>]/.test(password), // special chars
      password.length >= 12   // length bonus
    ];

    strength = checks.filter(Boolean).length;

    if (strength < 3) {
      return { 
        isValid: false, 
        error: 'Mot de passe trop faible (utilisez majuscules, minuscules, chiffres et caractères spéciaux)',
        strength: 'weak'
      };
    }

    const strengthLevels = ['weak', 'weak', 'fair', 'good', 'strong', 'very-strong'];
    return { isValid: true, strength: strengthLevels[strength] };
  }

  // Sanitize user input to prevent XSS
  static sanitizeInput(input: string): string {
    if (!input) return '';
    
    // Use DOMPurify to sanitize HTML content
    return DOMPurify.sanitize(input, { 
      ALLOWED_TAGS: [], 
      ALLOWED_ATTR: [] 
    });
  }

  // Validate and sanitize text content
  static validateAndSanitizeText(
    text: string, 
    maxLength: number = 1000,
    fieldName: string = 'texte'
  ): { isValid: boolean; sanitized: string; error?: string } {
    if (!text) {
      return { isValid: false, sanitized: '', error: `${fieldName} requis` };
    }

    if (text.length > maxLength) {
      return { 
        isValid: false, 
        sanitized: '', 
        error: `${fieldName} trop long (max ${maxLength} caractères)` 
      };
    }

    const sanitized = this.sanitizeInput(text);
    
    return { isValid: true, sanitized };
  }

  // Comprehensive form validation
  static validateShippingForm(formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  }): { isValid: boolean; errors: { [key: string]: string } } {
    const errors: { [key: string]: string } = {};

    const firstNameValidation = this.validateName(formData.firstName, 'Prénom');
    if (!firstNameValidation.isValid) {
      errors.firstName = firstNameValidation.error!;
    }

    const lastNameValidation = this.validateName(formData.lastName, 'Nom');
    if (!lastNameValidation.isValid) {
      errors.lastName = lastNameValidation.error!;
    }

    const emailValidation = this.validateEmail(formData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error!;
    }

    const phoneValidation = this.validatePhone(formData.phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.error!;
    }

    const addressValidation = this.validateAddress(formData.address);
    if (!addressValidation.isValid) {
      errors.address = addressValidation.error!;
    }

    const cityValidation = this.validateName(formData.city, 'Ville');
    if (!cityValidation.isValid) {
      errors.city = cityValidation.error!;
    }

    const postalCodeValidation = this.validatePostalCode(formData.postalCode, formData.country);
    if (!postalCodeValidation.isValid) {
      errors.postalCode = postalCodeValidation.error!;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}
