package infrastructure

import (
	"context"
	"errors"
	"os"

	"cv_assessor/utils"

	"github.com/go-redis/redis/v8"
)

var RedisClient *redis.Client

func InitRedisConnection() error {
	host := os.Getenv("REDIS_HOST")
	if host == "" {
		utils.Log.Error("REDIS_HOST environment variable is required")
		return errors.New("REDIS_HOST environment variable is required")
	}
	port := os.Getenv("REDIS_PORT")
	if port == "" {
		port = "6379" // default Redis port
	}
	password := os.Getenv("REDIS_PASS") // optional

	addr := host + ":" + port

	RedisClient = redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: password,
	})

	// Test koneksi
	ctx := context.Background()
	if err := RedisClient.Ping(ctx).Err(); err != nil {
		utils.Log.Error("Failed to ping Redis: " + err.Error())
		return err
	}

	utils.Log.Info("Redis connection initialized successfully")
	return nil
}

func CloseRedisConnection() error {
	if RedisClient != nil {
		return RedisClient.Close()
	}
	return nil
}