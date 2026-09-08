package main

import (
	"errors"
	"path/filepath"
	"testing"

	"career-snowflakes/internal/career"
	"career-snowflakes/internal/storage"
)

type stubDialogs struct {
	path string
	err  error
}

func (d stubDialogs) importPath() (string, error) { return d.path, d.err }
func (d stubDialogs) exportPath() (string, error) { return d.path, d.err }

func TestCancelledDialogsDoNotChangeDocument(t *testing.T) {
	service := &CareerService{store: storage.New(filepath.Join(t.TempDir(), "career.json")), dialogs: stubDialogs{}}
	document, err := service.Load()
	if err != nil {
		t.Fatal(err)
	}
	document.Progress["frontend"] = 2
	if _, err := service.Save(document); err != nil {
		t.Fatal(err)
	}
	if result, err := service.Import(); result != nil || err != nil {
		t.Fatalf("cancelled import: got %v, %v", result, err)
	}
	if exported, err := service.Export(); exported || err != nil {
		t.Fatalf("cancelled export: got %v, %v", exported, err)
	}
	saved, err := service.Load()
	if err != nil || saved.Progress["frontend"] != 2 {
		t.Fatal("cancelled dialogs must preserve saved progress")
	}
}

func TestServiceExportsAndImportsSavedDocument(t *testing.T) {
	directory := t.TempDir()
	service := &CareerService{
		store:   storage.New(filepath.Join(directory, "career.json")),
		dialogs: stubDialogs{path: filepath.Join(directory, "export.json")},
	}
	document := career.Default()
	document.Profile.Name = "Экспортированный профиль"
	if _, err := service.Save(document); err != nil {
		t.Fatal(err)
	}
	if exported, err := service.Export(); !exported || err != nil {
		t.Fatalf("export: got %v, %v", exported, err)
	}
	if _, err := service.Save(career.Default()); err != nil {
		t.Fatal(err)
	}
	imported, err := service.Import()
	if err != nil || imported == nil || imported.Profile.Name != document.Profile.Name {
		t.Fatalf("import: got %v, %v", imported, err)
	}
}

func TestDialogErrorsAreReturned(t *testing.T) {
	failure := errors.New("dialog unavailable")
	service := &CareerService{dialogs: stubDialogs{err: failure}}
	if _, err := service.Import(); !errors.Is(err, failure) {
		t.Fatal("import must preserve dialog error")
	}
	if _, err := service.Export(); !errors.Is(err, failure) {
		t.Fatal("export must preserve dialog error")
	}
}
