package career

func technology() Group {
	return Group{ID: "technology", Name: "Technology", Color: "aqua", Tracks: []Track{
		defaultTrack("frontend", "FE", "Frontend", "Building clear, accessible, and responsive user interfaces.", [5]string{
			"Build a small component from an existing example and verify all of its states.",
			"Implement a form with validation, error handling, and keyboard support.",
			"Design a user flow and resolve a measured performance issue.",
			"Introduce accessibility checks and help the team use components consistently.",
			"Evolve a shared interface system and demonstrate an improvement in user experience.",
		}),
		defaultTrack("backend", "BE", "Backend", "Reliable business logic, clear contracts, and effective data handling.", [5]string{
			"Modify a request handler and cover the expected behavior with a test.",
			"Add an API with input validation and predictable errors.",
			"Design a service that accounts for transactions, retries, and failures.",
			"Help the team identify bottlenecks and align contracts between services.",
			"Establish shared service reliability practices and measure their impact.",
		}),
		defaultTrack("foundations", "CS", "Computer Science", "Understanding algorithms, data structures, networks, and the constraints of computing systems.", [5]string{
			"Explain how a chosen collection stores and retrieves elements.",
			"Choose an appropriate data structure and estimate the complexity of a common operation.",
			"Find the root cause of a networking, memory, or concurrency issue.",
			"Lead a technical problem review and teach colleagues a diagnostic approach.",
			"Apply foundational knowledge to a platform constraint affecting multiple teams.",
		}),
		defaultTrack("infrastructure", "INF", "Infrastructure", "Reproducible builds, safe delivery, and application observability.", [5]string{
			"Run the project locally and explain the build sequence.",
			"Configure a CI check and diagnose a failed run.",
			"Set up delivery with rollback, logs, and useful failure signals.",
			"Improve the team's release process and reduce measured recovery time.",
			"Develop a platform practice that improves the reliability of multiple products.",
		}),
	}}
}
