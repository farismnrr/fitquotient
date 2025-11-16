package middlewares

import "github.com/gin-gonic/gin"

func PoweredBy() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("X-Powered-By", "CV Assessor API")
		c.Next()
	}
}
