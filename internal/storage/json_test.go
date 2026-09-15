package storage

import (
	"bytes"
	"testing"

	"career-snowflakes/internal/career"
)

func TestDecodeRejectsMalformedDocuments(t *testing.T) {
	valid, err := encodeDocument(career.Default())
	if err != nil {
		t.Fatal(err)
	}
	tests := map[string][]byte{
		"empty":            {},
		"null":             []byte("null"),
		"broken json":      []byte("{"),
		"trailing json":    append(append([]byte{}, valid...), []byte("{}")...),
		"unknown field":    bytes.Replace(valid, []byte(`"version": 2`), []byte(`"version": 2, "unexpected": true`), 1),
		"bad version":      bytes.Replace(valid, []byte(`"version": 2`), []byte(`"version": 3`), 1),
		"decimal progress": bytes.Replace(valid, []byte(`"progress": {}`), []byte(`"progress": {"frontend": 1.5}`), 1),
		"invalid utf8":     {0xff},
	}
	for name, data := range tests {
		t.Run(name, func(t *testing.T) {
			if _, err := decodeDocument(data); err == nil {
				t.Fatal("expected decoding or validation error")
			}
		})
	}
}

func TestJSONNormalizesOptionalCollections(t *testing.T) {
	document := career.Default()
	document.Progress = nil
	document.Schema.Groups[0].Tracks[0].Levels[0].Examples = nil
	data, err := encodeDocument(document)
	if err != nil {
		t.Fatal(err)
	}
	decoded, err := decodeDocument(data)
	if err != nil {
		t.Fatal(err)
	}
	if decoded.Progress == nil || decoded.Schema.Groups[0].Tracks[0].Levels[0].Examples == nil {
		t.Fatal("JSON collections must not be null")
	}
}

func TestDecodeAllowsVersionTwoWithoutResources(t *testing.T) {
	data, err := encodeDocument(career.Default())
	if err != nil {
		t.Fatal(err)
	}
	dataWithoutResources := bytes.ReplaceAll(data, []byte(`"resources": "",`+"\n"), nil)
	if bytes.Equal(data, dataWithoutResources) {
		t.Fatal("encoded document did not contain resources")
	}

	document, err := decodeDocument(dataWithoutResources)
	if err != nil {
		t.Fatal(err)
	}
	if document.Schema.Groups[0].Tracks[0].Resources != "" {
		t.Fatal("missing resources must use an empty string")
	}
}

func TestDecodeMigratesVersionOneDocument(t *testing.T) {
	data := []byte(`{
  "version": 1,
  "profile": {"name": "Legacy profile", "role": "Software Engineer"},
  "schema": {
    "name": "Legacy matrix",
    "groups": [{
      "id": "technology",
      "name": "Technology",
      "color": "aqua",
      "tracks": [
        {
          "id": "frontend",
          "name": "Frontend",
          "description": "Default track",
          "levels": [{"name": "Level 1", "description": "", "examples": []}]
        },
        {
          "id": "custom",
          "name": "Custom",
          "description": "Custom track",
          "levels": [{"name": "Level 1", "description": "", "examples": []}]
        }
      ]
    }]
  },
  "progress": {"frontend": 1}
}`)

	document, err := decodeDocument(data)
	if err != nil {
		t.Fatal(err)
	}
	if document.Version != career.Version {
		t.Fatalf("version: got %d, want %d", document.Version, career.Version)
	}
	tracks := document.Schema.Groups[0].Tracks
	if tracks[0].Code != "FE" || tracks[1].Code != "AA" {
		t.Fatalf("migrated codes: got %q and %q", tracks[0].Code, tracks[1].Code)
	}
	if document.Profile.Name != "Legacy profile" || document.Progress["frontend"] != 1 {
		t.Fatal("migration must preserve profile and progress")
	}
}
