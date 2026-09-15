package storage

import (
	"bytes"
	"fmt"
	"os"
	"path/filepath"
	"reflect"
	"sync"
	"testing"

	"career-snowflakes/internal/career"
)

func TestLoadCreatesDefaultAndSaveSurvivesRestart(t *testing.T) {
	path := filepath.Join(t.TempDir(), "nested", "career.json")
	store := New(path)
	document, err := store.Load()
	if err != nil {
		t.Fatal(err)
	}
	if !reflect.DeepEqual(document, career.Default()) {
		t.Fatal("first load must use the default matrix")
	}
	document.Profile.Name = "Никита"
	document.Progress["frontend"] = 3
	if _, err := store.Save(document); err != nil {
		t.Fatal(err)
	}
	reloaded, err := New(path).Load()
	if err != nil {
		t.Fatal(err)
	}
	if !reflect.DeepEqual(document, reloaded) {
		t.Fatal("saved profile and progress must survive a new store instance")
	}
}

func TestExportImportRoundTrip(t *testing.T) {
	directory := t.TempDir()
	store := New(filepath.Join(directory, "source.json"))
	document := career.Default()
	document.Schema.Name = "Моя схема"
	document.Schema.Groups[0].Tracks[0].Resources = "- [Go documentation](https://go.dev/doc/)"
	document.Progress["backend"] = 5
	if _, err := store.Save(document); err != nil {
		t.Fatal(err)
	}
	exportPath := filepath.Join(directory, "export.json")
	if err := store.Export(exportPath); err != nil {
		t.Fatal(err)
	}
	imported, err := New(filepath.Join(directory, "target.json")).Import(exportPath)
	if err != nil {
		t.Fatal(err)
	}
	if !reflect.DeepEqual(document, imported) {
		t.Fatal("export and import must preserve schema, profile, and progress")
	}
}

func TestInvalidChangesPreserveSavedFile(t *testing.T) {
	directory := t.TempDir()
	path := filepath.Join(directory, "career.json")
	store := New(path)
	document, err := store.Load()
	if err != nil {
		t.Fatal(err)
	}
	original := readBytes(t, path)
	document.Progress["frontend"] = 99
	if _, err := store.Save(document); err == nil {
		t.Fatal("invalid progress must be rejected")
	}
	importPath := filepath.Join(directory, "broken.json")
	writeBytes(t, importPath, []byte(`{"version":999}`))
	if _, err := store.Import(importPath); err == nil {
		t.Fatal("invalid import must be rejected")
	}
	if !bytes.Equal(original, readBytes(t, path)) {
		t.Fatal("failed operations must not change the saved document")
	}
}

func TestCorruptStoredFileIsNotOverwritten(t *testing.T) {
	path := filepath.Join(t.TempDir(), "career.json")
	original := []byte(`{"version": 1, broken`)
	writeBytes(t, path, original)
	store := New(path)
	if _, err := store.Load(); err == nil {
		t.Fatal("loading corrupt data must report an error")
	}
	if _, err := store.Save(career.Default()); err == nil {
		t.Fatal("saving over corrupt data must report an error")
	}
	if !bytes.Equal(original, readBytes(t, path)) {
		t.Fatal("the original file must be preserved for recovery")
	}
}

func TestSaveCanReplaceVersionOneDocument(t *testing.T) {
	path := filepath.Join(t.TempDir(), "career.json")
	writeBytes(t, path, []byte(`{
  "version": 1,
  "profile": {"name": "Legacy profile", "role": "Software Engineer"},
  "schema": {
    "name": "Legacy matrix",
    "groups": [{
      "id": "technology",
      "name": "Technology",
      "color": "aqua",
      "tracks": [{
        "id": "frontend",
        "name": "Frontend",
        "description": "Default track",
        "levels": [{"name": "Level 1", "description": "", "examples": []}]
      }]
    }]
  },
  "progress": {"frontend": 1}
}`))

	document := career.Default()
	document.Progress["frontend"] = 2
	if _, err := New(path).Save(document); err != nil {
		t.Fatal(err)
	}

	saved, err := New(path).Load()
	if err != nil {
		t.Fatal(err)
	}
	if saved.Version != career.Version || saved.Progress["frontend"] != 2 {
		t.Fatal("save must replace a valid version one document")
	}
}

func TestConcurrentSavesLeaveValidDocument(t *testing.T) {
	store := New(filepath.Join(t.TempDir(), "career.json"))
	var tasks sync.WaitGroup
	for i := 0; i < 12; i++ {
		tasks.Go(func() {
			document := career.Default()
			document.Profile.Name = fmt.Sprintf("Профиль %d", i)
			if _, err := store.Save(document); err != nil {
				t.Error(err)
			}
		})
	}
	tasks.Wait()
	if _, err := store.Load(); err != nil {
		t.Fatal(err)
	}
}

func TestReadRejectsOversizedFile(t *testing.T) {
	path := filepath.Join(t.TempDir(), "large.json")
	writeBytes(t, path, bytes.Repeat([]byte(" "), MaxFileSize+1))
	if _, err := readDocument(path); err == nil {
		t.Fatal("oversized files must be rejected")
	}
}

func TestFailedReplacementCleansTemporaryFile(t *testing.T) {
	directory := t.TempDir()
	destination := filepath.Join(directory, "existing-directory")
	if err := os.Mkdir(destination, 0o700); err != nil {
		t.Fatal(err)
	}
	if err := writeAtomic(destination, []byte("data")); err == nil {
		t.Fatal("replacing a directory should fail")
	}
	temporary, err := filepath.Glob(filepath.Join(directory, ".career-*.tmp"))
	if err != nil || len(temporary) != 0 {
		t.Fatalf("temporary files left behind: %v, %v", temporary, err)
	}
	if info, err := os.Stat(destination); err != nil || !info.IsDir() {
		t.Fatal("existing destination must be preserved")
	}
}

func readBytes(t *testing.T, path string) []byte {
	t.Helper()
	data, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}
	return data
}

func writeBytes(t *testing.T, path string, data []byte) {
	t.Helper()
	if err := os.WriteFile(path, data, 0o600); err != nil {
		t.Fatal(err)
	}
}
