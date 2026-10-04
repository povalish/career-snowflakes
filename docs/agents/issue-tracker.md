# Issue tracker: GitHub

Issues and specs live in GitHub Issues for `povalish/career-snowflakes`.
Use the `gh` CLI from this repository.

## Conventions

- Create: `gh issue create --title "..." --body-file <path>`.
- Read: `gh issue view <number> --json number,title,body,labels,comments`.
- List: `gh issue list --state open --json number,title,body,labels`.
- Read discussion: `gh issue view <number> --comments`.
- Comment: `gh issue comment <number> --body-file <path>`.
- Add a label: `gh issue edit <number> --add-label "..."`.
- Remove a label: `gh issue edit <number> --remove-label "..."`.
- Close: `gh issue close <number> --comment "..."`.

For multiline bodies, write the exact text to a temporary UTF-8 file
and pass it with `--body-file`.

Infer the repository from `git remote -v`; when needed, pass
`--repo povalish/career-snowflakes` explicitly.

Use the label mapping in `docs/agents/triage-labels.md`.

## Pull requests as a triage surface

**PRs as a request surface: no.**

## When a skill says "publish to the issue tracker"

Create a GitHub issue.

## When a skill says "fetch the relevant ticket"

Read the issue body, labels, and comments using the commands above.
