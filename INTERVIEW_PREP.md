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

### How to Access

1. Go to https://medi-queue-beige.vercel.app/login
2. Click on any role button to auto-fill the email
3. Enter password: `Admain`
4. Click Login

### Try the Chatbot

1. Login as **Patient**
2. Click the **blue chat bubble** in the bottom-right corner
3. Ask: *"How can I book an appointment?"*
4. Follow the guided flow: Doctor → Date → Time → Booked!

### Try the Demo Flow

1. **Patient**: Login → Open chatbot → Book appointment → View My Appointments
2. **Doctor**: Login → Go to My Queue → Complete a patient → Add notes → AI Summary
3. **Admin**: Login → View Dashboard → Queue Management → Report Analyzer

---

## Functionality Flow

### 1. Authentication Flow

```
User visits /login
       ↓
Clicks role button (Admin/Doctor/Patient)
       ↓
Email auto-filled → Enters password → Clicks Login
       ↓
NextAuth.js validates credentials
       ↓
JWT token created → Redirected to dashboard based on role
       ↓
Sidebar shows role-specific menu items
```

**Role-Based Routing:**
- Admin → /dashboard, /queue, /doctors, /appointments, /report-analyzer
- Doctor → /dashboard, /my-queue, /my-patients, /my-appointments
- Patient → /dashboard, /my-appointments

---

### 2. Chatbot Appointment Booking Flow

```
Patient clicks blue chat bubble
       ↓
Bot: "Hello! How can I help you today?"
       ↓
Patient: "How can I book an appointment?"
       ↓
Intent Detection: Pattern matching → APPOINTMENT
       ↓
Bot: "Please provide a doctor name."
       ↓
Patient: "Dr. Meena Iyer"
       ↓
Intent Detection: Last bot asked for doctor name + looks like name → APPOINTMENT
       ↓
Bot: "When would you like the appointment?
      • today
      • tomorrow
      • Or type a date"
       ↓
Patient: "today"
       ↓
normalizeDate() → Gets IST date → "2026-08-28"
       ↓
findDoctor("Dr. Meena Iyer") → Fuzzy match → Found
       ↓
getDoctorAppointments() → Check existing bookings
       ↓
Filter available slots (remove booked + past time + lunch break)
       ↓
Bot: "Available slots: 09:00, 10:00, 11:00, 14:00, 15:00, 16:00, 17:00"
       ↓
Patient: "11:00"
       ↓
validateTime() → Check working hours (9-6), lunch break (1-2)
       ↓
istToUtc() → Convert "11:00" IST → "05:30" UTC
       ↓
createAppointment() → INSERT into database
       ↓
Bot: "✅ Appointment Booked!
      Doctor: Dr. Meena Iyer
      Date: 2026-08-28
      Time: 11:00
      Status: Pending"
```

---

### 3. Intent Detection Flow

```
User message arrives at /api/chat
       ↓
Get conversation history from client
       ↓
Get last bot message from history
       ↓
DETERMINISTIC CHECKS (fast, no LLM):
       ↓
├─ Bot asked for "doctor name" + message looks like name? → APPOINTMENT
├─ Bot asked for "date" + message is "today"/"tomorrow"/date? → APPOINTMENT
├─ Bot showed "available slots" + message is time? → APPOINTMENT
├─ Message contains "book"/"appointment"/"schedule"? → APPOINTMENT
├─ Message contains "i have"/"i feel" (symptoms)? → SYMPTOM
├─ Message contains "who is"/"show me" (doctors)? → DOCTOR
├─ Message contains "queue"? → QUEUE
├─ Message contains "history"? → HISTORY
       ↓
NO MATCH? → Call LLM for classification
       ↓
Route to appropriate handler:
├─ FAQ → handleFAQ() → RAG retrieval → LLM answer
├─ DOCTOR → handleDoctorSearch() → findDoctor() or list all
├─ SYMPTOM → handleSymptoms() → Match symptoms to doctor
├─ APPOINTMENT → handleAppointment() → Extract details → Book
       ↓
Return response to client
```

---

### 4. Doctor Search Flow

