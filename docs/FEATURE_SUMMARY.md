# E-Voting System - Feature Summary

## System Overview
A secure, auditable e-voting system for university elections with mobile and web interfaces.

---

## Roles & Permissions

### 👨‍💼 Election Admin
| Feature | Description |
|---------|-------------|
| **Manage Positions** | Create, edit, delete election positions with nomination/voting windows |
| **Set Voting Windows** | Configure open/close times for nominations and voting |
| **Upload Voters CSV** | Import eligible voters from CSV file |
| **View Full Audit Log** | Complete system activity log |
| **Create Officers** | Add returning officers to the system |
| **View Results** | Real-time election results with charts |

### 👮 Returning Officer
| Feature | Description |
|---------|-------------|
| **Approve Nominations** | Review and approve/reject candidate nominations |
| **View Positions** | Read-only access to positions |
| **View Voters** | Access to registered voters list |
| **View Results** | Monitor election standings |

### 👤 Candidate
| Feature | Description |
|---------|-------------|
| **Submit Nomination** | Apply for a position with manifesto, photo, slogan |
| **View Approval Status** | Track nomination status (PENDING/APPROVED/REJECTED) |
| **Edit Profile** | Update manifesto, photo, slogan after submission |

### 🗳️ Voter
| Feature | Description |
|---------|-------------|
| **Verify Eligibility** | Login with registration number + OTP |
| **Cast Ballot** | Vote for candidates (one per position) |
| **View Candidates** | See approved candidates and manifestos |

---

## Security Implementation

### ✅ One-Vote Enforcement

```
MULTI-LAYER PROTECTION:
┌─────────────────────────────────────────────┐
│ 1. Ballot Token System                      │
│    - Unique token issued per voter session  │
│    - Token required for all voting actions  │
├─────────────────────────────────────────────┤
│ 2. CONSUMED Status Check                    │
│    - Ballot marked CONSUMED after use       │
│    - Cannot vote twice with same token      │
├─────────────────────────────────────────────┤
│ 3. Database Constraint                      │
│    - @@unique([ballotId, positionId])       │
│    - One vote per position per ballot       │
├─────────────────────────────────────────────┤
│ 4. Existing Votes Check                     │
│    - Query checks before casting vote       │
│    - Rejects if already voted for position  │
└─────────────────────────────────────────────┘
```

**Code Evidence** (votes.controller.js):
- Line 54-59: Checks if ballot is CONSUMED
- Line 272-277: Validates one vote per position
- Line 280-291: Checks for existing votes before casting
- Line 306-313: Marks ballot as CONSUMED after voting

### ✅ Ballot Secrecy

```
ANONYMIZATION FLOW:
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│    Voter     │───>│   Ballot     │───>│    Vote      │
│  (regNo)     │    │  (token)     │    │ (candidateId)│
└──────────────┘    └──────────────┘    └──────────────┘
                           │
                    NO DIRECT LINK
                    between voter
                    and vote choice
```

**Implementation Details:**
- Votes linked to `ballotId` not `voterId`
- Ballot token is anonymous (UUID)
- Audit log records that vote was cast, not who voted for whom
- Vote table has no voter personally identifiable information (PII)

### ✅ Voter Eligibility

| Check | Location | Description |
|-------|----------|-------------|
| **CSV Import** | voters.controller.js | Only voters in CSV are added to EligibleVoter table |
| **Reg Number Validation** | Login flow | Must match EligibleVoter record |
| **OTP Verification** | Verification system | Email/SMS OTP required |
| **Status Check** | EligibleVoter.status | Must be "ELIGIBLE" |

---

## Database Schema Highlights

```sql
-- Ballot (anonymizes voter)
Ballot {
  id, voterId, token, status, issuedAt, consumedAt
}

-- Vote (no voter PII)
Vote {
  id, ballotId, positionId, candidateId, castAt
  @@unique([ballotId, positionId])
}

-- EligibleVoter (from CSV)
EligibleVoter {
  id, regNo, name, email, phone, program, status
}
```

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| **Mobile App** | React Native + Expo |
| **Backend API** | Node.js + Express |
| **Database** | MySQL + Prisma ORM |
| **Authentication** | JWT + bcrypt |
| **OTP** | Email (Nodemailer) / SMS |

---

## API Endpoints Summary

### Admin Routes
- `POST /positions` - Create position
- `PUT /positions/:id` - Update position
- `DELETE /positions/:id` - Delete position
- `POST /voters/import` - Import CSV
- `POST /auth/create-officer` - Create officer

### Officer Routes
- `PUT /candidates/:id/status` - Approve/reject nomination

### Candidate Routes
- `POST /candidates` - Submit nomination
- `PUT /candidates/:id` - Update profile
- `GET /candidates/my` - Get own nomination

### Voter Routes
- `POST /vote/verify` - Request OTP
- `POST /vote/ballot` - Get ballot with token
- `POST /vote` - Cast vote

---

## Mobile Screens

### Admin/Officer Dashboard
![Admin Dashboard features based on role]

### Candidate Portal
- Dashboard with status
- Submit/Edit nomination form

### Voter Ballot
- Position list
- Candidate selection
- Submit vote

---

## Audit Trail
All critical actions are logged:
- Vote casting (anonymous)
- Position CRUD
- Candidate approval/rejection
- Voter imports
- Officer creation
