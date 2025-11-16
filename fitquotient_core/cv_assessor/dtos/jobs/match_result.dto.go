package jobs

type MatchResult struct {
	MatchScore           float32  `json:"matchScore"`
	VectorSimilarity     float32  `json:"vectorSimilarity"`
	SkillMatch           []string `json:"skillMatch"`
	MissingSkills        []string `json:"missingSkills"`
	ExperienceRelevance  float32  `json:"experienceRelevance"`
	SkillMatchScore      float32  `json:"skillMatchScore"`
	MissingSkillsPenalty float32  `json:"missingSkillsPenalty"`
	Summary              string   `json:"summary"`
	Recommendation       string   `json:"recommendation"`
}
