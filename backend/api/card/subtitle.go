package card

import (
	"backend/models/sessions"
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type Time struct {
	Start string `json:"start"`
	End   string `json:"end"`
}

func Route(r gin.IRouter) {
	file, err := os.ReadFile("sessions.json")
	if err != nil {
		panic(err)
	}

	sessions, err := sessions.ParseSessions(file)

	route := r.Group("/card")

	route.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, sessions)
	})

	route.GET("/:id", func(c *gin.Context) {
		id := c.Param("id")

		session := sessions[id]

		c.JSON(http.StatusOK, session)
	})

	route.POST("/:id", func(c *gin.Context) {
		id := c.Param("id")

		t := Time{}
		c.BindJSON(&t)

		s, ok := sessions[id]
		if !ok {
			c.JSON(http.StatusNotFound, gin.H{"error": "session not found"})
		}

		s.Start = t.Start
		s.End = t.End

		sessions[id] = s

		fmt.Println(s)

		c.JSON(http.StatusOK, s)
	})
}
