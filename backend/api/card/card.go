package card

import (
	"backend/models/session"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
)

type Time struct {
	Start string `json:"start"`
	End   string `json:"end"`
}

// PareseTime parse string like "11:30" to time.Time, whose year, month and day are 2024-03-09
func ParseTime(t string) (time.Time, error) {
	t = "2024-03-09 " + t + ":00"
	return time.Parse("2006-01-02 15:04:05", t)
}

func Route(r gin.IRouter) {
	file, err := os.ReadFile("sessions.json")
	if err != nil {
		panic(err)
	}

	sessions, err := session.ParseSessions(file)

	route := r.Group("/card")

	route.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, sessions)
	})

	route.GET("/:id", func(c *gin.Context) {
		id := c.Param("id")

		session := sessions[id]

		c.JSON(http.StatusOK, session)
	})

	route.GET("/room/:roomid", func(c *gin.Context) {
		roomid := c.Param("roomid")

		roomSession := session.Session{}

		for _, s := range sessions {
			if s.Room != roomid {
				continue
			}

			if time.Now().Before(s.EndTime) && s.StartTime.Before(roomSession.StartTime) {
				roomSession = s
			}
		}
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

		s.StartTime, err = ParseTime(t.Start)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid start time"})
		}
		s.EndTime, err = ParseTime(t.End)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid end time"})
		}

		sessions[id] = s

		fmt.Println(s)

		c.JSON(http.StatusOK, s)
	})
}
