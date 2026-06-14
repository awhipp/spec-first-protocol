# Spec-First Protocol Personas

This directory (`sfp-personas/`) contains **Persona** configurations that tailor the behavior, prompt style,
and output schema of the Spec-First Protocol to specific domains or use cases (e.g., Stock Trading,
Travel Planning, RPG Campaigns).

## How It Works

Personas allow SFP skills to act as specialized domain experts without hard-coding domain knowledge
into the core agnostic skills.

1. **Dynamic Detection**: When `sfp-discover` or `sfp-orchestrate` runs, it scans this directory for
   Persona files. By matching your initial request against the `domain` and `description` defined in
   the Persona metadata, it automatically recommends the best fit.
2. **State Lock**: Once a Persona is selected (or manually chosen), the skill writes the persona's
   slug into the `.sfp/<slug>/status.md` file (e.g., `persona: travel-advisor`).
3. **Behavior Adoption**: Downstream skills (`sfp-audit`, `sfp-refine`) dynamically read this state
   lock and apply the instructions defined in that Persona, adapting their interviewing style,
   enforcing domain-specific rules, and injecting custom templates.

## Adding Custom Personas

You can add your own custom Personas to this directory. The Spec-First Protocol updater scripts
are designed to preserve any custom local Personas you create here during synchronization.

The easiest way to get started is to duplicate the included template file:
`cp _TEMPLATE.md my-custom-persona.md`

A Persona file must be a valid Markdown file containing YAML frontmatter. Ensure the frontmatter
includes a `name`, `domain`, and `description` to enable intelligent matching.

### Persona Markdown Schema

The body of the Markdown file must follow this schema structure:

```markdown
---
name: <Human Readable Name>
description: <Short description of the persona's expertise for matching>
domain: <Target domain, e.g., Stock Trading, Travel Planning>
---

# Persona Name

## 1. Discovery Prompts
Instructions and targeted guidelines for the discovery agent during requirements gathering
(e.g., "Ask about venue capacity and load-in times").

## 2. Specification Template
Customized sections and schema structural modifications to append or inject into the default
specification format (e.g., adding a "Run-of-Show" section).

## 3. Auditing Rules
Specific edge cases, risks, constraints, and audit verification guidelines for this domain. Defines
when the auditor should raise Blockers, Warnings, or Suggestions.

## 4. Tone & Style
Directives for the agent's communication style (e.g., "Professional and hospitable",
"Use event management terminology").

## 5. Anti-Patterns
Explicit instructions on what the agent should *never* ask or include (e.g., "Do not ask about
APIs or software architecture").

## 6. Knowledge Context
Baseline domain definitions and a glossary. This prevents the agent from asking the user to define
basic industry terms.

## 7. Downstream Guidance (Optional)
Domain-specific instructions for downstream execution agents. When present,
the audit skill synthesizes this with the spec's Deliverables section into
a Downstream Execution Prompt appended to the locked specification.
```
