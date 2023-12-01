package api

import (
	"backend/pkg/websocket"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

const (
	PAUSE = iota
	COUNTING
)

const N = 5

type Room struct {
	Inittime int `json:"inittime"`
	Time     int `json:"time"`
	State    int `json:"state"`
}

var rooms = make([]Room, N)

func init() {
	for i := 0; i < N; i++ {
		rooms[i] = Room{
			Inittime: 10,
			Time:     0,
			State:    PAUSE,
		}
	}

	rooms[0].Time = 10000000
	// rooms[0].State = COUNTING
}

func timer(quit chan struct{}, io websocket.IO) {
	tricker := time.NewTicker(1 * time.Second)
	for {
		select {
		case <-tricker.C:
			for i, room := range rooms {
				if room.State == PAUSE {
					continue
				}

				room.Time -= 1
				if room.Time <= 0{
					room.State = PAUSE
					room.Time = 0
				}

				rooms[i] = room
			}
			// log.Printf("%#v\n", rooms )
			// data, err := json.Marshal(rooms)
			data, err := json.Marshal(gin.H{
				"rooms": rooms,
				"serverTime": time.Now(),
			})
			if err != nil {
				log.Println(err)
				continue
			}

			io.Broadcast(data)
		case <-quit:
			tricker.Stop()
			return
		}
	}
}

func Route(r *gin.Engine, io websocket.IO) {
	api := r.Group("/api")

	api.GET("/room", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"rooms": rooms,
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

		if id >= len(rooms) || id < 0 {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "id is out of range",
			})

			return
		}

		room := rooms[id]

		c.JSON(http.StatusOK, gin.H{
			"room": room,
		})
	})

	api.POST("/room/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "failed to parse room id",
			})
			return
		}

		if id >= len(rooms) || id < 0 {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "id is out of range",
			})

			return
		}

		room := Room{}

		if err := c.BindJSON(&room); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		log.Printf("update room %d to %#v\n", id, room)

		rooms[id] = room

		c.JSON(http.StatusOK, gin.H{
			"message": "success update room",
		})
	})

	quit := make(chan struct{})
	go timer(quit, io)

	// api.GET("/hello", func(c *gin.Context) {
	// 	c.JSON(http.StatusOK, gin.H{
	// 		"status":  "ok",
	// 		"message": "Hello, world!",
	// 	})
	// })
	//
	// api.GET("/broadcast", func(c *gin.Context) {
	// 	io.Broadcast([]byte("Hello, world!"))
	// 	c.JSON(http.StatusOK, gin.H{
	// 		"status":  "ok",
	// 		"message": "Broadcasted!",
	// 	})
	// })
}
