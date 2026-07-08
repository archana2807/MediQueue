# MediQueue - Complete Interview Preparation

## Project Overview

MediQueue is a **hospital queue management system** with **AI-powered clinical decision support**. It helps clinics manage patient flow, doctor queues, and provides AI-generated clinical summaries for better healthcare delivery.

**Problem Solved:**
- Long wait times in hospitals due to manual queue management
- Doctors spending too much time on documentation
- Lack of structured clinical data for patient handovers
- No AI support for clinical decision-making

**Solution:**
- Real-time digital queue management
- AI-powered clinical data extraction from doctor notes
- Structured clinical data storage (conditions, medications, allergies, observations)
- Clinical Agent for generating handover summaries and risk assessments

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TypeScript |
| UI Components | shadcn/ui, Tailwind CSS, Lucide Icons |
| Backend | Next.js API Routes (App Router) |
| Database | PostgreSQL (Neon Serverless) |
| AI Integration | OpenRouter API (GPT-4.1-nano) |
| Authentication | NextAuth.js |
| State Management | TanStack Query (React Query) |
| Forms | React Hook Form + Zod |

---

## Key Features

### 1. Queue Management
**What it does:** Real-time queue with patient status tracking

**Flow:** CHECKED_IN → WAITING → IN_PROGRESS → COMPLETED

**Features:**
- Auto queue number assignment per doctor
- Date-based queue filtering (defaults to today)
- Doctor-wise queue filtering
- Search patients by name

**API Endpoints:**
- GET /api/queue - Fetch queue with filters
- PUT /api/queue/[id] - Update queue status

### 2. Doctor Workspace
**What it does:** Structured clinical data entry with AI assistance

**Features:**
- Chief complaint / notes textarea
- Tag-style UI for conditions, medications, allergies, observations
- "Extract from Notes" button - AI parses doctor notes into structured data
- AI summary generation
- Save & Complete appointment

**AI Extraction:**
- Doctor writes: "Hypertension. Prescribing Amlodipine 5mg. Allergic to Penicillin."
- AI extracts:
  - Conditions: ["Hypertension"]
  - Medications: ["Amlodipine 5mg"]
  - Allergies: ["Penicillin"]

### 3. Patient Detail Page
**What it does:** Comprehensive patient view with clinical data

**Sections:**
- Hero Section: Patient name, email, phone, join date, risk badges
- Stats Row: Total visits, medications, allergies, risk flags
- Clinical Summary: Active problems, medications, allergies, observations
- Clinical Agent: AI-powered document generation
- Saved Drafts: Previously generated clinical documents
- Raw Data: JSON view of all patient data

### 4. AI Clinical Agent
**What it does:** Generates concise clinical documents from patient context

**Document Types:**
1. Handover Summary - For shift changes
2. Patient Summary - For new clinicians seeing the patient
3. Risk Flags - Clinical risk assessment
4. Missing Information - Gaps in patient record

**Output Format:** Concise 5-6 line summaries (not lengthy documents)

### 5. Reports Management
**What it does:** Upload and analyze medical reports

**Features:**
- Upload PDF/image reports
- AI-powered report analysis
- Store reports in database

---

## Architecture

### Folder Structure
```
src/
├── app/
│   ├── (dashboard)/           # Protected dashboard routes
│   │   ├── patients/
│   │   │   ├── page.tsx       # Patient list
│   │   │   └── [id]/page.tsx  # Patient detail
│   │   ├── queue/page.tsx     # Admin queue view
│   │   ├── my-queue/page.tsx  # Doctor's queue
│   │   ├── my-patients/page.tsx
│   │   └── my-appointments/page.tsx
│   └── api/
│       ├── queue/
│       │   ├── route.ts       # GET queue list
│       │   └── [id]/route.ts  # PUT queue status
│       ├── my-queue/route.ts  # Doctor's queue
│       ├── patients/
│       │   └── [id]/
│       │       ├── context/route.ts  # Patient context
│       │       └── agent/route.ts    # Clinical agent
│       ├── ai/
│       │   ├── summary/route.ts      # AI summary
│       │   └── extract-clinical/route.ts  # Clinical extraction
│       └── drafts/route.ts   # Saved drafts CRUD
├── components/
│   ├── common/
│   │   ├── doctor-notes-modal.tsx  # Doctor Workspace
│   │   ├── data-table.tsx          # Reusable data table
│   │   └── spinner.tsx
│   ├── patients/
│   │   ├── patient-context-card.tsx  # Clinical summary
│   │   ├── agent-panel.tsx          # AI agent panel
│   │   ├── saved-drafts-panel.tsx   # Drafts panel
│   │   ├── patients-table.tsx       # Patient list
│   │   └── doctor-patients-table.tsx
│   └── queue/
│       ├── queue-table.tsx       # Admin queue
│       ├── queue-actions.tsx     # Status buttons
│       └── doctor-queue-table.tsx
└── lib/
    ├── ai/
    │   ├── client.ts            # OpenAI client
    │   └── model.ts             # Model: gpt-4.1-nano
    ├── queries/
    │   ├── clinical-data.ts     # Clinical CRUD
    │   ├── patient-context.ts   # Context builder
    │   ├── appointment-notes.ts # Notes + clinical
    │   └── queue.ts             # Queue queries
    ├── db.ts                    # PostgreSQL pool
    └── auth.ts                  # NextAuth config
```

