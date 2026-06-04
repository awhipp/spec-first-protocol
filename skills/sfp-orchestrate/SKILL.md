---
name: Spec Orchestrate
description: >
  Run the full Spec-First Protocol pipeline in a single session.
  Orchestrates discover, audit, and refine skills without context
  clearing between phases.
---

# Spec Orchestrate

## Purpose

You are running the **complete Spec-First Protocol pipeline** in a single,
continuous conversation. Instead of invoking each skill separately with
context clearing between phases, this skill orchestrates the full
Discover → Audit → Refine → Lock cycle without interruption.

You will execute each phase by reading and following the instructions in
the corresponding skill file. This orchestrator defines **when** to
transition between phases; the individual skills define **how** each
phase operates.

## When to Use This Skill

Use this orchestrator when:

- The specification scope is moderate (not expected to produce an
  exceptionally long interview or audit trail).
- The context window of the active model is large enough to hold the
  full conversation across all phases.

If context window pressure is a concern, or the specification is very
large, use the individual skills separately instead:
**Spec Discover** → **Spec Audit** → **Spec Refine**, clearing context
between each invocation.

## Pipeline Overview

The protocol follows a structured loop across four sequential phases:

1. **Phase 1: Discovery** – Conduct a structured interview to extract
requirements and compile the initial specification draft.
2. **Phase 2: Audit** – Perform an adversarial review of the specification
draft. If findings/issues exist, transition to Phase 3. If the audit is clean
and the owner approves, transition to Phase 4.
3. **Phase 3: Refinement** – Resolve findings incrementally with the owner,
update discovery notes, and recompile the specification. Once recompiled,
cycle back to Phase 2 (Audit) for verification.
4. **Phase 4: Lock** – Finalize and lock the specification, removing the draft
suffix and cleaning up the working directory.

## Execution Instructions

### Phase 1: Discovery

Read and follow the instructions in the
[Spec Discover skill](../sfp-discover/SKILL.md).

Execute the full discovery process: initialization, structured interview,
Discovery Notes, compilation gate, and specification compilation.

**Phase exit condition:** The project owner has approved compilation and
the draft specification file (`YYYY-MM-DD_<SLUG>_SPEC_DRAFT.md`) has
been written to the project root.

**Transition:** Announce to the project owner that the discovery phase is
complete and the protocol is moving to the audit phase. Then proceed
directly to Phase 2.

---

### Phase 2: Audit

Read and follow the instructions in the
[Spec Audit skill](../sfp-audit/SKILL.md).

Execute the full audit process: load the specification and Discovery
Notes, perform the adversarial review, classify findings, and produce the
Audit Report.

**Phase exit conditions:**

- **Clean audit (zero blockers) + owner approves →** Proceed to Phase 4
  (Lock). The audit skill handles finalization, immutability, and
  cleanup.
- **Findings exist →** Announce to the project owner that the protocol
  is moving to the refinement phase. Then proceed to Phase 3.

---

### Phase 3: Refinement

Read and follow the instructions in the
[Spec Refine skill](../sfp-refine/SKILL.md).

Execute the full refinement process: prioritize findings, walk through
each one with the project owner, record decisions, handle scope
expansion, and recompile the specification.

**Phase exit condition:** The updated specification has been recompiled
and written.

**Transition:** Announce to the project owner that refinement is complete
and the protocol is cycling back to audit. Then return to Phase 2.

---

### Phase 4: Lock (Finalization)

This phase is handled entirely by the audit skill's **Finalization Gate**
(executed during Phase 2 when the audit is clean). No separate action is
needed from this orchestrator.

When the audit skill completes finalization:

1. The specification file is renamed (removing `_DRAFT`).
2. The `.sfp/` working directory is cleaned up.
3. The protocol is complete.

Announce to the project owner that the Spec-First Protocol pipeline is
finished and the locked specification is ready for downstream execution.

## Override Directive

When executing each phase above, **ignore the "Suggested Next Skill"
section** at the end of each individual skill's instructions. Do not
suggest clearing context or starting a fresh session. Phase transitions
are managed by this orchestrator, not by the individual skills.

All other instructions, guardrails, and behavioral rules defined in each
skill must be followed exactly as written.

## Orchestration Guardrails

- **No phase skipping.** Every specification must pass through Discovery
  before Audit, and through Audit before Lock. Do not skip phases even
  if the project owner requests it.
- **Announce transitions.** When moving between phases, explicitly tell
  the project owner which phase is ending and which is beginning. This
  maintains orientation in a long conversation.
- **Preserve all skill guardrails.** The individual skills define
  guardrails (No Solutions, Contradiction Blocker, Scope Creep
  Containment, Zero Solution Design, No Silent Passes, etc.). All of
  these remain in full effect during orchestrated execution.
- **Context monitoring.** If the conversation becomes very long and the
  model's responses begin to degrade in quality (repetition, missed
  details, or inconsistencies), recommend to the project owner that they
  continue with the individual skills in separate sessions, using the
  `.sfp/` working files as the handoff mechanism.
- **Downstream Execution Boundary.** Once the specification is final and
  locked, the pipeline is complete. You must NOT automatically begin planning,
  task creation, or code modifications. You must announce completion and stop,
  prompting the user for next steps or waiting for their explicit instruction.
