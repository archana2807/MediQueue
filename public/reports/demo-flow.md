# MediQueue Demo Flow

## Step 1: Login

1. Go to `http://localhost:3000/login`
2. Use demo credentials:
   - **Admin:** admin@gmail.com / Admain
   - **Doctor:** doctor@gmail.com / Admain
   - **Patient:** patient@gmail.com
3. Click **Login**

---

## Step 2: Dashboard

After login, you'll see the Dashboard with:
- **Stats Cards:** Appointments, Today's Patients, Doctors Available, Queue Waiting
- **Recent Appointments:** Latest appointments across the hospital

---

## Step 3: Queue Management

1. Click **Queue** in the sidebar
2. See today's patients filtered by doctor
3. Use the **date picker** to view different days
4. Use the **doctor filter** to see specific doctor's queue
5. Queue statuses:
   - CHECKED_IN (Blue)
   - WAITING (Violet)
   - IN_PROGRESS (Cyan)
   - COMPLETED (Green)

---

## Step 4: View Patient Details

1. Click the **user icon** on any queue row
2. Patient Detail page opens with:
   - **Hero Section:** Patient name, email, phone, join date
   - **Stats Row:** Total visits, medications, allergies, risk flags
   - **Clinical Summary:** Active problems, medications, allergies, observations
   - **Clinical Agent:** AI-powered document generation
   - **Saved Drafts:** Previously generated documents

---

## Step 5: Complete Appointment (Doctor Workspace)

1. Go back to Queue
2. Click **Complete** on an IN_PROGRESS patient
3. **Doctor Workspace** modal opens
4. Enter notes in the textarea
5. Click **Extract from Notes** to auto-fill clinical data
6. Add/edit conditions, medications, allergies, observations
7. Click **Generate AI Summary**
8. Click **Save & Complete**

---

## Step 6: Clinical Agent

1. Go to Patient Detail page
2. In the **Clinical Agent** panel, select a task:
   - Handover Summary
   - Patient Summary
   - Risk Flags
   - Missing Info
3. Click **Run Agent**
4. View the generated summary
5. Click **Save as Draft** to save it

---

## Step 7: Saved Drafts

1. In Patient Detail page, see the **Saved Drafts** panel
2. Previously generated documents appear here
3. Click to expand and read
4. Click delete icon to remove

---

## Step 8: My Queue (Doctor View)

1. Login as Doctor (doctor@gmail.com)
2. Click **My Queue** in sidebar
3. See only your patients in queue
4. Complete appointments from here

---

## Step 9: My Patients (Doctor View)

1. Click **My Patients** in sidebar
2. See all patients you've treated
3. Click view icon to see patient details

---

## Step 10: Reports

1. Click **Reports** in sidebar
2. Upload a medical report (PDF/image)
3. AI analyzes the report
4. View analysis results

---

## Key Features to Highlight

### 1. Real-Time Queue
- Auto queue number assignment
- Status tracking (CHECKED_IN → WAITING → IN_PROGRESS → COMPLETED)
- Date and doctor filtering

### 2. Doctor Workspace
- Structured clinical data entry
- AI-powered "Extract from Notes"
- Tag-style UI for clinical items

### 3. Patient Detail Page
- Comprehensive patient view
- Clinical summary from database
- AI-powered clinical agent

### 4. Clinical Agent
- Handover Summary for shift changes
- Patient Summary for new clinicians
- Risk Flags assessment
- Missing Information analysis

### 5. AI Integration
- OpenRouter API with GPT-4.1-nano
- Clinical data extraction
- Document generation
- Report analysis

---

## Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gmail.com | Admain |
| Doctor | doctor@gmail.com | Admain |
| Patient | patient@gmail.com | - |

---

## Tech Stack

- **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, PostgreSQL
- **AI:** OpenRouter API (GPT-4.1-nano)
- **Auth:** NextAuth.js
- **State:** TanStack Query

---

## Database

- **Users:** Admin, Doctors, Patients
- **Appointments:** Queue with status tracking
- **Clinical Data:** Conditions, Medications, Allergies, Observations
- **Notes:** Doctor notes + AI summaries
- **Reports:** Medical reports with AI analysis

---

## Test Data

- 5 Doctors (Cardiology, Orthopedics, Pediatrics, Dermatology, General Medicine)
- 12 Patients with clinical data
- 10 today's appointments (various statuses)
- 6 past completed appointments
- 12 conditions, 14 medications, 8 allergies, 18 observations
