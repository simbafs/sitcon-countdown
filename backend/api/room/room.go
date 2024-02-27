package room

import (
	"backend/models/room"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func Route(r gin.IRouter) {
	route := r.Group("/room")

	route.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"room.Rooms": room.Rooms,
		})
	})

	route.GET("/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "failed to parse room id",
			})
			return
		}

		if id >= len(room.Rooms) || id < 0 {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "id is out of range",
			})

			return
		}

		room := room.Rooms[id]

		c.JSON(http.StatusOK, gin.H{
			"room": room,
		})
	})

	route.POST("/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "failed to parse room id",
			})
			return
		}

		if id >= len(room.Rooms) || id < 0 {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "id is out of range",
			})

			return
		}

		r := room.Room{}

		if err := c.BindJSON(&r); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		log.Printf("update room %d to %#v\n", id, r)

		room.Rooms[id] = r

		c.JSON(http.StatusOK, gin.H{
			"message": "success update room",
		})
	})
}
