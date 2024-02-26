package sessions

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

	// build map of session type and its name
	typeString := make(map[string]string)
	for _, t := range s.SessionsTypes {
		typeString[t.Id] = t.Zh.Name
	}

	// clear sessions information
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

		// type
		t, ok := typeString[session.Type]
		if !ok {
			t = session.Type
		}
		s.Sessions[sessionId].Type = t

		result[session.Id] = s.Sessions[sessionId]
	}

	return result, err
}
