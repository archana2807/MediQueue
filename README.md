<div align="center">

# 🏥 MediQueue

### Smart Hospital Queue Management System

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql)](https://neon.tech)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

**AI-Powered Healthcare Platform for Patients, Doctors, and Administrators**

[Live Demo](https://medi-queue-beige.vercel.app) • [Interview Prep](./INTERVIEW_PREP.md) • [Report Issue](https://github.com/archana2807/MediQueue/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Demo Access](#-demo-access)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Functionality Flow](#-functionality-flow)
- [Chatbot Booking Flow](#-chatbot-booking-flow)
- [Database Schema](#-database-schema)
- [API Routes](#-api-routes)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Testing Checklist](#-testing-checklist)
- [Deployment](#-deployment)

---

## 🎯 Overview

MediQueue is a comprehensive hospital management system that streamlines patient flow, appointment booking, and clinical workflows through AI-powered automation.

**Problem Solved:**
- ⏱️ Long wait times due to manual queue management
- 📝 Doctors spending excessive time on documentation
- 📊 Lack of structured clinical data for patient handovers
- 🤖 No AI support for clinical decision-making

**Solution:**
- 🔄 Real-time digital queue management
- 🤖 AI-powered clinical data extraction from doctor notes
- 📋 Structured clinical data storage (conditions, medications, allergies)
- 💬 AI chatbot for guided appointment booking

---

## 🔐 Demo Access

**Password for all accounts:** `Admain`

| Role | Email | Capabilities |
|:-----|:------|:-------------|
| **Admin** | `admin@gmail.com` | Dashboard, Queue Management, Doctor Management, Report Analyzer |
| **Doctor** | `doctor@gmail.com` | My Queue, Complete Appointments, AI Notes, Clinical Agent |
| **Patient** | `patient@gmail.com` | Book Appointments, My Appointments, AI Chatbot |

### Quick Start

1. Go to [medi-queue-beige.vercel.app/login](https://medi-queue-beige.vercel.app/login)
2. Click any role button to auto-fill email
3. Enter password: `Admain`
4. Click Login

---

## ✨ Key Features

### 🤖 AI Chatbot
| Feature | Description |
|:--------|:------------|
| Intent Detection | 6 intents: FAQ, Doctor, Symptom, Appointment, Queue, History |
| Guided Booking | Step-by-step: Doctor → Date → Time → Confirmation |
| Smart Slots | Shows only available slots, blocks lunch breaks |
| Context Memory | Remembers conversation within session |
| FAQ System | 10 knowledge chunks for hospital information |

### 👨‍⚕️ Doctor Features
- View patient queue with real-time status updates
- Complete appointments with clinical notes
- AI-powered note extraction (conditions, medications, allergies)
- Generate AI summaries for patient visits
- Clinical Agent for handover documents

### 👩‍⚕️ Patient Features
- Book appointments via AI chatbot or manual form
- View appointment history with status tracking
- Real-time queue position updates
- Access personal medical history

### 🔧 Admin Features
- Dashboard with live statistics
- Queue management with date/doctor filtering
- Doctor management (add/edit/remove)
- Report analyzer (upload PDF/images for AI analysis)
- Patient detail views with clinical data

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| **Frontend** | Next.js 15, React 19, TypeScript | UI framework |
| **Styling** | Tailwind CSS, shadcn/ui | Design system |
| **Backend** | Next.js API Routes | Server logic |
| **Database** | PostgreSQL (Neon Serverless) | Data storage |
| **AI/LLM** | OpenRouter API (GPT-4.1-nano) | AI features |
| **Auth** | NextAuth.js | Authentication |
| **State** | TanStack Query | Server state management |
| **Forms** | React Hook Form + Zod | Form validation |
| **Deployment** | Vercel | Hosting |

---

## 🔄 Functionality Flow

### Authentication Flow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  User visits │    │  Clicks role │    │  Enters      │
│  /login      │ →  │  button      │ →  │  password    │
└──────────────┘    └──────────────┘    └──────────────┘
                                               ↓
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Redirect to │ ←  │  JWT token   │ ←  │  NextAuth    │
│  dashboard   │    │  created     │    │  validates   │
└──────────────┘    └──────────────┘    └──────────────┘
```

### Intent Detection Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER MESSAGE RECEIVED                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              DETERMINISTIC CHECKS (Fast, No LLM)            │
├─────────────────────────────────────────────────────────────┤
│  ✓ Bot asked for "doctor name" + looks like name?          │
│  ✓ Bot asked for "date" + "today"/"tomorrow"?              │
│  ✓ Bot showed "available slots" + time format?             │
│  ✓ Message contains "book"/"appointment"?                  │
│  ✓ Message contains "i have"/"i feel"?                     │
│  ✓ Message contains "who is"/"show me"?                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────┴─────────┐
                    │      MATCH?       │
                    └─────────┬─────────┘
                         ↓         ↓
                       YES        NO
                        ↓         ↓
                   ┌────────┐  ┌────────┐
                   │ Route  │  │  LLM   │
                   │ to     │  │  Call  │
                   │ Handler│  └────────┘
                   └────────┘
```

### Chatbot Booking Flow

```
Step 1: "How can I book an appointment?"
        → Bot: "Please provide a doctor name."

Step 2: "Dr. Meena Iyer"
        → findDoctor() → Match found
        → Bot: "When would you like the appointment?"

Step 3: "today"
        → normalizeDate() → IST date
        → getDoctorAppointments() → Check bookings
        → Filter available slots
        → Bot: "Available slots: 09:00, 10:00, 11:00..."

Step 4: "11:00"
        → validateTime() → Check hours + lunch
        → istToUtc() → Convert to UTC
        → createAppointment() → Save to DB
        → Bot: "✅ Appointment Booked!"
```

---

## 💬 Chatbot Booking Flow

### Step-by-Step Guide

```
You:    How can I book an appointment?
Bot:    Please provide a doctor name.

You:    Dr. Meena Iyer
Bot:    Great! You want to book with Dr. Meena Iyer.
        When would you like the appointment?
        • Reply with "today" for today
        • Reply with "tomorrow" for tomorrow
        • Or type a date like "2026-08-30"

You:    today
Bot:    Dr. Meena Iyer is available on 2026-08-28.
        Available slots:
        ✓ 09:00  ✓ 10:00  ✓ 11:00  ✓ 12:00
        ✓ 14:00  ✓ 15:00  ✓ 16:00  ✓ 17:00
        Reply with your preferred time.

You:    11:00
Bot:    ✅ Appointment Booked
        Doctor: Dr. Meena Iyer
        Date: 2026-08-28
        Time: 11:00
        Estimated Wait: 0 min
        Status: Pending
```

### All Ways to Book

| Method | Example |
|:-------|:--------|
| Guided Flow | "How can I book an appointment?" |
| With Doctor | "Book appointment with Dr. Meena Iyer" |
| With Time | "Book with Priya at 10:00" |
| With Date | "Book appointment tomorrow at 2 PM" |
| Direct | "I want to see Dr. Rahul at 14:00" |

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐         ┌─────────────────┐
│      users       │         │     doctors      │
├─────────────────┤         ├─────────────────┤
│ id (PK)         │←───────→│ id (PK)         │
│ name            │    1:1  │ user_id (FK)    │
│ email           │         │ specialization  │
│ phone           │         └─────────────────┘
│ password        │                │
│ role            │                │ 1:1
│ created_at      │                ↓
└─────────────────┘         ┌─────────────────┐
        │                   │  appointments   │
        │ 1:N               ├─────────────────┤
        ↓                   │ id (PK)         │
┌─────────────────┐         │ patient_id (FK) │
│ patient_        │         │ doctor_id (FK)  │
│ conditions      │         │ appointment_date│
├─────────────────┤         │ queue_number    │
│ id (PK)         │←───────→│ status          │
│ patient_id (FK) │   N:1   └─────────────────┘
│ condition_name  │                │
│ status          │                │ 1:1
│ visit_id (FK)   │                ↓
└─────────────────┘         ┌─────────────────┐
                            │appointment_notes│
┌─────────────────┐         ├─────────────────┤
│ patient_        │         │ id (PK)         │
│ medications     │         │ appointment_id  │
├─────────────────┤         │ doctor_notes    │
│ id (PK)         │←───────→│ ai_summary      │
│ patient_id (FK) │   N:1   └─────────────────┘
│ name            │
│ dosage          │
│ frequency       │
│ visit_id (FK)   │
└─────────────────┘

Similar tables: patient_allergies, patient_observations,
                patient_drafts, patient_reports, knowledge_chunks
```

### Tables Overview

| Table | Purpose | Key Fields |
|:------|:--------|:-----------|
| `users` | All user accounts | id, name, email, role |
| `doctors` | Doctor profiles | user_id, specialization |
| `appointments` | Bookings | patient_id, doctor_id, date, status |
| `appointment_notes` | Clinical notes | appointment_id, doctor_notes, ai_summary |
| `patient_conditions` | Medical conditions | patient_id, condition_name, status |
| `patient_medications` | Prescriptions | patient_id, name, dosage, frequency |
| `patient_allergies` | Allergies | patient_id, allergen, severity |
| `patient_observations` | Vital signs, test results | patient_id, observation |
| `patient_drafts` | AI-generated documents | patient_id, task_type, content |
| `knowledge_chunks` | FAQ data | title, content, category |

---

## 🌐 API Routes

### Authentication
| Method | Endpoint | Description |
|:-------|:---------|:------------|
| POST | `/api/auth/[...nextauth]` | Login/Logout |

### Chatbot
| Method | Endpoint | Description |
|:-------|:---------|:------------|
| POST | `/api/chat` | Process chatbot messages |

### Appointments
| Method | Endpoint | Description |
|:-------|:---------|:------------|
| GET | `/api/appointments` | List all appointments |
| POST | `/api/appointments` | Create appointment |
| GET | `/api/appointments/[id]` | Get appointment details |
| PUT | `/api/appointments/[id]` | Update appointment |
| DELETE | `/api/appointments/[id]` | Delete appointment |
| GET | `/api/appointments/availability` | Check slot availability |
| GET | `/api/my-appointments/patient` | Patient's appointments |
| GET | `/api/my-appointments/doctor` | Doctor's appointments |

### Queue Management
| Method | Endpoint | Description |
|:-------|:---------|:------------|
| GET | `/api/queue` | List queue |
| PUT | `/api/queue/[id]` | Update queue status |

### Doctors & Patients
| Method | Endpoint | Description |
|:-------|:---------|:------------|
| GET | `/api/doctors` | List doctors |
| POST | `/api/doctors` | Create doctor |
| GET | `/api/patients` | List patients |
| GET | `/api/patients/[id]` | Patient details |
| GET | `/api/patients/[id]/context` | Patient context for AI |

### AI Services
| Method | Endpoint | Description |
|:-------|:---------|:------------|
| POST | `/api/ai/extract-clinical` | Extract clinical data from notes |
| POST | `/api/ai/summary` | Generate AI summary |
| POST | `/api/patients/[id]/agent` | Run clinical agent |
| POST | `/api/report-analyzer` | Analyze medical reports |

### Drafts
| Method | Endpoint | Description |
|:-------|:---------|:------------|
| GET | `/api/drafts` | List saved drafts |
| POST | `/api/drafts` | Save draft |
| DELETE | `/api/drafts/[id]` | Delete draft |

---

## 📁 Project Structure

```
MediQueue/
├── src/
│   ├── app/
│   │   ├── (auth)/                    # Authentication pages
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/               # Protected dashboard
│   │   │   ├── layout.tsx             # Sidebar + auth
│   │   │   ├── page.tsx               # Dashboard home
│   │   │   ├── appointments/          # Appointment management
│   │   │   ├── doctors/               # Doctor management
│   │   │   ├── patients/              # Patient management
│   │   │   ├── queue/                 # Queue management
│   │   │   ├── my-queue/              # Doctor's queue
│   │   │   ├── my-appointments/       # Patient's appointments
│   │   │   └── report-analyzer/       # Report analysis
│   │   └── api/                       # API routes
│   │       ├── chat/route.ts          # Chatbot
│   │       ├── appointments/          # Appointment CRUD
│   │       ├── queue/                 # Queue management
│   │       ├── doctors/               # Doctor CRUD
│   │       ├── patients/              # Patient management
│   │       ├── ai/                    # AI services
│   │       └── drafts/                # Draft management
│   ├── components/
│   │   ├── auth/                      # Auth forms
│   │   ├── chat/                      # Chatbot UI
│   │   ├── appointments/              # Appointment components
│   │   ├── patients/                  # Patient components
│   │   ├── queue/                     # Queue components
│   │   ├── dashboard/                 # Dashboard widgets
│   │   ├── doctors/                   # Doctor components
│   │   ├── common/                    # Shared components
│   │   └── ui/                        # shadcn/ui
│   └── lib/
│       ├── ai/                        # AI client & model
│       ├── queries/                   # Database queries
│       ├── db.ts                      # PostgreSQL pool
│       ├── auth.ts                    # NextAuth config
│       └── utils.ts                   # Utilities
├── database/
│   ├── sql                            # Main schema
│   └── migrations/                    # Seed data
├── public/                            # Static assets
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon recommended)
- OpenRouter API key

### Installation

```bash
# Clone repository
git clone https://github.com/archana2807/MediQueue.git
cd MediQueue

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@host/dbname

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# AI
OPENROUTER_API_KEY=your-api-key
```

### Database Setup

```bash
# Create tables
psql $DATABASE_URL -f database.sql

# Seed data
psql $DATABASE_URL -f database/migrations/003_reset_and_seed.sql
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ✅ Testing Checklist

### Chatbot
- [ ] Bot answers hospital questions correctly
- [ ] Bot recommends the right doctor for symptoms
- [ ] Bot lists all doctors when asked
- [ ] Booking flow: Doctor → Date → Slot → Confirmation
- [ ] Bot blocks lunch break (1:00–2:00 PM)
- [ ] Bot blocks after-hours (before 9 AM, after 6 PM)
- [ ] Bot remembers conversation context
- [ ] Login required before booking
- [ ] Only patients can book (not doctors/admins)

### Dashboard & Management
- [ ] Dashboard shows correct statistics
- [ ] Queue management works with filtering
- [ ] Doctor can complete appointments
- [ ] AI summary generation works
- [ ] Report analyzer processes uploaded files

---

## 🌐 Deployment

**Live URL:** [medi-queue-beige.vercel.app](https://medi-queue-beige.vercel.app)

**GitHub:** [github.com/archana2807/MediQueue](https://github.com/archana2807/MediQueue)

### Deploy Your Own

1. Fork the repository
2. Create Vercel project
3. Add environment variables
4. Connect to Neon database
5. Deploy!

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ for Healthcare**

[![Next.js](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/archana2807/MediQueue)

</div>
