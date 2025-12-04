# E-Voting Mobile App - User Journey Flowcharts

This document contains comprehensive flowcharts for all user journeys in the mobile e-voting application.

---

## 1. Initial Welcome & Authentication Flow

```mermaid
graph TD
# E-Voting Mobile App - User Journey Flowcharts

This document contains comprehensive flowcharts for all user journeys in the mobile e-voting application.

---

## 1. Initial Welcome & Authentication Flow

```mermaid
graph TD
    A[App Launch] --> B[WelcomeScreen]
    B --> C{User Type?}
    C -->|Voter| D[VoterLoginScreen]
    C -->|Staff/Candidate| E[LoginScreen]
    
    D --> F[Enter Reg No]
    F --> G[Request OTP Button]
    G --> H{Valid Reg No?}
    H -->|Yes| I[API: /verify/request-otp]
    H -->|No| F
    I --> J[Show OTP Input Field]
    J --> K[Enter OTP from Email]
    K --> L[Verify & Login Button]
    L --> M{OTP Valid?}
    M -->|Yes| N[Store Ballot Token]
    N --> O[Main Tabs - Voter]
    M -->|No| K
    
    E --> P[Enter Email & Password]
    P --> Q{Authentication}
    Q -->|Admin/Officer| R[AdminDashboard]
    Q -->|Candidate| S[CandidateDashboard]
    Q -->|Invalid| E
    
    style B fill:#ff6b6b
    style O fill:#51cf66
    style R fill:#4c6ef5
    style S fill:#ffd43b
```

---

## 2. Voter Journey

```mermaid
graph TD
    A[Voter Login Success] --> B[Main Tabs Navigator]
    B --> C[Vote Tab - DashboardScreen]
    B --> D[Results Tab - ResultsScreen]
    
    C --> E{Ballot Token Exists?}
    E -->|No| F[Redirect to Login]
    E -->|Yes| G[Fetch Positions & Ballot Status]
    
    G --> H{Ballot Status?}
    H -->|Consumed| I[Show 'Already Voted' Badge]
    H -->|Active| J[Display Positions List]
    
    J --> K[Select Position]
    K --> L[CandidateProfileScreen]
    L --> M[View Candidate Details:<br/>- Name<br/>- Program<br/>- Manifesto<br/>- Photo]
    L --> N[Cast Vote Button]
    N --> O{Confirm Vote?}
    O -->|Yes| P[API: /api/vote]
    O -->|No| L
    P --> Q{Vote Success?}
    Q -->|Yes| R[Show Success Alert]
    Q -->|No| S[Show Error]
    R --> C
    
    D --> T[View Live Results:<br/>- Charts<br/>- Vote Counts<br/>- Percentages]
    T --> U[Pull to Refresh]
    U --> T
    
    C --> V[Logout]
    V --> W[WelcomeScreen]
    
    style C fill:#51cf66
    style D fill:#4dabf7
    style L fill:#ffd43b
```

---

## 3. Candidate Journey

```mermaid
graph TD
    A[Candidate Login] --> B[CandidateDashboardScreen]
    
    B --> C[View Nomination Status:<br/>- SUBMITTED<br/>- APPROVED<br/>- REJECTED]
    B --> D[View Current Info:<br/>- Name<br/>- Email<br/>- Program<br/>- Manifesto Status]
    
    B --> E[Quick Actions Menu]
    E --> F[Edit Profile]
    E --> G[View Manifesto]
    E --> H[View Results]
    
    F --> I[EditCandidateProfileScreen]
    I --> J[Current Information Display]
    I --> K[Update Profile Photo]
    K --> L{Pick Photo Source}
    L -->|Camera/Gallery| M[Select Image]
    M --> N[Preview Image]
    
    I --> O[Update Manifesto PDF]
    O --> P[Select PDF Document]
    P --> Q{Validate PDF}
    Q -->|Valid| R[Show Selected Badge]
    
    N --> S[Save Changes]
    R --> S
    S --> T[API: Upload Files]
    T --> B
    
    G --> U[ManifestoViewerScreen]
    U --> V[View PDF in WebView]
    V --> W[Download / Share]
    
    H --> X[ResultsScreen]
    X --> Y[View Election Results]
    
    B --> Z[Logout]
    Z --> AA[WelcomeScreen]
    
    style B fill:#ffd43b
    style I fill:#ff922b
    style U fill:#748ffc
