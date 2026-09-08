package career

// Default is an editable starting point inspired by career matrices, not a grading standard.
func Default() Document {
	return Document{
		Version:  Version,
		Profile:  Profile{Name: "Мой профиль", Role: "Software Engineer"},
		Schema:   Schema{Name: "Карта профессионального развития", Groups: []Group{technology(), craft(), leadership(), impact()}},
		Progress: map[string]int{},
	}
}

func defaultTrack(id, name, description string, examples [5]string) Track {
	names := [5]string{"Знакомство", "Практика", "Самостоятельность", "Развитие команды", "Системное влияние"}
	descriptions := [5]string{
		"Понимаете основные понятия и выполняете небольшие задачи с поддержкой коллег.",
		"Применяете навык в привычных задачах, замечаете ограничения и запрашиваете обратную связь.",
		"Самостоятельно решаете сложные задачи и объясняете свой выбор с учётом компромиссов.",
		"Помогаете коллегам развивать этот навык и улучшаете подходы всей команды.",
		"Создаёте устойчивые практики, полезные нескольким командам, и оцениваете их результат.",
	}
	levels := make([]Level, len(names))
	for i := range levels {
		levels[i] = Level{Name: names[i], Description: descriptions[i], Examples: []string{examples[i]}}
	}
	return Track{ID: id, Name: name, Description: description, Levels: levels}
}
