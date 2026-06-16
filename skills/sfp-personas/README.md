# Spec-First Protocol Personas

This directory (`sfp-personas/`) contains **Persona** configurations that tailor the behavior, prompt style,
and output schema of the Spec-First Protocol to specific domains or use cases (e.g., Stock Trading,
Travel Planning, RPG Campaigns).

## How It Works

Personas allow SFP skills to act as specialized domain experts without hard-coding domain knowledge
into the core agnostic skills.

1. **Dynamic Detection**: When `sfp-discover` or `sfp-orchestrate` runs, it scans the persona folders (project-local,
   user-global, and pre-packaged fallback) for Persona files. By matching your initial request against the `domain`
   and `description` defined in the Persona metadata, it automatically recommends the best fit.
2. **State Lock**: Once a Persona is selected (or manually chosen), the skill writes the persona's
   slug into the `.sfp/<slug>/status.md` file (e.g., `persona: travel-advisor`).
3. **Behavior Adoption**: Downstream skills (`sfp-audit`, `sfp-refine`) dynamically read this state
   lock and load the corresponding persona file from the highest priority scope in which it is found (checking
   Project-Local first, then User-Global, then Pre-packaged). They apply the instructions defined in that Persona,
   adapting their interviewing style, enforcing domain-specific rules, and injecting custom templates.

## Adding Custom Personas

Custom personas can be created and stored in three different scopes:

- **Project-Scoped Custom Personas**: Stored in `.sfp/personas/` in your project root. Safe from upgrades, checkable
  into Git, and shareable with your team.
- **User-Global Custom Personas**: Stored in `~/.sfp/personas/` (e.g. `%USERPROFILE%\.sfp\personas\` on Windows
  or `$HOME/.sfp/personas/` on macOS/Linux). Safe from package upgrades and shared across all your local projects.
- **Pre-packaged Default Personas**: Stored in the colocated `../sfp-personas/` directory (installed globally or
  locally by the package manager).

The easiest way to get started is to use the **SFP Personas** skill (`npx skills use sfp-personas`) to
interactively build or edit a custom persona. The skill will prompt you for the desired scope and compile the
configuration to `.sfp/personas/<slug>.md` or `~/.sfp/personas/<slug>.md` automatically.

Alternatively, you can duplicate the template file manually:
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
