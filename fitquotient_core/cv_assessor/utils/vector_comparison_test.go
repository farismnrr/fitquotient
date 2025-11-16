package utils

import (
	"math"
	"testing"
)

func TestCosineSimilarity(t *testing.T) {
	vc := NewVectorComparison()

	tests := []struct {
		name     string
		vec1     []float32
		vec2     []float32
		expected float32
		tolerance float32
	}{
		{
			name:      "identical vectors",
			vec1:      []float32{1, 0, 0},
			vec2:      []float32{1, 0, 0},
			expected:  1.0,
			tolerance: 0.0001,
		},
		{
			name:      "orthogonal vectors",
			vec1:      []float32{1, 0, 0},
			vec2:      []float32{0, 1, 0},
			expected:  0.0,
			tolerance: 0.0001,
		},
		{
			name:      "opposite vectors",
			vec1:      []float32{1, 0, 0},
			vec2:      []float32{-1, 0, 0},
			expected:  -1.0,
			tolerance: 0.0001,
		},
		{
			name:      "empty vectors",
			vec1:      []float32{},
			vec2:      []float32{},
			expected:  0.0,
			tolerance: 0.0001,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := vc.CosineSimilarity(tt.vec1, tt.vec2)
			if math.Abs(float64(result-tt.expected)) > float64(tt.tolerance) {
				t.Errorf("CosineSimilarity() = %v, want %v", result, tt.expected)
			}
		})
	}
}

func TestEuclideanDistance(t *testing.T) {
	vc := NewVectorComparison()

	tests := []struct {
		name      string
		vec1      []float32
		vec2      []float32
		expected  float32
		tolerance float32
	}{
		{
			name:      "identical vectors",
			vec1:      []float32{0, 0, 0},
			vec2:      []float32{0, 0, 0},
			expected:  0.0,
			tolerance: 0.0001,
		},
		{
			name:      "unit distance",
			vec1:      []float32{0, 0, 0},
			vec2:      []float32{1, 0, 0},
			expected:  1.0,
			tolerance: 0.0001,
		},
		{
			name:      "3-4-5 triangle",
			vec1:      []float32{0, 0, 0},
			vec2:      []float32{3, 4, 0},
			expected:  5.0,
			tolerance: 0.0001,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := vc.EuclideanDistance(tt.vec1, tt.vec2)
			if math.Abs(float64(result-tt.expected)) > float64(tt.tolerance) {
				t.Errorf("EuclideanDistance() = %v, want %v", result, tt.expected)
			}
		})
	}
}

func TestDotProduct(t *testing.T) {
	vc := NewVectorComparison()

	tests := []struct {
		name     string
		vec1     []float32
		vec2     []float32
		expected float32
	}{
		{
			name:     "perpendicular vectors",
			vec1:     []float32{1, 0, 0},
			vec2:     []float32{0, 1, 0},
			expected: 0,
		},
		{
			name:     "parallel vectors",
			vec1:     []float32{1, 2, 3},
			vec2:     []float32{2, 4, 6},
			expected: 28,
		},
		{
			name:     "zero vector",
			vec1:     []float32{0, 0, 0},
			vec2:     []float32{1, 2, 3},
			expected: 0,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := vc.DotProduct(tt.vec1, tt.vec2)
			if result != tt.expected {
				t.Errorf("DotProduct() = %v, want %v", result, tt.expected)
			}
		})
	}
}

func TestMagnitude(t *testing.T) {
	vc := NewVectorComparison()

	tests := []struct {
		name      string
		vec       []float32
		expected  float32
		tolerance float32
	}{
		{
			name:      "unit vector",
			vec:       []float32{1, 0, 0},
			expected:  1.0,
			tolerance: 0.0001,
		},
		{
			name:      "3-4-5 vector",
			vec:       []float32{3, 4, 0},
			expected:  5.0,
			tolerance: 0.0001,
		},
		{
			name:      "zero vector",
			vec:       []float32{0, 0, 0},
			expected:  0.0,
			tolerance: 0.0001,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := vc.Magnitude(tt.vec)
			if math.Abs(float64(result-tt.expected)) > float64(tt.tolerance) {
				t.Errorf("Magnitude() = %v, want %v", result, tt.expected)
			}
		})
	}
}