```

---

## 4. Admin Journey

```mermaid
graph TD
    A[Admin Login] --> B[AdminDashboardScreen]
    
    B --> C[Overview Stats:<br/>- Positions<br/>- Candidates<br/>- Voters<br/>- Votes Cast]
    
    B --> D[Management Menu]
    D --> E[Manage Candidates]
    D --> F[Manage Positions]
    D --> G[Manage Voters]
    D --> H[Live Results]
    D --> I[Audit Log]
    D --> J[Create Officer]
    
    E --> K[AdminCandidatesScreen]
    K --> L[List Nominations]
    L --> M[Approve/Reject Candidate]
    L --> N[Create New Candidate]
    
    F --> O[AdminPositionsScreen]
    O --> P[List Positions]
    P --> Q[Create New Position]
    
    G --> R[AdminVotersScreen]
    R --> S[Upload Voters CSV]
    R --> T[View Voter List]
    
    H --> U[ResultsScreen]
    
    I --> V[AuditLogScreen]
    V --> W[View System Logs]
    
    J --> X[AdminCreateOfficerScreen]
    X --> Y[Create Returning Officer]
    
    B --> Z[Logout]
    
    style B fill:#4c6ef5
    style K fill:#845ef7
    style O fill:#20c997
```

---

## 5. Officer Journey

```mermaid
graph TD
    A[Officer Login] --> B[AdminDashboardScreen]
    
    B --> C[Overview Stats]
    
    B --> D[Management Menu]
    D --> E[Manage Candidates]
    D --> F[Manage Positions]
    D --> G[Manage Voters]
    D --> H[Live Results]
    D --> I[Audit Log]
    
    E --> J[AdminCandidatesScreen]
    J --> K[Verify Nominations]
    J --> L[Approve/Reject]
    
    F --> M[AdminPositionsScreen]
    M --> N[View Positions]
    
    G --> O[AdminVotersScreen]
    O --> P[View Voter List]
    O --> Q[Assist Voters]
    
    H --> R[ResultsScreen]
    R --> S[Monitor Turnout]
    
    I --> T[AuditLogScreen]
    T --> U[View Logs]
    
    B --> V[Logout]
    
    style B fill:#4c6ef5
    style J fill:#845ef7
```

---

## 6. Navigation Structure Overview

```mermaid
graph TD
    A[Root Stack Navigator] --> B[Welcome]
    A --> C[VoterLogin]
    A --> D[StaffLogin]
    A --> E[Main Tabs]
    A --> F[AdminDashboard]
    A --> G[CandidateDashboard]
    
    E --> H[Vote Tab]
    E --> I[Results Tab]
    
    H --> J[CandidateProfile Screen]
    
    G --> K[EditCandidateProfile]
    G --> L[ManifestoViewer]
    G --> M[Results]
    
    F --> N[AdminCandidates]
    F --> O[AdminPositions]
    F --> P[AdminCreatePosition]
    F --> Q[AdminCreateOfficer]
    F --> R[AdminCreateCandidate]
    F --> M
    
    style A fill:#339af0
    style E fill:#51cf66
    style F fill:#4c6ef5
    style G fill:#ffd43b
```

---

## 7. Complete User Flow by Role

### Voter Complete Flow

```mermaid
graph LR
    A[Launch App] --> B[WelcomeScreen]
    B --> C[VoterLoginScreen]
    C --> D[OTP Verification]
    D --> E[DashboardScreen]
    E --> F[Select Position]
    F --> G[View Candidate]
    G --> H[Cast Vote]
    H --> E
    E --> I[ResultsScreen]
    I --> J[Logout]
    J --> B
    
    style E fill:#51cf66
