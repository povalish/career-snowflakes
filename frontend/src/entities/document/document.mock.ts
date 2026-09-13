import type { Document, Track } from "./document.types";

//
//

const LEVELS = [
  {
    name: "Introduction",
    description:
      "You understand the basic concepts and complete small tasks with support from colleagues.",
  },
  {
    name: "Practice",
    description:
      "You apply the skill to familiar tasks, recognize limitations, and ask for feedback.",
  },
  {
    name: "Independence",
    description: "You solve complex tasks independently and explain your decisions and trade-offs.",
  },
  {
    name: "Team Growth",
    description: "You help colleagues develop this skill and improve the team's practices.",
  },
  {
    name: "Systemic Impact",
    description:
      "You establish sustainable practices that benefit multiple teams and evaluate their impact.",
  },
] as const;

type LevelExamples = readonly [string, string, string, string, string];

function createTrack(
  id: string,
  code: string,
  name: string,
  description: string,
  examples: LevelExamples,
): Track {
  return {
    id,
    code,
    name,
    description,
    levels: LEVELS.map((level, levelIndex) => ({
      ...level,
      examples: [examples[levelIndex]!],
    })),
  };
}

//
//

export function createDocumentMock(): Document {
  return {
    version: 2,
    profile: { name: "Alex", role: "Software Engineer" },
    schema: {
      name: "Professional Development Map",
      groups: [
        {
          id: "technology",
          name: "Technology",
          color: "aqua",
          tracks: [
            createTrack(
              "frontend",
              "FE",
              "Frontend",
              "Building clear, accessible, and responsive user interfaces.",
              [
                "Build a small component from an existing example and verify all of its states.",
                "Implement a form with validation, error handling, and keyboard support.",
                "Design a user flow and resolve a measured performance issue.",
                "Introduce accessibility checks and help the team use components consistently.",
                "Evolve a shared interface system and demonstrate an improvement in user experience.",
              ],
            ),
            createTrack(
              "backend",
              "BE",
              "Backend",
              "Reliable business logic, clear contracts, and effective data handling.",
              [
                "Modify a request handler and cover the expected behavior with a test.",
                "Add an API with input validation and predictable errors.",
                "Design a service that accounts for transactions, retries, and failures.",
                "Help the team identify bottlenecks and align contracts between services.",
                "Establish shared service reliability practices and measure their impact.",
              ],
            ),
            createTrack(
              "foundations",
              "CS",
              "Computer Science",
              "Understanding algorithms, data structures, networks, and the constraints of computing systems.",
              [
                "Explain how a chosen collection stores and retrieves elements.",
                "Choose an appropriate data structure and estimate the complexity of a common operation.",
                "Find the root cause of a networking, memory, or concurrency issue.",
                "Lead a technical problem review and teach colleagues a diagnostic approach.",
                "Apply foundational knowledge to a platform constraint affecting multiple teams.",
              ],
            ),
            createTrack(
              "infrastructure",
              "INF",
              "Infrastructure",
              "Reproducible builds, safe delivery, and application observability.",
              [
                "Run the project locally and explain the build sequence.",
                "Configure a CI check and diagnose a failed run.",
                "Set up delivery with rollback, logs, and useful failure signals.",
                "Improve the team's release process and reduce measured recovery time.",
                "Develop a platform practice that improves the reliability of multiple products.",
              ],
            ),
          ],
        },
        {
          id: "craft",
          name: "Craft",
          color: "blue",
          tracks: [
            createTrack(
              "delivery",
              "DLV",
              "Delivery",
              "Bringing work to a useful outcome within a clear timeframe.",
              [
                "Complete a small task and verify its acceptance criteria with a colleague.",
                "Break a task into steps and communicate a blocker early.",
                "Take an ambiguous task from clarified requirements through result verification.",
                "Help the team align priorities and remove a recurring delay.",
                "Coordinate multiple teams around a measurable user outcome.",
              ],
            ),
            createTrack(
              "communication",
              "COM",
              "Communication",
              "Clear discussion of decisions, expectations, and feedback.",
              [
                "Describe a question so that a colleague can reproduce the problem.",
                "Give a meaningful task update and constructive code feedback.",
                "Present solution options and help participants agree on the next step.",
                "Facilitate a difficult discussion while keeping decisions clear and participants respected.",
                "Improve context sharing between teams and verify that agreements are working.",
              ],
            ),
            createTrack(
              "quality",
              "QLT",
              "Code Quality",
              "Simple, testable code with clear boundaries of responsibility.",
              [
                "Follow project conventions and write a test for a fixed defect.",
                "Separate mixed responsibilities and verify important edge cases.",
                "Simplify a complex area without changing behavior and justify module boundaries.",
                "Improve review practices and help the team reduce recurring defects.",
                "Align useful quality standards across teams and evaluate their maintenance cost.",
              ],
            ),
            createTrack(
              "initiative",
              "INI",
              "Initiative",
              "Independently identifying problems and validating the value of changes.",
              [
                "Notice a small problem and describe its impact on the work.",
                "Propose an improvement and bring it into use.",
                "Validate a hypothesis, choose a small experiment, and measure the result.",
                "Help colleagues propose improvements and make time for the most valuable ones.",
                "Launch a change that solves a shared problem across multiple teams.",
              ],
            ),
          ],
        },
        {
          id: "leadership",
          name: "Leadership",
          color: "purple",
          tracks: [
            createTrack(
              "growth",
              "GRW",
              "Growth",
              "Intentional learning and application of new knowledge at work.",
              [
                "Choose a skill to develop and agree on a clear next step.",
                "Apply a learned approach to a task and get feedback.",
                "Create a development plan based on real gaps and revise it using the results.",
                "Help colleagues connect learning goals with team tasks and opportunities.",
                "Create a knowledge-sharing practice that continues without its author being constantly involved.",
              ],
            ),
            createTrack(
              "organisation",
              "ORG",
              "Organization",
              "Clear ownership and better collaboration.",
              [
                "Understand who makes decisions for a task and contact the right person in time.",
                "Clarify dependencies and align expectations with everyone involved.",
                "Organize a small group's work with clear decisions and action owners.",
                "Remove a recurring organizational barrier and verify the improvement in practice.",
                "Establish sustainable ownership boundaries across multiple teams.",
              ],
            ),
            createTrack(
              "wellbeing",
              "WLB",
              "Sustainable Pace",
              "Healthy workload, a respectful environment, and long-term effectiveness.",
              [
                "Discuss a realistic workload and communicate time constraints early.",
                "Plan work with rest in mind and recognize signs of overload.",
                "Discuss conflicting priorities and propose a sustainable set of commitments.",
                "Help the team reduce systemic overtime and improve on-call practices.",
                "Change an organizational practice that creates prolonged overload across multiple teams.",
              ],
            ),
            createTrack(
              "ownership",
              "OWN",
              "Ownership",
              "Caring for outcomes and the consequences of decisions throughout the product lifecycle.",
              [
                "Check your work after release and fix a discovered defect.",
                "Maintain a feature and keep its documentation up to date.",
                "Assess change risks and coordinate recovery from a failure.",
                "Clarify component ownership and improve the team's incident response.",
                "Remove a systemic product risk and align a long-term support plan.",
              ],
            ),
          ],
        },
        {
          id: "impact",
          name: "Impact",
          color: "orange",
          tracks: [
            createTrack(
              "mentorship",
              "MNT",
              "Mentorship",
              "Helping colleagues solve problems independently and grow professionally.",
              [
                "Share useful context and help a colleague understand a small task.",
                "Work alongside a colleague, explaining your reasoning while leaving room for practice.",
                "Support a colleague's growth with clear goals and regular feedback.",
                "Help other mentors establish a useful and sustainable practice.",
                "Develop a mentorship program and evaluate its value for participants.",
              ],
            ),
            createTrack(
              "knowledge",
              "KNO",
              "Knowledge Sharing",
              "Sharing experience through documentation, presentations, and open discussion.",
              [
                "Document a solution so that someone else can use it.",
                "Share a task review at a team meeting and answer questions.",
                "Prepare material that helps others solve a recurring problem.",
                "Organize cross-team knowledge sharing with practical outcomes.",
                "Develop an accessible knowledge source that benefits the professional community.",
              ],
            ),
            createTrack(
              "hiring",
              "HR",
              "Hiring",
              "Fair candidate evaluation and support for new colleagues.",
              [
                "Review interview criteria and help a new colleague set up their environment.",
                "Participate in an interview and record observations tied to the role criteria.",
                "Run an interview independently and give an evidence-based assessment without personal bias.",
                "Improve interview questions and onboarding using participant feedback.",
                "Align a transparent hiring process across teams and verify decision quality.",
              ],
            ),
            createTrack(
              "community",
              "CMT",
              "Community",
              "Meaningful participation in the professional community within and beyond the team.",
              [
                "Take part in a discussion and help another participant find the right resource.",
                "Make a small contribution to a shared library, documentation, or open-source project.",
                "Support a useful initiative regularly and account for participants' needs.",
                "Organize community collaboration with clear rules and an accessible entry point.",
                "Develop a sustainable community where other participants lead initiatives independently.",
              ],
            ),
          ],
        },
      ],
    },
    progress: {
      frontend: 3,
      backend: 2,
      foundations: 2,
      infrastructure: 1,
      delivery: 3,
      communication: 3,
      quality: 2,
      initiative: 2,
      growth: 2,
      organisation: 1,
      wellbeing: 2,
      ownership: 3,
      mentorship: 3,
      knowledge: 2,
      hiring: 1,
      community: 1,
    },
  };
}
