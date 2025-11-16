package utils

import "math"

// VectorComparison provides utilities for comparing vectors
type VectorComparison struct{}

// NewVectorComparison creates a new VectorComparison instance
func NewVectorComparison() *VectorComparison {
	return &VectorComparison{}
}

// CosineSimilarity calculates the cosine similarity between two vectors
// Returns a value between -1 and 1, where 1 means identical direction
func (vc *VectorComparison) CosineSimilarity(vec1, vec2 []float32) float32 {
	if len(vec1) != len(vec2) || len(vec1) == 0 {
		return 0
	}

	dotProduct := float32(0)
	magnitude1 := float32(0)
	magnitude2 := float32(0)

	for i := 0; i < len(vec1); i++ {
		dotProduct += vec1[i] * vec2[i]
		magnitude1 += vec1[i] * vec1[i]
		magnitude2 += vec2[i] * vec2[i]
	}

	magnitude1 = float32(math.Sqrt(float64(magnitude1)))
	magnitude2 = float32(math.Sqrt(float64(magnitude2)))

	if magnitude1 == 0 || magnitude2 == 0 {
		return 0
	}

	return dotProduct / (magnitude1 * magnitude2)
}

// EuclideanDistance calculates the Euclidean distance between two vectors
// Lower values mean more similar vectors
func (vc *VectorComparison) EuclideanDistance(vec1, vec2 []float32) float32 {
	if len(vec1) != len(vec2) || len(vec1) == 0 {
		return math.MaxFloat32
	}

	sumOfSquares := float32(0)
	for i := 0; i < len(vec1); i++ {
		diff := vec1[i] - vec2[i]
		sumOfSquares += diff * diff
	}

	return float32(math.Sqrt(float64(sumOfSquares)))
}

// DotProduct calculates the dot product of two vectors
func (vc *VectorComparison) DotProduct(vec1, vec2 []float32) float32 {
	if len(vec1) != len(vec2) || len(vec1) == 0 {
		return 0
	}

	dotProduct := float32(0)
	for i := 0; i < len(vec1); i++ {
		dotProduct += vec1[i] * vec2[i]
	}

	return dotProduct
}

// Magnitude calculates the magnitude (length) of a vector
func (vc *VectorComparison) Magnitude(vec []float32) float32 {
	if len(vec) == 0 {
		return 0
	}

	sumOfSquares := float32(0)
	for i := 0; i < len(vec); i++ {
		sumOfSquares += vec[i] * vec[i]
	}

	return float32(math.Sqrt(float64(sumOfSquares)))
}
