package main

import (
	"context"
	"cv_assessor/handlers/jobs"
	"cv_assessor/middlewares"
	"cv_assessor/repositories"
	"cv_assessor/services"
	"cv_assessor/utils"
	"errors"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
)

func runServer() {
    // Load server configuration from environment variables
    host := os.Getenv("SERVER_HOST")
    if host == "" {
        host = "0.0.0.0"
        utils.Log.Fatal("SERVER_HOST environment variable is required")
    }

    port := os.Getenv("SERVER_PORT")
    if port == "" {
        port = "8080"
        utils.Log.Fatal("SERVER_PORT environment variable is required")
    }

    // Start server
    utils.Log.Info("Starting server")
    r := gin.New()

    r.GET("/healthcheck", func(c *gin.Context) {
        c.String(200, "OK")
        utils.Log.Debug("Healthcheck endpoint called")
    })

    apiGroup := r.Group("/api")
    apiGroup.Use(middlewares.PoweredBy())
    apiGroup.Use(middlewares.ErrorHandler())

    // Initialize Job Service and Handler
    jobRepo := repositories.NewJobRepository()
    jobService := services.NewJobService(jobRepo)
    jobHandler := jobs.NewJobHandler(jobService)

    // Job Routes
    jobGroup := apiGroup.Group("/jobs")
    jobGroup.POST("", jobHandler.CreateJob)
    jobGroup.GET("/:id", jobHandler.GetJob)
    jobGroup.DELETE("/:id", jobHandler.DeleteJob)

    addr := host + ":" + port

    srv := &http.Server{
        Addr:    addr,
        Handler: r,
    }

    go func() {
        utils.Log.Info("Server starting on " + addr)
        if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
            utils.Log.Fatal("Server listen error: " + err.Error())
        }
    }()

    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit

    utils.Log.Info("Shutting down server...")
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    if err := srv.Shutdown(ctx); err != nil {
        utils.Log.Fatal("Server forced to shutdown: " + err.Error())
    }

    utils.Log.Info("Server exiting")
}