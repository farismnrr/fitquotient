package jobs

import "github.com/gin-gonic/gin"

func SetupJobRoutes(jobGroup *gin.RouterGroup, jobHandler *JobHandler) {
	jobGroup.POST("", jobHandler.CreateJob)
	jobGroup.GET("/:id", jobHandler.GetJob)
	jobGroup.DELETE("/:id", jobHandler.DeleteJob)
	jobGroup.POST("/evaluate", jobHandler.CompareCVJob)
	jobGroup.GET("/result/:id", jobHandler.GetComparisonResult)
}
