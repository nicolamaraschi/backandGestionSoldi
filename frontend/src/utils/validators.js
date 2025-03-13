/**
 * Validate an email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidEmail = (email) => {
    // Basic email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @param {object} options - Validation options
   * @returns {object} Validation result with isValid and message
   */
  export const validatePassword = (password, options = {}) => {
    const defaults = {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecial: false
    };
    
    const config = { ...defaults, ...options };
    
    const result = {
      isValid: true,
      message: ''
    };
    
    if (!password || password.length < config.minLength) {
      result.isValid = false;
      result.message = `Password must be at least ${config.minLength} characters long`;
      return result;
    }
    
    if (config.requireUppercase && !/[A-Z]/.test(password)) {
      result.isValid = false;
      result.message = 'Password must contain at least one uppercase letter';
      return result;
    }
    
    if (config.requireLowercase && !/[a-z]/.test(password)) {
      result.isValid = false;
      result.message = 'Password must contain at least one lowercase letter';
      return result;
    }
    
    if (config.requireNumbers && !/\d/.test(password)) {
      result.isValid = false;
      result.message = 'Password must contain at least one number';
      return result;
    }
    
    if (config.requireSpecial && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      result.isValid = false;
      result.message = 'Password must contain at least one special character';
      return result;
    }
    
    return result;
  };
  
  /**
   * Validate if a value is a positive number
   * @param {any} value - Value to validate
   * @returns {boolean} True if valid, false otherwise
   */
  export const isPositiveNumber = (value) => {
    if (typeof value === 'string') {
      value = parseFloat(value);
    }
    return !isNaN(value) && value > 0;
  };
  
  /**
   * Validate if a value is a non-negative number (positive or zero)
   * @param {any} value - Value to validate
   * @returns {boolean} True if valid, false otherwise
   */
  export const isNonNegativeNumber = (value) => {
    if (typeof value === 'string') {
      value = parseFloat(value);
    }
    return !isNaN(value) && value >= 0;
  };
  
  /**
   * Validate a date is in the future
   * @param {Date|string|number} date - Date to validate
   * @returns {boolean} True if valid, false otherwise
   */
  export const isFutureDate = (date) => {
    const dateObj = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dateObj >= today;
  };
  
  /**
   * Validate a date is in the past
   * @param {Date|string|number} date - Date to validate
   * @returns {boolean} True if valid, false otherwise
   */
  export const isPastDate = (date) => {
    const dateObj = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dateObj < today;
  };
  
  /**
   * Validate that a date range is valid (start date is before end date)
   * @param {Date|string|number} startDate - Start date
   * @param {Date|string|number} endDate - End date
   * @returns {boolean} True if valid, false otherwise
   */
  export const isValidDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start <= end;
  };
  
  /**
   * Validate that a string is not empty
   * @param {string} value - String to validate
   * @returns {boolean} True if valid, false otherwise
   */
  export const isNotEmpty = (value) => {
    return typeof value === 'string' && value.trim().length > 0;
  };