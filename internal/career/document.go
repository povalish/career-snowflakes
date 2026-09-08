package career

const Version = 1

type Document struct {
	Version  int            `json:"version"`
	Profile  Profile        `json:"profile"`
	Schema   Schema         `json:"schema"`
	Progress map[string]int `json:"progress"`
}

type Profile struct {
	Name string `json:"name"`
	Role string `json:"role"`
}

type Schema struct {
	Name   string  `json:"name"`
	Groups []Group `json:"groups"`
}

type Group struct {
	ID     string  `json:"id"`
	Name   string  `json:"name"`
	Color  string  `json:"color"`
	Tracks []Track `json:"tracks"`
}

type Track struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Levels      []Level `json:"levels"`
}

type Level struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Examples    []string `json:"examples"`
}

// Normalize makes optional collections consistent across JSON and TypeScript.
func (d *Document) Normalize() {
	if d.Progress == nil {
		d.Progress = map[string]int{}
	}
	for gi := range d.Schema.Groups {
		for ti := range d.Schema.Groups[gi].Tracks {
			for li := range d.Schema.Groups[gi].Tracks[ti].Levels {
				level := &d.Schema.Groups[gi].Tracks[ti].Levels[li]
				if level.Examples == nil {
					level.Examples = []string{}
				}
			}
		}
	}
}
