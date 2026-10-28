# ULoans API Contract (Frontend Reference)

## Purpose and status
This document records the currently known frontend-facing contract. Verify it against the backend source and actual responses before relying on details marked **VERIFY**. If code and this document disagree, report the mismatch and update this document only after confirming the intended behavior.

## Base URL
`http://localhost:8080/api/v1`

Use one central API client configuration rather than repeating the base URL in components. Confirm environment-variable conventions in the actual repository before introducing one.

## Response envelope
Known intended success envelope:
```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

Known intended error envelope:
```json
{
  "success": false,
  "message": "..."
}
```

**VERIFY:** Actual backend responses may differ by endpoint or error middleware. Inspect controller and error-handler code before coding against optional fields.

## Endpoints

| Method | Path | Auth | Expected status | Request body | Purpose |
|---|---|---:|---:|---|---|
| `POST` | `/auth/register` | Public | `201` | `{ name, email, password }` | Create an account |
| `POST` | `/auth/login` | Public | `200` | Verify backend schema | Authenticate a user |
| `GET` | `/profile` | Private | `200` | None | Get current user's profile |
| `POST` | `/loans` | Private | `201` | `{ amount, tenor }` | Create a loan application |
| `GET` | `/loans` | Private | `200` | None | List current user's loans |
| `POST` | `/loans/:loanId/cancellation` | Private | `200` | None expected | Cancel an eligible loan |

## Validation rules currently specified
- Registration name: required, minimum 2 characters.
- Registration email: required, valid format, unique.
- Registration password: minimum 6 characters.
- Loan amount: positive and minimum Rp500,000.
- Loan tenor: one of `3`, `6`, `12`, `24` months.
- Loan statuses: `PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`.
- Only the owner of a loan in `PENDING` status may cancel it; the backend enforces this.

## Authentication
- Private requests require the backend's supported authentication mechanism.
- A Bearer JWT is the intended mechanism, but inspect middleware and login response before implementing the interceptor.
- **VERIFY:** The exact token property in the login response is not yet confirmed.
- **VERIFY:** Token persistence strategy is not decided. Do not choose `localStorage`, `sessionStorage`, or cookie-based auth without evaluating security and backend/CORS/CSRF compatibility.
- A `401` response should trigger the agreed expired-session behavior, without creating redirect loops.

## Frontend integration rules
1. Keep HTTP calls in an API/service layer rather than inside reusable presentation components.
2. Type or otherwise validate the data shape at the boundary if the project uses TypeScript; do not invent fields.
3. Treat backend responses as the source of truth for IDs, statuses, ownership, and eligibility.
4. Distinguish validation errors, authentication errors, server errors, and network failures where the response permits it.
5. Do not log passwords, tokens, or sensitive personal data.
6. Verify real responses with backend source, tests, or an API client before marking integration complete.

## Contract verification checklist
- [ ] Confirm the backend port and API prefix.
- [ ] Inspect registration and login request validators.
- [ ] Record the exact login response and credential field.
- [ ] Inspect auth middleware and expected `Authorization` header format.
- [ ] Record exact profile response fields.
- [ ] Record exact loan list/create/cancel response fields.
- [ ] Confirm error envelope and status codes for invalid input, duplicate email, unauthorized requests, missing loans, and invalid cancellation.
- [ ] Test representative responses against the running backend.
