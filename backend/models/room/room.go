package room

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

var Rooms = make([]Room, 5)

func init() {
	for i := 0; i < N; i++ {
		Rooms[i] = Room{
			Inittime: 60,
			Time:     0,
			State:    PAUSE,
		}
	}
}
