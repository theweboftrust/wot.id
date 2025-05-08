# wot.id Migration Checklist (Clean Slate)

## Purpose
Migrate only atomic, reviewed UI fragments (e.g., CSS) from wot.id_0.1 to the new wot.id, ensuring zero legacy logic or technical debt.

## Steps
- [ ] Identify atomic CSS/SCSS files in `wot.id_0.1/styles` or equivalent.
- [ ] Manually review each file for legacy selectors, dependencies, or logic.
- [ ] Copy only approved files into `wot.id/styles`.
- [ ] Confirm no JS/TS logic is ported unless 100% principle-compliant and reviewed.
- [ ] Run linter/static analysis to ensure no legacy imports or patterns.
- [ ] Document rationale for each migrated file in this checklist.
- [ ] Update `/styles/README.md` with migration status and usage notes.

## Rules
- No legacy JS/TS logic, no EVM/AppKit/Ceramic remnants.
- All migrated styles must be modular and atomic.
- Document every migration decision.
