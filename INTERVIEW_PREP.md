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
