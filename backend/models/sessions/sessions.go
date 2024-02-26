package sessions

import (
	"encoding/json"
	"time"
)

type input struct {
	Sessions []Session `json:"sessions"`
	Speakers []struct {
		Id string
		Zh struct {
			Name string
		}
	} `json:"speakers"`
}

type Session struct {
	Id    string `json:"id"`
	Type  string `json:"type"`
	Room  string `json:"room"`
	Start string `json:"start"`
	End   string `json:"end"`
	Zh    struct {
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

	result := make(map[string]Session)

	for sessionId, session := range s.Sessions {
		// speaker
		for speakerId, speaker := range session.Speakers {
			s.Sessions[sessionId].Speakers[speakerId] = speakers[speaker]
		}

		// start
		start, err := time.Parse(layout, session.Start)
		if err != nil {
			return nil, err
		}
		s.Sessions[sessionId].Start = start.Format("15:04")

		end, err := time.Parse(layout, session.End)
		if err != nil {
			return nil, err
		}
		s.Sessions[sessionId].End = end.Format("15:04")

		result[session.Id] = s.Sessions[sessionId]
	}

	return result, err
}
