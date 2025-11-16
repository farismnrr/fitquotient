package errors

import "fmt"

// Error codes to classify service-layer errors
const (
	CodeNotFound     = "NOT_FOUND"
	CodeInvalid      = "INVALID_INPUT"
	CodeUnauthorized = "UNAUTHORIZED"
	CodeInternal     = "INTERNAL_SERVER_ERROR"
	CodeConflict     = "CONFLICT"
)

// ServiceError represents a custom error for service operations
// It can wrap an underlying error to preserve low-level details.
type ServiceError struct {
	Code    string
	Message string
	Err     error // optional underlying error
}

// Error implements the error interface
func (e *ServiceError) Error() string {
	if e == nil {
		return "<nil>"
	}
	if e.Err != nil {
		return fmt.Sprintf("%s: %s: %v", e.Code, e.Message, e.Err)
	}
	return fmt.Sprintf("%s: %s", e.Code, e.Message)
}

// Unwrap exposes the underlying error for errors.Is / errors.As
func (e *ServiceError) Unwrap() error { return e.Err }

// NewServiceError constructs a ServiceError with optional underlying error
func NewServiceError(code, message string, underlying ...error) *ServiceError {
	var err error
	if len(underlying) > 0 {
		err = underlying[0]
	}
	return &ServiceError{Code: code, Message: message, Err: err}
}

// Helper constructors for common cases
func InvalidInput(msg string) error { return NewServiceError(CodeInvalid, msg) }
func Conflict(msg string) error     { return NewServiceError(CodeConflict, msg) }
func NotFound(msg string) error     { return NewServiceError(CodeNotFound, msg) }
func Unauthorized(msg string) error { return NewServiceError(CodeUnauthorized, msg) }
func Internal(msg string, err error) error {
	return NewServiceError(CodeInternal, msg, err)
}
