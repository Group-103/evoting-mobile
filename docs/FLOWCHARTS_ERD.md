# E-Voting System - Flowcharts & ERD

## User Journey Flowcharts

### 1. Voter Journey Flowchart

```mermaid
flowchart TD
    A[Welcome Screen] --> B{Select Role}
    B -->|I am a Voter| C[Voter Login Screen]
    
    C --> D[Enter Reg Number]
    D --> E[Select OTP Method]
    E --> F[Request OTP]
    F --> G{OTP Sent?}
    
    G -->|No| H[Show Error]
    H --> D
    
    G -->|Yes| I[Enter OTP Code]
    I --> J{OTP Valid?}
    
    J -->|No| K[Invalid OTP Error]
    K --> I
    
    J -->|Yes| L[Issue Ballot Token]
    L --> M[Ballot Screen]
    
    M --> N[View Positions & Candidates]
    N --> O[Select Candidates]
    O --> P{All Selected?}
    
    P -->|No| O
    P -->|Yes| Q[Review Selections]
    
    Q --> R[Submit Vote]
    R --> S{Vote Successful?}
    
    S -->|No| T[Show Error]
    T --> M
    
    S -->|Yes| U[Mark Ballot CONSUMED]
    U --> V[Vote Confirmation]
    V --> W[Logout]
    W --> A
```

---

### 2. Candidate Journey Flowchart

```mermaid
flowchart TD
    A[Welcome Screen] --> B{Action}
    
    B -->|Register as Candidate| C[Signup Form]
    C --> D[Enter Details]
    D --> E[Submit Registration]
    E --> F{Success?}
    F -->|No| G[Show Error]
    G --> D
    F -->|Yes| H[Registration Complete]
    H --> I[Redirect to Login]
    
    B -->|Candidate Login| I[Login Screen]
    I --> J[Enter Email & Password]
    J --> K{Valid?}
    K -->|No| L[Login Error]
    L --> J
    K -->|Yes| M[Candidate Dashboard]
    
    M --> N{Has Nomination?}
    
    N -->|No| O[Submit Nomination]
    O --> P[Select Position]
    P --> Q[Enter Slogan]
    Q --> R[Upload Photo]
    R --> S[Upload Manifesto PDF]
    S --> T[Submit]
    T --> M
    
    N -->|Yes| U{Status Check}
    U -->|PENDING| V[Await Approval]
    U -->|APPROVED| W[Nomination Active]
    U -->|REJECTED| X[Resubmit Option]
    
    M --> Y[Quick Actions]
    Y --> Z1[Edit Profile]
    Y --> Z2[View Manifesto]
    Y --> Z3[View Results]
    
    M --> AA[Logout]
    AA --> A
```

---

### 3. Returning Officer Journey Flowchart

```mermaid
flowchart TD
    A[Welcome Screen] --> B[Official Login]
    B --> C[Enter Email & Password]
    C --> D{Valid Officer?}
    
    D -->|No| E[Access Denied]
    E --> C
    
    D -->|Yes| F[Officer Dashboard]
    F --> G[View Stats]
    
    F --> H{Select Action}
    
    H -->|Approve Nominations| I[View Pending Candidates]
    I --> J[Select Candidate]
    J --> K[View Details & Manifesto]
    K --> L{Decision}
    L -->|Approve| M[Update Status: APPROVED]
    L -->|Reject| N[Update Status: REJECTED]
    M --> O[Notify Candidate]
    N --> O
    O --> I
    
    H -->|View Positions| P[Positions List - Read Only]
    H -->|View Voters| Q[Voters List - Read Only]
    H -->|Live Results| R[Results Charts]
    
    F --> S[Logout]
    S --> A
```

---

### 4. Election Admin Journey Flowchart

