# MediQueue — Smart Hospital Queue Management System

> Live URL: https://medi-queue-beige.vercel.app

A full-stack hospital queue management system with AI-powered chatbot for appointment booking, patient tracking, and clinical workflow automation.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes, PostgreSQL (Neon) |
| AI/LLM | OpenAI via OpenRouter (GPT-4.1-nano) |
| Auth | NextAuth.js (credentials provider) |
| ORM | Raw SQL (pg driver) |
| Deployment | Vercel |

---

## Features

### AI Chatbot
- **6 Intent Detection**: FAQ, Doctor Search, Symptom Analysis, Appointment Booking, Queue Status, Patient History
- **Guided Booking Flow**: Doctor name → Date selection → Time slot → Confirmation
- **Smart Slot Management**: Shows only available slots, blocks lunch breaks and after-hours
- **Conversation Memory**: Bot remembers context within a session
- **10 FAQ Knowledge Chunks**: Hospital timings, departments, insurance, emergency contacts

### Patient Features
- Book appointments via chatbot or manual form
- View appointment history with status tracking
- Real-time queue position updates

### Doctor Features
- View patient queue with real-time status
- Complete appointments with clinical notes
- AI-powered note extraction (conditions, medications, allergies)
- Generate AI summaries for patient visits

### Admin Features
- Dashboard with live statistics
- Queue management with date/doctor filtering
- Doctor management (add/edit/remove)
- Report analyzer (upload PDF/images for AI analysis)
- Patient detail views with medical history

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

## Chatbot Booking Flow

```
Step 1: "How can I book an appointment?"
        → Bot: "Please provide a doctor name."

Step 2: "Dr. Meena Iyer"
        → Bot: "When would you like the appointment?
                Reply with today/tomorrow or type a date."

Step 3: "today"
        → Bot: Shows available time slots for that date

Step 4: "11:00"
        → Bot: Appointment booked with confirmation
```

### All Ways to Book

```
How can I book an appointment?          → Guided flow
Book appointment with Dr. Meena Iyer   → Asks for date
Book with Priya at 10:00               → Direct booking
I want to see Dr. Rahul at 2 PM        → Direct booking
Book appointment with Dr Meena tomorrow at 14:00
```

---

## Chatbot Intents

| Intent | Trigger Examples |
|--------|------------------|
| FAQ | "What are hospital timings?", "Do you accept insurance?" |
| DOCTOR | "Who are the doctors?", "Show me the heart doctor" |
| SYMPTOM | "I have fever", "My knee hurts", "My child has a cough" |
| APPOINTMENT | "Book appointment", "I want to see Dr. X" |
| QUEUE | "What's my queue status?" |
| HISTORY | "Show my medical history" |

---

## Functionality Flow

### Authentication Flow

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
```

### Chatbot Booking Flow

```
Patient: "How can I book an appointment?"
       ↓
Intent Detection: Pattern matching → APPOINTMENT
       ↓
Bot: "Please provide a doctor name."
       ↓
Patient: "Dr. Meena Iyer"
       ↓
Bot: "When would you like the appointment? (today/tomorrow/date)"
       ↓
Patient: "today"
       ↓
findDoctor() → Match found
       ↓
getDoctorAppointments() → Check existing bookings
       ↓
Filter available slots (remove booked + past time + lunch break)
       ↓
Bot: "Available slots: 09:00, 10:00, 11:00, 14:00..."
       ↓
Patient: "11:00"
       ↓
validateTime() → Check working hours + lunch break
       ↓
istToUtc() → Convert "11:00" IST → "05:30" UTC
       ↓
createAppointment() → INSERT into database
       ↓
Bot: "✅ Appointment Booked!"
```

### Intent Detection Flow

```
User message arrives at /api/chat
       ↓
DETERMINISTIC CHECKS (fast, no LLM):
├─ Bot asked for "doctor name" + looks like name? → APPOINTMENT
├─ Bot asked for "date" + "today"/"tomorrow"? → APPOINTMENT
├─ Bot showed "available slots" + time format? → APPOINTMENT
├─ Message contains "book"/"appointment"? → APPOINTMENT
├─ Message contains "i have"/"i feel"? → SYMPTOM
├─ Message contains "who is"/"show me"? → DOCTOR
       ↓