```
Patient: "I have chest pain"
       ↓
Intent: SYMPTOM
       ↓
handleSymptoms() called
       ↓
Symptom mapping:
├─ "chest pain" → Cardiology → Dr. Priya Sharma
├─ "fever" → General Medicine → Dr. Meena Iyer
├─ "knee hurts" → Orthopedics → Dr. Rahul Verma
├─ "skin rash" → Dermatology → Dr. Vikram Patel
├─ "child cough" → Pediatrics → Dr. Anita Desai
       ↓
Returns: "Based on your symptoms, I recommend Dr. Priya Sharma (Cardiology)."
```

---

### 5. Queue Management Flow (Admin)

```
Admin logs in → Goes to /queue
       ↓
QueueTable component loads
       ↓
Fetches /api/queue with filters:
├─ date: today (default)
├─ doctorId: all (default)
├─ search: ""
       ↓
GET /api/queue → SQL query with JOINs
       ↓
Returns: patients with doctor names, queue numbers, status
       ↓
DataTable renders with columns:
├─ Queue # (badge)
├─ Patient Name
├─ Doctor
├─ Time
├─ Status (colored badge)
├─ Actions (status buttons)
       ↓
Admin clicks "Waiting" button
       ↓
PUT /api/queue/[id] → UPDATE status
       ↓
Queue refetches → UI updates
```

---

### 6. Doctor Workspace Flow

```
Doctor logs in → Goes to /my-queue
       ↓
Clicks "Complete" on IN_PROGRESS patient
       ↓
DoctorNotesModal opens
       ↓
Doctor types notes:
"Hypertension. Prescribing Amlodipine 5mg. Allergic to Penicillin."
       ↓
Clicks "Extract from Notes"
       ↓
POST /api/ai/extract-clinical
       ↓
LLM parses notes → Returns JSON:
{
  "conditions": ["Hypertension"],
  "medications": ["Amlodipine 5mg"],
  "allergies": ["Penicillin"],
  "observations": []
}
       ↓
Tag-style UI populates with extracted data
       ↓
Doctor reviews → Can add/remove/modify tags
       ↓
Clicks "Generate AI Summary"
       ↓
POST /api/ai/summary
       ↓
LLM generates concise summary from clinical data
       ↓
Clicks "Save & Complete"
       ↓
PUT /api/queue/[id] → status: COMPLETED
POST /api/appointments/[id]/notes → Save notes + clinical data
       ↓
Clinical data saved to:
├─ patient_conditions
├─ patient_medications
├─ patient_allergies
├─ patient_observations
```

---

### 7. Clinical Agent Flow

```
Doctor/Admin goes to Patient Detail page
       ↓
Sees Clinical Agent panel
       ↓
Selects document type:
├─ Handover Summary
├─ Patient Summary
├─ Risk Flags
└─ Missing Information
       ↓
Clicks "Run Agent"
       ↓
POST /api/patients/[id]/agent
       ↓
Fetches patient context:
├─ Basic info (name, age, contact)
├─ Conditions (active/resolved)
├─ Current medications
├─ Known allergies
├─ Recent observations
├─ Visit history
       ↓
Context sent to LLM with document type prompt
       ↓
LLM generates concise 5-6 line summary
       ↓
Result displayed in agent panel
       ↓
Clicks "Save as Draft"
       ↓
POST /api/drafts → Save to patient_drafts table
       ↓
Draft appears in Saved Drafts panel
```

---

### 8. Report Analyzer Flow

```
Admin goes to /report-analyzer
       ↓
Uploads PDF or image (medical report)
       ↓
File sent to /api/report-analyzer
       ↓
AI analyzes the report:
├─ Extracts text (OCR for images)
├─ Identifies key findings
├─ Flags abnormal results
├─ Generates recommendations
       ↓
Results displayed:
├─ Key Findings (bullet points)
├─ Abnormal Results (highlighted)
├─ Recommendations (actionable items)
       ↓
Report stored in patient_reports table
```

---