### Data Flow

```
Doctor writes notes
       ↓
Doctor Workspace UI
       ↓
Extract from Notes (AI) → Structured Clinical Data
       ↓
Save to Database (clinical tables)
       ↓
Patient Detail Page (reads clinical tables)
       ↓
Clinical Agent (generates summaries)
```

---

## Database Schema

### Core Tables

**users**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR | Full name |
| email | VARCHAR | Email (unique) |
| phone | VARCHAR | Phone number |
| password | VARCHAR | Hashed password |
| role | ENUM | ADMIN, DOCTOR, PATIENT |
| created_at | TIMESTAMP | Registration date |

**doctors**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK to users |
| specialization | VARCHAR | Cardiology, Orthopedics, etc. |

**appointments**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| patient_id | UUID | FK to users |
| doctor_id | UUID | FK to doctors |
| appointment_date | TIMESTAMP | Scheduled time |
| queue_number | INTEGER | Queue position |
| status | ENUM | CHECKED_IN, WAITING, IN_PROGRESS, COMPLETED |

**appointment_notes**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| appointment_id | UUID | FK to appointments |
| doctor_notes | TEXT | Doctor's free-text notes |
| ai_summary | TEXT | AI-generated summary |

### Clinical Tables

**patient_conditions**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| patient_id | UUID | FK to users |
| condition_name | TEXT | e.g., "Hypertension" |
| status | TEXT | "active" or "resolved" |
| visit_id | UUID | FK to appointments |

**patient_medications**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| patient_id | UUID | FK to users |
| name | TEXT | e.g., "Amlodipine" |
| dosage | TEXT | e.g., "5mg" |
| frequency | TEXT | e.g., "once daily" |
| visit_id | UUID | FK to appointments |

**patient_allergies**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| patient_id | UUID | FK to users |
| allergen | TEXT | e.g., "Penicillin" |
| severity | TEXT | "mild", "moderate", "severe" |
| visit_id | UUID | FK to appointments |

**patient_observations**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| patient_id | UUID | FK to users |
| observation | TEXT | e.g., "BP 140/90 mmHg" |
| visit_id | UUID | FK to appointments |

---

## Testing Data

### Login Credentials (Password: Admin)

| Role | Email | Description |
|------|-------|-------------|
| Admin | admin@mediqueue.com | Full system access |
| Doctor | priya.sharma@mediqueue.com | Cardiology specialist |
| Doctor | rahul.verma@mediqueue.com | Orthopedics specialist |
| Doctor | anita.desai@mediqueue.com | Pediatrics specialist |
| Doctor | vikram.patel@mediqueue.com | Dermatology specialist |
| Doctor | meena.iyer@mediqueue.com | General Medicine |
| Patient | amit.kumar@email.com | Cardiology patient |
| Patient | sneha.reddy@email.com | Orthopedics patient |
| Patient | karan.singh@email.com | Pediatrics patient |
| Patient | divya.nair@email.com | Dermatology patient |

### Doctors

| Name | Specialization | User ID |
|------|----------------|---------|
| Dr. Priya Sharma | Cardiology | a0000000-0000-0000-0000-000000000010 |
| Dr. Rahul Verma | Orthopedics | a0000000-0000-0000-0000-000000000011 |
| Dr. Anita Desai | Pediatrics | a0000000-0000-0000-0000-000000000012 |
| Dr. Vikram Patel | Dermatology | a0000000-0000-0000-0000-000000000013 |
| Dr. Meena Iyer | General Medicine | a0000000-0000-0000-0000-000000000014 |

### Today's Appointments (10)

