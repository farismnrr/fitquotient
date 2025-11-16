package cvs

import "github.com/gin-gonic/gin"

func SetupCVRoutes(cvGroup *gin.RouterGroup, cvHandler *CVHandler) {
	cvGroup.POST("", cvHandler.CreateCV)
	cvGroup.GET("/:id", cvHandler.GetCV)
	cvGroup.DELETE("/:id", cvHandler.DeleteCV)
}
