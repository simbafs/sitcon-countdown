package now

import (
	"backend/models/session"
	"time"
)

var now = time.Time{}

func GetNow() time.Time {
	if now.IsZero() {
		return time.Now()
	} else {
		return now
	}
}

func SetNow(t string) error {
	tt, err := session.ParseTime(t)
	if err != nil {
		return nil
	}
	now = tt
	return nil
}

func ClearNow() {
	now = time.Time{}
}
