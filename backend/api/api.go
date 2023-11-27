package api

import (
	"backend/pkg/websocket"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

const (
	PAUSE = iota
	COUNTING
)

type Room struct {
	Inittime int `json:"inittime"`
	Time     int `json:"time"`
	State    int `json:"state"`
}

var data = make([]Room, 4)

func init(){
	for i := 0; i < 4; i++ {
		data[i] = Room{
			Inittime: 10,
			Time: 0,
			State: PAUSE,
		}
	}
}

func Route(r *gin.Engine, io websocket.IO) {
	api := r.Group("/api")

	api.GET("/time", func(c *gin.Context){
		c.JSON(http.StatusOK, gin.H{
			"time": time.Now(),
		})
	})

	api.GET("/room", func(c *gin.Context){
		c.JSON(http.StatusOK, gin.H{
			"rooms": data,
		})
	})

	api.GET("/room/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "failed to parse room id",
			})
			return 
		}

		if id >= len(data) || id < 0 {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "id is out of range",
			})

			return 
		}

		room := data[id]
		
		c.JSON(http.StatusOK, gin.H{
			"room": room,
		})
	})

	api.GET("/hello", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"message": "Hello, world!",
		})
	})

	api.GET("/broadcast", func(c *gin.Context) {
		io.Broadcast([]byte("Hello, world!"))
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"message": "Broadcasted!",
		})
	})
}
