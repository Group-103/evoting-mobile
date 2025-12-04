# E-Voting Mobile Application

<div align="center">

**A secure, transparent digital voting system for university elections**

[![React Native](https://img.shields.io/badge/React_Native-0.76-61DAFB.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK_52-000020.svg)](https://expo.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5.1-brightgreen.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-Prisma_6.19-orange.svg)](https://www.mysql.com/)

</div>

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Features by Role](#features-by-role)
4. [User Journeys](#user-journeys)
5. [Entity Relationship Diagram](#entity-relationship-diagram)
6. [Project Structure](#project-structure)
7. [Setup Instructions](#setup-instructions)
8. [Environment Variables](#environment-variables)
9. [API Endpoints](#api-endpoints)
10. [Mobile Screens](#mobile-screens)
11. [Security Features](#security-features)

---

## 🎯 Project Overview

**E-Voting Mobile** is a comprehensive React Native application for conducting secure university elections. The system supports multiple user roles with a seamless mobile voting experience.

### Key Highlights

- ✅ **Secure OTP Authentication** - SMS/Email verification for voters
- ✅ **Secret Ballot System** - Anonymous voting with unique ballot tokens
- ✅ **One-Vote Enforcement** - Database constraints prevent double voting
- ✅ **Role-Based Access** - Admin, Officer, Candidate, Voter permissions
- ✅ **Real-time Results** - Live election statistics and charts
- ✅ **Audit Trail** - Complete activity logging for transparency
- ✅ **Dark/Light Mode** - User preference theming
- ✅ **Cross-Platform** - iOS & Android via Expo

---

## 🛠️ Tech Stack

### Mobile Application

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Native** | 0.76.6 | Mobile UI framework |
| **Expo** | SDK 52 | Development platform |
| **React Navigation** | 7.x | Screen navigation |
| **Axios** | 1.7.9 | HTTP client |
| **AsyncStorage** | 2.1.0 | Local data persistence |
| **react-native-chart-kit** | 6.12.0 | Results visualization |
| **expo-document-picker** | 13.0.1 | File uploads |
| **expo-image-picker** | 16.0.3 | Photo capture |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Runtime environment |
| **Express.js** | 5.1.0 | Web framework |
| **Prisma ORM** | 6.19.0 | Database toolkit |
| **MySQL** | 8.0 | Relational database |
| **JWT** | 9.0.2 | Authentication tokens |
| **Bcrypt** | 3.0.3 | Password hashing |
| **Multer** | 2.0.2 | File uploads |
| **Nodemailer** | 7.0.10 | Email service |

---

## ✨ Features by Role

### 👨‍💼 Admin
- Create/edit/delete election positions
- Upload eligible voters via CSV
- Create returning officers
- View live results & turnout
- Access complete audit log
- Manage candidates

### 👮 Returning Officer
- Approve/reject candidate nominations
- View candidate manifestos (PDF)
- Monitor positions and voters
- View live election results

### 🎯 Candidate
- Self-registration
- Submit nominations with manifesto
- Upload profile photo
- Track approval status
- View election results

### 🗳️ Voter
- OTP verification (Email/SMS)
- Secret ballot voting
- View candidate profiles
- One vote per position

---

## 🚀 User Journeys

### Voter Flow
```
Welcome → Voter Login → Enter Reg No → Request OTP → Verify OTP 
→ Receive Ballot Token → View Positions → Select Candidates 
→ Submit Vote → Ballot Consumed → Logout
```

### Candidate Flow
```
Welcome → Register as Candidate → Login → Candidate Dashboard
→ Submit Nomination (Select Position, Upload Photo, Upload Manifesto)
→ Track Status (PENDING → APPROVED/REJECTED) → View Results
```

### Officer Flow
```
Welcome → Login → Officer Dashboard → Approve Nominations
→ View Candidate Manifesto → Approve/Reject with Reason
→ View Results
```

### Admin Flow
```
Welcome → Login → Admin Dashboard → Manage Positions
→ Import Voters (CSV) → Create Officers → View Candidates
→ View Results → View Audit Log
```

---

## 📊 Entity Relationship Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│     User     │     │   Position   │     │  Candidate   │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id (PK)      │     │ id (PK)      │     │ id (PK)      │
│ email (UQ)   │     │ name         │     │ positionId   │──┐
│ password     │     │ seats        │     │ userId       │──┼──┐
│ name         │◄────┤ nominationOpens │  │ name         │  │  │
│ role         │     │ nominationCloses│  │ manifestoUrl │  │  │
│ regNo        │     │ votingOpens  │     │ photoUrl     │  │  │
│ program      │     │ votingCloses │     │ status       │  │  │
└──────────────┘     └──────────────┘     └──────────────┘  │  │
                            │                    ▲          │  │
                            │                    │          │  │
                            ▼                    └──────────┘  │
┌──────────────┐     ┌──────────────┐                         │
│EligibleVoter │     │     Vote     │                         │
├──────────────┤     ├──────────────┤                         │
│ id (PK)      │     │ id (PK)      │                         │
│ regNo (UQ)   │     │ ballotId     │──┐                      │
│ name         │     │ positionId   │  │                      │
│ email        │     │ candidateId  │──┼──────────────────────┘
│ phone        │     │ castAt       │  │
└──────────────┘     └──────────────┘  │
       │                               │
       ▼                               │
┌──────────────┐     ┌──────────────┐  │
│ Verification │     │    Ballot    │◄─┘
├──────────────┤     ├──────────────┤
│ id (PK)      │     │ id (PK)      │
│ voterId      │     │ voterId      │
│ otpHash      │     │ token (UQ)   │
│ expiresAt    │     │ status       │
│ verifiedAt   │     │ consumedAt   │
└──────────────┘     └──────────────┘

┌──────────────┐     ┌──────────────┐
│PasswordReset │     │  AuditLog    │
├──────────────┤     ├──────────────┤
│ id (PK)      │     │ id (PK)      │
│ userId       │     │ actorType    │
│ otpHash      │     │ action       │
│ expiresAt    │     │ entity       │
│ resetAt      │     │ createdAt    │
└──────────────┘     └──────────────┘
```

### Key Constraints
- `Vote`: `UNIQUE(ballotId, positionId)` - One vote per position per ballot
- `Ballot`: `UNIQUE(token)` - Unique ballot tokens
- `EligibleVoter`: `UNIQUE(regNo)` - Unique registration numbers

---

## 📁 Project Structure

```
evote@university/
├── mobile/                     # React Native Expo App
│   ├── screens/
│   │   ├── WelcomeScreen.js          # Role selection
│   │   ├── LoginScreen.js            # Admin/Officer/Candidate login
│   │   ├── VoterLoginScreen.js       # Voter OTP login
│   │   ├── CandidateSignupScreen.js  # Candidate registration
│   │   ├── DashboardScreen.js        # Voter ballot
│   │   ├── AdminDashboardScreen.js   # Admin/Officer dashboard
│   │   ├── CandidateDashboardScreen.js
│   │   ├── AdminCandidatesScreen.js  # Nomination approval
│   │   ├── AdminPositionsScreen.js
│   │   ├── AdminVotersScreen.js
│   │   ├── ResultsScreen.js          # Live results charts
│   │   ├── AuditLogScreen.js
│   │   └── EditCandidateProfileScreen.js
│   ├── services/
│   │   └── api.js                # Axios API configuration
│   ├── contexts/
│   │   └── ThemeContext.js       # Dark/Light mode
│   ├── App.js                    # Navigation setup
│   └── package.json
│
├── backend/                    # Node.js Express API
│   ├── prisma/
│   │   └── schema.prisma         # Database schema
│   ├── src/
│   │   ├── controllers/          # Request handlers
│   │   ├── routes/               # API routes
│   │   ├── middleware/           # Auth middleware
│   │   ├── utils/                # Helpers (email, audit)
│   │   └── server.js             # Express server
│   ├── uploads/                  # Photos & manifestos
│   └── package.json
│
├── docs/                       # Documentation
│   ├── USER_JOURNEYS.md
│   ├── FLOWCHARTS_ERD.md
│   └── FEATURE_SUMMARY.md
│
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** v18+
- **MySQL** 8.0+
- **Expo CLI** (`npm install -g expo-cli`)
- **Expo Go** app on your phone

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment (create .env file)
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed admin account
npx prisma db seed

# Start server
npm run dev
```

### Mobile Setup

```bash
cd mobile

# Install dependencies
npm install

# Update API URL in services/api.js
# Change to your computer's IP address:
# const API_URL = 'http://YOUR_IP:5000/api';

# Start Expo
npx expo start

# Scan QR code with Expo Go app
```

---

## 🔧 Environment Variables

### Backend `.env`

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/evote"

# Auth
JWT_SECRET="your-secret-key"

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"

# Email (for OTP)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

### Mobile `api.js`

```javascript
const API_URL = 'http://YOUR_LOCAL_IP:5000/api';
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | User login |
| POST | `/auth/register` | Candidate registration |
| GET | `/auth/me` | Get current user |

### Voter Verification
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/verify/request` | Request OTP |
| POST | `/verify/verify` | Verify OTP |

### Voting
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/vote/ballot` | Get ballot |
| POST | `/vote` | Cast vote |

### Candidates
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/candidates` | Get all (Admin/Officer) |
| GET | `/candidates/my` | Get own nominations |
| POST | `/candidates` | Submit nomination |
| PATCH | `/candidates/:id/approve` | Approve (Officer) |
| PATCH | `/candidates/:id/reject` | Reject (Officer) |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reports/results` | Election results |
| GET | `/reports/turnout` | Voter turnout |
| GET | `/reports/audit` | Audit log (Admin) |

---

## 📱 Mobile Screens

| Screen | Role | Description |
|--------|------|-------------|
| WelcomeScreen | All | Role selection |
| LoginScreen | Staff | Email/password login |
| VoterLoginScreen | Voter | Reg number + OTP |
| CandidateSignupScreen | New | Self-registration |
| DashboardScreen | Voter | Voting ballot |
| AdminDashboardScreen | Admin/Officer | Role-based dashboard |
| CandidateDashboardScreen | Candidate | Nomination portal |
| AdminCandidatesScreen | Admin/Officer | Manage nominations |
| AdminPositionsScreen | Admin | Manage positions |
| AdminVotersScreen | Admin | Manage voters |
| ResultsScreen | All staff | Live results charts |
| AuditLogScreen | Admin | Activity log |

---

## 🔐 Security Features

| Feature | Implementation |
|---------|----------------|
| **One-Vote Enforcement** | Ballot token + CONSUMED status + DB UNIQUE constraint |
| **Ballot Secrecy** | Votes linked to ballot UUID, not voter ID |
| **OTP Verification** | 6-digit OTP via Email/SMS, 10-minute expiry |
| **Password Security** | bcrypt hashing with salt |
| **JWT Authentication** | Bearer token with role claims |
| **Audit Logging** | Immutable log of all admin actions |
| **Input Validation** | Server-side validation on all endpoints |

---

## 👥 Team

**Group 103** - Web & Mobile Application Development, DIT 2025

---

## 📄 License

This project is developed for educational purposes.

---

**Last Updated**: December 2025 | **Version**: 1.0.0