```

### Candidate Complete Flow

```mermaid
graph LR
    A[Launch App] --> B[WelcomeScreen]
    B --> C[Staff Login]
    C --> D[CandidateDashboard]
    D --> E[Edit Profile]
    E --> F[Upload Files]
    F --> D
    D --> G[View Manifesto]
    G --> D
    D --> H[View Results]
    H --> D
    D --> I[Logout]
    I --> B
    
    style D fill:#ffd43b
```

### Admin Complete Flow

```mermaid
graph LR
    A[Launch App] --> B[WelcomeScreen]
    B --> C[Staff Login]
    C --> D[AdminDashboard]
    D --> E[Manage Candidates]
    E --> F[Approve/Reject]
    F --> E
    E --> D
    D --> G[Manage Positions]
    G --> H[Create Position]
    H --> G
    G --> D
    D --> I[Create Officer]
    I --> D
    D --> J[View Results]
    J --> D
    D --> K[Logout]
    K --> B
    
    style D fill:#4c6ef5
```

---

## 8. Screen Interaction Details

### DashboardScreen (Voter) - Detailed Flow

```mermaid
graph TD
    A[DashboardScreen Load] --> B[Fetch Ballot Status]
    B --> C{Has Ballot?}
    C -->|No| D[Show Empty State:<br/>'Complete verification first']
    C -->|Yes| E[Fetch Positions]
    E --> F[Fetch User Votes]
    F --> G[Display Positions List]
    
    G --> H{For Each Position}
    H --> I{Already Voted?}
    I -->|Yes| J[Show Voted Badge]
    I -->|No| K[Show Vote Button]
    
    K --> L[User Taps Position]
    L --> M[Navigate to CandidateProfile]
    M --> N[Pass: candidateId, positionId]
    
    G --> O[Pull to Refresh]
    O --> B
    
    G --> P[Toggle Theme]
    G --> Q[Logout]
    
    style G fill:#51cf66
```

### EditCandidateProfileScreen - Detailed Flow

```mermaid
graph TD
    A[Screen Load] --> B[Fetch Candidate Data]
    B --> C[Request Permissions]
    C --> D[Display Current Info]
    
    D --> E[Photo Section]
    E --> F{User Taps Select Photo}
    F --> G[Show Action Sheet]
    G --> H{Source?}
    H -->|Camera| I[Launch Camera]
    H -->|Gallery| J[Launch Gallery]
    I --> K[Photo Selected]
    J --> K
    K --> L[Set Local State]
    L --> M[Show Preview]
    
    D --> N[Manifesto Section]
    N --> O{User Taps Select PDF}
    O --> P[Launch Document Picker]
    P --> Q{File Selected?}
    Q -->|Yes| R[Validate File Type]
    R --> S{Is PDF?}
    S -->|Yes| T[Check File Size]
    S -->|No| U[Show Error: PDF only]
    T --> V{Size < 10MB?}
    V -->|Yes| W[Set Local State]
    V -->|No| X[Show Error: Too large]
    W --> Y[Show Selected Badge]
    
    M --> Z[Save Button Enabled]
    Y --> Z
    Z --> AA{User Taps Save}
    AA --> AB[Create FormData]
    AB --> AC[Add Files to FormData]
    AC --> AD[PUT /api/candidates/:id]
    AD --> AE{Success?}
    AE -->|Yes| AF[Show Success Alert]
    AE -->|No| AG[Show Error Alert]
    AF --> AH[Navigate Back]
    
    style D fill:#ff922b
    style Z fill:#51cf66
```

### ManifestoViewerScreen - Detailed Flow

```mermaid
graph TD
    A[Screen Load] --> B{Has Route Params?}
    B -->|manifestoUrl| C[Use Provided URL]
    B -->|candidateId| D[Fetch Candidate Data]
    D --> E[Get manifestoUrl]
    
    C --> F[Construct Full URL]
    E --> F
    F --> G{URL Exists?}
    G -->|No| H[Show Empty State]
    G -->|Yes| I[Load PDF in WebView]
    
    I --> J[Display Action Buttons]
    J --> K[Download & Share]
    J --> L[Open Externally]
    
    K --> M{User Taps Download}
    M --> N[Download File to Cache]
    N --> O[Check Sharing Available]
    O --> P[Show Share Dialog]
    
    L --> Q{User Taps External}
    Q --> R[Open in System PDF Viewer]
    
    style I fill:#748ffc
    style P fill:#51cf66
