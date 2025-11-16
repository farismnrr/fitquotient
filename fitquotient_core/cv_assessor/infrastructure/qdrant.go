package infrastructure

import (
	"fmt"
	"os"
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

	qdrantAPIKey := os.Getenv("QDRANT_API_KEY")

	// Create client with gRPC connection
	var err error
	if qdrantAPIKey != "" {
		qc.client, err = qdrant.NewClient(&qdrant.Config{
			Host: qdrantURL,
			Port: 6334,
			APIKey: qdrantAPIKey,
		})
	} else {
		qc.client, err = qdrant.NewClient(&qdrant.Config{
			Host: qdrantURL,
			Port: 6334,
		})
	}

	if err != nil {
		return fmt.Errorf("failed to connect to qdrant: %w", err)
	}

	qc.isOpen = true
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
