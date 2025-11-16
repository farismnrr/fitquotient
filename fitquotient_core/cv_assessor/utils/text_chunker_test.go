package utils

import (
	"testing"
)

func TestNewTextChunker(t *testing.T) {
	chunker := NewTextChunker()
	if chunker == nil {
		t.Fatal("NewTextChunker should not return nil")
	}
	if chunker.config.MaxChunkSize != 512 {
		t.Errorf("expected MaxChunkSize 512, got %d", chunker.config.MaxChunkSize)
	}
	if chunker.config.OverlapSize != 50 {
		t.Errorf("expected OverlapSize 50, got %d", chunker.config.OverlapSize)
	}
}

func TestNewTextChunkerWithConfig(t *testing.T) {
	config := TextChunkerConfig{
		MaxChunkSize: 256,
		OverlapSize:  25,
	}
	chunker := NewTextChunkerWithConfig(config)
	if chunker == nil {
		t.Fatal("NewTextChunkerWithConfig should not return nil")
	}
	if chunker.config.MaxChunkSize != 256 {
		t.Errorf("expected MaxChunkSize 256, got %d", chunker.config.MaxChunkSize)
	}
	if chunker.config.OverlapSize != 25 {
		t.Errorf("expected OverlapSize 25, got %d", chunker.config.OverlapSize)
	}
}

func TestChunkTextEmpty(t *testing.T) {
	chunker := NewTextChunker()
	chunks := chunker.ChunkText("")
	if len(chunks) != 0 {
		t.Errorf("expected empty chunks for empty text, got %d chunks", len(chunks))
	}
}

func TestChunkTextWithParagraphs(t *testing.T) {
	chunker := NewTextChunker()
	text := "This is the first paragraph.\n\nThis is the second paragraph.\n\nThis is the third paragraph."
	chunks := chunker.ChunkText(text)
	
	if len(chunks) < 1 {
		t.Fatalf("expected at least 1 chunk, got %d", len(chunks))
	}

	// Check that chunks are not empty
	for i, chunk := range chunks {
		if len(chunk) == 0 {
			t.Errorf("chunk %d is empty", i)
		}
	}
}

func TestChunkTextWithLongParagraph(t *testing.T) {
	chunker := NewTextChunkerWithConfig(TextChunkerConfig{
		MaxChunkSize: 100,
		OverlapSize:  10,
	})
	text := "This is a long paragraph that should be split into multiple chunks. Each sentence should be considered. The chunking algorithm should work correctly."
	chunks := chunker.ChunkText(text)
	
	if len(chunks) == 0 {
		t.Fatal("expected chunks for long paragraph")
	}

	// Check that each chunk doesn't exceed max size
	for i, chunk := range chunks {
		if len(chunk) > 100 {
			t.Errorf("chunk %d exceeds max size: %d", i, len(chunk))
		}
	}
}

func TestSplitBySentences(t *testing.T) {
	chunker := NewTextChunkerWithConfig(TextChunkerConfig{
		MaxChunkSize: 100,
		OverlapSize:  10,
	})
	text := "First sentence. Second sentence. Third sentence. Fourth sentence."
	chunks := chunker.SplitBySentences(text)
	
	if len(chunks) == 0 {
		t.Fatal("expected at least one chunk")
	}

	// Check that chunks contain sentences with punctuation
	for i, chunk := range chunks {
		if len(chunk) == 0 {
			t.Errorf("chunk %d is empty", i)
		}
	}
}

func TestSplitBySentencesWithMultiplePunctuation(t *testing.T) {
	chunker := NewTextChunker()
	text := "Is this a question? Yes it is! This is a statement."
	chunks := chunker.SplitBySentences(text)
	
	if len(chunks) == 0 {
		t.Fatal("expected at least one chunk")
	}

	// Verify we have chunks
	if len(chunks) > 0 {
		t.Logf("Got %d chunks from text", len(chunks))
	}
}
