import { toast } from "sonner";
import type {
  ApiResponse,
  ApiHandlerOptions,
  ApiHandlerResult,
  ValidationError,
} from "@/types/api";

/**
 * Generic API Response Handler
 * Handles success, error, and validation error cases consistently
 * 
 * @param response - The API response object
 * @param options - Handler options for callbacks and configuration
 * @returns ApiHandlerResult with success status and relevant data
 * 
 * @example
 * ```typescript
 * const result = await handleApiResponse(apiResponse, {
 *   onSuccess: (data) => router.push('/dashboard'),
 *   onValidationError: (errors) => setFieldErrors(errors),
 *   fieldMapping: { confirm_password: 'confirmPassword' },
 *   successMessage: 'Operation completed successfully!'
 * });
 * ```
 */
export async function handleApiResponse<T = unknown>(
  response: ApiResponse<T>,
  options: ApiHandlerOptions<T> = {}
): Promise<ApiHandlerResult<T>> {
  const {
    onSuccess,
    onError,
    onValidationError,
    fieldMapping = {},
    successMessage,
    errorMessage,
  } = options;

  // Success case
  if (response.is_success) {
    const message = successMessage || response.message || "Operation successful";
    toast.success(message);

    if (onSuccess) {
      await onSuccess(response.data as T);
    }

    return {
      success: true,
      data: response.data,
      message,
    };
  }

  // Error case with validation errors
  const errorDetails = response.details || response.data;
  if (errorDetails && Array.isArray(errorDetails)) {
    const fieldErrors = mapValidationErrors(errorDetails, fieldMapping);

    if (onValidationError) {
      onValidationError(fieldErrors);
    }

    toast.error(response.message, {
      description: "Please check the form for errors.",
    });

    return {
      success: false,
      message: response.message,
      fieldErrors,
    };
  }

  // Generic error case
  const message = errorMessage || response.message || "An error occurred";
  toast.error(message);

  if (onError) {
    onError(message);
  }

  return {
    success: false,
    message,
  };
}

/**
 * Maps validation errors from API field names to form field names
 * 
 * @param errors - Array of validation errors from API
 * @param fieldMapping - Mapping of API field names to form field names
 * @returns Record of form field names to error messages
 */
export function mapValidationErrors(
  errors: ValidationError[],
  fieldMapping: Record<string, string> = {}
): Record<string, string> {
  const mappedErrors: Record<string, string> = {};

  errors.forEach((err) => {
    const fieldName = fieldMapping[err.field] || err.field;
    mappedErrors[fieldName] = err.message;
  });

  return mappedErrors;
}

/**
 * Generic API Call Wrapper with Error Handling
 * Wraps any API call and handles errors consistently
 * 
 * @param apiCall - The API function to call
 * @param options - Handler options
 * @returns ApiHandlerResult
 * 
 * @example
 * ```typescript
 * const result = await handleApiCall(
 *   () => registerUser(formData),
 *   {
 *     onSuccess: () => router.push('/login'),
 *     fieldMapping: { confirm_password: 'confirmPassword' }
 *   }
 * );
 * ```
 */
export async function handleApiCall<T = unknown>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: ApiHandlerOptions<T> = {}
): Promise<ApiHandlerResult<T>> {
  try {
    const response = await apiCall();
    return await handleApiResponse(response, options);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    
    toast.error(message);

    if (options.onError) {
      options.onError(message);
    }

    return {
      success: false,
      message,
    };
  }
}
