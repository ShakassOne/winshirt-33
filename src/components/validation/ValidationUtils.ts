
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phone === '' || phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validatePostalCode = (postalCode: string, country: string = ''): boolean => {
  if (postalCode === '') return true;
  
  // Basic validation - can be enhanced for specific countries
  const postalCodeRegex = /^[A-Z0-9\s-]{3,10}$/i;
  return postalCodeRegex.test(postalCode);
};

export const sanitizeText = (text: string): string => {
  return text.trim().replace(/[<>]/g, '');
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateLength = (value: string, min: number, max: number): boolean => {
  const length = value.trim().length;
  return length >= min && length <= max;
};
