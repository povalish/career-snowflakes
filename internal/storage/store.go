package storage

import (
	"errors"
	"fmt"
	"os"
	"sync"

	"career-snowflakes/internal/career"
)

type Store struct {
	mu   sync.Mutex
	path string
}

func New(path string) *Store {
	return &Store{path: path}
}

func (s *Store) Load() (career.Document, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.load()
}

func (s *Store) load() (career.Document, error) {
	document, err := readDocument(s.path)
	if errors.Is(err, os.ErrNotExist) {
		document = career.Default()
		err = s.write(document)
	}
	if err != nil {
		return career.Document{}, fmt.Errorf("не удалось загрузить %s: %w", s.path, err)
	}
	return document, nil
}

func (s *Store) Save(document career.Document) (career.Document, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if err := document.Validate(); err != nil {
		return career.Document{}, err
	}
	// Never overwrite an unreadable existing file, including after a failed load.
	if _, err := readDocument(s.path); err != nil && !errors.Is(err, os.ErrNotExist) {
		return career.Document{}, fmt.Errorf("файл %s не изменён: %w", s.path, err)
	}
	document.Normalize()
	if err := s.write(document); err != nil {
		return career.Document{}, err
	}
	return document, nil
}

func (s *Store) write(document career.Document) error {
	data, err := encodeDocument(document)
	if err != nil {
		return err
	}
	if err := writeAtomic(s.path, data); err != nil {
		return fmt.Errorf("не удалось сохранить %s: %w", s.path, err)
	}
	return nil
}

func (s *Store) Import(path string) (career.Document, error) {
	document, err := readDocument(path)
	if err != nil {
		return career.Document{}, fmt.Errorf("не удалось импортировать файл: %w", err)
	}
	return s.Save(document)
}

func (s *Store) Export(path string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	document, err := s.load()
	if err != nil {
		return err
	}
	data, err := encodeDocument(document)
	if err != nil {
		return err
	}
	if err := writeAtomic(path, data); err != nil {
		return fmt.Errorf("не удалось экспортировать файл: %w", err)
	}
	return nil
}
