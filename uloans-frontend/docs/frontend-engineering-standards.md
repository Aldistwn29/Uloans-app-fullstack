# Frontend Engineering Standards

## 1. Core principles
- Readability before cleverness.
- Explicit behavior before implicit magic.
- Small components with cohesive responsibilities.
- Consistency with existing conventions.
- Testable changes with visible evidence.
- No abstraction without a current, concrete use case.

## 2. React components
- Use function components and hooks consistently with the project.
- Keep components focused; split a component when it has multiple independent responsibilities or becomes difficult to reason about.
- Pass required data and callbacks through clear props.
- Use stable keys when rendering lists; do not use array indices as keys when items can be inserted, removed, or reordered.
- Do not mutate React state directly; create the appropriate updated value.
- Avoid duplicating values that can be derived from existing props or state.
- Do not add `useEffect` for derived values or event handling that can be performed directly in render or an event handler.

## 3. Naming and file organization
- Follow the naming style already used in the repository.
- Use names that express domain intent, such as `LoanList` or `cancelLoan`, rather than vague names such as `DataBox` or `handleThing`.
- Keep feature-specific code near the feature when practical.
- Avoid generic `utils` functions unless they are truly reusable.
- Keep components, API calls, and formatting responsibilities distinct where this improves clarity.

## 4. API and async behavior
- Use a shared API client and feature-level service functions rather than duplicating raw HTTP setup across components.
- Handle loading, success, empty, validation, API, and network states where relevant.
- Disable submit/action controls while their request is pending to prevent duplicate requests.
- Do not assume all failures have the same shape; inspect the actual API contract and normalize errors deliberately.
- Do not silently suppress errors.
- Avoid retry loops or automatic retries for mutations unless explicitly designed and safe.
- Refresh or update displayed data after mutations using verified response data or a clear refetch strategy.

## 5. Forms and validation
- Every input has a visible or programmatic label.
- Validate obvious constraints client-side for usability, but treat backend validation as authoritative.
- Associate validation feedback with the relevant field where possible.
- Preserve user-entered values after recoverable errors unless there is a security reason not to.
- Use appropriate input types and autocomplete attributes when useful.
- Make pending and disabled states perceivable.

## 6. Security and domain rules
- Never put secrets or private keys in frontend source or environment variables exposed to the client.
- Do not log credentials or JWTs.
- Do not rely on a hidden button or route guard to enforce authorization.
- The backend decides authentication, loan ownership, allowed status transitions, and financial rules.
- Escape/render user-provided text safely; do not use unsafe HTML injection for ordinary UI.
- Token storage and cookie/CSRF choices require explicit review against the actual backend.

## 7. Accessibility and responsive design
- Prefer semantic HTML elements.
- Ensure interactive controls work by keyboard and have meaningful accessible names.
- Do not use color alone to communicate loan status or errors.
- Maintain visible focus indicators and sufficient text contrast.
- Ensure layouts remain usable on narrow screens and do not rely on hover alone.
- Use icons to support meaning, not as the only label for an important action.

## 8. Styling
- Follow the configured Tailwind CSS version and existing conventions.
- Reuse repeated patterns when it improves consistency, but avoid creating a design system before repeated needs exist.
- Avoid conflicting one-off style approaches without a reason.
- Keep conditional styling readable; extract complex class logic only when it improves comprehension.

## 9. Dependencies and tooling
- Inspect `package.json` and lockfile before using a package or recommending a command.
- Do not install a package for functionality that can be implemented clearly with existing tools.
- Explain the benefit, cost, and alternative before adding a dependency.
- Use the repository's existing formatter, lint, test, and build scripts when available.

## 10. Change review checklist
- [ ] Change is limited to the requested scope.
- [ ] Naming and conventions are consistent.
- [ ] Loading, empty, success, and error states are handled where relevant.
- [ ] API assumptions match verified backend behavior.
- [ ] No sensitive data is logged or exposed.
- [ ] Keyboard and responsive behavior are considered.
- [ ] No redundant state, unnecessary Effects, or premature abstractions were added.
- [ ] Relevant checks were actually run and results reported accurately.
- [ ] Developer can explain the data flow and how to verify the feature.
