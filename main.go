package main

import (
	"embed"
	"log"
	"os"
	"path/filepath"

	"career-snowflakes/internal/storage"

	"github.com/wailsapp/wails/v3/pkg/application"
)

//go:embed all:frontend/dist
var assets embed.FS

//go:embed build/appicon.png
var appIcon []byte

func main() {
	configDir, err := os.UserConfigDir()
	if err != nil {
		log.Fatal(err)
	}
	service := &CareerService{store: storage.New(filepath.Join(configDir, "career-snowflakes", "career.json"))}
	app := application.New(application.Options{
		Name:        "Career Snowflakes",
		Description: "Наглядная карта профессионального развития",
		Icon:        appIcon,
		Services:    []application.Service{application.NewService(service)},
		Assets:      application.AssetOptions{Handler: application.AssetFileServerFS(assets)},
		Mac:         application.MacOptions{ApplicationShouldTerminateAfterLastWindowClosed: true},
	})
	window := app.Window.NewWithOptions(application.WebviewWindowOptions{
		Title:            "Career Snowflakes",
		Frameless:        true,
		Width:            940,
		Height:           850,
		MinWidth:         940,
		MinHeight:        850,
		BackgroundColour: application.NewRGB(40, 40, 40),
		Mac: application.MacWindow{
			TitleBar:                application.MacTitleBarHiddenInsetUnified,
			InvisibleTitleBarHeight: 48,
		},
		URL: "/",
	})
	service.dialogs = nativeDialogs{app: app, window: window}
	if err := app.Run(); err != nil {
		log.Fatal(err)
	}
}
