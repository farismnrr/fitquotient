import { useState } from "react";
import type { ApiResponse, FieldMapping } from "@/types/api";
import { handleApiCall } from "@/lib/api-handler";

/**
 * Options for useApiForm hook
 */
export interface UseApiFormOptions<T, R> {
  initialValues: T;
  onSubmit: (values: T) => Promise<ApiResponse<R>>;
  onSuccess?: (data: R) => void | Promise<void>;
  onError?: (message: string) => void;
  fieldMapping?: FieldMapping;
  successMessage?: string;
  errorMessage?: string;
}

/**
 * Return type for useApiForm hook
 */
export interface UseApiFormReturn<T> {
  values: T;
  errors: Record<string, string>;
  isLoading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setValues: React.Dispatch<React.SetStateAction<T>>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
  reset: () => void;
}

/**
 * Custom hook for handling forms with API integration
 * Provides form state management, validation error handling, and loading states
 * 
 * @param options - Configuration options for the form
 * @returns Form state and handlers
 * 
 * @example
 * ```typescript
 * const { values, errors, isLoading, handleChange, handleSubmit } = useApiForm({
 *   initialValues: { email: '', password: '' },
 *   onSubmit: (values) => loginUser(values),
 *   onSuccess: () => router.push('/dashboard'),
 *   fieldMapping: { confirm_password: 'confirmPassword' },
 *   successMessage: 'Login successful!'
 * });
 * ```
 */
export function useApiForm<T extends Record<string, unknown>, R = unknown>(
  options: UseApiFormOptions<T, R>
): UseApiFormReturn<T> {
  const {
    initialValues,
    onSubmit,
    onSuccess,
    onError,
    fieldMapping,
    successMessage,
    errorMessage,
  } = options;

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle input change
   * Automatically clears field error when user starts typing
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, name, value } = e.target;
    const fieldName = id || name;

    setValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear field error when user starts typing
    clearError(fieldName);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    await handleApiCall(
      () => onSubmit(values),
      {
        onSuccess,
        onError,
        onValidationError: setErrors,
        fieldMapping,
        successMessage,
        errorMessage,
      }
    );

    setIsLoading(false);
  };

  /**
   * Clear error for a specific field
   */
  const clearError = (field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  /**
   * Clear all errors
   */
  const clearAllErrors = () => {
    setErrors({});
  };

  /**
   * Reset form to initial values
   */
  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
    setValues,
    setErrors,
    clearError,
    clearAllErrors,
    reset,
  };
}
