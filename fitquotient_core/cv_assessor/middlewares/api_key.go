package middlewares

import (
	"os"

	"cv_assessor/errors"

	"github.com/gin-gonic/gin"
)

func ApiKey() gin.HandlerFunc {
	return func(c *gin.Context) {
		apiKey := c.GetHeader("X-API-Key")
		expectedApiKey := os.Getenv("CV_ASSESSOR_API_KEY")

		if expectedApiKey == "" {
			_ = c.Error(errors.Internal("API Key configuration error", nil))
			c.Abort()
			return
		}

		if apiKey == "" {
			_ = c.Error(errors.Unauthorized("API Key is required"))
			c.Abort()
			return
		}

		if apiKey != expectedApiKey {
			_ = c.Error(errors.Unauthorized("Invalid API Key"))
			c.Abort()
			return
		}

		c.Next()
	}
}
