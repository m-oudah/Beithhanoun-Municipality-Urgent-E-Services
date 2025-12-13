
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Allow optional +, digits, spaces, dashes. Min 9 digits (e.g. landline or mobile), Max 15 (intl)
  // Rejects if it contains letters or special chars other than + - . ( )
  const validChars = /^[\d\+\-\.\(\)\s]+$/;
  const stripped = phone.replace(/\D/g, '');
  return validChars.test(phone) && stripped.length >= 9 && stripped.length <= 15;
};

export const validateName = (name: string): boolean => {
  // Must be at least 3 chars and only letters/spaces (English + Arabic)
  const re = /^[a-zA-Z\u0600-\u06FF\s]{3,}$/;
  return re.test(name.trim());
};

// Basic XSS prevention (removes script tags and html entities)
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
