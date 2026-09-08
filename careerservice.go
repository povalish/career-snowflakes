package main

import (
	"career-snowflakes/internal/career"
	"career-snowflakes/internal/storage"
)

type fileDialogs interface {
	importPath() (string, error)
	exportPath() (string, error)
}

type CareerService struct {
	store   *storage.Store
	dialogs fileDialogs
}

func (s *CareerService) Load() (career.Document, error) {
	return s.store.Load()
}

func (s *CareerService) Save(document career.Document) (career.Document, error) {
	return s.store.Save(document)
}

// Import replaces the saved document only after the selected file is validated.
// A nil document means that the user cancelled the native file dialog.
func (s *CareerService) Import() (*career.Document, error) {
	path, err := s.dialogs.importPath()
	if err != nil || path == "" {
		return nil, err
	}
	document, err := s.store.Import(path)
	if err != nil {
		return nil, err
	}
	return &document, nil
}

// Export writes the latest committed document; false means dialog cancellation.
func (s *CareerService) Export() (bool, error) {
	path, err := s.dialogs.exportPath()
	if err != nil || path == "" {
		return false, err
	}
	if err := s.store.Export(path); err != nil {
		return false, err
	}
	return true, nil
}
