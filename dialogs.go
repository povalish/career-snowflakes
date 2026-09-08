package main

import "github.com/wailsapp/wails/v3/pkg/application"

type nativeDialogs struct {
	app    *application.App
	window *application.WebviewWindow
}

func (d nativeDialogs) importPath() (string, error) {
	path, err := d.app.Dialog.OpenFile().
		SetTitle("Импортировать карьерную схему").
		AttachToWindow(d.window).
		AddFilter("Career Snowflakes (*.json)", "*.json").
		CanChooseFiles(true).
		CanChooseDirectories(false).
		PromptForSingleSelection()
	return dialogResult(path, err)
}

func (d nativeDialogs) exportPath() (string, error) {
	path, err := d.app.Dialog.SaveFile().
		SetFilename("career-snowflake.json").
		AttachToWindow(d.window).
		AddFilter("Career Snowflakes (*.json)", "*.json").
		CanCreateDirectories(true).
		PromptForSingleSelection()
	return dialogResult(path, err)
}

func dialogResult(path string, err error) (string, error) {
	// Wails alpha2.119 keeps the Windows cancellation sentinel in an internal
	// package, so it can only be identified by its exact message here.
	if err != nil && err.Error() == "cancelled by user" {
		return "", nil
	}
	return path, err
}
