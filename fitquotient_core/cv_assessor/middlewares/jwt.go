package middlewares

import (
	"cv_assessor/errors"
	"cv_assessor/utils"
	"strings"

	"github.com/gin-gonic/gin"
)

func JWTAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			_ = c.Error(errors.Unauthorized("Authorization header is required"))
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			_ = c.Error(errors.Unauthorized("Bearer token required"))
			c.Abort()
			return
		}

		claims, err := utils.VerifyJWT(tokenString)
		if err != nil {
			_ = c.Error(errors.Unauthorized("Invalid token"))
			c.Abort()
			return
		}

		if claims.TokenType != "access" {
			_ = c.Error(errors.Unauthorized("Invalid token type"))
			c.Abort()
			return
		}

		c.Set("userID", claims.UserID)
		c.Next()
	}
}