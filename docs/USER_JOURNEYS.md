# E-Voting System - User Journey Documentation

## Overview

This document describes the complete user journeys for all roles in the University E-Voting Mobile Application.

---

## 1. Voter Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                        VOTER FLOW                                │
├─────────────────────────────────────────────────────────────────┤
│  Welcome Screen                                                  │
│       │                                                          │
│       ▼                                                          │
│  "I am a Voter" Button                                          │
│       │                                                          │
│       ▼                                                          │
│  Voter Login Screen                                              │
│  ├── Enter Registration Number                                   │
│  ├── Select OTP Method (Email/SMS)                              │
│  └── Request OTP                                                 │
│       │                                                          │
│       ▼                                                          │
│  OTP Verification                                                │
│  └── Enter 6-digit OTP code                                     │
│       │                                                          │
│       ▼                                                          │
│  Ballot Screen (Dashboard)                                       │
│  ├── View all open positions                                    │
│  ├── View candidates per position                               │
│  ├── Tap candidate info (i) for profile                         │
│  ├── Select one candidate per position                          │
│  └── Submit Vote                                                 │
│       │                                                          │
│       ▼                                                          │
│  Vote Confirmation → Logout                                      │
└─────────────────────────────────────────────────────────────────┘
```

### Key Features:
- One-time ballot token issued after OTP verification
- Anonymous voting (vote linked to ballot, not voter)
- Cannot vote twice (ballot marked CONSUMED)
- Progress indicator showing selections made

---

## 2. Candidate Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                      CANDIDATE FLOW                              │
├─────────────────────────────────────────────────────────────────┤
│  Welcome Screen                                                  │
│       │                                                          │
│       ├── "Register as Candidate" (New)                         │
│       │         │                                                │
│       │         ▼                                                │
│       │   Signup Form                                            │
│       │   ├── Full Name                                          │
│       │   ├── Email                                              │
│       │   ├── Registration Number                                │
│       │   ├── Program                                            │
│       │   └── Password                                           │
│       │         │                                                │
│       │         ▼                                                │
│       │   Registration Success → Login                           │
│       │                                                          │
│       └── "Candidate / Official Login" (Existing)               │
│                 │                                                │
│                 ▼                                                │
│  Login Screen                                                    │
│  └── Email + Password                                            │
│                 │                                                │
│                 ▼                                                │
│  Candidate Dashboard                                             │
│  ├── View nomination status (PENDING/APPROVED/REJECTED)         │
│  ├── View profile details                                        │
│  └── Quick Actions:                                              │
│       ├── Submit Nomination (if not submitted)                  │
│       │    ├── Select Position                                   │
│       │    ├── Enter Campaign Slogan                            │
│       │    ├── Upload Profile Photo                             │
│       │    └── Upload Manifesto PDF                             │
│       ├── Edit Profile (if submitted)                           │
│       ├── View Manifesto                                         │
│       └── View Live Results                                      │
└─────────────────────────────────────────────────────────────────┘
```

### Key Features:
- Self-registration for candidates
- Nomination submission with manifesto upload
- Real-time status updates
- Can edit profile until approved

---

