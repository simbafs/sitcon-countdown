package now

import (
	"backend/models/now"
	"bytes"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Route(r gin.IRouter) {
	route := r.Group("/now")

	route.GET("/", func(c *gin.Context) {
		t := now.GetNow()
		c.JSON(http.StatusOK, gin.H{
			"hour":   t.Hour(),
			"minute": t.Minute(),
		})
	})

	route.POST("/", func(c *gin.Context) {
		buf := new(bytes.Buffer)
		buf.ReadFrom(c.Request.Body)
		t := buf.String()

		if err := now.SetNow(t); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid time"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"time": t})
	})

	route.DELETE("/", func(c *gin.Context) {
		now.ClearNow()
		c.JSON(http.StatusOK, gin.H{"message": "cleared"})
	})
}
