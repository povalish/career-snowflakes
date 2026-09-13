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
