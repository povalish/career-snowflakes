# Domain Docs

## Layout

This repository uses a single-context layout:

- `GLOSSARY.md` at the repository root: domain terminology.
- `docs/adr/`: architectural decision records.

## Before exploring

Read the glossary and ADRs relevant to the area being explored.

If these files do not exist, proceed silently. Do not suggest
creating them upfront. Domain-modeling work creates them lazily
when terms or decisions are resolved.

## Use the glossary's vocabulary

Use the glossary's terms in issue titles, proposals, hypotheses,
and test names. Avoid synonyms that the glossary explicitly rejects.

If a concept is missing, reconsider the wording or note a real gap
for domain-modeling work.

## Flag ADR conflicts

Explicitly identify any proposal that contradicts an existing ADR,
and explain why the decision should be reconsidered.
