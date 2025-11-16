package middlewares

import (
	"errors"
	"io"
	"net/http"

	respDtos "cv_assessor/dtos/responses"
	svc "cv_assessor/errors"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

// ErrorHandler middleware catches errors and responds with appropriate HTTP status codes
func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		// Check if there's an error in the context
		if len(c.Errors) > 0 {
			err := c.Errors.Last().Err

			// Handle http.ErrNoCookie as unauthorized
			if errors.Is(err, http.ErrNoCookie) {
				response := respDtos.GeneralErrorResponse{
					IsSuccess: false,
					Message:   "Unauthorized",
				}
				c.JSON(http.StatusUnauthorized, response)
				c.Abort()
				return
			}

			// Handle ServiceError
			var serviceErr *svc.ServiceError
			if errors.As(err, &serviceErr) {
				status := http.StatusBadRequest
				switch serviceErr.Code {
				case svc.CodeUnauthorized:
					status = http.StatusUnauthorized
				case svc.CodeNotFound:
					status = http.StatusNotFound
				case svc.CodeConflict:
					status = http.StatusConflict
				case svc.CodeInternal:
					status = http.StatusInternalServerError
				case svc.CodeInvalid:
					status = http.StatusBadRequest
				}
				response := respDtos.GeneralErrorResponse{
					IsSuccess: false,
					Message:   serviceErr.Message,
				}
				c.JSON(status, response)
				c.Abort()
				return
			}

			// Handle validation errors
			var validationErrors validator.ValidationErrors
			if errors.As(err, &validationErrors) {
				details := make([]respDtos.ValidationDetail, 0, len(validationErrors))
				for _, fieldErr := range validationErrors {
					details = append(details, respDtos.ValidationDetail{
						Field: fieldErr.Field(),
						Error: fieldErr.Tag(),
					})
				}
				response := respDtos.ValidationErrorResponse{
					IsSuccess: false,
					Message:   "Validation failed",
					Details:   details,
				}
				c.JSON(http.StatusBadRequest, response)
				c.Abort()
				return
			}

			// Handle binding errors (empty body, invalid JSON, etc.)
			if errors.Is(err, io.EOF) {
				response := respDtos.GeneralErrorResponse{
					IsSuccess: false,
					Message:   "Request body is required",
				}
				c.JSON(http.StatusBadRequest, response)
				c.Abort()
				return
			}

			// Check if it's a JSON unmarshal error or other binding error
			if _, ok := err.(*gin.Error); ok || errors.Is(err, io.ErrUnexpectedEOF) {
				response := respDtos.GeneralErrorResponse{
					IsSuccess: false,
					Message:   "Invalid request body",
				}
				c.JSON(http.StatusBadRequest, response)
				c.Abort()
				return
			}

			// Handle generic errors
			response := respDtos.GeneralErrorResponse{
				IsSuccess: false,
				Message:   "Bad request",
			}
			c.JSON(http.StatusBadRequest, response)
			c.Abort()
		}
	}
}
