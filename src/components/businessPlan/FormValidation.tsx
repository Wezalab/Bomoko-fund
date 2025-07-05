import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

// Validation Rules
export const validationRules = {
  required: (value: any) => {
    if (value === null || value === undefined || value === '') {
      return 'This field is required';
    }
    if (Array.isArray(value) && value.length === 0) {
      return 'Please select at least one option';
    }
    return null;
  },
  
  minLength: (min: number) => (value: string) => {
    if (value && value.length < min) {
      return `Minimum ${min} characters required`;
    }
    return null;
  },
  
  maxLength: (max: number) => (value: string) => {
    if (value && value.length > max) {
      return `Maximum ${max} characters allowed`;
    }
    return null;
  },
  
  email: (value: string) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },
  
  phone: (value: string) => {
    if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ''))) {
      return 'Please enter a valid phone number';
    }
    return null;
  },
  
  url: (value: string) => {
    if (value && !/^https?:\/\/.+\..+/.test(value)) {
      return 'Please enter a valid URL (including http:// or https://)';
    }
    return null;
  },
  
  numeric: (value: string) => {
    if (value && isNaN(Number(value))) {
      return 'Please enter a valid number';
    }
    return null;
  },
  
  percentage: (value: string) => {
    const num = Number(value);
    if (value && (isNaN(num) || num < 0 || num > 100)) {
      return 'Please enter a percentage between 0 and 100';
    }
    return null;
  }
};

// Validation Hook
export const useFormValidation = () => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateField = (fieldName: string, value: any, rules: Array<(value: any) => string | null>) => {
    const fieldErrors = rules
      .map(rule => rule(value))
      .filter(error => error !== null);
    
    if (fieldErrors.length > 0) {
      setErrors(prev => ({ ...prev, [fieldName]: fieldErrors[0] }));
      return false;
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
      return true;
    }
  };

  const validateAllFields = (fields: Record<string, { value: any; rules: Array<(value: any) => string | null> }>) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.entries(fields).forEach(([fieldName, { value, rules }]) => {
      const fieldErrors = rules
        .map(rule => rule(value))
        .filter(error => error !== null);
      
      if (fieldErrors.length > 0) {
        newErrors[fieldName] = fieldErrors[0];
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const clearErrors = () => setErrors({});
  const clearError = (fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  return {
    errors,
    validateField,
    validateAllFields,
    clearErrors,
    clearError,
    hasErrors: Object.keys(errors).length > 0
  };
};

// Error Display Component
interface ErrorMessageProps {
  error?: string;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, className = '' }) => {
  if (!error) return null;

  return (
    <div className={`flex items-center gap-2 text-red-600 text-sm mt-1 ${className}`}>
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>{error}</span>
    </div>
  );
};

// Success Message Component
interface SuccessMessageProps {
  message?: string;
  className?: string;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <div className={`flex items-center gap-2 text-green-600 text-sm mt-1 ${className}`}>
      <CheckCircle className="w-4 h-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

// Form Field Wrapper with Validation
interface ValidatedFieldProps {
  label: string;
  error?: string;
  success?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const ValidatedField: React.FC<ValidatedFieldProps> = ({
  label,
  error,
  success,
  required = false,
  children,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      <ErrorMessage error={error} />
      <SuccessMessage message={success} />
    </div>
  );
};

// Progress Validation
export const calculateCompletionScore = (data: Record<string, any>, requiredFields: string[]) => {
  const completedFields = requiredFields.filter(field => {
    const value = data[field];
    return value !== null && value !== undefined && value !== '' && 
           (!Array.isArray(value) || value.length > 0);
  });
  
  return {
    completed: completedFields.length,
    total: requiredFields.length,
    percentage: Math.round((completedFields.length / requiredFields.length) * 100),
    isComplete: completedFields.length === requiredFields.length
  };
};

// Business Plan Specific Validations
export const businessPlanValidations = {
  companyName: [validationRules.required, validationRules.minLength(2), validationRules.maxLength(100)],
  industry: [validationRules.required],
  businessType: [validationRules.required],
  targetMarket: [validationRules.required, validationRules.minLength(10)],
  businessDescription: [validationRules.required, validationRules.minLength(50), validationRules.maxLength(1000)],
  email: [validationRules.email],
  phone: [validationRules.phone],
  website: [validationRules.url],
  fundingAmount: [validationRules.numeric],
  ownershipPercentage: [validationRules.percentage]
};

export default {
  validationRules,
  useFormValidation,
  ErrorMessage,
  SuccessMessage,
  ValidatedField,
  calculateCompletionScore,
  businessPlanValidations
}; 