### 9. Data Flow Summary

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT SIDE                          │
├─────────────────────────────────────────────────────────────┤
│  React Components → TanStack Query → API Routes             │
│  Chatbot UI → POST /api/chat → Display response             │
│  Forms → React Hook Form → Zod validation → Submit          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                       API ROUTES                            │
├─────────────────────────────────────────────────────────────┤
│  /api/chat          → Intent detection → Route handler      │
│  /api/appointments  → CRUD operations                      │
│  /api/queue         → Queue management                     │
│  /api/ai/*          → LLM calls (extraction, summary)      │
│  /api/patients/*    → Patient context & clinical agent     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE (PostgreSQL)                   │
├─────────────────────────────────────────────────────────────┤
│  users → doctors → appointments → appointment_notes         │
│  patient_conditions, patient_medications                    │
│  patient_allergies, patient_observations                    │
│  patient_drafts, patient_reports, knowledge_chunks          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┤
│                      AI SERVICES                            │
├─────────────────────────────────────────────────────────────┤
│  OpenRouter API (GPT-4.1-nano)                              │
│  ├─ Intent classification (LLM fallback)                    │
│  ├─ FAQ answer generation (RAG)                             │
│  ├─ Clinical data extraction from notes                     │
│  ├─ AI summary generation                                   │
│  └─ Report analysis                                         │
└─────────────────────────────────────────────────────────────┘
```

---

### 10. Timezone Handling Flow

```
User in IST (India Standard Time, UTC+5:30)
       ↓
User enters time: "15:00" (3:00 PM IST)
       ↓
istToUtc("15:00") → Subtract 5:30 → "09:30" (UTC)
       ↓
Database stores: "2026-08-28 09:30:00" (TIMESTAMP, no timezone)
       ↓
Pg driver returns: Date object (interprets as UTC)
       ↓
JSON serialization: "2026-08-28T09:30:00.000Z"
       ↓
formatDateTime("2026-08-28T09:30:00.000Z")
       ↓
new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
       ↓
Converts UTC → IST: Adds 5:30 → "03:00 PM"
       ↓
Displays: "28 Aug 2026, 03:00 PM"
```

---

### 11. Slot Availability Flow

```
User asks for appointment date
       ↓
getDoctorAppointments(doctorId, date) → Fetch existing bookings
       ↓
Get booked times:
existing.map(a => new Date(a.appointment_date)
  .toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata" }))
       ↓
Example: ["09:00", "10:00"] (two appointments already booked)
       ↓
All slots: ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"]
       ↓
Filter out booked: ["11:00", "12:00", "14:00", "15:00", "16:00", "17:00"]
       ↓
If today: Filter out past time:
currentTime = new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata" })
availableSlots.filter(slot => slot > currentTime)
       ↓
Return available slots to chatbot/form
```

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

### Chatbot & AI Questions

**Q: How does the chatbot booking work?**
A: User says "book appointment" → Intent detected as APPOINTMENT → Bot asks for doctor name → User provides name → Bot asks for date → User says "today" → Bot shows available slots → User picks a time → Appointment created with IST→UTC conversion.

**Q: How does intent detection work?**
A: Two-layer approach: (1) Deterministic pattern matching for common flows (name after "provide doctor name" → APPOINTMENT), (2) LLM fallback for ambiguous cases. This is fast and reliable.

**Q: Why use deterministic patterns instead of pure LLM?**
A: Deterministic patterns are faster (no API call), cheaper, and more reliable for common flows. LLM is only used for ambiguous cases where pattern matching isn't sufficient.

**Q: How do you handle follow-up questions in the chatbot?**
A: History is passed to the API. The intent detector checks the last bot message to determine context. If bot asked for "doctor name" and user provides a name → APPOINTMENT. If bot showed "available slots" and user provides a time → APPOINTMENT.

**Q: How does the chatbot handle conversation context?**
A: Messages array is passed from client to API. LLM receives conversation history in the prompt. For example, if user said "I have fever" earlier and now says "book with her", the LLM knows "her" refers to Dr. Meena Iyer.

**Q: What happens if the LLM fails or returns invalid JSON?**
A: The chatbot has fallback handling. If JSON parsing fails, it returns an error message. Deterministic intent detection ensures the chatbot works even if LLM is unavailable.

**Q: How do you prevent the chatbot from getting stuck in loops?**
A: Each intent handler returns a specific response that guides the user to the next step. The flow is: Doctor → Date → Time → Book. Each step has validation and clear error messages.

---

### Timezone & Date Handling

**Q: How do you handle timezone issues?**
A: Database stores UTC. User inputs are IST. Before storage, IST is converted to UTC. On display, UTC is converted back to IST using toLocaleString with timeZone: "Asia/Kolkata".

**Q: Why store UTC instead of IST?**
A: UTC is timezone-agnostic and prevents ambiguity. When the server runs in a different timezone (Vercel uses UTC), storing UTC ensures consistent behavior. Display layer handles timezone conversion.

**Q: How does the IST→UTC conversion work?**
A: Simple arithmetic: subtract 5 hours and 30 minutes. For example, 15:00 IST → 09:30 UTC. This is done in the `istToUtc()` helper function before database insertion.

**Q: How do you handle daylight saving time?**
A: India doesn't observe DST, so the offset is always +5:30. The `toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })` handles this automatically.

**Q: What if a user is in a different timezone?**
A: The app is designed for Indian hospitals. All times are displayed in IST. The chatbot validates times against IST working hours (9 AM - 6 PM).

---

### Database & Architecture

**Q: Why PostgreSQL?**
A: Relational data with foreign keys (patients → appointments → notes → clinical data). Complex queries for queue management and patient context. UUID primary keys ensure data security.

**Q: Why use raw SQL instead of an ORM?**
A: More control over queries, better performance for complex joins, easier to debug. The pg driver is lightweight and efficient.

**Q: How do you handle database connections in serverless?**
A: Connection pooling with `pg.Pool`. Each API request gets a connection from the pool, uses it, and returns it. This works well with Vercel's serverless functions.

**Q: How is the clinical data structured?**
A: Separate tables for conditions, medications, allergies, observations. Each linked to patient_id and visit_id (appointment). This allows fast queries and easy aggregation.

**Q: Why use UUID instead of auto-increment IDs?**
A: UUIDs are globally unique, prevent ID guessing attacks, and work well with distributed systems. No collision risk across environments.

---

### AI & Machine Learning

**Q: How does the AI extraction work?**
A: Doctor writes free-text notes. We send them to GPT-4.1-nano with a prompt to extract structured clinical data. The AI returns JSON which we save to clinical tables.

**Q: Why GPT-4.1-nano instead of GPT-4?**
A: Cost-effective for structured extraction tasks. GPT-4.1-nano is faster and cheaper while maintaining accuracy for clinical data extraction.

**Q: How do you handle AI errors?**
A: Fallback to mock output if API key missing. Graceful degradation - app works without AI. Deterministic intent detection ensures chatbot works even if LLM fails.

**Q: What prompts do you use for clinical extraction?**
A: System prompt defines the JSON schema (conditions, medications, allergies, observations). Doctor notes are sent as user message. Temperature set to 0 for consistent output.

**Q: How do you handle AI hallucinations in clinical data?**
A: Extracted data is stored but flagged as "AI-extracted". Doctor can review and modify. The AI summary is generated from verified clinical data, not raw notes.

---

### Frontend & UX

**Q: Why Next.js App Router instead of Pages Router?**
A: Nested layouts, server components, streaming, better caching. The (dashboard) layout wraps all protected routes with sidebar and auth check.

**Q: How do you handle real-time updates?**
A: TanStack Query with staleTime of 15 seconds. Refetch on user action. Optimistic updates for queue status changes. Could add WebSocket for true real-time.

**Q: How does the chatbot UI work?**
A: Simple message array state. User messages added immediately, assistant messages added after API response. Blue chat bubble in bottom-right corner. Auto-scroll to latest message.

**Q: How do you handle form validation?**
A: React Hook Form with Zod schemas. Server-side validation in API routes. Client-side validation for immediate feedback.

**Q: How do you handle loading states?**
A: Skeleton loaders for data fetching, spinners for mutations, disabled buttons during API calls. Toast notifications for success/error feedback.

---

### Security & Authentication

**Q: How does authentication work?**
A: NextAuth.js with credentials provider. Passwords hashed with bcrypt. JWT tokens for session management. Middleware protects dashboard routes.

**Q: What about data security?**
A: Patient data is UUID-based. API routes require authentication. No sensitive data in AI prompts. Timezone-safe date handling prevents data corruption.

**Q: How do you protect against SQL injection?**
A: Parameterized queries with $1, $2 placeholders. Never concatenate user input into SQL strings. The pg driver handles escaping.

**Q: How do you handle role-based access?**
A: Session includes user role. API routes check role before executing. Dashboard routes redirect based on role. Only patients can book appointments.

---

### Testing & Deployment

**Q: How do you test the chatbot?**
A: Manual testing with predefined scenarios. Test each intent (FAQ, DOCTOR, SYMPTOM, APPOINTMENT). Test edge cases (invalid times, missing data, past dates).

**Q: How do you deploy to Vercel?**
A: Git push triggers automatic deployment. Environment variables set in Vercel dashboard. PostgreSQL connection to Neon serverless.

**Q: How do you handle environment variables?**
A: .env.local for development, Vercel dashboard for production. DATABASE_URL, NEXTAUTH_SECRET, OPENROUTER_API_KEY.

**Q: What monitoring do you have?**
A: Vercel Analytics for performance. Console logs for debugging. Error boundaries for React errors.

---

### System Design Questions

**Q: How would you scale this to multiple hospitals?**
A: Add hospital_id to all tables. Multi-tenant architecture. Separate database schemas or row-level security. Load balancing across Vercel regions.

**Q: How would you add real-time queue updates?**
A: WebSocket connection (Socket.io or native WS). Server broadcasts status changes. Clients subscribe to doctor-specific channels. Fallback to polling.

**Q: How would you integrate with hospital EMR systems?**
A: HL7 FHIR standard for medical data exchange. REST APIs for bidirectional sync. Webhook notifications for appointment updates.

**Q: How would you add multi-language support?**
A: i18n library (next-intl). Translate UI strings and chatbot responses. Language selection in user profile. AI prompts in selected language.

**Q: How would you handle high traffic during peak hours?**
A: Redis caching for frequently accessed data. Database read replicas. CDN for static assets. Rate limiting on API routes.

---

### Behavioral Questions

**Q: What was the most challenging part of this project?**
A: Timezone handling. PostgreSQL stores timestamps without timezone, JavaScript interprets them as UTC. Had to implement IST→UTC conversion on storage and UTC→IST on display. Also ensured consistency across chatbot, admin forms, and edit pages.

**Q: How did you handle the AI integration?**
A: Started with pure LLM intent detection, but it was slow and unreliable. Added deterministic pattern matching as first layer, LLM as fallback. This made the chatbot faster and more reliable.

**Q: What would you do differently next time?**
A: Use TIMESTAMPTZ column type from the start. Add WebSocket for real-time updates. Implement proper error boundaries. Add unit tests for critical paths.

**Q: How did you handle the chatbot conversation flow?**
A: Designed a 4-step guided flow: Doctor → Date → Time → Book. Each step validates input and provides clear next steps. History is passed to maintain context across messages.

**Q: What did you learn from this project?**
A: Importance of timezone handling in healthcare apps. How to combine deterministic logic with AI. Building guided conversational flows. Structured clinical data extraction from free-text notes.

---

## Full-Stack Architecture Questions

### Database Design Questions

**Q: Explain your database schema. How are the tables related?**
A: 10 tables total:
- `users` — stores all user accounts (Admin, Doctor, Patient) with role field
- `doctors` — extends users with specialization, linked via user_id FK
- `appointments` — links patient_id (→users), doctor_id (→doctors), stores date/time and status
- `appointment_notes` — stores doctor notes and AI summary per appointment
- `patient_conditions`, `patient_medications`, `patient_allergies`, `patient_observations` — clinical data tables, each linked to patient_id and visit_id (→appointments)
- `patient_drafts` — stores AI-generated clinical documents
- `knowledge_chunks` — FAQ data for RAG retrieval

**Q: Why use separate tables for conditions, medications, allergies, and observations instead of a single clinical_data table?**
A: Separate tables allow:
- Type-specific fields (e.g., dosage for medications, severity for allergies)
- Faster queries (no filtering by type)
- Easier aggregation (count conditions vs medications)
- Better data integrity (each table has its own constraints)
- Simpler CRUD operations per clinical type

**Q: Why use UUID instead of auto-increment IDs?**
A: UUIDs are globally unique, prevent ID guessing attacks, work well with distributed systems, no collision risk across environments, and can be generated client-side without DB round-trip.

**Q: What is the relationship between appointments and clinical data?**
A: Each clinical table (conditions, medications, allergies, observations) has a `visit_id` FK pointing to appointments. This links clinical data to the specific visit when it was recorded. A patient can have multiple visits, each with different clinical data.

**Q: How does the queue_number work?**
A: Queue number is assigned per doctor per day. When a new appointment is created, the system queries `MAX(queue_number)` for that doctor on that date and increments by 1. This ensures sequential numbering within each doctor's daily queue.

---

### API Architecture Questions

**Q: Explain your API route structure.**
A: Next.js App Router with RESTful conventions:
- `/api/appointments` — CRUD for appointments (GET list, POST create)
- `/api/appointments/[id]` — Single appointment (GET, PUT, DELETE)
- `/api/appointments/availability` — GET with doctorId and date params
- `/api/chat` — POST for chatbot messages
- `/api/queue` and `/api/queue/[id]` — Queue management
- `/api/ai/*` — AI endpoints (extract-clinical, summary)
- `/api/patients/[id]/*` — Patient-specific endpoints

**Q: How do you handle authentication in API routes?**
A: NextAuth.js `getServerSession(authOptions)` in each API route. Returns session with user ID and role. Routes check `session.user.role` before executing. For example, only PATIENT role can create appointments.

**Q: How do you handle errors in API routes?**
A: Try-catch blocks in each route handler. On error:
1. Log the error with `console.error`
2. Return appropriate HTTP status (500 for server errors)
3. Return JSON with `success: false` and error message
4. Client displays toast notification

**Q: What is the `/api/appointments/availability` endpoint used for?**
A: Called by the appointment form when user selects a doctor and date. Returns:
- `availableSlots`: Array of available time strings (e.g., ["09:00", "10:00", ...])
- `bookedSlots`: Array of already booked times
Used to populate the time slot dropdown, excluding booked and past times.

**Q: How does the chatbot API (`/api/chat`) work?**
A: Receives `message` and `history` from client. Runs intent detection (deterministic patterns first, LLM fallback). Routes to appropriate handler (FAQ, DOCTOR, SYMPTOM, APPOINTMENT). Returns `{ success, answer, intent }`.

---

### Frontend Architecture Questions

**Q: Explain your component structure.**
A: Organized by feature:
- `auth/` — LoginForm, RegisterForm
- `chat/` — hospital-chat.tsx (chatbot UI)
- `appointments/` — appointment-form, appointments-table, delete button
- `patients/` — patient-appointments-table, doctor-queue-table, patients-table
- `queue/` — queue-table, queue-actions
- `dashboard/` — recent-appointments-card
- `common/` — data-table (reusable), doctor-notes-modal, spinner
- `ui/` — shadcn/ui components

**Q: How do you handle state management?**
A: TanStack Query (React Query) for server state:
- `useQuery` for data fetching with caching (staleTime: 30s)
- `useMutation` for create/update operations
- Automatic refetch on window focus
- Optimistic updates for queue status changes
Local state with React `useState` for UI state (search, pagination, modals).

**Q: How does the dashboard layout work?**
A: `app/(dashboard)/layout.tsx` wraps all protected routes:
- Checks authentication with NextAuth `useSession`
- Redirects to `/login` if not authenticated
- Renders sidebar + main content area
- Sidebar shows different menu items based on user role

**Q: How do you handle form validation?**
A: React Hook Form with Zod schemas:
- Client-side validation for immediate feedback
- Server-side validation in API routes as second layer
- Error messages displayed below form fields
- Form resets after successful submission

**Q: Explain the DataTable component.**
A: Reusable component accepting:
- `data`: Array of objects
- `columns`: Column definitions with render functions
- `total`, `totalPages`, `page`, `pageSize`: Pagination
- `search`, `onSearchChange`: Search functionality
- `onPageChange`, `onPageSizeChange`: Pagination callbacks
Used across appointments, queue, patients, and doctor lists.

---

### AI Integration Questions

**Q: How do you use AI in this project?**
A: Three main AI use cases:
1. **Chatbot** — Intent detection + FAQ answers + appointment booking
2. **Clinical Extraction** — Parse doctor notes into structured data (conditions, medications, allergies)
3. **AI Summary** — Generate concise clinical summaries from patient context

All use OpenRouter API with GPT-4.1-nano model.

**Q: How does the RAG (Retrieval Augmented Generation) work for FAQ?**
A: `knowledge_chunks` table stores FAQ entries. When user asks a question:
1. `retrieveContext()` searches knowledge_chunks using similarity matching
2. Top matching chunks are retrieved
3. Chunks are injected into LLM prompt as context
4. LLM generates answer based only on provided context
5. If no relevant context, returns "I don't have that information"

**Q: How does the clinical data extraction work?**
A: Doctor writes free-text notes in DoctorWorkspaceModal. On "Extract from Notes" click:
1. Notes sent to `/api/ai/extract-clinical`
2. LLM prompt includes JSON schema for conditions, medications, allergies, observations
3. LLM parses notes and returns structured JSON
4. Frontend populates tag-style UI with extracted data
5. Doctor can review, add, or remove tags before saving

**Q: How do you handle AI costs?**
A: Using GPT-4.1-nano (cheapest model) via OpenRouter. Deterministic patterns reduce LLM calls. FAQ uses RAG to limit context size. Temperature set to 0 for consistent output. Max tokens limited per endpoint.

---

### Deployment Questions

**Q: How is the project deployed?**
A: Vercel deployment:
- Git push triggers automatic build and deploy
- Environment variables set in Vercel dashboard
- PostgreSQL connection to Neon serverless (connection pooling)
- Static assets served from Vercel CDN
- API routes run as serverless functions

**Q: What environment variables are needed?**
A:
- `DATABASE_URL` — PostgreSQL connection string (Neon)
- `NEXTAUTH_SECRET` — Secret for JWT encryption
- `NEXTAUTH_URL` — Base URL for callbacks
- `OPENROUTER_API_KEY` — API key for AI services

**Q: How do you handle database migrations?**
A: SQL files in `database/migrations/`:
1. `database.sql` — Creates all tables (IF NOT EXISTS)
2. `003_reset_and_seed.sql` — Clears data and inserts seed data
Run manually against Neon database. No migration tool (like Prisma Migrate) — raw SQL for full control.

---

### Security Questions

**Q: How do you hash passwords?**
A: bcrypt via NextAuth.js credentials provider. Passwords hashed with salt rounds before storage. Login compares hashed password with bcrypt.compare().

**Q: How do you protect against SQL injection?**
A: Parameterized queries with pg driver:
```sql
SELECT * FROM users WHERE id = $1
```
User input passed as parameters, never concatenated into SQL strings. The pg driver handles escaping automatically.

**Q: How do you handle role-based access control?**
A: Three layers:
1. **Frontend**: Sidebar menu items filtered by role
2. **API routes**: `session.user.role` checked before execution
3. **Middleware**: Protected routes redirect unauthenticated users

**Q: How do you secure patient data?**
A: UUID-based IDs prevent guessing. API routes require authentication. No sensitive data in AI prompts. Timezone-safe date handling prevents data corruption. Patient data only accessible to assigned doctor and admins.

---

### Performance Questions

**Q: How do you optimize database queries?**
A:
- JOINs instead of multiple queries
- Pagination with LIMIT/OFFSET
- Indexed columns (user_id, doctor_id, appointment_date)
- Connection pooling with pg.Pool
- SELECT specific columns instead of SELECT *

**Q: How do you handle loading states?**
A: TanStack Query provides `isLoading`, `isError`, `isFetching` states:
- Skeleton loaders for initial data fetch
- Spinner for mutations
- Disabled buttons during API calls
- Toast notifications for success/error feedback

**Q: How would you scale this application?**
A:
- Redis caching for frequently accessed data (doctors, FAQ)
- Database read replicas for query distribution
- CDN for static assets (already on Vercel)
- Rate limiting on API routes
- WebSocket for real-time queue updates
- Horizontal scaling with Vercel serverless functions

---

## Files to Show in Interview

| File | Purpose | What to Highlight |
|------|---------|-------------------|
| src/app/api/chat/route.ts | Chatbot intent detection | Deterministic pattern matching + LLM fallback |
| src/lib/queries/appointment-agent.ts | Booking logic | Date validation, slot availability, IST→UTC |
| src/lib/queries/appointments.ts | DB queries | istToUtc(), parameterized queries |
| src/components/chat/hospital-chat.tsx | Chatbot UI | Message handling, history passing |
| src/components/common/doctor-notes-modal.tsx | Doctor Workspace | AI extraction, tag UI, save flow |
| src/app/api/ai/extract-clinical/route.ts | AI extraction | LLM prompt, JSON parsing |
| src/lib/utils.ts | Utility functions | formatDateTime with IST timezone |
| database/migrations/003_reset_and_seed.sql | Seed data | 5 doctors, 10 FAQ, clinical data |
| src/middleware.ts | Auth middleware | Route protection |
| src/lib/queries/rag.ts | RAG retrieval | FAQ context injection |
