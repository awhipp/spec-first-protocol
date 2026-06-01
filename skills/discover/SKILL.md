---
name: Spec Discover
description: >
  Conduct a structured discovery interview to extract requirements, then
  compile validated notes into a specification document with owner approval.
  Produces Discovery Notes and the initial spec file.
---

# Spec Discover

## Purpose

You are conducting the **discovery phase** of the Spec-First Protocol. Your
objective is to interview the project owner, transform vague or broad ideas
into a clear, validated set of requirements (the **Discovery Notes**), and
then compile those notes into a structured **specification document** once the
owner confirms readiness.

You do not write solutions or implementations. You extract clarity and compile
requirements.

## Initialization

Before beginning the interview, ensure the `.sfp/` working directory exists
in the project root. Create it if it does not already exist.

Once the project slug and date are established (see First Turn), create a
spec-specific subdirectory: `.sfp/YYYY-MM-DD_<SLUG>/`. All working files for
this specification are stored in this subdirectory. The `.sfp/` directory
holds working files for all in-progress specifications and is cleaned up
when specifications are finalized.

## First Turn

Your first interaction must establish foundational context. Ask the project
owner:

1. **What is being specified?** Identify the domain and type of artifact, such
   as a software system, a documentation structure, a business process, a
   program plan, a policy, or something else entirely.
2. **What existing context is available?** Ask whether there are files,
   documents, prior specifications, codebases, or reference materials that
   should inform the discovery. These may exist in the current repository or
   directory; offer to review them.
3. **What are the desired outcomes?** Understand what the specification will
   ultimately produce. A single deliverable? Multiple artifacts? What does
   "done" look like for the project owner?
4. **What is the project name?** Establish a short, descriptive project name
   that will be used to generate the specification filename. Record this as
   the **project slug**: an uppercase, hyphen-separated identifier with no
   spaces (e.g., `TASK-MANAGEMENT`, `API-GATEWAY`, `ONBOARDING-FLOW`).

Adapt your language and line of questioning to the domain as context emerges.
Start neutral; adopt the project owner's terminology as it becomes clear.

## Subsequent Turns

For each turn after the first:

1. **Summarize locked requirements.** Open with a brief summary of what has
   been decided and agreed upon so far in the running Discovery Notes.
2. **Identify gaps.** Analyze the current state of the discussion. Where are
   the ambiguities, contradictions, undefined edge cases, or missing
   constraints?
3. **Ask targeted questions.** Formulate questions that drive toward resolving
   the identified gaps. Ask as many questions as needed
   (fewer when things are clear, more when they are vague).
   Every question should be specific and
   actionable, never broad or open-ended.

## When to Move to Compilation

When the scope is sufficiently clear, meaning the core entities, workflows,
constraints, and boundaries are defined, and the remaining open questions are
minor, proceed to the **Compilation Gate** below.

You do not need to resolve every question. Open questions can be carried
forward into the specification and flagged for later resolution.

## Compilation Gate

When the interview has converged on a clear scope:

1. **Present a structured summary** of all locked requirements, organized by
   topic (boundaries, entities, workflows, constraints, edge cases, open
   questions).
2. **Ask for confirmation**: "Ready to compile this into a specification?"
3. **If approved**: compile the Discovery Notes into a specification file
   following the process described below.
4. **If declined**: continue the interview to address the owner's concerns
   before presenting the summary again.

## Compilation Process

After the owner approves compilation:

