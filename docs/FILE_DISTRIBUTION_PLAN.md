# File Distribution Plan: University E-Voting System

This document maps the **Team Implementation Plan** to specific files in the codebase. Each team member should work primarily on these files within their assigned feature branches.

---

## 1. Daniel (Team Lead / DevOps)
**Branch:** `feature/admin-positions`, `feature/voter-import`
**Responsibility:** Admin Dashboard, Position Management, Voter Import.

### Backend Files (`evoting-backend`)
*   `src/controllers/positions.controller.js` (CRUD logic for positions)
*   `src/routes/positions.routes.js` (API endpoints)
*   `src/controllers/voters.controller.js` (CSV import logic)
*   `src/routes/voters.routes.js`
*   `prisma/schema.prisma` (Schema updates for Positions/Voters)

### Mobile Files (`evoting-mobile`)
*   `screens/AdminDashboardScreen.js` (Main Admin Hub)
*   `screens/AdminPositionsScreen.js` (List positions)
*   `screens/AdminCreatePositionScreen.js` (Add position form)
*   `screens/AdminEditPositionScreen.js` (Edit position form)
*   `screens/AdminVotersScreen.js` (Voter list & Import UI)

---

## 2. Mable (Auth Specialist)
**Branch:** `feature/otp-auth`, `feature/voter-login`
**Responsibility:** Voter Authentication, OTP System.

### Backend Files (`evoting-backend`)
*   `src/controllers/verification.controller.js` (OTP generation & validation)
*   `src/routes/verification.routes.js`
*   `src/utils/smsService.js` (Mock SMS logic)
*   `src/utils/emailService.js` (Email logic)
*   `src/controllers/auth.controller.js` (General auth helpers)

### Mobile Files (`evoting-mobile`)
*   `screens/VoterLoginScreen.js` (Reg No input & OTP entry)
*   `screens/LoginScreen.js` (General login for Admin/Candidates)
*   `screens/WelcomeScreen.js` (Landing page)

---

## 3. Ken (Candidate Lead)
**Branch:** `feature/candidate-nomination`
**Responsibility:** Candidate Registration, Dashboard, Profile Management.

### Backend Files (`evoting-backend`)
*   `src/controllers/candidates.controller.js` (Submission logic)
*   `src/routes/candidates.routes.js`
*   `src/middleware/upload.js` (File upload configuration - create if missing)
*   `uploads/` (Directory for storing photos/manifestos)

### Mobile Files (`evoting-mobile`)
*   `screens/CandidateDashboardScreen.js` (Status tracking)
*   `screens/EditCandidateProfileScreen.js` (Form for bio, photo, manifesto)
*   `screens/ManifestoViewerScreen.js` (PDF viewing)

---

## 4. Christine (Voting Lead)
**Branch:** `feature/voting-engine`
**Responsibility:** Voting Logic, Ballot Tokens, Voting UI.

### Backend Files (`evoting-backend`)
*   `src/controllers/votes.controller.js` (Vote casting & validation)
*   `src/routes/votes.routes.js`
*   `src/controllers/verification.controller.js` (Ballot token issuance)

### Mobile Files (`evoting-mobile`)
*   `screens/DashboardScreen.js` (Voter Dashboard / Ballot)
*   `screens/CandidateProfileScreen.js` (View candidate before voting)
*   `screens/VotingScreen.js` (The actual voting wizard - *Create if missing*)

---

## 5. Esther (Analytics Lead)
**Branch:** `feature/analytics-reports`
**Responsibility:** Results, Reports, Exports, Seeding.

### Backend Files (`evoting-backend`)
*   `src/controllers/reports.controller.js` (Aggregating results)
*   `src/routes/reports.routes.js`
*   `prisma/seed.js` (Data seeding script)
*   `src/utils/pdfGenerator.js` (Report generation logic - *Create if missing*)

### Mobile Files (`evoting-mobile`)
*   `screens/ResultsScreen.js` (Charts & Tables)

---

## 6. Trevor (Officer / Security)
**Branch:** `feature/officer-approval`, `feature/audit-logs`
**Responsibility:** Officer Dashboard, Audit Logs, Security.

### Backend Files (`evoting-backend`)
*   `src/controllers/users.controller.js` (Officer management)
*   `src/utils/auditLogger.js` (Logging utility)
*   `src/middleware/auth.middleware.js` (RBAC enforcement)
*   `src/controllers/candidates.controller.js` (Approval/Rejection logic)

### Mobile Files (`evoting-mobile`)
*   `screens/AdminCreateOfficerScreen.js`
*   `screens/AuditLogScreen.js` (Log viewer)
*   `screens/AdminCandidatesScreen.js` (For Officer to view/approve candidates)

---

## Shared Files (Collaborative)
*   `backend/package.json` (Dependencies)
*   `mobile/package.json` (Dependencies)
*   `mobile/App.js` (Navigation - *Careful with merge conflicts!*)
*   `backend/src/app.js` or `server.js` (Main entry point)

**Note:** When modifying shared files, communicate in the group chat to avoid conflicts.
