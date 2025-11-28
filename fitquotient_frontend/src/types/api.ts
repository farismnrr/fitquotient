/**
 * Standard API Response Structure
 */
export interface ApiResponse<T = unknown> {
  is_success: boolean;
  message: string;
  data?: T;
  details?: ValidationError[];
  error?: string;
}

/**
 * Validation Error Structure from API
 */
export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

/**
 * Field Mapping Configuration
 * Maps API field names to form field names
 */
export type FieldMapping = Record<string, string>;

/**
 * API Handler Options
 */
export interface ApiHandlerOptions<T = unknown> {
  onSuccess?: (data: T) => void | Promise<void>;
  onError?: (message: string) => void;
  onValidationError?: (errors: Record<string, string>) => void;
  fieldMapping?: FieldMapping;
  successMessage?: string;
  errorMessage?: string;
  /**
   * If set to false, do not show the success toast for this API call
   */
  showSuccessToast?: boolean;
}

/**
 * API Handler Result
 */
export interface ApiHandlerResult<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  fieldErrors?: Record<string, string>;
}
