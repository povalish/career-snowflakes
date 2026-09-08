package main

import (
	"errors"
	"testing"
)

func TestNativeCancellationIsNotAnError(t *testing.T) {
	for _, err := range []error{nil, errors.New("cancelled by user")} {
		if path, resultErr := dialogResult("", err); path != "" || resultErr != nil {
			t.Fatalf("cancellation: got %q, %v", path, resultErr)
		}
	}
}

func TestNativeDialogResultPreservesSelectionAndFailures(t *testing.T) {
	if path, err := dialogResult("selected.json", nil); path != "selected.json" || err != nil {
		t.Fatalf("selection: got %q, %v", path, err)
	}
	failure := errors.New("file dialogs not available in server mode")
	if _, err := dialogResult("", failure); !errors.Is(err, failure) {
		t.Fatal("unexpected dialog failures must be reported")
	}
}
