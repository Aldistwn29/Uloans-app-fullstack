# AI-Assisted Frontend Workflow

## Purpose
Use AI to accelerate syntax and implementation while keeping the developer responsible for requirements, decisions, execution, testing, and understanding. Optimize for correct, maintainable increments—not maximum generated code.

## 1. Context is limited
- Start with the smallest context that can answer the current task.
- Inspect the actual source before assuming how the application works.
- Read only the relevant documentation, then retrieve more context when a concrete question requires it.
- Prefer concise summaries, file paths, and exact excerpts over repeatedly pasting the entire project specification.
- Separate verified facts, assumptions, and recommendations.
- If context becomes long, summarize durable decisions, current state, unresolved questions, and next step. Do not preserve irrelevant conversation history.

## 2. Four-stage loop

### Stage A — Explore (no edits)
Ask the agent to inspect relevant files and report:
- Current behavior and data flow.
- Relevant file paths.
- Confirmed API/schema details.
- Unknowns and conflicts.
- The smallest likely change.

Example:
> Inspect the existing login flow and relevant backend endpoints. Do not edit files. Report the verified request/response contract, current implementation, and unknowns. Separate facts from assumptions.

### Stage B — Plan (no edits yet)
Ask for:
- A narrowly scoped implementation plan.
- Files likely to change and why.
- Edge cases and acceptance criteria.
- Verification commands and manual test steps.
- Any decision requiring developer approval.

Example:
> Propose the smallest implementation for the login form using existing project conventions. List affected files, state flow, error cases, acceptance criteria, and verification steps. Do not code yet. Ask before changing auth architecture or adding dependencies.

### Stage C — Implement (small scope)
Approve one coherent increment. Ask the agent to:
- Edit only the agreed scope.
- Explain unfamiliar syntax and important design choices.
- Avoid unrelated refactors.
- Identify assumptions rather than filling gaps with invented API details.

Example:
> Implement only the approved login form. Keep API access in the existing service layer. Explain the unfamiliar React syntax and do not change unrelated files.

### Stage D — Verify and review
The developer runs the suggested commands and exercises the feature. Ask the agent to review actual outputs and the diff.

Example:
> Review this diff against the acceptance criteria. Separate confirmed defects from optional improvements. Give me a manual test checklist. Do not claim tests passed unless their output is available.

## 3. Developer responsibilities
For every increment, the developer should be able to answer:
1. What behavior did I ask for?
2. Which files changed and why?
3. How does data move from UI to API and back?
4. What happens on success and failure?
5. How did I verify it?
6. What is still unknown or incomplete?

If any answer is unclear, pause and ask for an explanation before adding more code.

## 4. Work in vertical slices
Prefer a thin end-to-end feature over generating many disconnected components. For example:
1. Verify API contract.
2. Build one form.
3. Connect it to the service/API client.
4. Handle pending and error states.
5. Run checks and manually test.
6. Review and document durable decisions.

Avoid asking the agent to build the whole frontend in one pass.

## 5. Progressive disclosure for project context
- Keep stable, cross-cutting rules in `AGENTS.md`.
- Keep product requirements, API details, architecture, standards, and workflow in their dedicated documents.
- Read only what applies to the current task.
- Update a document when a durable decision or verified contract changes; do not write down every temporary thought.
- If a document and code conflict, investigate and resolve the conflict explicitly.

## 6. Stop conditions
Pause and ask the developer when the task requires an unapproved choice about:
- Authentication/token storage, cookies, CORS, or CSRF.
- New dependencies or major architectural patterns.
- Changes to backend/API contracts.
- Destructive commands, environment secrets, or broad refactors.
- Product behavior that is not specified.

## 7. Definition of done
- Acceptance criteria are met.
- The developer has run or explicitly deferred the relevant checks.
- Results are reported honestly.
- The diff is reviewed for scope, errors, and maintainability.
- Remaining assumptions and issues are documented.
- The developer can explain and manually verify the feature.
