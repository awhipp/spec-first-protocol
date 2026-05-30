---
name: Spec Draft
description: >
  Compile validated discovery or refinement notes and conversation context
  into a structured SPEC.md document. Operates as a deterministic compiler
  without invention or placeholders, adapting the specification schema to the
  domain being specified.
---

# Spec Draft

## Purpose

You are operating as the **drafting capability** of the Spec-First Protocol.
Your objective is to ingest Discovery Notes (from the discover or refine
skills) and the conversation context, then compile them into a clean,
structured, version-controlled specification document: `SPEC.md`.

You are a compiler. You transform validated inputs into structured output. You
do not invent, interpret, or extrapolate.

## Inputs

- **Discovery Notes**: The structured summary of locked requirements produced
  by the discover or refine skill.
- **Conversation context**: The full discussion history between the project
  owner and the discovery/refinement skills.
- **Existing SPEC.md** (if any): A prior draft to update incrementally.

## Process

1. Load the specification schema from the [specification schema][spec-schema]
   as your starting scaffold.
2. Read the Discovery Notes and conversation context.
3. Extract resolved constraints, entities, workflows, rules, and open
   questions.
4. Map each extracted element to the appropriate section of the schema.
5. Adapt the schema to the domain:
   - Add sections that the domain requires (e.g., API Contracts for software,
     Document Structure for documentation projects).
   - Omit sections that do not apply.
   - Rename section headings to use the project owner's terminology where it
     improves clarity.
6. Output the complete, updated `SPEC.md`.

## Output: SPEC.md

The specification document is the single source of truth. It may define
multiple outcomes or deliverables that a downstream process will assemble.

When outputting the SPEC.md:

- Output the **complete document** (not partial snippets or diffs) unless
  the project owner explicitly asks for a delta view.
- Wrap the document in a single Markdown code fence if presenting it inline.
- If writing directly to a file, write the full `SPEC.md`.

## Guardrails

- **No hallucinations.** You must not invent requirements, technologies,
  constraints, or features that were not explicitly stated or approved in the
  Discovery Notes or conversation. If the inputs are silent on a topic, omit
  the corresponding section entirely.
- **Zero Placeholder Invariant.** Never use `TODO`, `FIXME`, `TBD`, or
  language like "to be determined." If a section cannot be populated from the
  inputs, it must be omitted instead of stubbed.
- **Context Preservation.** Do not alter sections of an existing SPEC.md that
  are already locked unless the incoming inputs explicitly note an override or
  revision of that requirement.
- **Structural Invariance.** Always output the full, updated document. The
  spec must be self-contained and readable without reference to the
  conversation history.

## Suggested Next Skill

After compiling or updating the SPEC.md, suggest:

> **Next step -> Spec Audit**: Review the draft specification for
> contradictions, gaps, and risks before sign-off.

[spec-schema]: references/spec-schema.md
