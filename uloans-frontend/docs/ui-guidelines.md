ULoans UI Guidelines — VaultLine, bank bjb-inspired palette
1. Purpose and brand direction
Use the VaultLine component principles with a blue-and-yellow palette inspired by the public visual identity of bank bjb. This is a portfolio-project design direction, not an official bank bjb design system and does not imply affiliation, endorsement, or that ULoans is a bank bjb product.

Visual direction: trustworthy, approachable, professional, clear, and modern. Favor a clean banking interface over decorative or luxury styling.
Principles
1. Trust through clarity, consistent interaction, and accurate information.
2. Blue is the primary brand/action color; yellow is a restrained accent.
3. Keep financial information easy to scan and compare.
4. Reuse design tokens and shared components instead of styling each screen independently.
5. Accessibility and responsive behavior are part of the design, not optional polish.
2. Color tokens
The following hex values are proposed implementation tokens inspired by the site's blue/yellow identity, not a claim of exact official bank bjb brand specifications. If official brand assets or a documented brand guide become available, verify and update these tokens centrally.
Token	Value	Usage
Primary Blue	#00529B	Primary buttons, active navigation, links, focus indicators
Blue Hover	#003F78	Hover/pressed primary actions
Blue Dark	#003B70	Strong headings or dark blue surfaces, used sparingly
Accent Yellow	#F5C400	Small highlights, selected metrics, decorative accents
Yellow Soft	#FFF8D6	Soft accent backgrounds when contrast is verified
Page Background	#F7F9FC	Main app background
Surface	#FFFFFF	Cards, forms, panels, dialogs
Text Primary	#1E293B	Main text
Text Secondary	#475569	Supporting text and metadata
Neutral	#9CA3AF	Muted content and inactive controls
Border	#D9E1EA	Default borders
Divider	#E9EEF4	Subtle separators
Soft Surface	#F1F5F9	Hover backgrounds and neutral panels
Success	#15803D	Successful outcomes
Warning	#A16207	Pending actions and attention
Error	#B91C1C	Validation errors and failed operations
Info	#1D4ED8	Informational messages


Color usage rules
- Use Primary Blue for the primary action and current navigation state.
- Yellow is an accent, not the default button fill for every action. Yellow text on white and white text on yellow should not be used unless contrast is verified.
- Do not use brand colors as the only way to communicate state; pair color with a label or icon.
- Semantic colors (success, warning, error, info) retain their meaning and should not be replaced by blue/yellow.
- Check contrast for actual foreground/background combinations before shipping.
3. Typography
Font families
- UI and headings: Inter
- Financial figures and technical values: IBM Plex Mono, selectively
Use a consistent sans-serif system to align with the modern banking direction. Do not use DM Serif Display as the default headline font in this adapted theme; it belongs to the original heritage-serif VaultLine direction and may make the interface feel visually inconsistent.
Style	Font	Size	Line height	Usage
Display	Inter	36–40px	1.15	Main page introduction, sparingly
Headline	Inter	28–32px	1.2	Page title
Subhead	Inter	20–24px	1.3	Section title
Body Large	Inter	18px	1.6	Important supporting text
Body	Inter	16px	1.5–1.6	Default interface text
Body Small	Inter	14px	1.5	Supporting content
Caption	Inter	12px	1.4	Metadata
Overline	Inter	11px	1.4	Section labels
Financial/Code	IBM Plex Mono	13–14px	1.5–1.6	Aligned figures and technical values


Use a clear type hierarchy. Avoid arbitrary font sizes and avoid monospace for long paragraphs.
4. Spacing and layout
Use an 8px base rhythm with this scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px.
- Default card padding: 24px on desktop; reduce appropriately on small screens.
- Button/input horizontal padding: typically 16px.
- Related groups: 24px spacing.
- Major page sections: 32–48px spacing.
- Prefer shared spacing tokens over arbitrary values.
- Ensure primary workflows remain usable on mobile without horizontal scrolling.
5. Radius and elevation
Token	Radius	Usage
None	0px	Designated tables or banners
Small	2px	Inline tags
Medium	4px	Buttons, inputs, standard cards
Large	6px	Dialogs and feature panels
XL	8px	Hero containers and wide cards
Full	9999px	Status dots and circular avatars


Use restrained shadows. A border and surface contrast should do most of the work; avoid heavy shadows and gold glow effects.
- Subtle: 0 1px 3px rgba(15, 23, 42, 0.06)
- Medium: 0 4px 12px rgba(15, 23, 42, 0.08)
- Overlay: 0 16px 40px rgba(15, 23, 42, 0.14)
6. Buttons
Primary
- Background: #00529B
- Text: #FFFFFF
- Hover: #003F78
- Radius: 4px
- Use for the main action in a view.
Secondary
- Background: #FFFFFF
- Text: #00529B
- Border: 1px solid #00529B
- Hover background: #F1F5F9
Ghost
- Transparent background, blue text, no border.
- Hover background: #F1F5F9.
Destructive
- Background: #B91C1C
- Text: #FFFFFF
- Use only for destructive actions such as cancelling an eligible loan, with confirmation when appropriate.
Sizes and behavior
Size	Height	Horizontal padding	Font size	Weight
Small	32px	12–14px	13–14px	600
Medium	40px	20px	14px	600
Large	48px	28px	16px	600


