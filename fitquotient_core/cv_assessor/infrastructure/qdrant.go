package infrastructure

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"
	"os"
	"strings"
	"sync"

	"github.com/qdrant/go-client/qdrant"
)

type QdrantConnection struct {
	client *qdrant.Client
	mu     sync.RWMutex
	isOpen bool
}

var (
	qdrantInstance *QdrantConnection
	once           sync.Once
)

// GetQdrantInstance returns singleton instance of QdrantConnection
func GetQdrantInstance() *QdrantConnection {
	once.Do(func() {
		qdrantInstance = &QdrantConnection{
			isOpen: false,
		}
	})
	return qdrantInstance
}

// Connect establishes connection to Qdrant server
func (qc *QdrantConnection) Connect() error {
	qc.mu.Lock()
	defer qc.mu.Unlock()

	if qc.isOpen {
		return fmt.Errorf("qdrant connection is already open")
	}

	// Get configuration from environment variables
	qdrantURL := os.Getenv("QDRANT_URL")
	if qdrantURL == "" {
		qdrantURL = "localhost:6334"
	}

	// Extract hostname from URL (remove protocol if present)
	host := qdrantURL
	host = strings.TrimPrefix(host, "http://")
	host = strings.TrimPrefix(host, "https://")

	// Extract just the hostname without port for gRPC
	hostname, _, err := net.SplitHostPort(host)
	if err != nil {
		// If no port in string, use the whole thing as hostname
		hostname = host
	}

	qdrantAPIKey := os.Getenv("QDRANT_API_KEY")

	// Create client with gRPC connection
	var clientErr error
	if qdrantAPIKey != "" {
		qc.client, clientErr = qdrant.NewClient(&qdrant.Config{
			Host:   hostname,
			Port:   6334,
			APIKey: qdrantAPIKey,
		})
	} else {
		qc.client, clientErr = qdrant.NewClient(&qdrant.Config{
			Host: hostname,
			Port: 6334,
		})
	}

	if clientErr != nil {
		return fmt.Errorf("failed to connect to qdrant: %w", clientErr)
	}

	qc.isOpen = true
	return nil
}

// EnsureCollectionExists creates the collection if it doesn't exist
func (qc *QdrantConnection) EnsureCollectionExists(collectionName string, vectorSize uint64) error {
	qdrantURL := os.Getenv("QDRANT_URL")
	if qdrantURL == "" {
		qdrantURL = "http://localhost:6333"
	}

	// Ensure URL has protocol
	if qdrantURL != "" && !bytes.HasPrefix([]byte(qdrantURL), []byte("http://")) && !bytes.HasPrefix([]byte(qdrantURL), []byte("https://")) {
		qdrantURL = "http://" + qdrantURL
	}

	// Try to create collection via REST API
	payload := map[string]interface{}{
		"vectors": map[string]interface{}{
			"size":     vectorSize,
			"distance": "Cosine",
		},
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal collection config: %w", err)
	}

	url := fmt.Sprintf("%s/collections/%s", qdrantURL, collectionName)
	req, err := http.NewRequest("PUT", url, bytes.NewBuffer(payloadBytes))
	if err != nil {
		return fmt.Errorf("failed to create HTTP request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to make HTTP request to Qdrant: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response body: %w", err)
	}

	// 409 Conflict means collection already exists, which is OK
	if resp.StatusCode == http.StatusConflict {
		return nil
	}

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		return fmt.Errorf("failed to create collection %s: status %d, body: %s", collectionName, resp.StatusCode, string(body))
	}

	return nil
}

// Disconnect closes the connection to Qdrant server
func (qc *QdrantConnection) Disconnect() error {
	qc.mu.Lock()
	defer qc.mu.Unlock()

	if !qc.isOpen {
		return fmt.Errorf("qdrant connection is not open")
	}

	if qc.client != nil {
		qc.client.Close()
		qc.client = nil
	}

	qc.isOpen = false
	return nil
}

// GetClient returns the Qdrant client
func (qc *QdrantConnection) GetClient() *qdrant.Client {
	qc.mu.RLock()
	defer qc.mu.RUnlock()

	return qc.client
}

// IsConnected checks if connection is open
func (qc *QdrantConnection) IsConnected() bool {
	qc.mu.RLock()
	defer qc.mu.RUnlock()

	return qc.isOpen && qc.client != nil
}

// InitQdrantConnection initializes Qdrant connection
func InitQdrantConnection() error {
	return GetQdrantInstance().Connect()
}

// CloseQdrantConnection closes Qdrant connection
func CloseQdrantConnection() error {
	return GetQdrantInstance().Disconnect()
}
