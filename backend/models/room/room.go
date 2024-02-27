package room

const (
	PAUSE = iota
	COUNTING
)

const N = 5

type Room struct {
	Inittime int    `json:"inittime"`
	Time     int    `json:"time"`
	State    int    `json:"state"`
	Name     string `json:"name"`
}

var Rooms = make([]Room, 5)

func init() {
	name := []string{"R0", "R1", "R2", "R3", "S"}
	for i := 0; i < N; i++ {
		Rooms[i] = Room{
			Inittime: 60,
			Time:     0,
			State:    PAUSE,
			Name:     name[i],
		}
	}
}
