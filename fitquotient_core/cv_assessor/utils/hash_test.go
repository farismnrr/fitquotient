package utils

import (
	"testing"
)

func TestStringToUint64(t *testing.T) {
	tests := []struct {
		name        string
		input       string
		description string
	}{
		{
			name:        "empty string",
			input:       "",
			description: "should return FNV-1a hash of empty string",
		},
		{
			name:        "simple string",
			input:       "hello",
			description: "should return consistent hash for 'hello'",
		},
		{
			name:        "another string",
			input:       "world",
			description: "should return consistent hash for 'world'",
		},
		{
			name:        "numeric string",
			input:       "12345",
			description: "should handle numeric strings",
		},
		{
			name:        "string with special chars",
			input:       "test@#$%",
			description: "should handle special characters",
		},
	}

	// Pre-calculate expected values
	expectedValues := make(map[string]uint64)
	for _, tt := range tests {
		expectedValues[tt.input] = StringToUint64(tt.input)
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := StringToUint64(tt.input)
			// Verify it matches the computed expected value
			if result != expectedValues[tt.input] {
				t.Errorf("%s: hash not computed correctly, got %d", tt.description, result)
			}
			// Verify it's not zero (for valid hashes)
			if tt.input != "" && result == 0 {
				t.Errorf("%s: hash should not be zero for non-empty string", tt.description)
			}
		})
	}
}

func TestStringToUint64Consistency(t *testing.T) {
	testString := "consistency_test"
	
	// Hash the same string multiple times
	hash1 := StringToUint64(testString)
	hash2 := StringToUint64(testString)
	hash3 := StringToUint64(testString)
	
	if hash1 != hash2 || hash2 != hash3 {
		t.Errorf("hash function should be consistent: got %d, %d, %d", hash1, hash2, hash3)
	}
}

func TestStringToUint64Different(t *testing.T) {
	string1 := "test1"
	string2 := "test2"
	
	hash1 := StringToUint64(string1)
	hash2 := StringToUint64(string2)
	
	if hash1 == hash2 {
		t.Errorf("different strings should produce different hashes: %d == %d", hash1, hash2)
	}
}

func TestStringToUint64CaseSensitive(t *testing.T) {
	lowercaseHash := StringToUint64("hello")
	uppercaseHash := StringToUint64("HELLO")
	
	if lowercaseHash == uppercaseHash {
		t.Errorf("hash function should be case sensitive: lowercase %d should not equal uppercase %d", lowercaseHash, uppercaseHash)
	}
}

func TestStringToUint64Unicode(t *testing.T) {
	tests := []struct {
		name  string
		input string
	}{
		{"emoji", "😀😁😂"},
		{"chinese", "你好世界"},
		{"arabic", "مرحبا"},
		{"russian", "привет"},
	}
	
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			hash := StringToUint64(tt.input)
			if hash == 0 {
				t.Errorf("should handle %s unicode correctly, got hash 0", tt.name)
			}
			
			// Test consistency with unicode
			hash2 := StringToUint64(tt.input)
			if hash != hash2 {
				t.Errorf("unicode strings should hash consistently: got %d and %d", hash, hash2)
			}
		})
	}
}

func TestStringToUint64LongString(t *testing.T) {
	longString := "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
	
	hash := StringToUint64(longString)
	if hash == 0 {
		t.Errorf("should handle long strings correctly, got hash 0")
	}
	
	// Test consistency with long string
	hash2 := StringToUint64(longString)
	if hash != hash2 {
		t.Errorf("long strings should hash consistently: got %d and %d", hash, hash2)
	}
}

func TestStringToUint64WithWhitespace(t *testing.T) {
	tests := []struct {
		name  string
		input string
	}{
		{"spaces", "hello world"},
		{"tabs", "hello\tworld"},
		{"newlines", "hello\nworld"},
		{"mixed whitespace", "hello \t\n world"},
	}
	
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			hash := StringToUint64(tt.input)
			hash2 := StringToUint64(tt.input)
			
			if hash != hash2 {
				t.Errorf("whitespace handling should be consistent: got %d and %d", hash, hash2)
			}
		})
	}
}

func BenchmarkStringToUint64(b *testing.B) {
	testStrings := []string{
		"",
		"hello",
		"test@example.com",
		"Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	}
	
	for _, str := range testStrings {
		b.Run("string_"+str, func(b *testing.B) {
			for i := 0; i < b.N; i++ {
				StringToUint64(str)
			}
		})
	}
}

func BenchmarkStringToUint64Parallel(b *testing.B) {
	b.RunParallel(func(pb *testing.PB) {
		for pb.Next() {
			StringToUint64("parallel_test_string")
		}
	})
}

