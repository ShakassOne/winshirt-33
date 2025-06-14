
import { enhancedErrorUtils, inputSanitizer, passwordValidator } from '@/utils/enhancedSecurityHeaders';

export class SecureValidationUtils {
  // Secure input validation with length limits and XSS protection
  static validateAndSanitizeInput(
    input: string, 
    fieldName: string,
    options: {
      required?: boolean;
      minLength?: number;
      maxLength?: number;
      pattern?: RegExp;
      allowHtml?: boolean;
    } = {}
  ): { isValid: boolean; value: string; error?: string } {
    const { 
      required = false, 
      minLength = 0, 
      maxLength = 500, 
      pattern,
      allowHtml = false 
    } = options;

    if (!input || input.trim().length === 0) {
      if (required) {
        return { 
          isValid: false, 
          value: '', 
          error: `${fieldName} est requis` 
        };
      }
      return { isValid: true, value: '' };
    }

    // Sanitize input
    const sanitized = allowHtml 
      ? inputSanitizer.sanitizeHtml(input)
      : inputSanitizer.sanitizeUserInput(input, maxLength);

    // Check length constraints
    if (sanitized.length < minLength) {
      return { 
        isValid: false, 
        value: sanitized,
        error: `${fieldName} doit contenir au moins ${minLength} caractères` 
      };
    }

    if (sanitized.length > maxLength) {
      return { 
        isValid: false, 
        value: sanitized,
        error: `${fieldName} ne peut pas dépasser ${maxLength} caractères` 
      };
    }

    // Check pattern if provided
    if (pattern && !pattern.test(sanitized)) {
      return { 
        isValid: false, 
        value: sanitized,
        error: `Format de ${fieldName} invalide` 
      };
    }

    return { isValid: true, value: sanitized };
  }

  // Validate product data with comprehensive checks
  static validateProductData(data: any): { isValid: boolean; errors: string[]; sanitized: any } {
    const errors: string[] = [];
    const sanitized: any = {};

    // Name validation
    const nameValidation = this.validateAndSanitizeInput(data.name, 'Nom du produit', {
      required: true,
      minLength: 2,
      maxLength: 200
    });
    if (!nameValidation.isValid) {
      errors.push(nameValidation.error!);
    }
    sanitized.name = nameValidation.value;

    // Description validation
    const descValidation = this.validateAndSanitizeInput(data.description, 'Description', {
      required: true,
      minLength: 10,
      maxLength: 2000
    });
    if (!descValidation.isValid) {
      errors.push(descValidation.error!);
    }
    sanitized.description = descValidation.value;

    // Category validation
    const categoryValidation = this.validateAndSanitizeInput(data.category, 'Catégorie', {
      required: true,
      maxLength: 100
    });
    if (!categoryValidation.isValid) {
      errors.push(categoryValidation.error!);
    }
    sanitized.category = categoryValidation.value;

    // Price validation
    if (typeof data.price !== 'number' || isNaN(data.price) || data.price < 0 || data.price > 10000) {
      errors.push('Prix invalide (doit être entre 0 et 10000€)');
    }
    sanitized.price = data.price;

    // Image URL validation
    if (!data.image_url || typeof data.image_url !== 'string') {
      errors.push('URL d\'image requise');
    } else if (!data.image_url.startsWith('https://') || data.image_url.length > 500) {
      errors.push('URL d\'image invalide (doit être HTTPS et moins de 500 caractères)');
    }
    sanitized.image_url = data.image_url;

    // Boolean fields validation
    sanitized.is_customizable = Boolean(data.is_customizable);
    sanitized.is_active = Boolean(data.is_active);

    // Tickets validation
    if (typeof data.tickets_offered !== 'number' || data.tickets_offered < 0 || data.tickets_offered > 100) {
      errors.push('Nombre de tickets invalide (0-100)');
    }
    sanitized.tickets_offered = data.tickets_offered;

    // Colors validation
    if (data.available_colors && Array.isArray(data.available_colors)) {
      sanitized.available_colors = data.available_colors
        .map((color: string) => inputSanitizer.sanitizeUserInput(color, 50))
        .filter((color: string) => color.length > 0)
        .slice(0, 20); // Limit to 20 colors
    }

    // Sizes validation
    if (data.available_sizes && Array.isArray(data.available_sizes)) {
      sanitized.available_sizes = data.available_sizes
        .map((size: string) => inputSanitizer.sanitizeUserInput(size, 20))
        .filter((size: string) => size.length > 0)
        .slice(0, 20); // Limit to 20 sizes
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitized
    };
  }

  // Validate user registration data
  static validateUserRegistration(data: any): { isValid: boolean; errors: string[]; sanitized: any } {
    const errors: string[] = [];
    const sanitized: any = {};

    // Email validation
    const emailValidation = inputSanitizer.validateEmail(data.email);
    if (!emailValidation.isValid) {
      errors.push(emailValidation.error!);
    }
    sanitized.email = data.email?.trim().toLowerCase();

    // Password validation
    const passwordValidation = passwordValidator.validatePasswordStrength(data.password);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.feedback);
    }
    sanitized.password = data.password;

    // First name validation
    const firstNameValidation = this.validateAndSanitizeInput(data.firstName, 'Prénom', {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-ZÀ-ÿ\s-']+$/
    });
    if (!firstNameValidation.isValid) {
      errors.push(firstNameValidation.error!);
    }
    sanitized.firstName = firstNameValidation.value;

    // Last name validation
    const lastNameValidation = this.validateAndSanitizeInput(data.lastName, 'Nom', {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-ZÀ-ÿ\s-']+$/
    });
    if (!lastNameValidation.isValid) {
      errors.push(lastNameValidation.error!);
    }
    sanitized.lastName = lastNameValidation.value;

    return {
      isValid: errors.length === 0,
      errors,
      sanitized
    };
  }

  // Log validation attempts for security monitoring
  static logValidationAttempt(
    validationType: string, 
    success: boolean, 
    errors?: string[]
  ): void {
    if (!success && errors && errors.length > 0) {
      enhancedErrorUtils.logSecurityEvent(`Validation failed: ${validationType}`, {
        errors: errors.join(', ')
      });
    }
  }
}
