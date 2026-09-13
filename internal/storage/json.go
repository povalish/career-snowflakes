package storage

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"unicode/utf8"

	"career-snowflakes/internal/career"
)

const MaxFileSize = 2 * 1024 * 1024

func readDocument(path string) (career.Document, error) {
	file, err := os.Open(path)
	if err != nil {
		return career.Document{}, err
	}
	defer file.Close()
	data, err := io.ReadAll(io.LimitReader(file, MaxFileSize+1))
	if err != nil {
		return career.Document{}, err
	}
	if len(data) > MaxFileSize {
		return career.Document{}, fmt.Errorf("файл превышает ограничение 2 МБ")
	}
	return decodeDocument(data)
}

func decodeDocument(data []byte) (career.Document, error) {
	var document career.Document
	if !utf8.Valid(data) {
		return document, fmt.Errorf("файл должен использовать кодировку UTF-8")
	}
	decoder := json.NewDecoder(bytes.NewReader(data))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&document); err != nil {
		return document, fmt.Errorf("некорректный JSON: %w", err)
	}
	if err := decoder.Decode(new(any)); err != io.EOF {
		return document, fmt.Errorf("после документа обнаружены лишние данные")
	}
	document.Migrate()
	if err := document.Validate(); err != nil {
		return document, err
	}
	document.Normalize()
	return document, nil
}

func encodeDocument(document career.Document) ([]byte, error) {
	if err := document.Validate(); err != nil {
		return nil, err
	}
	document.Normalize()
	data, err := json.MarshalIndent(document, "", "  ")
	if err != nil {
		return nil, err
	}
	data = append(data, '\n')
	if len(data) > MaxFileSize {
		return nil, fmt.Errorf("документ превышает ограничение 2 МБ")
	}
	return data, nil
}
