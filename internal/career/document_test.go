package career

import (
	"fmt"
	"strings"
	"testing"
)

func TestDefaultDocument(t *testing.T) {
	document := Default()
	if err := document.Validate(); err != nil {
		t.Fatal(err)
	}
	if len(document.Schema.Groups) != 4 || len(document.Progress) != 0 {
		t.Fatal("expected four groups and no completed levels")
	}
	for _, group := range document.Schema.Groups {
		if len(group.Tracks) != 4 {
			t.Fatalf("%s: expected four tracks", group.Name)
		}
		for _, track := range group.Tracks {
			if !validTrackCode.MatchString(track.Code) {
				t.Fatalf("%s: invalid track code %q", track.Name, track.Code)
			}
			if len(track.Levels) != 5 {
				t.Fatalf("%s: expected five levels", track.Name)
			}
		}
	}
}

func TestValidationRejectsInvalidDocuments(t *testing.T) {
	tests := []struct {
		name   string
		change func(*Document)
	}{
		{"future version", func(d *Document) { d.Version++ }},
		{"empty profile", func(d *Document) { d.Profile.Name = "  " }},
		{"empty role", func(d *Document) { d.Profile.Role = "" }},
		{"long title", func(d *Document) { d.Schema.Name = strings.Repeat("я", 121) }},
		{"no groups", func(d *Document) { d.Schema.Groups = nil }},
		{"too many groups", func(d *Document) { d.Schema.Groups = make([]Group, MaxGroups+1) }},
		{"duplicate groups", func(d *Document) { d.Schema.Groups[1].ID = d.Schema.Groups[0].ID }},
		{"duplicate tracks", func(d *Document) { d.Schema.Groups[1].Tracks[0].ID = "frontend" }},
		{"group track collision", func(d *Document) { d.Schema.Groups[0].Tracks[0].ID = "technology" }},
		{"invalid id", func(d *Document) { d.Schema.Groups[0].ID = "../path" }},
		{"unknown color", func(d *Document) { d.Schema.Groups[0].Color = "#ffffff" }},
		{"empty group", func(d *Document) { d.Schema.Groups[0].Name = "" }},
		{"no tracks", func(d *Document) { d.Schema.Groups[0].Tracks = nil }},
		{"too many group tracks", func(d *Document) { d.Schema.Groups[0].Tracks = make([]Track, MaxTracks+1) }},
		{"empty track", func(d *Document) { d.Schema.Groups[0].Tracks[0].Name = "" }},
		{"invalid track code", func(d *Document) { d.Schema.Groups[0].Tracks[0].Code = "frontend" }},
		{"duplicate track code", func(d *Document) { d.Schema.Groups[1].Tracks[0].Code = "FE" }},
		{"long description", func(d *Document) { d.Schema.Groups[0].Tracks[0].Description = strings.Repeat("a", 4001) }},
		{"no levels", func(d *Document) { d.Schema.Groups[0].Tracks[0].Levels = nil }},
		{"too many levels", func(d *Document) { d.Schema.Groups[0].Tracks[0].Levels = make([]Level, MaxLevels+1) }},
		{"empty level", func(d *Document) { d.Schema.Groups[0].Tracks[0].Levels[0].Name = "" }},
		{"long level description", func(d *Document) { d.Schema.Groups[0].Tracks[0].Levels[0].Description = strings.Repeat("a", 4001) }},
		{"too many examples", func(d *Document) { d.Schema.Groups[0].Tracks[0].Levels[0].Examples = make([]string, 21) }},
		{"long example", func(d *Document) {
			d.Schema.Groups[0].Tracks[0].Levels[0].Examples = []string{strings.Repeat("a", 1001)}
		}},
		{"negative progress", func(d *Document) { d.Progress["frontend"] = -1 }},
		{"progress beyond levels", func(d *Document) { d.Progress["frontend"] = 6 }},
		{"unknown progress track", func(d *Document) { d.Progress["deleted"] = 1 }},
		{"invalid utf8", func(d *Document) { d.Profile.Name = string([]byte{0xff}) }},
		{"too many tracks total", func(d *Document) {
			for i := 0; i < 17; i++ {
				track := d.Schema.Groups[0].Tracks[0]
				track.ID = fmt.Sprintf("extra-%d", i)
				d.Schema.Groups[0].Tracks = append(d.Schema.Groups[0].Tracks, track)
			}
		}},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			document := Default()
			test.change(&document)
			if err := document.Validate(); err == nil {
				t.Fatal("expected validation error")
			}
		})
	}
}

func TestValidationAllowsZeroAndCompleteProgress(t *testing.T) {
	document := Default()
	document.Progress["frontend"] = 0
	document.Progress["backend"] = 5
	document.Profile.Name = strings.Repeat("я", 120)
	if err := document.Validate(); err != nil {
		t.Fatal(err)
	}
}

func TestNormalizeOptionalCollections(t *testing.T) {
	document := Default()
	document.Progress = nil
	document.Schema.Groups[0].Tracks[0].Levels[0].Examples = nil
	document.Normalize()
	if document.Progress == nil || document.Schema.Groups[0].Tracks[0].Levels[0].Examples == nil {
		t.Fatal("optional collections must be non-nil")
	}
}
