# MediQueue - Complete Interview Preparation

## Project Overview

MediQueue is a **hospital queue management system** with **AI-powered clinical decision support** and an **AI chatbot for appointment booking**. It helps clinics manage patient flow, doctor queues, and provides AI-generated clinical summaries for better healthcare delivery.

**Live URL:** https://medi-queue-beige.vercel.app

**Problem Solved:**
- Long wait times in hospitals due to manual queue management
- Doctors spending too much time on documentation
- Lack of structured clinical data for patient handovers
- No AI support for clinical decision-making
- Patients calling医院 for basic appointment booking

**Solution:**
- Real-time digital queue management
- AI-powered clinical data extraction from doctor notes
- Structured clinical data storage (conditions, medications, allergies, observations)
- Clinical Agent for generating handover summaries and risk assessments
- AI chatbot for guided appointment booking (doctor → date → slot)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TypeScript |
| UI Components | shadcn/ui, Tailwind CSS, Lucide Icons |
| Backend | Next.js API Routes (App Router) |
| Database | PostgreSQL (Neon Serverless) |
| AI Integration | OpenRouter API (GPT-4.1-nano) |
| Authentication | NextAuth.js (Credentials Provider) |
| State Management | TanStack Query (React Query) |
| Forms | React Hook Form + Zod |
| Deployment | Vercel |

---

## Quick Demo Access

**Password for all accounts:** `Admain`

| Role | Email | What You Can Do |
|------|-------|-----------------|
| Admin | admin@gmail.com | Dashboard, Queue Management, Doctors, Reports |
| Doctor | doctor@gmail.com | My Queue, Complete Appointments, AI Notes |
| Patient | patient@gmail.com | Book Appointments, My Appointments, Chatbot |

---

## Key Features

### 1. AI Chatbot (Appointment Booking)
**What it does:** Guided appointment booking through natural conversation

**Flow:** Doctor name → Date selection → Time slot → Confirmation

**Intents Detected:**
| Intent | Trigger Examples |
|--------|------------------|
| FAQ | "What are hospital timings?", "Do you accept insurance?" |
| DOCTOR | "Who are the doctors?", "Show me the heart doctor" |
| SYMPTOM | "I have fever", "My knee hurts" |
| APPOINTMENT | "Book appointment", "I want to see Dr. X" |
| QUEUE | "What's my queue status?" |
| HISTORY | "Show my medical history" |

**Booking Examples:**
```
You:    How can I book an appointment?
Bot:    Please provide a doctor name.

You:    Dr. Meena Iyer
Bot:    When would you like the appointment?
        • Reply with "today" for today
        • Reply with "tomorrow" for tomorrow
        • Or type a date like "2026-08-30"

You:    today
Bot:    Available slots: 09:00, 10:00, 11:00, 14:00, 15:00, 16:00, 17:00

You:    11:00
Bot:    ✅ Appointment Booked!
```

**Technical Details:**
- Intent detection: Deterministic pattern matching + LLM fallback
- Slot management: IST timezone handling, lunch break blocking
- Conversation memory: History passed to LLM for context

### 2. Queue Management
**What it does:** Real-time queue with patient status tracking

**Flow:** CHECKED_IN → WAITING → IN_PROGRESS → COMPLETED

**Features:**
- Auto queue number assignment per doctor
- Date-based queue filtering (defaults to today)
- Doctor-wise queue filtering
- Search patients by name

### 3. Doctor Workspace
**What it does:** Structured clinical data entry with AI assistance

**Features:**
- Chief complaint / notes textarea
- Tag-style UI for conditions, medications, allergies, observations
- "Extract from Notes" button - AI parses doctor notes into structured data
- AI summary generation
- Save & Complete appointment

**AI Extraction Example:**
- Doctor writes: "Hypertension. Prescribing Amlodipine 5mg. Allergic to Penicillin."
- AI extracts:
  - Conditions: ["Hypertension"]
  - Medications: ["Amlodipine 5mg"]
  - Allergies: ["Penicillin"]

### 4. Patient Detail Page
**What it does:** Comprehensive patient view with clinical data

**Sections:**
- Hero Section: Patient name, email, phone, join date, risk badges
- Stats Row: Total visits, medications, allergies, risk flags
- Clinical Summary: Active problems, medications, allergies, observations
- Clinical Agent: AI-powered document generation
- Saved Drafts: Previously generated clinical documents

### 5. AI Clinical Agent
**What it does:** Generates concise clinical documents from patient context

**Document Types:**
1. Handover Summary - For shift changes
2. Patient Summary - For new clinicians seeing the patient
3. Risk Flags - Clinical risk assessment
4. Missing Information - Gaps in patient record

### 6. Report Analyzer
**What it does:** Upload and analyze medical reports

**Features:**
- Upload PDF/image reports
- AI-powered report analysis (Key Findings, Abnormal Results, Recommendations)
- Store reports in database

---

## Doctor List

| Doctor | Specialty |
|--------|-----------|
| Dr. Priya Sharma | Cardiology (Heart) |
| Dr. Rahul Verma | Orthopedics (Bones & Joints) |
| Dr. Anita Desai | Pediatrics (Children) |
| Dr. Vikram Patel | Dermatology (Skin) |
| Dr. Meena Iyer | General Medicine |

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
| appointment_date | TIMESTAMP | Scheduled time (stored as UTC) |
| queue_number | INTEGER | Queue position |
| status | ENUM | PENDING, CONFIRMED, CHECKED_IN, WAITING, IN_PROGRESS, COMPLETED, CANCELLED |

### Clinical Tables

**patient_conditions** | **patient_medications** | **patient_allergies** | **patient_observations**

