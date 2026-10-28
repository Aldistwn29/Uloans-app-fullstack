# ULoans Frontend — Implementation Plan

## How to use this plan
Treat this as a sequence of small milestones, not a mandate to create every file up front. Inspect the current repository and mark items complete only after verification. Do not begin a later feature while a blocking API/auth uncertainty remains unresolved.

## Milestone 0 — Repository and contract audit
**Goal:** establish what exists and remove critical assumptions.

- [ ] Inspect repository structure, `package.json`, Vite/Tailwind configuration, and existing conventions.
- [ ] Read `AGENTS.md` and relevant docs.
- [ ] Verify backend base URL and API prefix.
- [ ] Confirm login request/response, token field/session behavior, and auth middleware.
- [ ] Confirm profile and loan response shapes and error envelope.
- [ ] Record discrepancies between API behavior and documentation.

**Exit criteria:** frontend implementation can rely on a verified API contract, or remaining unknowns are explicitly recorded and isolated.

## Milestone 1 — App foundation
**Goal:** establish the minimum working application shell.

- [ ] Configure routes using the existing router choice/dependency.
- [ ] Establish global styles and responsive layout conventions.
- [ ] Add only shared UI elements needed by the first feature.
- [ ] Confirm the app starts and builds using scripts verified in `package.json`.

**Exit criteria:** app shell renders, routing works, and relevant checks have been run.

## Milestone 2 — API client and error handling
**Goal:** create a consistent path to the backend.

- [ ] Configure a shared API client and base URL.
- [ ] Normalize API errors only after inspecting actual response behavior.
- [ ] Implement authentication header/session integration only after contract verification.
- [ ] Decide `401` behavior and avoid redirect loops.

**Exit criteria:** a simple request can be made and failures are handled predictably. No token strategy is guessed.

## Milestone 3 — Authentication vertical slice
**Goal:** registration and login work end to end.

- [ ] Build registration form with validation and pending/error states.
- [ ] Build login form with validation and pending/error states.
- [ ] Connect forms to auth service functions.
- [ ] Implement verified session persistence and logout behavior.
- [ ] Test invalid credentials, duplicate email, and network/server failures.

**Exit criteria:** happy and failure paths are manually verified against the running backend.

## Milestone 4 — Protected profile
**Goal:** authenticated users can see their own profile.

- [ ] Add route guard for user experience.
- [ ] Fetch profile through a service.
- [ ] Handle loading, `401`, network error, and success.
- [ ] Verify private endpoint access is enforced by backend.

**Exit criteria:** profile works for an authenticated session and expired/invalid auth is handled.

## Milestone 5 — Loan list
**Goal:** display the authenticated user's loans.

- [ ] Fetch loan list from the verified endpoint.
- [ ] Render relevant fields confirmed by the API response.
- [ ] Handle loading, empty, error, and success states.
- [ ] Display statuses consistently and responsively.

**Exit criteria:** loan list handles empty and populated responses without fabricated data.

## Milestone 6 — Create and cancel loans
**Goal:** complete the supported loan actions.

- [ ] Create form with amount and tenor validation.
- [ ] Submit to the backend and prevent duplicate submissions.
- [ ] Refresh/update list after successful creation.
- [ ] Show cancel action only for displayed `PENDING` loans.
- [ ] Handle cancellation success and backend rejection.
- [ ] Verify ownership/status rules remain backend-enforced.

**Exit criteria:** create/cancel flows and relevant error paths are manually verified.

## Milestone 7 — Quality and handoff
**Goal:** leave a reviewable, maintainable project.

- [ ] Run available lint, test, and build scripts.
- [ ] Test keyboard navigation and responsive layouts.
- [ ] Review API assumptions, error handling, and sensitive-data handling.
- [ ] Remove debug code and unrelated changes.
- [ ] Update docs for durable decisions and verified contract changes.
- [ ] Record remaining defects and follow-up work.

**Exit criteria:** actual check results are documented, the diff is reviewed, and the developer can explain how to run and test the app.
