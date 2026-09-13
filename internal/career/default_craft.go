package career

func craft() Group {
	return Group{ID: "craft", Name: "Craft", Color: "blue", Tracks: []Track{
		defaultTrack("delivery", "DLV", "Delivery", "Bringing work to a useful outcome within a clear timeframe.", [5]string{
			"Complete a small task and verify its acceptance criteria with a colleague.",
			"Break a task into steps and communicate a blocker early.",
			"Take an ambiguous task from clarified requirements through result verification.",
			"Help the team align priorities and remove a recurring delay.",
			"Coordinate multiple teams around a measurable user outcome.",
		}),
		defaultTrack("communication", "COM", "Communication", "Clear discussion of decisions, expectations, and feedback.", [5]string{
			"Describe a question so that a colleague can reproduce the problem.",
			"Give a meaningful task update and constructive code feedback.",
			"Present solution options and help participants agree on the next step.",
			"Facilitate a difficult discussion while keeping decisions clear and participants respected.",
			"Improve context sharing between teams and verify that agreements are working.",
		}),
		defaultTrack("quality", "QLT", "Code Quality", "Simple, testable code with clear boundaries of responsibility.", [5]string{
			"Follow project conventions and write a test for a fixed defect.",
			"Separate mixed responsibilities and verify important edge cases.",
			"Simplify a complex area without changing behavior and justify module boundaries.",
			"Improve review practices and help the team reduce recurring defects.",
			"Align useful quality standards across teams and evaluate their maintenance cost.",
		}),
		defaultTrack("initiative", "INI", "Initiative", "Independently identifying problems and validating the value of changes.", [5]string{
			"Notice a small problem and describe its impact on the work.",
			"Propose an improvement and bring it into use.",
			"Validate a hypothesis, choose a small experiment, and measure the result.",
			"Help colleagues propose improvements and make time for the most valuable ones.",
			"Launch a change that solves a shared problem across multiple teams.",
		}),
	}}
}
