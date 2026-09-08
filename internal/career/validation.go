package career

import (
	"fmt"
	"regexp"
	"slices"
	"strings"
	"unicode/utf8"
)

const (
	MaxGroups = 8
	MaxTracks = 32
	MaxLevels = 8
)

var validID = regexp.MustCompile(`^[a-zA-Z0-9_-]{1,64}$`)
var colors = []string{"red", "green", "yellow", "blue", "purple", "aqua", "orange"}

func (d Document) Validate() error {
	if d.Version != Version {
		return fmt.Errorf("неподдерживаемая версия файла: %d (ожидается %d)", d.Version, Version)
	}
	for field, value := range map[string]string{
		"имя профиля": d.Profile.Name, "роль": d.Profile.Role, "название схемы": d.Schema.Name,
	} {
		if err := textLength(field, value, 120, true); err != nil {
			return err
		}
	}
	if len(d.Schema.Groups) < 1 || len(d.Schema.Groups) > MaxGroups {
		return fmt.Errorf("схема должна содержать от 1 до %d направлений", MaxGroups)
	}
	ids := map[string]bool{}
	tracks := map[string]int{}
	for _, group := range d.Schema.Groups {
		if err := validateGroup(group, ids, tracks); err != nil {
			return err
		}
	}
	if len(tracks) > MaxTracks {
		return fmt.Errorf("схема может содержать не более %d треков", MaxTracks)
	}
	for id, progress := range d.Progress {
		levels, exists := tracks[id]
		if !exists {
			return fmt.Errorf("прогресс ссылается на неизвестный трек %q", id)
		}
		if progress < 0 || progress > levels {
			return fmt.Errorf("прогресс трека %q должен быть от 0 до %d", id, levels)
		}
	}
	return nil
}

func validateGroup(group Group, ids map[string]bool, tracks map[string]int) error {
	if err := uniqueID(group.ID, ids); err != nil {
		return err
	}
	if err := textLength("название направления", group.Name, 120, true); err != nil {
		return err
	}
	if !slices.Contains(colors, group.Color) {
		return fmt.Errorf("неизвестный цвет направления %q: %q", group.Name, group.Color)
	}
	if len(group.Tracks) < 1 || len(group.Tracks) > MaxTracks {
		return fmt.Errorf("направление %q должно содержать от 1 до %d треков", group.Name, MaxTracks)
	}
	for _, track := range group.Tracks {
		if err := validateTrack(track, ids); err != nil {
			return err
		}
		tracks[track.ID] = len(track.Levels)
	}
	return nil
}

func validateTrack(track Track, ids map[string]bool) error {
	if err := uniqueID(track.ID, ids); err != nil {
		return err
	}
	if err := textLength("название трека", track.Name, 120, true); err != nil {
		return err
	}
	if err := textLength("описание трека", track.Description, 4000, false); err != nil {
		return err
	}
	if len(track.Levels) < 1 || len(track.Levels) > MaxLevels {
		return fmt.Errorf("трек %q должен содержать от 1 до %d уровней", track.Name, MaxLevels)
	}
	for _, level := range track.Levels {
		if err := validateLevel(level); err != nil {
			return fmt.Errorf("трек %q: %w", track.Name, err)
		}
	}
	return nil
}

func validateLevel(level Level) error {
	if err := textLength("название уровня", level.Name, 120, true); err != nil {
		return err
	}
	if err := textLength("описание уровня", level.Description, 4000, false); err != nil {
		return err
	}
	if len(level.Examples) > 20 {
		return fmt.Errorf("уровень %q может содержать не более 20 примеров", level.Name)
	}
	for _, example := range level.Examples {
		if err := textLength("пример", example, 1000, false); err != nil {
			return err
		}
	}
	return nil
}

func uniqueID(id string, ids map[string]bool) error {
	if !validID.MatchString(id) {
		return fmt.Errorf("некорректный идентификатор %q: используйте 1–64 латинских букв, цифр, - или _", id)
	}
	if ids[id] {
		return fmt.Errorf("идентификатор %q повторяется", id)
	}
	ids[id] = true
	return nil
}

func textLength(field, value string, limit int, required bool) error {
	if required && strings.TrimSpace(value) == "" {
		return fmt.Errorf("поле «%s» не должно быть пустым", field)
	}
	if !utf8.ValidString(value) || utf8.RuneCountInString(value) > limit {
		return fmt.Errorf("поле «%s» должно содержать не более %d символов UTF-8", field, limit)
	}
	return nil
}
