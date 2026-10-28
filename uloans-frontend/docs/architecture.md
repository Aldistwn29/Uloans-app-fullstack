# ULoans Frontend — Architecture

## 1. Architecture goals
- Make data flow easy to follow for a junior developer and future teammates.
- Separate presentation, page orchestration, API access, and shared application state where useful.
- Keep the architecture proportional to the current application; do not introduce layers or state libraries without a demonstrated need.

## 2. Technology baseline
- React + Vite.
- React Router for page navigation and protected routes, if present in the project dependencies.
- Tailwind CSS v4 for styling, if configured in the repository.
- Axios for HTTP communication, if selected and installed.
- Lucide React for icons, if selected and installed.

These are the intended tools, not proof of what is currently installed. Inspect `package.json` and configuration before using them.

## 3. Suggested responsibility boundaries
Adapt these to the existing repository instead of restructuring blindly.

- **Pages/routes:** compose page-level UI and coordinate page state.
- **Components:** reusable visual elements with focused props and behavior.
- **API client:** base URL, shared headers, and common transport configuration.
- **Feature services:** endpoint-specific calls such as auth, profile, and loans.
- **Auth/session module:** centralizes the verified session/token behavior.
- **Shared utilities:** small, genuinely reusable formatting or validation helpers.

A possible structure:
```text
src/
  app/
    router.jsx
  components/
  features/
    auth/
      pages/
      components/
      auth.service.js
    profile/
      profile.service.js
    loans/
      pages/
      components/
      loans.service.js
  lib/
    api-client.js
  utils/
  styles/
```

This is a starting point, not a requirement to create every folder in advance. Add a file when a concrete feature needs it.

## 4. Data flow
1. A user interacts with a page or component.
2. The page/feature handler validates the form for user experience.
3. A feature service calls the API client.
4. The API client sends the request to the Express backend.
5. The service returns normalized response data or a consistently handled error.
6. React state updates and the UI renders the resulting loading, success, empty, or error state.

Do not mirror the entire server response into multiple independent state variables. Keep state as close as practical to the component or feature that owns it.

## 5. Routing and authentication
- Public pages: registration and login.
- Private pages: profile and loan functionality.
- A route guard may redirect unauthenticated users for usability.
- Route guards are not authorization controls; private API endpoints must enforce authentication and ownership.
- Handle `401` responses consistently. Avoid repeated redirects, stale auth state, or silently treating network errors as expired sessions.
- Decide token/cookie handling only after verifying the backend's actual implementation and deployment requirements.

## 6. State and Effects
- Prefer local component state for isolated form and page interactions.
- Lift state only when multiple components genuinely need to share it.
- Derive values from existing state instead of storing redundant copies.
- Use Effects to synchronize with external systems, not as a default way to calculate derived UI or handle every click.
- Avoid introducing global state management until real requirements justify it.

## 7. Error boundaries
- Keep transport-level handling in the API client where appropriate.
- Keep feature-specific messages and recovery actions in the feature/page layer.
- Do not swallow errors silently.
- Do not expose stack traces, internal server details, or secrets to end users.

## 8. Architecture decision rule
For any significant new dependency, global state pattern, folder restructuring, or authentication change, explain:
1. The concrete problem.
2. The simplest viable option.
3. The trade-offs.
4. Why existing project patterns are insufficient.
Get approval before making a consequential change.
