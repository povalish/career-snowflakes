package career

func leadership() Group {
	return Group{ID: "leadership", Name: "Leadership", Color: "purple", Tracks: []Track{
		defaultTrack("growth", "GRW", "Growth", "Intentional learning and application of new knowledge at work.", [5]string{
			"Choose a skill to develop and agree on a clear next step.",
			"Apply a learned approach to a task and get feedback.",
			"Create a development plan based on real gaps and revise it using the results.",
			"Help colleagues connect learning goals with team tasks and opportunities.",
			"Create a knowledge-sharing practice that continues without its author being constantly involved.",
		}),
		defaultTrack("organisation", "ORG", "Organization", "Clear ownership and better collaboration.", [5]string{
			"Understand who makes decisions for a task and contact the right person in time.",
			"Clarify dependencies and align expectations with everyone involved.",
			"Organize a small group's work with clear decisions and action owners.",
			"Remove a recurring organizational barrier and verify the improvement in practice.",
			"Establish sustainable ownership boundaries across multiple teams.",
		}),
		defaultTrack("wellbeing", "WLB", "Sustainable Pace", "Healthy workload, a respectful environment, and long-term effectiveness.", [5]string{
			"Discuss a realistic workload and communicate time constraints early.",
			"Plan work with rest in mind and recognize signs of overload.",
			"Discuss conflicting priorities and propose a sustainable set of commitments.",
			"Help the team reduce systemic overtime and improve on-call practices.",
			"Change an organizational practice that creates prolonged overload across multiple teams.",
		}),
		defaultTrack("ownership", "OWN", "Ownership", "Caring for outcomes and the consequences of decisions throughout the product lifecycle.", [5]string{
			"Check your work after release and fix a discovered defect.",
			"Maintain a feature and keep its documentation up to date.",
			"Assess change risks and coordinate recovery from a failure.",
			"Clarify component ownership and improve the team's incident response.",
			"Remove a systemic product risk and align a long-term support plan.",
		}),
	}}
}
