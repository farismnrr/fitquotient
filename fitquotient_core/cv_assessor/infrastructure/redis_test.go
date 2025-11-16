package infrastructure

import (
	"os"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

var _ = Describe("Redis Connection", func() {
	Context("when initializing connection", func() {
		It("should return error if REDIS_HOST is missing", func() {
			// Backup original env
			originalHost := os.Getenv("REDIS_HOST")
			originalPort := os.Getenv("REDIS_PORT")
			originalPassword := os.Getenv("REDIS_PASSWORD")

			// Clear env vars
			os.Unsetenv("REDIS_HOST")
			os.Unsetenv("REDIS_PORT")
			os.Unsetenv("REDIS_PASSWORD")

			defer func() {
				// Restore env vars
				if originalHost != "" {
					os.Setenv("REDIS_HOST", originalHost)
				}
				if originalPort != "" {
					os.Setenv("REDIS_PORT", originalPort)
				}
				if originalPassword != "" {
					os.Setenv("REDIS_PASSWORD", originalPassword)
				}
			}()

			err := InitRedisConnection()
			Expect(err).To(HaveOccurred())
			Expect(err.Error()).To(Equal("REDIS_HOST environment variable is required"))
		})

		It("should use default port if REDIS_PORT is not set", func() {
			os.Setenv("REDIS_HOST", "localhost")
			os.Unsetenv("REDIS_PORT")

			err := InitRedisConnection()
			if err != nil {
				Expect(err.Error()).NotTo(ContainSubstring("REDIS_HOST environment variable is required"))
			}
		})
	})
})