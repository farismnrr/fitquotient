package infrastructure

import (
	"os"
	"sync"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestQdrantSingleton(t *testing.T) {
	// Reset singleton untuk test
	once.Do(func() {})
	qdrantInstance = nil
	once = sync.Once{}

	instance1 := GetQdrantInstance()
	instance2 := GetQdrantInstance()

	assert.NotNil(t, instance1)
	assert.Equal(t, instance1, instance2, "Should return same instance")
}

func TestQdrantIsConnected(t *testing.T) {
	qc := GetQdrantInstance()
	assert.False(t, qc.IsConnected(), "Should not be connected initially")
}

func TestQdrantConnectWithoutEnv(t *testing.T) {
	// Clear environment variables
	os.Unsetenv("QDRANT_URL")
	os.Unsetenv("QDRANT_API_KEY")

	qc := GetQdrantInstance()

	// Note: This test will try to connect to localhost:6334
	// It will fail if Qdrant is not running, which is expected for unit tests
	err := qc.Connect()
	if err != nil {
		t.Logf("Connection failed (expected if Qdrant not running): %v", err)
	}

	// Clean up
	if qc.IsConnected() {
		qc.Disconnect()
	}
}

func TestQdrantDisconnectWithoutConnection(t *testing.T) {
	qc := GetQdrantInstance()
	err := qc.Disconnect()
	assert.Error(t, err, "Should error when disconnecting without connection")
	assert.Equal(t, "qdrant connection is not open", err.Error())
}
