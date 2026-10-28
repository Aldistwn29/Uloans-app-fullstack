# ULoans Frontend — Product Requirements

## 1. Product overview
ULoans is a web interface for users to register, sign in, view their profile, submit loan applications, review their own loan applications, and cancel eligible applications. The frontend consumes an existing Express API; it must not implement authoritative financial or authorization rules in the browser.

## 2. Primary user journey
1. A visitor creates an account.
2. The user signs in.
3. The application establishes an authenticated session using the backend's verified authentication contract.
4. The user views their profile and loan list.
5. The user submits a loan application with an amount and tenor.
6. The user may cancel a loan only while its status is `PENDING`; the backend decides whether cancellation is allowed.
7. The user receives clear feedback for success, validation errors, authentication errors, and server/network failures.

## 3. Scope
### In scope
- Registration and login forms.
- Authenticated route handling and logout behavior, based on the verified auth design.
- Profile display.
- Loan list with status and relevant application details returned by the API.
- Loan application form.
- Cancellation action for eligible pending loans.
- Responsive layouts, accessible form controls, and clear loading/empty/error states.

### Out of scope unless separately approved
- Admin or staff workflows.
- Approving or rejecting applications from the frontend.
- Credit scoring or loan eligibility calculations not explicitly exposed by the backend contract.
- Editing backend rules or database schema.
- Payment processing or disbursement.

## 4. Functional requirements

### Registration
- Fields: name, email, password.
- Name is required and has at least 2 characters.
- Email is required and must be syntactically valid.
- Password is required and has at least 6 characters.
- Show field-level feedback where practical and a useful message for API failures.
- Treat uniqueness as a backend-enforced constraint; translate the backend error into understandable UI feedback.

### Login
- Fields: email and password, subject to the actual backend contract.
- Prevent accidental repeated submissions while a request is pending.
- On success, handle the returned authentication credential/session according to the verified backend contract.
- On failure, show a useful message without exposing sensitive implementation details.
- Do not assume the JWT response field name until it is inspected in backend code or verified API documentation.

### Profile
- Request the authenticated profile from `GET /profile`.
- Handle loading, success, expired/invalid authentication, and network/server failure states.
- Render only fields confirmed by the API response.

### Loan list
- Request the authenticated user's loans from `GET /loans`.
- Show an intentional empty state when there are no loans.
- Display the status returned by the backend; do not infer or fabricate a status.
- Keep loan ownership enforcement on the backend.

### Create loan
- Fields: amount and tenor.
- Amount must be positive and at least Rp500,000.
- Tenor options: 3, 6, 12, or 24 months.
- Prevent duplicate submission while pending.
- On success, provide feedback and refresh or update the list using the actual API response.
- Do not add frontend eligibility calculations that are not part of the agreed requirements.

### Cancel loan
- Offer the cancel action only for a loan whose displayed status is `PENDING`, as a UX affordance.
- Call `PATCH /loans/:id/cancel` for the selected loan.
- Explain a failed cancellation clearly. The backend remains authoritative and may reject the action if the status changed or the user does not own the loan.
- For a non-pending loan, the backend message may be `Hanya pinjaman berstatus PENDING yang dapat dibatalkan`.

## 5. Global UX requirements
Every asynchronous feature must consider:
- Initial/loading state.
- Success state or successful navigation.
- Empty state where a collection can be empty.
- Validation and API error state.
- Network failure state.
- Disabled/pending controls to prevent duplicate actions.

## 6. Acceptance criteria
A feature is acceptable when:
- Its behavior matches this document and the verified API contract.
- Relevant success, loading, empty, and error states are covered.
- Keyboard use and accessible labels work for interactive controls.
- Layout remains usable at mobile and desktop widths.
- Relevant checks have been run, or manual verification steps are documented as not yet run.
- No backend security rule is treated as guaranteed by frontend code alone.

## 7. Open decisions to verify
- Exact login response shape and token/session field.
- Token storage/session strategy and backend support for cookies, if applicable.
- Exact profile and loan response fields.
- Currency formatting and loan detail fields available from the API.
- Whether registration automatically signs the user in or redirects to login.
