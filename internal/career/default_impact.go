package career

func impact() Group {
	return Group{ID: "impact", Name: "Impact", Color: "orange", Tracks: []Track{
		defaultTrack("mentorship", "MNT", "Mentorship", "Helping colleagues solve problems independently and grow professionally.", [5]string{
			"Share useful context and help a colleague understand a small task.",
			"Work alongside a colleague, explaining your reasoning while leaving room for practice.",
			"Support a colleague's growth with clear goals and regular feedback.",
			"Help other mentors establish a useful and sustainable practice.",
			"Develop a mentorship program and evaluate its value for participants.",
		}),
		defaultTrack("knowledge", "KNO", "Knowledge Sharing", "Sharing experience through documentation, presentations, and open discussion.", [5]string{
			"Document a solution so that someone else can use it.",
			"Share a task review at a team meeting and answer questions.",
			"Prepare material that helps others solve a recurring problem.",
			"Organize cross-team knowledge sharing with practical outcomes.",
			"Develop an accessible knowledge source that benefits the professional community.",
		}),
		defaultTrack("hiring", "HR", "Hiring", "Fair candidate evaluation and support for new colleagues.", [5]string{
			"Review interview criteria and help a new colleague set up their environment.",
			"Participate in an interview and record observations tied to the role criteria.",
			"Run an interview independently and give an evidence-based assessment without personal bias.",
			"Improve interview questions and onboarding using participant feedback.",
			"Align a transparent hiring process across teams and verify decision quality.",
		}),
		defaultTrack("community", "CMT", "Community", "Meaningful participation in the professional community within and beyond the team.", [5]string{
			"Take part in a discussion and help another participant find the right resource.",
			"Make a small contribution to a shared library, documentation, or open-source project.",
			"Support a useful initiative regularly and account for participants' needs.",
			"Organize community collaboration with clear rules and an accessible entry point.",
			"Develop a sustainable community where other participants lead initiatives independently.",
		}),
	}}
}
