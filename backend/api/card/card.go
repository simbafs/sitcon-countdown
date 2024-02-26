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
		// no session is after this time
		roomSession.StartTime, _ = time.Parse("2006/01/02 15:04:05", "2024/03/09 23:59:59")

		for _, s := range sessions {
			if s.Room != roomid {
				continue
			}

			// 2024/03/09 09:00:00
			now, _ := time.Parse("2006/01/02 15:04:05", "2024/03/09 09:09:00")
			// now := time.Now()

			if now.Before(s.EndTime) && s.StartTime.Before(roomSession.StartTime) {
				roomSession = s
			}
		}

		if roomSession.Id == "" {
			c.JSON(http.StatusNotFound, gin.H{"error": "session not found"})
			return
		}

		c.JSON(http.StatusOK, roomSession)
	})

	route.POST("/:id", func(c *gin.Context) {
		id := c.Param("id")

		t := Time{}
		c.BindJSON(&t)

		s, ok := sessions[id]
		if !ok {
			c.JSON(http.StatusNotFound, gin.H{"error": "session not found"})
			return
		}

		s.Start = t.Start
		s.End = t.End

		s.StartTime, err = session.ParseTime(t.Start)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid start time"})
			return
		}
		s.EndTime, err = session.ParseTime(t.End)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid end time"})
			return
		}

		sessions[id] = s

		fmt.Println(s)

		c.JSON(http.StatusOK, s)
	})
}
