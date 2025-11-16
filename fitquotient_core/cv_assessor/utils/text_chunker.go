package utils

import (
	"strings"
)

// TextChunkerConfig holds configuration for text chunking
type TextChunkerConfig struct {
	MaxChunkSize int // Maximum characters per chunk
	OverlapSize  int // Overlap between chunks for context
}

// DefaultTextChunkerConfig returns the default configuration
func DefaultTextChunkerConfig() TextChunkerConfig {
	return TextChunkerConfig{
		MaxChunkSize: 512,
		OverlapSize:  50,
	}
}

// TextChunker provides methods for splitting and chunking text
type TextChunker struct {
	config TextChunkerConfig
}

// NewTextChunker creates a new TextChunker with default configuration
func NewTextChunker() *TextChunker {
	return &TextChunker{
		config: DefaultTextChunkerConfig(),
	}
}

// NewTextChunkerWithConfig creates a new TextChunker with custom configuration
func NewTextChunkerWithConfig(config TextChunkerConfig) *TextChunker {
	return &TextChunker{
		config: config,
	}
}

// ChunkText splits text into chunks based on paragraphs and sentences
func (tc *TextChunker) ChunkText(text string) []string {
	if text == "" {
		return []string{}
	}

	var chunks []string

	// First try to split by paragraphs
	paragraphs := strings.Split(text, "\n\n")

	currentChunk := ""

	for _, para := range paragraphs {
		// If current chunk + new paragraph fits, add it
		if len(currentChunk)+len(para)+2 <= tc.config.MaxChunkSize {
			if currentChunk != "" {
				currentChunk += "\n\n"
			}
			currentChunk += para
		} else {
			// Save current chunk if not empty
			if currentChunk != "" {
				chunks = append(chunks, strings.TrimSpace(currentChunk))
			}

			// If paragraph itself is larger than max chunk size, split by sentences
			if len(para) > tc.config.MaxChunkSize {
				sentences := tc.SplitBySentences(para)
				chunks = append(chunks, sentences...)
				currentChunk = ""
			} else {
				currentChunk = para
			}
		}
	}

	// Add remaining chunk
	if currentChunk != "" {
		chunks = append(chunks, strings.TrimSpace(currentChunk))
	}

	return chunks
}

// SplitBySentences splits text by sentence boundaries with overlap
func (tc *TextChunker) SplitBySentences(text string) []string {
	var chunks []string

	// Split by sentence-like boundaries
	sentences := strings.FieldsFunc(text, func(r rune) bool {
		return r == '.' || r == '!' || r == '?'
	})

	currentChunk := ""

	for i, sentence := range sentences {
		sentence = strings.TrimSpace(sentence)
		if sentence == "" {
			continue
		}

		// Determine the punctuation mark
		punct := "."
		if i < len(sentences)-1 {
			// Find the next punctuation in original text
			idx := strings.Index(text, sentence)
			if idx+len(sentence) < len(text) {
				switch text[idx+len(sentence)] {
				case '!':
					punct = "!"
				case '?':
					punct = "?"
				}
			}
		}

		sentenceWithPunct := sentence + punct

		// If adding this sentence doesn't exceed limit, add it
		if len(currentChunk)+len(sentenceWithPunct)+1 <= tc.config.MaxChunkSize {
			if currentChunk != "" {
				currentChunk += " "
			}
			currentChunk += sentenceWithPunct
		} else {
			// Save current chunk if not empty
			if currentChunk != "" {
				chunks = append(chunks, strings.TrimSpace(currentChunk))
			}

			currentChunk = sentenceWithPunct
		}
	}

	// Add remaining chunk
	if currentChunk != "" {
		chunks = append(chunks, strings.TrimSpace(currentChunk))
	}

	return chunks
}
