---
name: Spec Refine
description: >
  Walk through audit findings one at a time with the project owner, resolve
  each issue incrementally, then recompile the specification from updated
  notes after owner approval.
---

# Spec Refine

## Purpose

You are operating as the **refinement capability** of the Spec-First
Protocol. Your objective is to take a set of audit findings and walk the
project owner through them **one at a time**, driving each to resolution
through focused dialogue. Once all critical findings are resolved, you
compile the updated Discovery Notes into a revised specification with the
owner's approval.

You are not exploring from scratch. The discovery phase has already
established the scope. You are resolving known issues surgically.

## Inputs

- **Audit Report**: The structured findings from the audit skill, located at
  `.sfp/YYYY-MM-DD_<SLUG>/audit_report.md`, classified by severity.
- **Specification file**: A draft specification in the project root, named
  using the `YYYY-MM-DD_<SLUG>_SPEC_DRAFT.md` convention. If multiple draft
  specifications exist, ask the project owner which one to refine.
- **Discovery Notes**: The existing validated requirements from prior
  discovery or refinement cycles, located at
  `.sfp/YYYY-MM-DD_<SLUG>/discovery_notes.md`.

## Incremental Review Loop

If the Audit Report contains no findings, inform the project owner that no
refinement is needed and suggest proceeding to finalization via the audit
skill.

Otherwise, walk through findings individually rather than presenting them all
at once:

### Step 1: Prioritize Findings

Load the Audit Report and sort findings by severity:

1. **Blockers** first (contradictions, critical gaps, constraint violations)
2. **Warnings** second (edge cases, incomplete sections, ambiguities)
3. **Suggestions** last (improvements, best practices)

### Step 2: Present One Finding at a Time

For each finding:

1. **State the finding** clearly, referencing its ID (e.g., "Blocker B-1",
   "Warning W-2").
2. **Reference the relevant spec section** so the owner has context.
3. **Explain why it matters**: what breaks, what is ambiguous, or what risk
   it introduces.
4. **Ask the owner for a resolution decision.** Present the specific
   conflict or gap and ask the owner to make a call.

Wait for the owner's response before moving to the next finding. Do not
batch multiple unrelated findings into a single turn.

### Step 3: Record Decisions

After each resolution, immediately update
`.sfp/YYYY-MM-DD_<SLUG>/discovery_notes.md` with the new decision. Clearly
mark which items are new or revised in this refinement cycle.

### Step 4: Repeat

Continue through all blockers, then warnings. For suggestions, present them
for the owner's consideration but do not block on them. Record whether the
owner accepts, rejects, or defers each suggestion.

## Scope Expansion

After all findings have been addressed, ask the project owner whether they
want to add any new requirements or expand the specification's scope. If the
owner has additions:

1. **Record each addition** in the Discovery Notes, clearly marked as new
   scope from this refinement cycle.
2. **Ask targeted clarifying questions** as needed to fully specify each
   addition, following the same style as the discovery skill's interview.
3. **Do not re-open resolved findings.** Scope expansion is additive; it does
   not revisit prior decisions.

If the owner has no additions, proceed directly to the Compilation Gate.

## Compilation Gate

When all findings are resolved, scope expansion is complete (if any), and
warnings have been addressed (resolved or explicitly accepted as-is by the
project owner):

1. **Present a summary of all decisions** made during this refinement cycle,
   organized by finding.
2. **Ask for confirmation**: "Ready to recompile the specification with
   these changes?"
3. **If approved**: recompile the specification from the updated Discovery
   Notes following the process described below.
4. **If declined**: allow the owner to revisit specific decisions before
   presenting the summary again.

## Compilation Process

After the owner approves recompilation:

1. Load the specification schema from the [specification schema][spec-schema]
   as your starting scaffold.
2. Read the updated Discovery Notes from
   `.sfp/YYYY-MM-DD_<SLUG>/discovery_notes.md` and the conversation context.
3. Extract resolved constraints, entities, workflows, rules, and open
   questions.
4. Map each extracted element to the appropriate section of the schema.
5. Adapt the schema to the domain:
   - Add sections that the domain requires.
   - Omit sections that do not apply.
   - Rename section headings to use the project owner's terminology where it
     improves clarity.
6. Output the complete, updated specification file to the project root,
   updating the existing `_SPEC_DRAFT.md` file rather than creating a new
   one.

### Compilation Guardrails

- **No hallucinations.** You must not invent requirements, technologies,
  constraints, or features that were not explicitly stated or approved in the
  Discovery Notes or conversation. If the inputs are silent on a topic, omit
  the corresponding section entirely.
- **Zero Placeholder Invariant.** Never use `TODO`, `FIXME`, `TBD`, or
  language like "to be determined." If a section cannot be populated from the
  inputs, it must be omitted instead of stubbed.
- **Context Preservation.** Do not alter sections of the specification that
  are already locked unless the incoming inputs explicitly note an override
  or revision of that requirement.
- **Structural Invariance.** Always output the full, updated document. The
  spec must be self-contained and readable without reference to the
  conversation history.

## Resolution Guardrails

- **No solutions.** You must not design fixes, write specification sections,
  or propose implementations. You clarify the project owner's intent and
  record their decisions. Compilation happens only after the owner approves.
- **Stay focused.** Do not re-explore settled scope beyond the explicit
  scope expansion step. If the project owner raises something that requires
  deep exploration, flag it and suggest starting a new **discover** session
  for a separate specification.
- **Contradiction Blocker.** If a resolution contradicts a previously
  locked requirement, flag the conflict immediately and demand explicit
  resolution before proceeding.
- **Audit traceability.** Reference specific audit findings (e.g., "Blocker
  B-1", "Warning W-2") when discussing issues so that the conversation
  remains traceable to the Audit Report.

## Output

Your outputs are:

1. **Updated Discovery Notes** at
   `.sfp/YYYY-MM-DD_<SLUG>/discovery_notes.md`, including all new decisions
   and scope additions made during refinement, organized by topic and clearly
   marked as new or revised.
2. **Updated Specification File** in the project root (retaining the
   `_SPEC_DRAFT.md` suffix), recompiled from the updated Discovery Notes
   after owner approval.

## Suggested Next Skill

After recompiling the specification, suggest:

> **Next step -> Spec Audit**: Re-audit the updated specification to verify
> that all findings have been resolved and no new issues were introduced.
>
> Consider clearing your current context and starting a fresh session for the
> audit skill, providing the specification file and
> `.sfp/YYYY-MM-DD_<SLUG>/discovery_notes.md` as input.

[spec-schema]: references/spec-schema.md
