# Team Implementation Plan: University E-Voting System (Advent 2025)

**Project:** Secure Auditable E-Voting System  
**Team Size:** 6 Members  
**Duration:** 2 Weeks  
**Repositories:** 2 (Backend API, Mobile/Frontend)

---

## 1. Team Roles & Responsibilities

To ensure **individual contribution** and **collaboration**, the workload is distributed by feature modules. Each member owns a "vertical slice" (Backend + Frontend) or specific horizontal layers where applicable.

| Member | Role | Primary Responsibility | Key Modules |
| :--- | :--- | :--- | :--- |
| **Daniel** | **Team Lead / DevOps** | Architecture, Admin Dashboard, Integration | Repo Setup, CI/CD, Admin Dashboard, Position Management |
| **Mable** | **Auth Specialist** | Voter Authentication, OTP System | Voter Login, OTP Service, Email/SMS Integration |
| **Ken** | **Candidate Lead** | Nomination Flow, Candidate Dashboard | Candidate Registration, File Uploads (Manifesto/Photo) |
| **Christine** | **Voting Lead** | Voting Engine, Ballot Security | Ballot Token Logic, Voting Wizard UI, Vote Casting |
| **Esther** | **Analytics Lead** | Reporting, Results, Exports | Results Dashboard, Charts, CSV/PDF Export, Load Testing |
| **Trevor** | **Officer / Security** | Officer Dashboard, Audit Logs | Officer Approval Flow, Audit Logging System, Security Hardening |

---

## 2. Repository & Workflow Strategy

**Guideline:** Two separate repositories are required.

1.  **`evoting-backend`**: Node.js/Express/Prisma/MySQL
2.  **`evoting-mobile`**: React Native (Expo)

**Branching Strategy:**
*   `main`: Production-ready code.
*   `develop`: Integration branch.
*   `feature/feature-name`: Individual work branches (e.g., `feature/otp-auth`, `feature/candidate-upload`).

**Collaboration Rules:**
*   **Pull Requests (PRs):** Every feature must be merged via PR.
*   **Review:** Another team member must review the PR before merging (e.g., Mable reviews Daniel's code).
*   **Commits:** Use semantic commit messages (e.g., `feat: implement otp generation`, `fix: resolve login bug`) to prove individual contribution.

---

## 3. Iterative Implementation Plan (Milestones)

### Milestone 1: Discovery & Architecture (Completed/Refining)
*   **Goal:** Project setup and documentation.
*   **Assignments:**
    *   **All:** Review and sign off on Architecture/ERD.
    *   **Daniel:** Initialize `backend` and `mobile` repos. Setup CI (Linting/Tests).
    *   **Trevor:** Finalize Risk/Threat Model.
    *   **Esther:** Prepare initial CSV schemas (Voters, Candidates).

### Milestone 2: Nominations Module (Days 1-4)
*   **Goal:** Enable candidate registration and officer approval.
*   **Assignments:**
    *   **Daniel:** Backend: `Position` CRUD APIs. Frontend: Admin Position Management UI.
    *   **Ken:** Backend: `Candidate` submission API + File Upload (Multer). Frontend: Candidate Dashboard & Edit Profile.
    *   **Trevor:** Backend: `Officer` approval APIs + Audit Log hooks. Frontend: Officer Dashboard (Approve/Reject).
    *   **Mable:** Setup Email Service (Nodemailer) for candidate notifications.

### Milestone 3: Voter Verification (Days 5-7)
*   **Goal:** Secure voter onboarding.
*   **Assignments:**
    *   **Mable:** Backend: `Verification` API (OTP generation/validation). Frontend: Voter Login & OTP Screens.
    *   **Daniel:** Backend: `Voter` Import API (CSV parsing). Frontend: Admin Voter List & Import Modal.
    *   **Christine:** Backend: Ballot Token generation logic (ensure single-use).
    *   **Esther:** Create dummy data generator for 1000 voters (Seed script).

### Milestone 4: Voting Engine & Live Dashboard (Days 8-10)
*   **Goal:** The core voting experience.
*   **Assignments:**
    *   **Christine:** Backend: `Vote` casting API (Transaction: Check Token -> Record Vote -> Burn Token). Frontend: Voting Wizard UI.
    *   **Esther:** Backend: `Reports` Aggregation APIs (Turnout, Results). Frontend: Live Results Dashboard (Charts).
    *   **Ken:** Ensure Candidate Profiles display correctly in Voting Wizard.
    *   **Trevor:** Ensure every vote cast creates an anonymized Audit Log entry.
    *   **All:** **Load Testing:** Run script to simulate 500 voters (Esther leads).

### Milestone 5: Reporting & Final Polish (Days 11-14)
*   **Goal:** Exports, documentation, and deployment.
*   **Assignments:**
    *   **Esther:** Backend: PDF/CSV Export endpoints. Frontend: Download Reports buttons.
    *   **Trevor:** Backend: Finalize Audit Log Export. Frontend: Audit Log Viewer.
    *   **Daniel:** Deployment (Render/Heroku for Backend, EAS Build for Mobile).
    *   **Mable/Ken/Christine:** Polish UI/UX, fix bugs, ensure responsive design.
    *   **All:** Write Individual Reflections (M5 requirement).

---

## 4. Immediate Next Steps (Action Items)

1.  **Daniel:** Create the two GitHub repositories and invite all members.
2.  **All:** Clone the repos locally.
3.  **Daniel:** Push the current "Milestone 1" code to `main`.
4.  **Team:** Create `develop` branch.
5.  **Start Milestone 2:**
    *   **Ken:** Create branch `feature/candidate-nomination`.
    *   **Trevor:** Create branch `feature/officer-approval`.
    *   **Daniel:** Create branch `feature/admin-positions`.

---

## 5. Contribution Tracking

To maximize marks:
*   **Issues:** Create GitHub Issues for every task (e.g., "Design OTP Screen"). Assign to self.
*   **PRs:** Link PRs to Issues (e.g., "Closes #12").
*   **Tests:** Each member writes unit tests for their backend controllers (Jest).