NO MATCH? → Call LLM for classification
       ↓
Route to handler → Return response
```

### Doctor Workspace Flow

```
Doctor clicks "Complete" on patient
       ↓
DoctorNotesModal opens
       ↓
Doctor types notes → Clicks "Extract from Notes"
       ↓
LLM parses notes → Returns structured data:
├─ Conditions: ["Hypertension"]
├─ Medications: ["Amlodipine 5mg"]
├─ Allergies: ["Penicillin"]
       ↓
Doctor reviews → Clicks "Generate AI Summary"
       ↓
Clicks "Save & Complete"
       ↓
Clinical data saved to database tables
```

### Data Flow Summary

```
CLIENT: React Components → TanStack Query → API Routes
   ↓
API ROUTES: /api/chat, /api/appointments, /api/queue, /api/ai/*
   ↓
DATABASE: users → doctors → appointments → clinical tables
   ↓
AI: OpenRouter API (GPT-4.1-nano) for extraction, summary, chat
```

### Timezone Handling Flow

```
User enters: "15:00" IST
       ↓
istToUtc("15:00") → "09:30" UTC
       ↓
Database stores: "2026-08-28 09:30:00"
       ↓
formatDateTime() → toLocaleString("Asia/Kolkata")
       ↓
Displays: "28 Aug 2026, 03:00 PM"
```

---

## How to Run Locally

```bash
# Clone the repository
git clone https://github.com/archana2807/MediQueue.git
cd MediQueue

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database URL and API keys

# Run database migrations
psql $DATABASE_URL -f database.sql
psql $DATABASE_URL -f database/migrations/003_reset_and_seed.sql

# Start development server
npm run dev
```

Open http://localhost:3000

---

## Project Structure

```
MediQueue/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx                    # Login page
│   │   │   └── register/page.tsx                 # Register page
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx                        # Dashboard layout (sidebar + auth)
│   │   │   ├── page.tsx                          # Dashboard home
│   │   │   ├── appointments/
│   │   │   │   ├── page.tsx                      # Appointments list (Admin)
│   │   │   │   ├── new/page.tsx                  # Create appointment
│   │   │   │   └── [id]/edit/page.tsx            # Edit appointment
│   │   │   ├── doctors/page.tsx                  # Doctor management (Admin)
│   │   │   ├── my-appointments/page.tsx          # Patient appointments
│   │   │   ├── my-patients/page.tsx              # Doctor's patients
│   │   │   ├── my-queue/page.tsx                 # Doctor's queue
│   │   │   ├── patients/
│   │   │   │   ├── page.tsx                      # Patient list (Admin)
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx                  # Patient detail
│   │   │   │       └── history/page.tsx          # Patient history
│   │   │   ├── queue/page.tsx                    # Queue management (Admin)
│   │   │   └── report-analyzer/page.tsx          # Report analyzer (Admin)
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts       # NextAuth config
│   │   │   ├── chat/route.ts                     # Chatbot API
│   │   │   ├── appointments/
│   │   │   │   ├── route.ts                      # GET/POST appointments
│   │   │   │   ├── [id]/route.ts                 # GET/PUT/DELETE appointment
│   │   │   │   └── availability/route.ts         # Slot availability
│   │   │   ├── my-appointments/
│   │   │   │   ├── patient/route.ts              # Patient's appointments
│   │   │   │   └── doctor/route.ts               # Doctor's appointments
│   │   │   ├── queue/
│   │   │   │   ├── route.ts                      # GET queue list
│   │   │   │   └── [id]/route.ts                 # PUT queue status
│   │   │   ├── doctors/route.ts                  # Doctor CRUD
│   │   │   ├── patients/
│   │   │   │   ├── route.ts                      # Patient list
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts                  # Patient detail
│   │   │   │       ├── context/route.ts          # Patient context
│   │   │   │       └── agent/route.ts            # Clinical agent
│   │   │   ├── ai/
│   │   │   │   ├── summary/route.ts              # AI summary
│   │   │   │   └── extract-clinical/route.ts     # Clinical extraction
│   │   │   ├── drafts/route.ts                   # Saved drafts CRUD
│   │   │   └── report-analyzer/route.ts          # Report analysis
│   │   └── layout.tsx                            # Root layout
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx                     # Login form
│   │   │   └── RegisterForm.tsx                  # Register form
│   │   ├── chat/
│   │   │   └── hospital-chat.tsx                 # Chatbot UI
│   │   ├── appointments/
│   │   │   ├── appointment-form.tsx              # Appointment create/edit form
│   │   │   ├── appointments-table.tsx            # Appointments list (Admin)
│   │   │   └── delete-appointment-button.tsx     # Delete button
│   │   ├── patients/
│   │   │   ├── patient-appointments-table.tsx    # Patient's appointments
│   │   │   ├── doctor-appointments-table.tsx     # Doctor's appointments
│   │   │   ├── doctor-queue-table.tsx            # Doctor's queue
│   │   │   ├── patient-raw-data.tsx              # Raw patient data
│   │   │   └── patients-table.tsx                # Patient list
│   │   ├── queue/
│   │   │   ├── queue-table.tsx                   # Admin queue table
│   │   │   └── queue-actions.tsx                 # Status action buttons
│   │   ├── dashboard/
│   │   │   └── recent-appointments-card.tsx      # Recent appointments
│   │   ├── doctors/
│   │   │   └── doctors-table.tsx                 # Doctor list
│   │   ├── sidebar/
│   │   │   └── sidebar.tsx                       # Navigation sidebar
│   │   ├── common/
│   │   │   ├── data-table.tsx                    # Reusable data table
│   │   │   ├── doctor-notes-modal.tsx            # Doctor Workspace modal
│   │   │   └── spinner.tsx                       # Loading spinner
│   │   └── ui/                                   # shadcn/ui components
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── client.ts                         # OpenAI client
│   │   │   └── model.ts                         # Model: gpt-4.1-nano
│   │   ├── queries/
│   │   │   ├── appointment-agent.ts              # Chatbot booking logic
│   │   │   ├── doctor-agent.ts                   # Doctor search & symptoms
│   │   │   ├── appointments.ts                   # Appointment DB queries
│   │   │   ├── clinical-data.ts                  # Clinical data CRUD
│   │   │   ├── patient-context.ts                # Patient context builder
│   │   │   ├── appointment-notes.ts              # Notes + clinical
│   │   │   ├── doctors.ts                        # Doctor queries
│   │   │   ├── queue.ts                          # Queue queries
│   │   │   └── rag.ts                            # RAG for FAQ retrieval
│   │   ├── db.ts                                 # PostgreSQL pool
│   │   ├── auth.ts                               # NextAuth config
│   │   └── utils.ts                              # Utility functions
│   └── middleware.ts                              # Auth middleware
├── database/
│   ├── sql                                       # Main schema
│   └── migrations/
│       └── 003_reset_and_seed.sql                # Seed data
├── public/
│   └── README.md                                 # Static README
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────────┐
│    users     │       │   doctors    │       │  appointments   │
├─────────────┤       ├─────────────┤       ├─────────────────┤
│ id (UUID)   │──┐    │ id (UUID)   │──┐    │ id (UUID)       │
│ name        │  │    │ user_id (FK)│←─┘    │ patient_id (FK) │←── users.id
│ email       │  │    │specialization│      │ doctor_id (FK)  │←── doctors.id
│ phone       │  │    └─────────────┘       │appointment_date │
│ password    │  │                          │ queue_number    │
│ role        │  │                          │ status          │
│ created_at  │  │                          └─────────────────┘
└─────────────┘  │                                   │
                 │                                   │
                 │    ┌─────────────────────┐        │
                 │    │  appointment_notes   │        │
                 │    ├─────────────────────┤        │
                 │    │ id (UUID)           │        │
                 │    │ appointment_id (FK) │←───────┘
                 │    │ doctor_notes (TEXT)  │
                 │    │ ai_summary (TEXT)    │
                 │    └─────────────────────┘
                 │
                 │    ┌─────────────────────┐
                 │    │  patient_conditions  │
                 │    ├─────────────────────┤
                 │    │ id (UUID)           │
                 ├───→│ patient_id (FK)     │
                 │    │ condition_name      │
                 │    │ status              │
                 │    │ visit_id (FK)       │←── appointments.id
                 │    └─────────────────────┘
                 │
                 │    ┌─────────────────────┐
                 │    │  patient_medications │
                 │    ├─────────────────────┤
                 │    │ id (UUID)           │
                 ├───→│ patient_id (FK)     │
                 │    │ name                │
                 │    │ dosage              │
                 │    │ frequency           │
                 │    │ visit_id (FK)       │←── appointments.id
                 │    └─────────────────────┘
                 │
                 │    ┌─────────────────────┐
                 │    │  patient_allergies   │
                 │    ├─────────────────────┤
                 │    │ id (UUID)           │
                 ├───→│ patient_id (FK)     │
                 │    │ allergen            │
                 │    │ severity            │
                 │    │ visit_id (FK)       │←── appointments.id
                 │    └─────────────────────┘
                 │
                 │    ┌─────────────────────┐
                 │    │ patient_observations │
                 │    ├─────────────────────┤
                 │    │ id (UUID)           │
                 ├───→│ patient_id (FK)     │
                 │    │ observation         │
                 │    │ visit_id (FK)       │←── appointments.id
                 │    └─────────────────────┘
                 │
                 │    ┌─────────────────────┐
                 │    │   patient_drafts     │
                 │    ├─────────────────────┤
                 │    │ id (UUID)           │
                 ├───→│ patient_id (FK)     │
                 │    │ task_type           │
                 │    │ content             │
                 │    │ evidence_references │
                 │    │ created_at          │
                 │    └─────────────────────┘
                 │
                 │    ┌─────────────────────┐
                 │    │  patient_reports     │
                 │    ├─────────────────────┤
                 │    │ id (UUID)           │
                 └───→│ patient_id (FK)     │
                      │ file_name           │
                      │ file_type           │
                      │ file_url            │
                      │ ai_analysis         │
                      │ created_at          │
                      └─────────────────────┘
```

### Tables Detail

#### users
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Auto-generated |
| name | VARCHAR(255) | NOT NULL | Full name |
| email | VARCHAR(255) | UNIQUE | Email address |
| phone | VARCHAR(20) | | Phone number |
| password | VARCHAR(255) | NOT NULL | Hashed password (bcrypt) |
| role | ENUM | NOT NULL | ADMIN, DOCTOR, PATIENT |
| created_at | TIMESTAMP | DEFAULT NOW() | Registration date |

#### doctors
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Auto-generated |
| user_id | UUID | FK → users.id | Links to user account |
| specialization | VARCHAR(100) | NOT NULL | Cardiology, Orthopedics, etc. |

#### appointments
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Auto-generated |
| patient_id | UUID | FK → users.id | Patient user |
| doctor_id | UUID | FK → doctors.id | Assigned doctor |
| appointment_date | TIMESTAMP | NOT NULL | Scheduled time (stored as UTC) |
| queue_number | INTEGER | | Queue position per doctor per day |
| status | VARCHAR(30) | DEFAULT 'PENDING' | PENDING, CONFIRMED, CHECKED_IN, WAITING, IN_PROGRESS, COMPLETED, CANCELLED |

#### appointment_notes
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Auto-generated |
| appointment_id | UUID | FK → appointments.id | Linked appointment |
| doctor_notes | TEXT | | Doctor's free-text notes |
| ai_summary | TEXT | | AI-generated summary |

#### patient_conditions
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Auto-generated |
| patient_id | UUID | FK → users.id | Patient user |
| condition_name | TEXT | NOT NULL | e.g., "Hypertension" |
| status | TEXT | | "active" or "resolved" |
| visit_id | UUID | FK → appointments.id | Associated visit |

#### patient_medications
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Auto-generated |
| patient_id | UUID | FK → users.id | Patient user |
| name | TEXT | NOT NULL | e.g., "Amlodipine" |
| dosage | TEXT | | e.g., "5mg" |
| frequency | TEXT | | e.g., "once daily" |
| visit_id | UUID | FK → appointments.id | Associated visit |

#### patient_allergies
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Auto-generated |
| patient_id | UUID | FK → users.id | Patient user |
| allergen | TEXT | NOT NULL | e.g., "Penicillin" |
| severity | TEXT | | "mild", "moderate", "severe" |
| visit_id | UUID | FK → appointments.id | Associated visit |

#### patient_observations
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Auto-generated |
| patient_id | UUID | FK → users.id | Patient user |
| observation | TEXT | NOT NULL | e.g., "BP 140/90 mmHg" |
| visit_id | UUID | FK → appointments.id | Associated visit |

#### patient_drafts
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Auto-generated |
| patient_id | UUID | FK → users.id | Patient user |
| task_type | VARCHAR(50) | NOT NULL | Handover Summary, Risk Flags, etc. |
| content | TEXT | NOT NULL | Generated document content |
| evidence_references | JSONB | DEFAULT '[]' | Source references |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation date |

#### knowledge_chunks (FAQ)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Auto-generated |
| title | TEXT | NOT NULL | FAQ title |
| content | TEXT | NOT NULL | FAQ answer |
| category | TEXT | | Category for filtering |

---

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/[...nextauth] | Authentication |
| POST | /api/chat | Chatbot message processing |
| GET | /api/appointments | List appointments (Admin) |
| POST | /api/appointments | Create appointment |
| GET | /api/appointments/[id] | Get appointment |
| PUT | /api/appointments/[id] | Update appointment |
| DELETE | /api/appointments/[id] | Delete appointment |
| GET | /api/appointments/availability | Check slot availability |
| GET | /api/my-appointments/patient | Patient's appointments |
| GET | /api/my-appointments/doctor | Doctor's appointments |
| GET | /api/queue | List queue (Admin) |
| PUT | /api/queue/[id] | Update queue status |
| GET | /api/doctors | List doctors |
| POST | /api/doctors | Create doctor |
| GET | /api/patients | List patients |
| GET | /api/patients/[id] | Patient detail |
| GET | /api/patients/[id]/context | Patient context for AI |
| POST | /api/patients/[id]/agent | Run clinical agent |
| POST | /api/ai/extract-clinical | Extract clinical data from notes |
| POST | /api/ai/summary | Generate AI summary |
| GET | /api/drafts | List saved drafts |
| POST | /api/drafts | Save draft |
| DELETE | /api/drafts/[id] | Delete draft |
| POST | /api/report-analyzer | Analyze uploaded report |

---

## Available Time Slots

| Slot | Status |
|------|--------|
| 09:00 | Available |
| 10:00 | Available |
| 11:00 | Available |
| 12:00 | Available |
| 13:00 | Blocked (Lunch) |
| 14:00 | Available |
| 15:00 | Available |
| 16:00 | Available |
| 17:00 | Available |

Working hours: 9:00 AM — 6:00 PM (Mon–Sat)

---

## Testing Checklist

- [ ] Bot answers hospital questions correctly
- [ ] Bot recommends the right doctor for symptoms
- [ ] Bot lists all doctors when asked
- [ ] Booking flow: Doctor → Date → Slot → Confirmation
- [ ] Bot blocks lunch break (1:00–2:00 PM)
- [ ] Bot blocks after-hours (before 9 AM, after 6 PM)
- [ ] Bot remembers conversation context
- [ ] Login required before booking
- [ ] Only patients can book (not doctors/admins)
- [ ] Dashboard shows correct statistics
- [ ] Queue management works with filtering
- [ ] Doctor can complete appointments with notes
- [ ] AI summary generation works
- [ ] Report analyzer processes uploaded files

---

## Deployment

Deployed on Vercel: https://medi-queue-beige.vercel.app

GitHub: https://github.com/archana2807/MediQueue.git