Each stores structured clinical data linked to patient and visit.

---

## Demo Flow

### Chatbot Demo (2 minutes)

1. Go to https://medi-queue-beige.vercel.app/login
2. Login as **Patient** (patient@gmail.com / Admain)
3. Click the **blue chat bubble** in bottom-right
4. Try: "How can I book an appointment?"
5. Follow: Doctor → Date → Time → Booked!
6. Try: "What are hospital timings?" (FAQ)
7. Try: "I have fever" (Symptom → Doctor recommendation)

### Admin Demo (2 minutes)

1. Login as **Admin** (admin@gmail.com / Admain)
2. View Dashboard with stats
3. Go to Queue Management → See today's patients
4. Go to Doctors → View 5 seeded doctors
5. Go to Report Analyzer → Upload a medical report

### Doctor Demo (2 minutes)

1. Login as **Doctor** (doctor@gmail.com / Admain)
2. Go to My Queue → See today's patients
3. Click "Complete" on a patient
4. Type notes → Click "Extract from Notes"
5. Click "Generate AI Summary"
6. Click "Save & Complete"

---

## Architecture

### Folder Structure
```
src/
├── app/
│   ├── (dashboard)/           # Protected dashboard routes
│   │   ├── patients/
│   │   ├── queue/
│   │   ├── my-queue/
│   │   └── my-appointments/
│   └── api/
│       ├── chat/route.ts              # Chatbot API
│       ├── appointments/route.ts      # CRUD appointments
│       ├── appointments/availability/ # Slot availability
│       ├── queue/
│       ├── patients/[id]/
│       │   ├── context/route.ts
│       │   └── agent/route.ts
│       └── ai/
│           ├── summary/route.ts
│           └── extract-clinical/route.ts
├── components/
│   ├── chat/hospital-chat.tsx         # Chatbot UI
│   ├── appointments/                  # Appointment forms
│   ├── patients/                      # Patient views
│   └── queue/                         # Queue management
└── lib/
    ├── ai/client.ts                   # OpenAI client
    ├── queries/
    │   ├── appointment-agent.ts       # Chatbot booking logic
    │   ├── doctor-agent.ts            # Doctor search & symptoms
    │   ├── appointments.ts            # DB queries
    │   └── rag.ts                     # FAQ retrieval
    └── utils.ts                       # Utility functions
```

### Data Flow

```
Chatbot Flow:
User message → Intent Detection → Route Handler → Extract Details → Validate → Book

Clinical Flow:
Doctor writes notes → AI extracts structured data → Save to clinical tables → Patient Detail reads → Clinical Agent generates summaries
```

---

## Key Talking Points

### AI Integration
"We use OpenRouter API with GPT-4.1-nano for cost-effective AI. The chatbot uses intent detection (deterministic patterns + LLM fallback) to route messages. The Extract from Notes feature parses doctor notes into structured clinical data."

### Chatbot Design
"The chatbot guides users through a 4-step booking flow: Doctor name → Date → Time slot → Confirmation. It handles timezone conversion (IST/UTC), blocks lunch breaks, and validates working hours."

### Clinical Data Flow
"Doctor writes notes in Doctor Workspace. AI extracts structured data (conditions, medications, allergies, observations). Data saved to clinical tables. Patient Detail page queries clinical tables directly. Clinical Agent uses this data for summaries."

### Database Design
"PostgreSQL was chosen for relational data with foreign keys. Appointment timestamps stored in IST and converted to UTC for storage. Clinical data in separate tables for fast queries."

---

## Common Interview Questions

**Q: How does the chatbot booking work?**
A: User says "book appointment" → Intent detected as APPOINTMENT → Bot asks for doctor name → User provides name → Bot asks for date → User says "today" → Bot shows available slots → User picks a time → Appointment created with IST→UTC conversion.

**Q: How does intent detection work?**
A: Two-layer approach: (1) Deterministic pattern matching for common flows (name after "provide doctor name" → APPOINTMENT), (2) LLM fallback for ambiguous cases. This is fast and reliable.

**Q: How do you handle timezone issues?**
A: Database stores UTC. User inputs are IST. Before storage, IST is converted to UTC. On display, UTC is converted back to IST using toLocaleString with timeZone: "Asia/Kolkata".

**Q: How does the AI extraction work?**
A: Doctor writes free-text notes. We send them to GPT-4.1-nano with a prompt to extract structured clinical data. The AI returns JSON which we save to clinical tables.

**Q: Why PostgreSQL?**
A: Relational data with foreign keys (patients → appointments → notes → clinical data). Complex queries for queue management and patient context.

**Q: How do you handle AI errors?**
A: Fallback to mock output if API key missing. Graceful degradation - app works without AI. Deterministic intent detection ensures chatbot works even if LLM fails.

**Q: What about data security?**
A: Patient data is UUID-based. API routes require authentication. No sensitive data in AI prompts. Timezone-safe date handling prevents data corruption.

**Q: What would you improve?**
A: WebSocket for real-time updates, push notifications for queue changes, mobile app, integration with hospital EMR systems, multi-language chatbot support.

---

## Files to Show in Interview

| File | Purpose |
|------|---------|
| src/app/api/chat/route.ts | Chatbot intent detection + routing |
| src/lib/queries/appointment-agent.ts | Booking logic with date/time validation |
| src/lib/queries/appointments.ts | DB queries with IST→UTC conversion |
| src/components/chat/hospital-chat.tsx | Chatbot UI |
| src/components/common/doctor-notes-modal.tsx | Doctor Workspace UI |
| src/app/api/ai/extract-clinical/route.ts | AI extraction endpoint |
| src/lib/utils.ts | formatDateTime with IST timezone |
