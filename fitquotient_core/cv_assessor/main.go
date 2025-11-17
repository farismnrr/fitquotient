package main

import (
	"cv_assessor/infrastructure"
	"cv_assessor/utils"

	"github.com/joho/godotenv"
)

func main() {
	// Load .env file if it exists (optional in Docker, uses system env vars otherwise)
	_ = godotenv.Load()
	
	// Init Qdrant
	if err := infrastructure.InitQdrantConnection(); err != nil {
		utils.Log.Fatal("Failed to connect to Qdrant: " + err.Error())
	}

	// Ensure collections exist
	if err := infrastructure.GetQdrantInstance().EnsureCollectionExists("cvs", 384); err != nil {
		utils.Log.Fatal("Failed to ensure CV collection exists: " + err.Error())
	}
	if err := infrastructure.GetQdrantInstance().EnsureCollectionExists("jobs", 384); err != nil {
		utils.Log.Fatal("Failed to ensure Job collection exists: " + err.Error())
	}

	defer func() {
		err := infrastructure.CloseQdrantConnection()
		if err != nil {
			utils.Log.Error("Failed to close Qdrant connection: " + err.Error())
		}
	}()

	// Init Redis
	if err := infrastructure.InitRedisConnection(); err != nil {
		utils.Log.Fatal("Failed to connect to Redis: " + err.Error())
	}
	defer func() {
		err := infrastructure.CloseRedisConnection()
		if err != nil {
			utils.Log.Error("Failed to close Redis connection: " + err.Error())
		}
	}()

	// Run server
	runServer()
}
