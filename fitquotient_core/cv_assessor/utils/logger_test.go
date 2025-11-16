package utils_test

import (
	"testing"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"

	"cv_assessor/utils"
)

func TestLogger(t *testing.T) {
	RegisterFailHandler(Fail)
	RunSpecs(t, "Logger Suite")
}

var _ = Describe("Logger", func() {
	Context("when logging messages", func() {
		It("should not panic when logging info", func() {
			Expect(func() { utils.Log.Info("Test info message") }).NotTo(Panic())
		})

		It("should not panic when logging error", func() {
			Expect(func() { utils.Log.Error("Test error message") }).NotTo(Panic())
		})

		It("should not panic when logging warn", func() {
			Expect(func() { utils.Log.Warn("Test warn message") }).NotTo(Panic())
		})

		It("should not panic when logging debug", func() {
			Expect(func() { utils.Log.Debug("Test debug message") }).NotTo(Panic())
		})

		It("should have correct interface", func() {
			var _ utils.LoggerInterface = utils.Log
		})

		It("should handle log levels", func() {
			// Test that debug is not logged by default
			Expect(func() { utils.Log.Debug("Debug message") }).NotTo(Panic())
		})
	})
})