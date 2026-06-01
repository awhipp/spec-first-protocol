# Skills Directory

This directory includes the core [Agent Skills](https://agentskills.io/home) of
the Spec-First Protocol (SFP).

## Execution Modes

SFP supports two execution modes. The protocol flow is the same
regardless of which mode you choose.

**Multi-Context (Core Flow):** Invoke each skill individually, clearing
context between phases. Recommended for large specifications or
constrained context windows.

**Single-Context:** Invoke the **Spec Orchestrate** skill to run the
full pipeline in one continuous conversation. Best when context window
management is not a concern.

## Skills

| Skill | Description |
| :--- | :--- |
| [SFP-orchestrate/](sfp-orchestrate/SKILL.md) | **Spec Orchestrate**: Runs the full protocol pipeline (discover → audit → refine → lock) in a single conversation by delegating to the individual skills below. |
| [SFP-discover/](sfp-discover/SKILL.md) | **Spec Discover**: Conducts a structured discovery interview with the project owner to extract requirements, generating Discovery Notes and compiling them into a draft specification file. |
| [SFP-audit/](sfp-audit/SKILL.md) | **Spec Audit**: Performs an adversarial review of a draft specification against the validated Discovery Notes to identify contradictions, gaps, and risks, and manages the finalization gate to lock the specification. |
| [SFP-refine/](sfp-refine/SKILL.md) | **Spec Refine**: Walks through audit findings incrementally with the project owner to resolve issues, records decisions, and recompiles the draft specification. |