```

---

## 9. Data Flow Summary

### Vote Submission Flow

```mermaid
sequenceDiagram
    participant User
    participant Dashboard
    participant Profile
    participant API
    participant Database
    
    User->>Dashboard: View Positions
    Dashboard->>API: GET /api/positions
    API->>Database: Fetch Active Positions
    Database-->>API: Return Positions
    API-->>Dashboard: Positions Data
    
    User->>Dashboard: Select Position
    Dashboard->>Profile: Navigate with candidateId
    Profile->>API: GET /api/candidates/:id
    API-->>Profile: Candidate Details
    
    User->>Profile: Cast Vote
    Profile->>API: POST /api/vote
    API->>Database: Record Vote
    Database-->>API: Vote Saved
    API-->>Profile: Success Response
    Profile-->>Dashboard: Navigate Back
    Dashboard->>Dashboard: Refresh Data
```

### Candidate Profile Update Flow

```mermaid
sequenceDiagram
    participant User
    participant EditScreen
    participant FilePicker
    participant API
    participant Backend
    
    User->>EditScreen: Tap Edit Profile
    EditScreen->>API: GET /api/candidates/my
    API-->>EditScreen: Current Data
    
    User->>EditScreen: Select Photo
    EditScreen->>FilePicker: Launch Picker
    FilePicker-->>EditScreen: Photo URI
    
    User->>EditScreen: Select PDF
    EditScreen->>FilePicker: Launch Document Picker
    FilePicker-->>EditScreen: PDF URI
    
    User->>EditScreen: Tap Save
    EditScreen->>EditScreen: Create FormData
    EditScreen->>API: PUT /api/candidates/:id
    API->>Backend: Process Multipart Upload
    Backend->>Backend: Save Files
    Backend->>Backend: Update Database
    Backend-->>API: Success
    API-->>EditScreen: Updated Candidate
    EditScreen->>EditScreen: Show Success
    EditScreen->>User: Navigate Back
```

---

## 10. Screen Count Summary

| Screen Name | Route Name | User Role | Purpose |
|-------------|------------|-----------|---------|
| WelcomeScreen | Welcome | All | Initial entry point |
| VoterLoginScreen | VoterLogin | Voter | OTP-based authentication |
| LoginScreen | StaffLogin | Staff/Candidate | Email/password authentication |
| DashboardScreen | Vote (Tab) | Voter | View positions and vote |
| ResultsScreen | Results (Tab/Stack) | All | View election results |
| CandidateProfileScreen | CandidateProfile | Voter | View candidate details |
| CandidateDashboardScreen | CandidateDashboard | Candidate | Candidate portal |
| EditCandidateProfileScreen | EditCandidateProfile | Candidate | Edit profile and upload files |
| ManifestoViewerScreen | ManifestoViewer | Candidate | View/download manifesto |
| AdminDashboardScreen | AdminDashboard | Admin/Officer | Admin portal |
| AdminCandidatesScreen | AdminCandidates | Admin/Officer | Manage nominations |
| AdminPositionsScreen | AdminPositions | Admin/Officer | Manage positions |
| AdminCreatePositionScreen | AdminCreatePosition | Admin/Officer | Create new position |
| AdminCreateOfficerScreen | AdminCreateOfficer | Admin | Create officer account |
| AdminCreateCandidateScreen | AdminCreateCandidate | Admin | Create candidate nomination |
| AdminVotersScreen | AdminVoters | Admin/Officer | Manage voters list |
| AuditLogScreen | AuditLog | Admin/Officer | View system logs |

**Total Screens**: 17
