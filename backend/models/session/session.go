package session

import (
	"encoding/json"
	"time"
)

type input struct {
	Sessions []Session `json:"sessions"`
	Speakers []struct {
		Id string `json:"id"`
		Zh struct {
			Name string `json:"name"`
		} `json:"zh"`
	} `json:"speakers"`
	SessionsTypes []struct {
		Id string `json:"id"`
		Zh struct {
			Name string `json:"name"`
		} `json:"zh"`
	} `json:"session_types"`
}

type Session struct {
	Id        string    `json:"id"`
	Type      string    `json:"type"`
	Room      string    `json:"room"`
	Broadcast []string  `json:"broadcast"`
	Start     string    `json:"start"`
	StartTime time.Time `json:"-"`
	EndTime   time.Time `json:"-"`
	End       string    `json:"end"`
	Zh        struct {
		Title string `json:"title"`
	} `json:"zh"`
	Speakers []string `json:"speakers"`
}

var layout = "2006-01-02T15:04:05-07:00"

func ParseSessions(data []byte) (map[string]Session, error) {
	var s input
	err := json.Unmarshal(data, &s)

	speakers := make(map[string]string)
	for _, speaker := range s.Speakers {
		speakers[speaker.Id] = speaker.Zh.Name
	}

	// build map of session type and its name
	typeString := make(map[string]string)
	for _, t := range s.SessionsTypes {
		typeString[t.Id] = t.Zh.Name
	}

	// clear sessions information
	result := make(map[string]Session)

	for _, session := range s.Sessions {
		// speaker
		for speakerId, speaker := range session.Speakers {
			session.Speakers[speakerId] = speakers[speaker]
		}

		// custom
		if session.Id == "439688" {
			session.Speakers = []string{"主持人 - 侯宜秀 律師", "與談人 - 孔祥重 院士", "卞中佩 教授", "張嘉淵 博士"}
		}

		// parse start time
		start, err := time.Parse(layout, session.Start)
		if err != nil {
			return nil, err
		}
		session.Start = start.Format("15:04")
		session.StartTime, err = ParseTime(session.Start)
		if err != nil {
			return nil, err
		}

		// parse end time
		end, err := time.Parse(layout, session.End)
		if err != nil {
			return nil, err
		}
		session.End = end.Format("15:04")
		session.EndTime, err = ParseTime(session.End)
		if err != nil {
			return nil, err
		}

		// session type
		t, ok := typeString[session.Type]
		if !ok {
			t = session.Type
		}
		session.Type = t

		result[session.Id] = session
	}

	return result, err
}

// PareseTime parse string like "11:30" to time.Time, whose year, month and day are 2024-03-09
func ParseTime(t string) (time.Time, error) {
	t = "2024-03-09 " + t + ":00"
	return time.Parse("2006-01-02 15:04:05", t)
}
