package utils

import (
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID    string `json:"user_id"`
	TokenType string `json:"token_type"`
	jwt.RegisteredClaims
}

func GenerateAccessToken(userID string) (string, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return "", jwt.ErrInvalidKey
	}

	expirationHoursStr := os.Getenv("JWT_EXPIRATION_HOURS")
	expirationHours, err := strconv.Atoi(expirationHoursStr)
	if err != nil {
		expirationHours = 24 // default 24 hours
	}
	expiration := time.Duration(expirationHours) * time.Hour

	claims := Claims{
		UserID:    userID,
		TokenType: "access",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(expiration)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

func GenerateRefreshToken(userID string) (string, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return "", jwt.ErrInvalidKey
	}

	expirationDaysStr := os.Getenv("JWT_EXPIRATION_DAYS")
	expirationDays, err := strconv.Atoi(expirationDaysStr)
	if err != nil {
		expirationDays = 7 // default 7 days
	}
	expiration := time.Duration(expirationDays) * 24 * time.Hour

	claims := Claims{
		UserID:    userID,
		TokenType: "refresh",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(expiration)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

func VerifyJWT(tokenString string) (*Claims, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return nil, jwt.ErrInvalidKey
	}

	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})
	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}
	return nil, jwt.ErrSignatureInvalid
}

func GetRefreshTokenExpiration() time.Time {
	expirationDaysStr := os.Getenv("JWT_EXPIRATION_DAYS")
	expirationDays, err := strconv.Atoi(expirationDaysStr)
	if err != nil {
		expirationDays = 7 // default 7 days
	}
	return time.Now().Add(time.Duration(expirationDays) * 24 * time.Hour)
}

func GetRefreshTokenMaxAge() int {
	expirationDaysStr := os.Getenv("JWT_EXPIRATION_DAYS")
	expirationDays, err := strconv.Atoi(expirationDaysStr)
	if err != nil {
		expirationDays = 7 // default 7 days
	}
	return expirationDays * 24 * 3600
}
