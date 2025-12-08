# Admin Standard Operating Procedures (SOP)
**E-Voting System - University Elections**

---

## Table of Contents
1. [Account Recovery](#1-account-recovery)
2. [Managing Elections](#2-managing-elections)
3. [Exporting Reports](#3-exporting-reports)
4. [Managing Voters](#4-managing-voters)
5. [Managing Candidates](#5-managing-candidates)
6. [Managing Positions](#6-managing-positions)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Account Recovery

### 1.1 Admin Password Reset
**If you forget your admin password:**

1. Navigate to the login screen
2. Click "Forgot Password?"
3. Enter your admin email address
4. Check your email for a 6-digit OTP code
5. Enter the OTP code within 5 minutes
6. Set your new password (minimum 8 characters)
7. Log in with your new credentials

**Note:** OTP codes expire after 5 minutes. You can request a new code after 60 seconds.

### 1.2 Candidate Password Reset
**To help a candidate reset their password:**

1. Instruct the candidate to use the "Forgot Password" feature
2. They will receive an OTP via email
3. Verify their identity before assisting further
4. If email issues occur, check the backend logs for email delivery status

### 1.3 Emergency Admin Recovery
**If locked out completely:**

1. Access the backend server directly
2. Run the admin recovery script:
   ```bash
   cd backend
   node scripts/create-admin.js
   ```
3. Follow the prompts to create a new admin account
4. Log in with the new credentials

---

## 2. Managing Elections

### 2.1 Setting Up an Election

**Step-by-step process:**

1. **Create Positions**
   - Go to Admin Dashboard → Positions
   - Click "Create Position"
   - Fill in:
     - Position name (e.g., "President", "Class Rep Science")
     - Number of seats (usually 1)
     - Constituency (optional - leave blank for general positions)
     - Start date and time
     - End date and time
   - Click "Create"

2. **Import Voters**
   - Go to Admin Dashboard → Voters
   - Click "Import CSV"
   - Upload a CSV file with columns: `regNo,name,email,phone`
   - System will auto-assign constituencies based on registration numbers:
     - 001-005 → Science
     - 006-010 → Arts
     - Others → General
   - Verify import was successful

3. **Approve Candidates**
   - Go to Admin Dashboard → Candidates
   - Review pending candidate applications
   - Check manifesto and photo
   - Click "Approve" or "Reject"
   - Approved candidates will appear on the ballot

### 2.2 Monitoring an Active Election

**During voting:**

1. **Check Turnout**
   - Dashboard shows real-time turnout percentage
   - Monitor votes cast vs. total eligible voters

2. **View Audit Log**
   - Admin Dashboard → Audit Log
   - Monitor all system activities
   - Look for suspicious patterns

3. **Handle Voter Issues**
   - Check if voter is in the system (Voters tab)
   - Verify OTP emails are being sent (check backend logs)
   - Ensure voter hasn't already voted

### 2.3 Closing an Election

**When voting period ends:**

1. **Automatic Closure**
   - Elections automatically close at the end date/time
   - No manual intervention needed

2. **Manual Closure (if needed)**
   - Go to Admin Dashboard → Positions
   - Click "Edit" on the position
   - Set end date to current time
   - Click "Update"

3. **Verify Closure**
   - Try to vote as a test voter
   - Should receive "Election has ended" message

---

## 3. Exporting Reports

### 3.1 Turnout Report

**CSV Export:**
```
GET /api/reports/export/turnout-csv
```
- Navigate to Admin Dashboard
- Click "Export Turnout (CSV)"
- File downloads automatically
- Contains: Total Voters, Votes Cast, Turnout %

**PDF Export:**
```
GET /api/reports/export/turnout-pdf
```
- Click "Export Turnout (PDF)"
- Professional formatted PDF with summary

### 3.2 Results Report

**CSV Export:**
```
GET /api/reports/export/results-csv
```
- Click "Export Results (CSV)"
- Contains: Position, Candidate Name, Program, Votes
- Import into Excel for analysis

**PDF Export:**
```
GET /api/reports/export/results-pdf
```
- Click "Export Results (PDF)"
- Includes candidate photos and vote percentages
- Shows winners with badges

### 3.3 Audit Log Export

**CSV Export:**
```
GET /api/reports/export/audit-csv
```
- Admin Dashboard → Audit Log
- Click "Export CSV"
- Contains: Date, Actor Type, Action, Entity, Details
- Last 1000 records

**PDF Export:**
```
GET /api/reports/export/audit-pdf
```
- Click "Export PDF"
- Professional table format
- Paginated for large datasets

---

## 4. Managing Voters

### 4.1 Importing Voters

**CSV Format:**
```csv
regNo,name,email,phone
S24D14/001,John Doe,john@example.com,+256700000001
S24D14/006,Jane Smith,jane@example.com,+256700000002
```

**Import Process:**
1. Prepare CSV file with correct format
2. Admin Dashboard → Voters → Import CSV
3. Select file
4. Click "Upload"
5. System validates and imports
6. Check for errors in response

**Auto-Constituency Assignment:**
- Registration numbers ending in 001-005 → Science
- Registration numbers ending in 006-010 → Arts
- Others → General (can vote for all positions)

### 4.2 Viewing Voters

1. Admin Dashboard → Voters
2. View list with:
   - Registration number
   - Name
   - Email
   - Phone
   - Constituency
   - Status (ELIGIBLE/VOTED)

### 4.3 Checking if Voter Has Voted

1. Search for voter by registration number
2. Check "Status" column
3. "VOTED" = already cast ballot
4. "ELIGIBLE" = can still vote

---

## 5. Managing Candidates

### 5.1 Approving Candidates

1. Admin Dashboard → Candidates
2. Filter by "Pending" status
3. Review each candidate:
   - Name and program
   - Position they're running for
   - Manifesto (PDF)
   - Photo
4. Click "Approve" or "Reject"
5. Candidate receives email notification

### 5.2 Creating Candidates (Admin-initiated)

1. Admin Dashboard → Candidates
2. Click "Create Candidate"
3. Fill in:
   - Name
   - Email
   - Program
   - Position
   - Upload photo
   - Upload manifesto (PDF only)
4. Click "Create"
5. Candidate receives login credentials via email

### 5.3 Editing Candidate Information

1. Find candidate in list
2. Click "Edit"
3. Update allowed fields:
   - Name
   - Program
   - Photo
   - Manifesto
4. Save changes

---

## 6. Managing Positions

### 6.1 Creating Positions

1. Admin Dashboard → Positions
2. Click "Create Position"
3. Required fields:
   - **Name**: Position title (e.g., "President")
   - **Seats**: Number of winners (usually 1)
   - **Start Date**: When voting opens
   - **End Date**: When voting closes
4. Optional fields:
   - **Constituency**: Leave blank for general positions
     - Set to "Science" for Science-only positions
     - Set to "Arts" for Arts-only positions

### 6.2 Editing Positions

1. Find position in list
2. Click "Edit"
3. Update dates or details
4. **Warning**: Changing dates affects active elections
5. Save changes

### 6.3 Deleting Positions

1. Find position in list
2. Click "Delete"
3. Confirm deletion
4. **Warning**: Cannot delete positions with votes cast

---

## 7. Troubleshooting

### 7.1 Voters Not Receiving OTP Emails

**Possible causes:**
1. Email server configuration issue
2. Voter's email is incorrect
3. Email in spam folder

**Solutions:**
1. Check backend logs for email errors:
   ```bash
   cd backend
   npm run dev
   # Look for "Email sent" or "Email failed" messages
   ```
2. Verify email configuration in `.env`:
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```
3. Test email manually:
   ```bash
   node backend/test-email.js
   ```
4. Ask voter to check spam folder
5. Verify voter's email in database is correct

### 7.2 Candidate Can't Upload Manifesto

**Error: "Manifesto must be a PDF file"**

**Solution:**
1. Ensure file is actually PDF format
2. File size should be under 5MB
3. Try converting to PDF using online tools
4. Re-upload

### 7.3 Results Not Showing

**Possible causes:**
1. No votes cast yet
2. Election hasn't ended
3. Browser cache issue

**Solutions:**
1. Check if any votes have been cast (Turnout report)
2. Verify election end date has passed
3. Refresh page (Ctrl+F5)
4. Clear browser cache

### 7.4 Voter Says "Already Voted" But Didn't

**Investigation steps:**
1. Admin Dashboard → Voters
2. Search for voter's registration number
3. Check "Status" column
4. If shows "VOTED", check Audit Log:
   - Search for voter's ID
   - Look for "VOTE_CAST" action
   - Check timestamp
5. If fraudulent, contact system administrator

**Prevention:**
- OTP system prevents duplicate voting
- Each OTP is single-use
- Audit log tracks all votes

### 7.5 System Performance Issues

**Symptoms:**
- Slow page loads
- Timeouts
- Database errors

**Solutions:**
1. Check server resources:
   ```bash
   top  # Linux
   Task Manager  # Windows
   ```
2. Restart backend server:
   ```bash
   cd backend
   npm run dev
   ```
3. Check database connection
4. Review audit log for unusual activity
5. Contact system administrator if issues persist

### 7.6 Mobile App Not Connecting

**Error: "Network Error"**

**Solutions:**
1. Verify backend is running
2. Check IP address in mobile app:
   - File: `mobile/services/api.js`
   - Update `API_URL` to current IP
3. Ensure mobile device and backend are on same network
4. Restart Expo server:
   ```bash
   cd mobile
   npx expo start
   ```
5. Reload app on device

---

## Quick Reference

### Important API Endpoints
```
POST   /api/auth/login                    - Admin login
GET    /api/reports/turnout               - Turnout statistics
GET    /api/reports/results               - Election results
GET    /api/reports/export/turnout-csv    - Export turnout CSV
GET    /api/reports/export/results-pdf    - Export results PDF
GET    /api/reports/export/audit-csv      - Export audit log CSV
GET    /api/voters                        - List voters
POST   /api/voters/import                 - Import voters CSV
GET    /api/candidates                    - List candidates
PUT    /api/candidates/:id/approve        - Approve candidate
GET    /api/positions                     - List positions
POST   /api/positions                     - Create position
```

### Emergency Contacts
- **System Administrator**: wjdaniel379@gmail.comw 
- **Technical Support**: trizzydaniels352@gmail.com 
- **Database Admin**: techwiz25rs@gmail.com 

---

## Best Practices

1. **Before Election:**
   - Test the entire voting flow
   - Import voters at least 24 hours before
   - Approve candidates 12 hours before voting starts
   - Send test emails to verify email system

2. **During Election:**
   - Monitor turnout every hour
   - Check audit log for anomalies
   - Be available for voter support
   - Don't make changes to positions or candidates

3. **After Election:**
   - Export all reports immediately
   - Backup database
   - Archive audit logs
   - Generate final results PDF

4. **Security:**
   - Never share admin credentials
   - Log out after each session
   - Use strong passwords (12+ characters)
   - Enable two-factor authentication if available
   - Review audit logs weekly

---

**Document Version:** 1.0  
**Last Updated:** December 2025  
**Maintained by:** E-Voting System Team