| Patient | Doctor | Time | Status | Queue # |
|---------|--------|------|--------|---------|
| Amit Kumar | Dr. Priya | 9:00 AM | CHECKED_IN | 1 |
| Sneha Reddy | Dr. Priya | 9:30 AM | WAITING | 2 |
| Karan Singh | Dr. Priya | 10:00 AM | IN_PROGRESS | 3 |
| Divya Nair | Dr. Rahul | 9:00 AM | WAITING | 1 |
| Rohan Gupta | Dr. Rahul | 10:00 AM | CHECKED_IN | 2 |
| Pooja Joshi | Dr. Anita | 11:00 AM | CHECKED_IN | 1 |
| Arun Menon | Dr. Anita | 11:30 AM | PENDING | 2 |
| Neha Agarwal | Dr. Vikram | 10:00 AM | WAITING | 1 |
| Vikash Yadav | Dr. Meena | 9:00 AM | IN_PROGRESS | 1 |
| Riya Das | Dr. Meena | 10:00 AM | CONFIRMED | 2 |

### Past Appointments (6 Completed)

| Patient | Doctor | Days Ago | Notes |
|---------|--------|----------|-------|
| Amit Kumar | Dr. Priya | 7 days | Chest pain, ECG |
| Sneha Reddy | Dr. Rahul | 5 days | Knee pain, X-ray |
| Divya Nair | Dr. Anita | 3 days | Fever, cough |
| Pooja Joshi | Dr. Priya | 2 days | Hypertension follow-up |
| Vikash Yadav | Dr. Meena | 10 days | Lower back pain |
| Sanjay Mishra | Dr. Vikram | 4 days | Acne treatment |

### Clinical Data

**Conditions (12)**

| Patient | Condition | Status |
|---------|-----------|--------|
| Amit Kumar | Hypertension | Active |
| Amit Kumar | Hyperlipidemia | Active |
| Sneha Reddy | Osteoarthritis - Right Knee | Active |
| Sneha Reddy | Obesity | Active |
| Karan Singh | Upper Respiratory Infection | Resolved |
| Divya Nair | Allergic Contact Dermatitis | Active |
| Pooja Joshi | Hypertension | Active |
| Vikash Yadav | Type 2 Diabetes | Active |
| Vikash Yadav | Lower Back Pain | Active |
| Sanjay Mishra | Acne Vulgaris | Active |
| Deepa Nair | Migraine | Active |
| Deepa Nair | Iron Deficiency Anemia | Active |

**Medications (14)**

| Patient | Medication | Dosage | Frequency |
|---------|------------|--------|-----------|
| Amit Kumar | Betaloc | 25mg | Once daily |
| Amit Kumar | Atorvastatin | 10mg | Once daily at bedtime |
| Sneha Reddy | Ibuprofen | 400mg | Twice daily after food |
| Karan Singh | Paracetamol Syrup | 5ml | Every 6 hours |
| Karan Singh | Azithromycin | 200mg | Once daily for 3 days |
| Divya Nair | Hydrocortisone Cream | 1% | Apply twice daily |
| Divya Nair | Cetirizine | 10mg | Once daily |
| Pooja Joshi | Amlodipine | 5mg | Once daily |
| Vikash Yadav | Metformin | 500mg | Twice daily with meals |
| Vikash Yadav | Diclofenac | 50mg | Three times daily |
| Sanjay Mishra | Adapalene Gel | 0.1% | Apply at bedtime |
| Sanjay Mishra | Doxycycline | 100mg | Once daily |
| Deepa Nair | Sumatriptan | 50mg | As needed for migraine |
| Deepa Nair | Ferrous Sulphate | 325mg | Once daily |

**Allergies (8)**

| Patient | Allergen | Severity |
|---------|----------|----------|
| Amit Kumar | Penicillin | Severe |
| Amit Kumar | Shellfish | Moderate |
| Sneha Reddy | Aspirin | Mild |
| Divya Nair | Nickel | Moderate |
| Pooja Joshi | Sulfa Drugs | Severe |
| Vikash Yadav | Metformin | Mild |
| Deepa Nair | Ibuprofen | Moderate |
| Deepa Nair | Codeine | Severe |

**Observations (18)**

| Patient | Observation |
|---------|-------------|
| Amit Kumar | Blood Pressure: 140/90 mmHg |
| Amit Kumar | Heart Rate: 88 bpm |
| Amit Kumar | ECG: Mild ST changes |
| Amit Kumar | Cholesterol: 240 mg/dL |
| Sneha Reddy | Weight: 82 kg |
| Sneha Reddy | BMI: 31.2 (Obese) |
| Sneha Reddy | X-ray Right Knee: Mild OA changes |
| Karan Singh | Temperature: 101 F |
| Karan Singh | Throat: Congested, red |
| Divya Nair | Rash: Bilateral forearms, erythematous |
| Pooja Joshi | Blood Pressure: 138/88 mmHg |
| Pooja Joshi | Heart Rate: 76 bpm |
| Vikash Yadav | Fasting Blood Sugar: 180 mg/dL |
| Vikash Yadav | HbA1c: 8.2% |
| Vikash Yadav | Lumbar Spine: No disc herniation |
| Sanjay Mishra | Acne: Grade 3, face and back |
| Deepa Nair | Hemoglobin: 9.8 g/dL (Low) |
| Deepa Nair | Migraine frequency: 3-4 episodes/month |

