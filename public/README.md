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

## Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Patient | patient@gmail.com | Admain |
| Admin | admin@gmail.com | Admain |
| Doctor | doctor@gmail.com | Admain |

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