```mermaid
flowchart TD
    A[Welcome Screen] --> B[Admin Login]
    B --> C[Enter Email & Password]
    C --> D{Valid Admin?}
    
    D -->|No| E[Access Denied]
    E --> C
    
    D -->|Yes| F[Admin Dashboard]
    F --> G[View Overview Stats]
    
    F --> H{Select Action}
    
    H -->|Manage Positions| I[Positions Screen]
    I --> I1[Create Position]
    I --> I2[Edit Position]
    I --> I3[Delete Position]
    
    H -->|Manage Candidates| J[Candidates Screen]
    J --> J1[View All]
    J --> J2[Create Candidate]
    J --> J3[Delete Candidate]
    
    H -->|Manage Voters| K[Voters Screen]
    K --> K1[Upload CSV]
    K --> K2[View All Voters]
    K --> K3[Delete All - Reset]
    
    H -->|Live Results| L[Results Dashboard]
    L --> L1[View Charts]
    L --> L2[View Statistics]
    
    H -->|Audit Log| M[Audit Screen]
    M --> M1[View All Logs]
    M --> M2[Filter by Actor]
    
    H -->|Create Officer| N[Create Officer Form]
    N --> N1[Enter Name]
    N --> N2[Enter Staff ID]
    N --> N3[Enter Email]
    N --> N4[Set Password]
    N --> N5[Submit]
    
    F --> O[Logout]
    O --> A
```

---

## Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USER {
        uuid id PK
        string email UK
        string password
        string name
        enum role "ADMIN|OFFICER|CANDIDATE"
        string regNo
        string program
        string staffId
        string status
        boolean emailVerified
        datetime createdAt
        datetime updatedAt
    }
    
    POSITION {
        uuid id PK
        string name
        int seats
        datetime nominationOpens
        datetime nominationCloses
        datetime votingOpens
        datetime votingCloses
        datetime createdAt
        datetime updatedAt
    }
    
    CANDIDATE {
        uuid id PK
        uuid positionId FK
        uuid userId FK
        string name
        string program
        string manifestoUrl
        string photoUrl
        string slogan
        enum status "SUBMITTED|APPROVED|REJECTED"
        string reason
        datetime createdAt
        datetime updatedAt
    }
    
    ELIGIBLE_VOTER {
        uuid id PK
        string regNo UK
        string name
        string email
        string phone
        string program
        string status
        datetime createdAt
        datetime updatedAt
    }
    
    VERIFICATION {
        uuid id PK
        uuid voterId FK
        string method
        string otpHash
        datetime issuedAt
        datetime expiresAt
        datetime verifiedAt
        string ballotToken
        datetime consumedAt
    }
    
    BALLOT {
        uuid id PK
        uuid voterId FK
        string token UK
        string status "ACTIVE|CONSUMED"
        datetime issuedAt
        datetime consumedAt
    }
    
    VOTE {
        uuid id PK
        uuid ballotId FK
        uuid positionId FK
        uuid candidateId FK
        datetime castAt
    }
    
    AUDIT_LOG {
        uuid id PK
        string actorType
        string actorId
        string action
        string entity
        string entityId
        json payload
        datetime createdAt
    }
    
    PASSWORD_RESET {
        uuid id PK
        uuid userId FK
        string otpHash
        datetime issuedAt
        datetime expiresAt
        datetime verifiedAt
        datetime resetAt
        datetime consumedAt
    }
    
    USER ||--o{ CANDIDATE : "creates"
    POSITION ||--o{ CANDIDATE : "has"
    POSITION ||--o{ VOTE : "has"
    CANDIDATE ||--o{ VOTE : "receives"
    ELIGIBLE_VOTER ||--o{ VERIFICATION : "requests"
    ELIGIBLE_VOTER ||--o{ BALLOT : "issued"
    BALLOT ||--o{ VOTE : "contains"
    USER ||--o{ PASSWORD_RESET : "requests"
```

---

## Database Relationships Summary

| Relationship | Type | Description |
|--------------|------|-------------|
| User → Candidate | 1:N | A user can submit multiple nominations |
| Position → Candidate | 1:N | A position has multiple candidates |
| Position → Vote | 1:N | A position receives multiple votes |
| Candidate → Vote | 1:N | A candidate receives multiple votes |
| EligibleVoter → Verification | 1:N | Voter can have multiple OTP attempts |
| EligibleVoter → Ballot | 1:N | Voter can have ballots (only 1 active) |
| Ballot → Vote | 1:N | A ballot contains votes for positions |
| User → PasswordReset | 1:N | User can request multiple resets |

---

## Key Constraints

| Table | Constraint | Purpose |
|-------|------------|---------|
| Vote | `UNIQUE(ballotId, positionId)` | One vote per position per ballot |
| Candidate | `UNIQUE(positionId, userId)` | One nomination per position per user |
| Ballot | `UNIQUE(token)` | Ballot tokens are unique |
| EligibleVoter | `UNIQUE(regNo)` | Registration numbers are unique |
| User | `UNIQUE(email)` | Email addresses are unique |
