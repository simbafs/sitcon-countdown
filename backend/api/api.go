package api

import (
	"backend/api/card"
	"backend/api/now"
	aRoom "backend/api/room"
	"backend/models/room"
	"backend/pkg/websocket"
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
)

func timer(quit chan struct{}, io websocket.IO) {
	tricker := time.NewTicker(1 * time.Second)
	for {
		select {
		case <-tricker.C:
			for i, r := range room.Rooms {
				if r.State == room.PAUSE {
					continue
				}

				r.Time -= 1
				if r.Time <= 0 {
					r.State = room.PAUSE
					r.Time = 0
				}

				room.Rooms[i] = r
			}
			// log.Printf("%#v\n", rooms )
			// data, err := json.Marshal(rooms)
			data, err := json.Marshal(gin.H{
				"rooms":      room.Rooms,
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

	card.Route(api)
	now.Route(api)
	aRoom.Route(api)

	api.POST("/verify", func(c *gin.Context) {
		buf := new(bytes.Buffer)
		buf.ReadFrom(c.Request.Body)
		token := buf.String()

		fmt.Printf(`"%s" == "%s"`, token, os.Getenv("TOKEN"))
		fmt.Println()

		if token == os.Getenv("TOKEN") {
			c.JSON(http.StatusOK, gin.H{
				"message": "success",
			})
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "invalid token",
			})
		}
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
