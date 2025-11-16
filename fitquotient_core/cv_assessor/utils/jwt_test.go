package utils

import (
	"os"
	"testing"
	"time"
)

func TestVerifyJWT_InvalidToken(t *testing.T) {
	if err := os.Setenv("JWT_SECRET", "test_secret"); err != nil {
		t.Fatal(err)
	}

	_, err := VerifyJWT("invalid.token.here")
	if err == nil {
		t.Fatal("Expected error for invalid token")
	}
}

func TestVerifyJWT_ExpiredToken(t *testing.T) {
	if err := os.Setenv("JWT_SECRET", "test_secret"); err != nil {
		t.Fatal(err)
	}
	if err := os.Setenv("JWT_EXPIRATION_HOURS", "0"); err != nil { // Expire immediately
		t.Fatal(err)
	}

	token, err := GenerateAccessToken("user123")
	if err != nil {
		t.Fatalf("Expected no error generating token, got %v", err)
	}

	// Wait a bit to ensure expiration
	time.Sleep(1 * time.Second)

	_, err = VerifyJWT(token)
	if err == nil {
		t.Fatal("Expected error for expired token")
	}
}

func TestGenerateAccessToken_Success(t *testing.T) {
	if err := os.Setenv("JWT_SECRET", "test_secret"); err != nil {
		t.Fatal(err)
	}
	if err := os.Setenv("JWT_EXPIRATION_HOURS", "1"); err != nil {
		t.Fatal(err)
	}

	token, err := GenerateAccessToken("user123")
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}
	if token == "" {
		t.Fatal("Expected non-empty token")
	}

	// Verify the token
	claims, err := VerifyJWT(token)
	if err != nil {
		t.Fatalf("Expected no error verifying token, got %v", err)
	}
	if claims.UserID != "user123" {
		t.Errorf("Expected UserID 'user123', got '%s'", claims.UserID)
	}
	if claims.TokenType != "access" {
		t.Errorf("Expected TokenType 'access', got '%s'", claims.TokenType)
	}
}

func TestGenerateRefreshToken_Success(t *testing.T) {
	if err := os.Setenv("JWT_SECRET", "test_secret"); err != nil {
		t.Fatal(err)
	}
	if err := os.Setenv("JWT_EXPIRATION_DAYS", "7"); err != nil {
		t.Fatal(err)
	}

	token, err := GenerateRefreshToken("user123")
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}
	if token == "" {
		t.Fatal("Expected non-empty token")
	}

	// Verify the token
	claims, err := VerifyJWT(token)
	if err != nil {
		t.Fatalf("Expected no error verifying token, got %v", err)
	}
	if claims.UserID != "user123" {
		t.Errorf("Expected UserID 'user123', got '%s'", claims.UserID)
	}
	if claims.TokenType != "refresh" {
		t.Errorf("Expected TokenType 'refresh', got '%s'", claims.TokenType)
	}
}