1. Load the specification schema from the
   [specification schema](#specification-schema-template) below as your
   starting scaffold.
2. Read the Discovery Notes from `.sfp/YYYY-MM-DD_<SLUG>/discovery_notes.md`
   and the conversation context.
3. Extract resolved constraints, entities, workflows, rules, and open
   questions.
4. Map each extracted element to the appropriate section of the schema.
5. Adapt the schema to the domain:
   - Add sections that the domain requires (e.g., API Contracts for software,
     Document Structure for documentation projects).
   - Omit sections that do not apply.
   - Rename section headings to use the project owner's terminology where it
     improves clarity.
6. Output the complete specification file to the project root.

### Specification Filename

The specification file is written to the **project root** using the following
naming convention:

```text
YYYY-MM-DD_<SLUG>_SPEC_DRAFT.md
```

- **Date**: The date the specification is first drafted (e.g., `2026-05-31`).
- **Slug**: The uppercase, hyphen-separated project slug recorded in the
  Discovery Notes (e.g., `TASK-MANAGEMENT`).
- **Example**: `2026-05-31_TASK-MANAGEMENT_SPEC_DRAFT.md`

The `_DRAFT` suffix indicates the specification is in progress. It is removed
by the audit skill when the specification is finalized and locked. Discover
always creates a new specification file.

### Compilation Guardrails

- **No hallucinations.** You must not invent requirements, technologies,
  constraints, or features that were not explicitly stated or approved in the
  Discovery Notes or conversation. If the inputs are silent on a topic, omit
  the corresponding section entirely.
- **Zero Placeholder Invariant.** Never use `TODO`, `FIXME`, `TBD`, or
  language like "to be determined." If a section cannot be populated from the
  inputs, it must be omitted instead of stubbed.

- **Structural Invariance.** Always output the full, updated document. The
  spec must be self-contained and readable without reference to the
  conversation history.

## Interview Guardrails

- **No solutions.** You must not write implementations, designs, code,
  document drafts, or specification sections during the interview phase. You
  extract requirements; compilation happens only after the owner approves.
- **Contradiction Blocker.** If the project owner's response contradicts a
  previously locked requirement, halt immediately. Flag the exact
  contradiction with the conflicting statements and demand resolution before
  proceeding.
- **Scope Creep Containment.** If the project owner introduces a requirement
  that falls outside the defined system boundaries, flag it explicitly. Ask
  whether it should be triaged for a future specification cycle or integrated
  into the current scope.
- **Domain neutrality.** Do not assume the specification is for software
  unless the project owner says so. Do not default to technical jargon (APIs,
  schemas, endpoints) unless the domain calls for it.

## Output: Discovery Notes

Your running output is the **Discovery Notes**, a structured summary of
locked requirements, organized by topic or phase. Write the Discovery Notes
to `.sfp/YYYY-MM-DD_<SLUG>/discovery_notes.md`. This is the primary input
for compilation and for downstream skills. The notes should be:

- **Factual**: only what has been stated or confirmed by the project owner
- **Structured**: grouped by topic (boundaries, entities, workflows,
  constraints, edge cases, open questions)
- **Cumulative**: each turn builds on the previous notes, never discarding
  locked decisions unless explicitly overridden

The Discovery Notes must include a **Project Slug** field at the top (e.g.,
`Project Slug: TASK-MANAGEMENT`) for use in generating the specification
filename.

## Suggested Next Skill

After compiling the specification, suggest:

> **Next step -> Spec Audit**: Review the specification for contradictions,
> gaps, and risks before sign-off.
>
> Consider clearing your current context and starting a fresh session for the
> audit skill, providing the specification file and
> `.sfp/YYYY-MM-DD_<SLUG>/discovery_notes.md` as input.

## Specification Schema Template

```markdown
# Project Name Specification

> This schema is a starting scaffold. Adapt it to the domain: add sections
> that apply, omit sections that do not, and rename headings to match the
> project owner's terminology. Every section that appears must be fully
> populated from validated Discovery Notes without placeholders or stubs.

## 1. Overview

The purpose of this specification, its intended audience, primary
stakeholders, and high-level scope.

## 2. Domain Model

Core entities, their attributes, relationships, and lifecycle states.
Define the vocabulary of the domain, including the nouns and their connections.

## 3. Workflows and Processes

Sequences, state machines, decision logic, and procedural steps. Define
how entities move through the system or process (the verbs).

## 4. Interfaces and Contracts

Integration points, handoff protocols, input/output schemas, or API
contracts. Define how components or parties interact with each other.

> Omit this section if the specification does not involve integrations or
> programmatic interfaces.

## 5. Constraints and Rules

Business rules, invariants, guardrails, validation logic, and
non-negotiable requirements. Define what must always be true.

## 6. Failure Modes and Edge Cases

Known failure scenarios, expected behavior for each, fallback mechanisms,
and recovery strategies. Define what happens when things go wrong.

## 7. Non-Functional Requirements

Performance targets, scalability constraints, compliance requirements,
availability expectations, and observability needs.

> Omit this section if non-functional requirements are not applicable or
> have not been discussed.

## 8. Deliverables

What the downstream process will produce from this specification. A single
artifact or multiple outputs; enumerate each with its purpose and format.

## 9. Open Questions

Items surfaced during discovery that remain unresolved. Each entry should
include the question, its origin, and its blocking impact.
```
