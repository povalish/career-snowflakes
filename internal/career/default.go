package career

// Default is an editable starting point inspired by career matrices, not a grading standard.
func Default() Document {
	return Document{
		Version:  Version,
		Profile:  Profile{Name: "My Profile", Role: "Software Engineer"},
		Schema:   Schema{Name: "Professional Development Map", Groups: []Group{technology(), craft(), leadership(), impact()}},
		Progress: map[string]int{},
	}
}

func defaultTrack(id, code, name, description string, examples [5]string) Track {
	names := [5]string{"Introduction", "Practice", "Independence", "Team Growth", "Systemic Impact"}
	descriptions := [5]string{
		"You understand the basic concepts and complete small tasks with support from colleagues.",
		"You apply the skill to familiar tasks, recognize limitations, and ask for feedback.",
		"You solve complex tasks independently and explain your decisions and trade-offs.",
		"You help colleagues develop this skill and improve the team's practices.",
		"You establish sustainable practices that benefit multiple teams and evaluate their impact.",
	}
	levels := make([]Level, len(names))
	for i := range levels {
		levels[i] = Level{Name: names[i], Description: descriptions[i], Examples: []string{examples[i]}}
	}
	return Track{ID: id, Code: code, Name: name, Description: description, Levels: levels}
}