Disabled buttons use reduced opacity, no shadow, and no hover change. Provide visible focus and submitting states. Prevent duplicate submissions for asynchronous actions. Do not use yellow as the default primary button fill.
7. Cards
Default card: white background, 1px solid #D9E1EA border, 4px radius, 24px padding, subtle shadow.

Elevated card: white background, 4px radius, medium shadow; use only when hierarchy requires it.

Interactive cards need a visible focus outline using Primary Blue. Do not imply clickability for non-interactive cards. Avoid unnecessary nested card containers.
8. Inputs and forms
- Background: #FFFFFF
- Default border: 1px solid #D9E1EA
- Text: #1E293B
- Height: 40px minimum
- Radius: 4px
- Padding: approximately 10px vertical and 14px horizontal
- Label: 13–14px, weight 600
- Helper text: 12–13px, color #475569
Hover: border #9CA3AF.

Focus: 2px Primary Blue border/outline, with a visible focus indicator.

Error: 2px #B91C1C border and a readable message associated with the field.

Disabled: muted surface and text, without relying on opacity alone to communicate the state.

Every input needs an associated label, suitable input type, and appropriate autocomplete behavior. Preserve recoverable user input after a failed request. Distinguish validation, server, and network errors. The backend remains authoritative for validation and financial rules.
9. Chips and loan statuses
Filter chips
- Default background: #F1F5F9
- Text: #475569
- Border: 1px solid #D9E1EA
- Radius: 4px
- Active background: #00529B
- Active text: #FFFFFF
Loan status mapping
Backend status	User-facing label	Background	Text
PENDING	Menunggu keputusan	#FEF3C7	#92400E
APPROVED	Disetujui	#DCFCE7	#166534
REJECTED	Ditolak	#FEE2E2	#991B1B
CANCELLED	Dibatalkan	#F1F5F9	#475569


Use 11–12px semibold text, 4px radius, and compact padding. Preserve backend enum values in application logic and translate them into readable labels in the UI. Always communicate status with text as well as color. Do not infer status from client-side calculations.
10. Lists and loan data
For each loan, prioritize:
1. Loan amount
2. Status
3. Tenor
4. Application date, when available
5. An action that is valid for the current status
Use consistent alignment for financial values. Use a responsive list/card layout when a table would be difficult to use on small screens. Provide loading, empty, and error states for data-driven views.
11. Financial formatting
- Format amounts as Indonesian Rupiah (IDR) using Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).
- Keep rounding and fraction-digit rules consistent across the application.
- Use IBM Plex Mono for financial figures when tabular alignment improves readability.
- Use a consistent date locale and timezone policy.
- Do not invent interest rates, fees, repayment schedules, exchange rates, or transaction history.
12. Trust and security
- This is a portfolio project inspired by a banking brand; do not use bank bjb's logo or imply official affiliation without authorization.
- Do not claim regulatory approval, deposit insurance, bank partnerships, or security certifications unless verified and applicable to ULoans.
- Never expose passwords, JWTs, secrets, or sensitive customer data in UI or logs.
- Frontend route guards improve navigation UX; backend authorization remains the security boundary.
- Display security indicators only when they reflect real implemented protections.
- Confirm consequential or destructive actions and provide clear feedback for unauthorized or expired sessions.
13. Motion and accessibility
- Use restrained 150–200ms transitions for meaningful state changes.
- Respect prefers-reduced-motion.
- Use semantic HTML, logical headings, keyboard navigation, visible focus, and accessible labels.
- Never communicate state using color alone.
- Do not place essential instructions only in tooltips.
- Check contrast for text, controls, and focus indicators.
14. AI implementation rules
1. Read this document for UI, layout, styling, or component tasks.
2. Inspect the existing React, Vite, and Tailwind CSS v4 configuration before changing styles.
3. Define reusable color, typography, radius, and spacing tokens in one central location.
4. Use existing project conventions and shared components when practical.
5. Do not add UI libraries, fonts, icon packs, or animation dependencies without explaining the trade-offs.
6. Implement one small, reviewable UI change at a time; do not refactor unrelated files.
7. Treat this palette as a proposed bank bjb-inspired direction, not verified official brand specifications.
8. Verify responsive behavior, keyboard focus, loading/error states, and relevant application behavior.
9. Report checks actually executed; never claim an unrun test passed.
15. Definition of done
A UI change is ready when it follows the shared tokens, works across supported screen sizes, provides appropriate interaction and data states, preserves accessibility, displays financial information accurately, avoids unsupported brand/security claims, and has been reviewed and verified to the extent reported.