## 3. Returning Officer Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                   RETURNING OFFICER FLOW                         │
├─────────────────────────────────────────────────────────────────┤
│  Welcome Screen                                                  │
│       │                                                          │
│       ▼                                                          │
│  "Candidate / Official Login"                                   │
│       │                                                          │
│       ▼                                                          │
│  Login Screen (Email + Password)                                │
│       │                                                          │
│       ▼                                                          │
│  Officer Dashboard                                               │
│  ├── Overview Stats (Positions, Candidates, Voters, Votes)     │
│  ├── Pending nominations badge                                   │
│  └── Actions:                                                    │
│       ├── Approve Nominations ★                                 │
│       │    ├── View pending candidates                          │
│       │    ├── View manifesto (PDF)                             │
│       │    ├── Approve nomination                               │
│       │    └── Reject nomination                                │
│       ├── Positions (View Only)                                  │
│       ├── Voters (View Only)                                     │
│       └── Live Results                                           │
│                                                                  │
│  ✗ NO ACCESS TO:                                                │
│    - Audit Log                                                   │
│    - Create Officer                                              │
│    - Create/Edit Positions                                       │
│    - Create Candidates                                           │
└─────────────────────────────────────────────────────────────────┘
```

### Key Features:
- Primary role: Approve/Reject candidate nominations
- View manifesto PDFs before approval
- Monitor election results
- Limited admin access (view only)

---

## 4. Election Admin Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                    ELECTION ADMIN FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│  Welcome Screen                                                  │
│       │                                                          │
│       ▼                                                          │
│  "Candidate / Official Login"                                   │
│       │                                                          │
│       ▼                                                          │
│  Login Screen (Email + Password)                                │
│       │                                                          │
│       ▼                                                          │
│  Admin Dashboard                                                 │
│  ├── Overview Stats (Positions, Candidates, Voters, Votes)     │
│  └── Full Management Access:                                     │
│                                                                  │
│       ├── Candidates                                             │
│       │    ├── View all nominations                             │
│       │    ├── Create candidate (manual)                        │
│       │    └── Delete candidates                                │
│       │                                                          │
│       ├── Positions                                              │
│       │    ├── Create position                                  │
│       │    │    ├── Position name                               │
│       │    │    ├── Number of seats                             │
│       │    │    ├── Nomination open/close dates                 │
│       │    │    └── Voting open/close dates                     │
│       │    ├── Edit position                                    │
│       │    └── Delete position                                  │
│       │                                                          │
│       ├── Voters                                                 │
│       │    ├── Upload CSV file                                  │
│       │    ├── View all voters                                  │
│       │    └── Delete all voters (reset)                        │
│       │                                                          │
│       ├── Live Results                                           │
│       │    └── View charts and statistics                       │
│       │                                                          │
│       ├── Audit Log                                              │
│       │    ├── View all system activity                         │
│       │    └── Filter by actor type                             │
│       │                                                          │
│       └── Create Officer                                         │
│            ├── Name                                              │
│            ├── Staff ID                                          │
│            ├── Email                                             │
│            └── Password                                          │
└─────────────────────────────────────────────────────────────────┘
```

### Key Features:
- Full system administration
- Manage election settings and positions
- Import voters from CSV
- View complete audit trail
- Create returning officers

---

## Screen Navigation Map

```
                    ┌─────────────┐
                    │   Welcome   │
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌────────────┐  ┌────────────┐  ┌──────────────┐
    │VoterLogin  │  │   Login    │  │CandidateSignup│
    └─────┬──────┘  └─────┬──────┘  └───────┬──────┘
          │               │                 │
          ▼               ▼                 ▼
    ┌────────────┐  ┌─────────────────────────────┐
    │  Ballot    │  │  Role-Based Dashboard       │
    │ (Dashboard)│  ├─────────────────────────────┤
    └────────────┘  │ ADMIN → AdminDashboard      │
                    │ OFFICER → AdminDashboard*   │
                    │ CANDIDATE → CandidateDash   │
                    └─────────────────────────────┘
                    
    * Officer sees limited menu options
```

---

## Security Features

| Feature | Implementation |
|---------|----------------|
| One-vote enforcement | Ballot token + CONSUMED status + DB constraint |
| Ballot secrecy | Votes linked to ballot UUID, not voter ID |
| OTP verification | Email/SMS OTP for voter authentication |
| Password security | bcrypt hashing for all passwords |
| Role-based access | JWT tokens with role claims |
| Audit logging | All actions logged with actor/timestamp |

---

## API Endpoints by Role

### Public
- `POST /auth/register` - Candidate registration
- `POST /auth/login` - User login
- `POST /verify/request` - Request OTP
- `POST /verify/verify` - Verify OTP

### Voter (Ballot Token)
- `GET /vote/ballot` - Get ballot
- `POST /vote` - Cast vote

### Candidate
- `GET /candidates/my` - Get own nominations
- `POST /candidates` - Submit nomination
- `PUT /candidates/:id` - Update nomination
- `GET /reports/results` - View results

### Officer
- `GET /candidates` - View all candidates
- `PATCH /candidates/:id/approve` - Approve nomination
- `PATCH /candidates/:id/reject` - Reject nomination
- `GET /reports/results` - View results

### Admin (All above plus)
- Full CRUD on Positions
- `POST /voters/import` - Import CSV
- `DELETE /voters` - Clear voters
- `GET /reports/audit` - Audit log
- `POST /auth/create-officer` - Create officer
