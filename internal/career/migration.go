package career

const versionWithoutTrackCodes = 1

// Migrate updates documents from supported older versions before validation.
func (d *Document) Migrate() {
	if d.Version != versionWithoutTrackCodes {
		return
	}

	defaultCodes := make(map[string]string)
	for _, group := range Default().Schema.Groups {
		for _, track := range group.Tracks {
			defaultCodes[track.ID] = track.Code
		}
	}

	usedCodes := make(map[string]bool)
	for groupIndex := range d.Schema.Groups {
		for trackIndex := range d.Schema.Groups[groupIndex].Tracks {
			track := &d.Schema.Groups[groupIndex].Tracks[trackIndex]
			track.Code = defaultCodes[track.ID]
			if track.Code != "" {
				usedCodes[track.Code] = true
			}
		}
	}

	codeIndex := 0
	for groupIndex := range d.Schema.Groups {
		for trackIndex := range d.Schema.Groups[groupIndex].Tracks {
			track := &d.Schema.Groups[groupIndex].Tracks[trackIndex]
			if track.Code != "" {
				continue
			}
			for {
				code := string([]byte{'A' + byte(codeIndex/26), 'A' + byte(codeIndex%26)})
				codeIndex++
				if !usedCodes[code] {
					track.Code = code
					usedCodes[code] = true
					break
				}
			}
		}
	}

	d.Version = Version
}
