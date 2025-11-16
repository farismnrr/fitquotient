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

// AverageCosineSimilarity calculates the average cosine similarity between two sets of vectors
// Returns the mean similarity score across all vector pairs
func (vc *VectorComparison) AverageCosineSimilarity(vec1Set, vec2Set [][]float32) float32 {
	if len(vec1Set) == 0 || len(vec2Set) == 0 {
		return 0
	}

	totalSimilarity := float32(0)
	count := 0

	// Compare each vector from set1 with each vector from set2
	for _, vec1 := range vec1Set {
		for _, vec2 := range vec2Set {
			similarity := vc.CosineSimilarity(vec1, vec2)
			totalSimilarity += similarity
			count++
		}
	}

	if count == 0 {
		return 0
	}

	return totalSimilarity / float32(count)
}

// MaxCosineSimilarity finds the maximum cosine similarity between two sets of vectors
func (vc *VectorComparison) MaxCosineSimilarity(vec1Set, vec2Set [][]float32) float32 {
	if len(vec1Set) == 0 || len(vec2Set) == 0 {
		return 0
	}

	maxSimilarity := float32(-1)

	for _, vec1 := range vec1Set {
		for _, vec2 := range vec2Set {
			similarity := vc.CosineSimilarity(vec1, vec2)
			if similarity > maxSimilarity {
				maxSimilarity = similarity
			}
		}
	}

	return maxSimilarity
}
