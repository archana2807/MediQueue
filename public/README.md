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
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts              # Chatbot API (intent detection + routing)
│   │   ├── appointments/route.ts      # CRUD for appointments
│   │   └── appointments/availability/ # Slot availability check
│   └── (dashboard)/                   # Dashboard pages
├── components/
│   ├── chat/hospital-chat.tsx         # Chatbot UI
│   ├── appointments/                  # Appointment forms and tables
│   ├── patients/                      # Patient views
│   └── queue/                         # Queue management
├── lib/
│   ├── queries/
│   │   ├── appointment-agent.ts       # Appointment booking logic
│   │   ├── doctor-agent.ts            # Doctor search & symptom analysis
│   │   ├── appointments.ts            # Database queries
│   │   └── rag.ts                     # RAG for FAQ retrieval
│   ├── ai/client.ts                   # OpenAI client
│   └── utils.ts                       # Utility functions
database/
├── sql                                 # Main schema
└── migrations/
    └── 003_reset_and_seed.sql          # Seed data (5 doctors, 10 FAQ chunks)
```

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