---

## Demo Flow

### Step 1: Login
1. Go to /login
2. Enter: priya.sharma@mediqueue.com / Admin
3. Click Login

### Step 2: View Queue
1. Navigate to Queue page
2. See today's patients filtered by Dr. Priya
3. Notice queue numbers (1, 2, 3)
4. See status badges (CHECKED_IN, WAITING, IN_PROGRESS)

### Step 3: View Patient Details
1. Click user icon on any queue row
2. Patient Detail page opens
3. See hero section with patient info
4. See stats row (visits, medications, allergies, risks)
5. See clinical summary (conditions, meds, allergies, observations)

### Step 4: Complete Appointment
1. Go back to queue
2. Click "Complete" on IN_PROGRESS patient (Karan Singh)
3. Doctor Workspace modal opens
4. Type notes: "Fever resolved. No medications needed."
5. Click "Extract from Notes"
6. See AI extract observations
7. Click "Generate AI Summary"
8. Click "Save & Complete"

### Step 5: Clinical Agent
1. Go to Patient Detail page
2. Click "Handover Summary" in Agent panel
3. Click "Run Agent"
4. See concise summary generated
5. Click "Save as Draft"

### Step 6: Saved Drafts
1. See draft appear in Saved Drafts panel
2. Click to expand and read
3. Can delete if needed

---

## Key Talking Points

### AI Integration
"We use OpenRouter API with GPT-4.1-nano for cost-effective AI. The Extract from Notes feature uses AI to parse doctor notes into structured clinical data. The Clinical Agent generates concise summaries from patient context."

### Clinical Data Flow
"Doctor writes notes in Doctor Workspace. AI extracts structured data (conditions, medications, allergies, observations). Data saved to clinical tables. Patient Detail page queries clinical tables directly. Clinical Agent uses this data for summaries."

### Real-World Relevance
"Queue management reduces patient wait times. Structured clinical data improves care coordination. AI summaries save doctor documentation time. Handover summaries improve shift transitions."

### Database Design
"PostgreSQL was chosen for relational data with foreign keys. Clinical data is stored in separate tables for fast queries. UUID primary keys ensure data security."

---

## Files to Show

| File | Purpose |
|------|---------|
| src/components/common/doctor-notes-modal.tsx | Doctor Workspace UI |
| src/app/api/ai/extract-clinical/route.ts | AI extraction endpoint |
| src/app/api/patients/[id]/agent/route.ts | Clinical Agent API |
| src/lib/queries/patient-context.ts | Patient context builder |
| src/lib/queries/clinical-data.ts | Clinical data CRUD |
| scripts/seed-test-data.js | Test data seeder |

---

## Common Interview Questions

**Q: How does the AI extraction work?**
A: Doctor writes free-text notes. We send them to GPT-4.1-nano with a prompt to extract structured clinical data (conditions, medications, allergies, observations). The AI returns JSON which we save to clinical tables.

**Q: Why PostgreSQL?**
A: Relational data with foreign keys (patients → appointments → notes → clinical data). Complex queries for queue management and patient context.

**Q: How do you handle AI errors?**
A: Fallback to mock output if API key missing. Graceful degradation - app works without AI.

**Q: How is the clinical data used?**
A: Patient Detail page shows clinical summary. Clinical Agent uses it for handover summaries, risk assessments. All queries go directly to clinical tables for fast reads.

**Q: What about data security?**
A: Patient data is UUID-based. API routes require authentication. No sensitive data in AI prompts.

**Q: Why did you choose Next.js?**
A: Server-side rendering for fast initial load. API routes eliminate need for separate backend. App Router provides nested layouts.

**Q: How does the queue system work?**
A: Patients check in, get queue number. Status flows CHECKED_IN → WAITING → IN_PROGRESS → COMPLETED. Queue filtered by doctor and date.

**Q: What is the Clinical Agent?**
A: AI-powered tool that generates concise clinical documents (handover summaries, risk assessments) from patient context stored in clinical tables.

**Q: How do you handle real-time updates?**
A: TanStack Query with staleTime of 15 seconds. Refetch on user action. Optimistic updates for queue status changes.

**Q: What would you improve?**
A: WebSocket for real-time updates, push notifications for queue changes, mobile app, integration with hospital EMR systems.
