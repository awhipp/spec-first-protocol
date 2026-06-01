# Contribution Guidelines

## How to Contribute

1. **Open an Issue**: Report bugs, identify inconsistencies, or propose
   features by opening an issue that describes the problem or proposal.
2. **Fork and Branch**: Fork the repository and create a feature branch from
   `main`.
3. **Follow Conventions**: Ensure all Markdown files comply with the
   [.markdownlint.json][markdownlint-config] configuration. Skill definitions
   must adhere to the Agent Skills standard, with each skill directory
   containing a `SKILL.md` file with a YAML front matter block specifying
   `name` and `description` fields. All skills must also meet the size
   constraints documented in the [Skill Authoring Standards][standards]
   section of the README.
4. **Submit a Pull Request**: Open a pull request against `main` containing a
   description of the changes.

## Scope of Contributions

- **Skill Refinements**: Improvements to skill instructions, guardrails, or
  suggested workflows in any `SKILL.md` file located under `skills/`.
- **Reference Materials**: Enhancements to schema or format files in skill
  reference directories.
- **Documentation**: Improvements to [README.md][readme], installation
  instructions, or examples.
- **New Skills**: Proposals for additional skills, structured as directories
  containing a `SKILL.md` and optional supporting assets.
- **Framework Integrations**: Setup guides or adapter scripts for additional AI
  agent platforms.

## Code of Conduct

Contributors must engage respectfully, constructively, and collaboratively.
Interactions containing personal attacks or bad-faith criticisms will not be
accepted.

[markdownlint-config]: .markdownlint.json
[readme]: README.md
[standards]: README.md#skill-authoring-standards
