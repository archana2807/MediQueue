# MediQueue - Demo Flow for Recruiters

> AI-powered Hospital Queue & Appointment Management System

---

## Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gmail.com | Admain |
| Doctor | doctor@gmail.com | Admain |
| Patient | patient@gmail.com | Admain |

**Live URL:** https://medi-queue-beige.vercel.app

---

## Quick Start (3-Minute Overview)

1. Login as **Patient** (patient@gmail.com / Admain)
2. Open the **AI Chatbot** (bottom-right corner)
3. Ask "What are hospital timings?" — get instant answer from knowledge base
4. Ask "I have chest pain" — get symptom-based doctor recommendation
5. Book an appointment via chatbot: "Book appointment with Dr. Meena Iyer at 11:00"
6. Go to **My Appointments** — see your booking
7. Logout, login as **Admin** — see full dashboard with queue management
8. Login as **Doctor** — manage queue and complete appointments

---

## Step 1: Login

1. Go to the login page
2. Enter email and password
3. Click **Login**
4. You'll be redirected to the Dashboard based on your role

---

## Step 2: Dashboard (All Roles)

After login, you'll see:
- **Stats Cards:** Total Appointments, Today's Patients, Doctors Available, Queue Waiting
- **Recent Appointments:** Latest 10 appointments with status

---

## Step 3: AI Chatbot (Patient View)

1. Login as **Patient** (patient@gmail.com / Admain)
2. Click the **chat bubble** in the bottom-right corner
3. You'll see the greeting: "Hello I'm MediQueue AI Assistant. How can I help you today?"
4. Try the test scenarios below

### Chatbot Features:
- **Intent Detection:** Automatically classifies queries (FAQ, Doctor, Symptom, Appointment)
- **RAG Knowledge Base:** Answers from hospital knowledge chunks
- **Multi-turn Conversation:** Remembers context across messages
- **Smart Name Matching:** Handles "Dr Meena" matching "Dr. Meena Iyer"
- **Quick Reply Buttons:** Hospital Timings, Appointments, Diet Advice, Emergency
- **Slot Availability:** Real-time checking against booked appointments
- **Conflict Detection:** Prevents double-booking
- **Working Hours Validation:** 9AM-6PM, lunch break 1-2PM blocked

---

## Chatbot Testing Scenarios (85 Test Cases)

> All tests can be performed on the live URL: https://medi-queue-beige.vercel.app
> Login as **Patient** (patient@gmail.com / Admain) for chatbot access.

---

### Scenario 1: FAQ / Hospital Information (Intent: FAQ) — 14 Tests

Test that the chatbot retrieves answers from the hospital knowledge base using RAG (Retrieval-Augmented Generation). The bot should answer ONLY from the 10 seeded knowledge chunks.

| # | Test Question | Expected Keywords in Response | What to Verify |
|---|---------------|-------------------------------|----------------|
| 1 | What are hospital timings? | Mon-Sat, 9:00 AM, 6:00 PM, lunch 1-2 PM, emergency 24/7 | Complete timings with lunch and emergency |
| 2 | What are the working hours? | 9 AM, 6 PM, Mon-Sat | Same info, different phrasing |
| 3 | Is the hospital open on Sunday? | No, closed on Sunday | Explicitly says closed |
| 4 | What departments are available? | Cardiology, Orthopedics, Pediatrics, Dermatology, General Medicine | All 5 departments listed |
| 5 | Emergency contact number? | 108, 102, Ambulance | Both emergency numbers |
| 6 | What diet is healthy? | Fruits, vegetables, whole grains, lean proteins, water | Nutritional advice + hydration |
| 7 | What insurance do you accept? | Major insurance, cash, cards, UPI | Insurance + payment methods |
| 8 | What should I bring to appointment? | Photo ID, insurance card, medication list, arrive 15 min early | Documents + arrival time |
| 9 | What is the follow-up policy? | 1-2 weeks, portal, scheduled at visit | Timeframe + scheduling |
| 10 | How does the queue system work? | Digital queue, real-time tracking, order | Queue description |
| 11 | What time does the hospital open? | 9:00 AM | Specific opening time |
| 12 | When is lunch break? | 1:00 PM to 2:00 PM | Lunch break info |
| 13 | Do you have emergency services? | 24/7, emergency | Emergency availability |
| 14 | What are the payment options? | Cash, cards, UPI | Payment methods |

**Quick Reply Button Test:**
| # | Button Click | Sends Message | Expected Intent |
|---|--------------|---------------|-----------------|
| 15 | Hospital Timings | "What are hospital timings?" | FAQ |
| 16 | Appointments | "How can I book an appointment?" | FAQ |
| 17 | Diet Advice | "What diet is healthy?" | FAQ |
| 18 | Emergency | "Emergency contact number?" | FAQ |

---

### Scenario 2: Symptom to Doctor Recommendation (Intent: SYMPTOM) — 12 Tests

Test that the chatbot maps symptoms to the correct medical specialization and recommends the appropriate doctor. The bot uses LLM to map symptoms, then queries the database for matching doctors.

| # | Test Question | Expected Department | Expected Doctor | What to Verify |
|---|---------------|---------------------|-----------------|----------------|
| 19 | I have fever | GENERAL MEDICINE | Dr. Meena Iyer | Correct mapping |
| 20 | I have chest pain | CARDIOLOGY | Dr. Priya Sharma | Correct mapping |
| 21 | My knee hurts | ORTHOPEDICS | Dr. Rahul Verma | Joint → Orthopedics |
| 22 | I have a skin rash | DERMATOLOGY | Dr. Vikram Patel | Skin → Dermatology |
| 23 | My child has a cough | PEDIATRICS | Dr. Anita Desai | Child → Pediatrics |
| 24 | I have a headache | GENERAL MEDICINE | Dr. Meena Iyer | Headache → General Medicine |
| 25 | I have ear pain | ENT or GENERAL MEDICINE | Dr. Meena Iyer | May not find ENT (not in DB) |
| 26 | I have joint pain | ORTHOPEDICS | Dr. Rahul Verma | Joint → Orthopedics |
| 27 | I have tooth pain | DENTAL | No doctors available | Dental not in DB → "No doctors currently available" |
| 28 | I have eye pain | OPHTHALMOLOGY | No doctors available | Ophthalmology not in DB |
| 29 | My stomach hurts | GENERAL MEDICINE | Dr. Meena Iyer | Abdominal → General Medicine |
| 30 | I feel dizzy | GENERAL MEDICINE | Dr. Meena Iyer | Dizziness → General Medicine |

**Expected Response Format:**
```
Recommended Department:
GENERAL MEDICINE

Available Doctors:
• Dr. Meena Iyer
```

**Edge Case — Unavailable Department:**
When the LLM maps to a specialization NOT in the database (ENT, Ophthalmology, Dental), the bot returns:
```
Recommended Department:
ENT

No doctors currently available.
```

---

### Scenario 3: Doctor Search (Intent: DOCTOR) — 8 Tests

Test that the chatbot lists doctors from the database and answers questions about available medical professionals. The AI has access to the full doctor list.

| # | Test Question | Expected Response | What to Verify |
|---|---------------|-------------------|----------------|
| 31 | Who are the doctors? | Lists all 5 doctors | Complete doctor list |
| 32 | Show me cardiologists | Dr. Priya Sharma - CARDIOLOGY | Filters correctly |
| 33 | Do you have a dermatologist? | Yes, Dr. Vikram Patel | Confirms availability |
| 34 | List all orthopedic doctors | Dr. Rahul Verma - ORTHOPEDICS | Filters correctly |
| 35 | Who is Dr. Priya? | Dr. Priya Sharma - Cardiology | Partial name match |
| 36 | Tell me about Dr. Meena | Dr. Meena Iyer - General Medicine | Info about specific doctor |
| 37 | Which doctor treats children? | Dr. Anita Desai - Pediatrics | Knowledge-based recommendation |
| 38 | Do you have a heart specialist? | Dr. Priya Sharma - Cardiology | Specialty description match |

---

### Scenario 4: Appointment Booking — Complete Flow (Intent: APPOINTMENT) — 12 Tests

**Important:** Must be logged in as Patient (patient@gmail.com / Admain). The chatbot uses multi-turn conversation to collect booking details.

#### Test Case 39: Full Booking Flow (2-turn)
| Turn | User Says | Bot Responds | What to Verify |
|------|-----------|--------------|----------------|
| 1 | Book appointment with Dr. Meena Iyer | Available slots for today | Shows ✓ 09:00, ✓ 10:00, etc. |
| 2 | 11:00 | Appointment Booked confirmation | Doctor, date, time, wait time, ID shown |

#### Test Case 40: Booking for Tomorrow
| Turn | User Says | Bot Responds |
|------|-----------|--------------|
| 1 | Book appointment with Dr. Priya Sharma tomorrow | Slots for tomorrow |
| 2 | 14:00 | Books at 2:00 PM |

#### Test Case 41: Booking with Time in Message
| Turn | User Says | Bot Responds |
|------|-----------|--------------|
| 1 | I want to see Dr. Rahul at 2 PM | Books directly at 14:00 |

#### Test Case 42: Booking with Doctor Name Variation (no dot)
| Turn | User Says | Bot Responds |
|------|-----------|--------------|
| 1 | Book appointment with Dr Meena at 11:00 | Finds Dr. Meena Iyer via fuzzy matching |

#### Test Case 43: Booking — Only Doctor Name (no time)
| Turn | User Says | Bot Responds |
|------|-----------|--------------|
| 1 | Book appointment with Dr. Vikram Patel | Shows available slots, asks for time |

#### Test Case 44: Booking — Only Time (no doctor, after previous context)
| Turn | User Says | Bot Responds |
|------|-----------|--------------|
| 1 | Book appointment with Dr. Anita Desai | Shows slots |
| 2 | 11:00 | Books at 11:00 (remembers doctor from turn 1) |

#### Test Case 45: Booking — Natural Language Time
| Turn | User Says | Bot Responds |
|------|-----------|--------------|
| 1 | Book with Dr. Meena at noon | May extract or ask for specific time |

#### Test Case 46: Booking — Partial Name
| Turn | User Says | Bot Responds |
|------|-----------|--------------|
| 1 | Book with Priya at 10:00 | Finds Dr. Priya Sharma |

#### Test Case 47: Booking — Last Name Only
| Turn | User Says | Bot Responds |
|------|-----------|--------------|
| 1 | Book appointment with Sharma at 9:00 | Finds Dr. Priya Sharma |

#### Test Case 48: Booking — Date with "today"
| Turn | User Says | Bot Responds |
|------|-----------|--------------|
| 1 | Book with Dr. Meena today at 11:00 | Books for today |

#### Test Case 49: Booking — Time in AM/PM format
| Turn | User Says | Bot Responds |
|------|-----------|--------------|
| 1 | Book with Dr. Rahul at 3 PM | Extracts 15:00 |

#### Test Case 50: Booking — 24-hour format
| Turn | User Says | Bot Responds |
|------|-----------|--------------|
| 1 | Book with Dr. Anita at 09:00 | Books at 09:00 |

---

### Scenario 5: Appointment Validation / Error Handling — 10 Tests

Test that the chatbot enforces booking rules and validates input.

| # | Test Question | Expected Response | What to Verify |
|---|---------------|-------------------|----------------|
| 51 | Book appointment at 13:00 | "Doctor is unavailable at 13:00. Lunch break: 01:00 PM - 02:00 PM" | Lunch break blocked |
| 52 | Book appointment at 8:00 | "Doctor appointments are available only between: 09:00 AM - 06:00 PM" | Before hours blocked |
| 53 | Book appointment at 18:00 | "Doctor appointments are available only between: 09:00 AM - 06:00 PM" | At closing blocked (hour >= 18) |
| 54 | Book appointment with Dr. Cancer | "Doctor 'Dr. Cancer' not found." | Invalid doctor |
| 55 | Book appointment yesterday | "Invalid appointment date. Please provide a future date." | Past date rejected |
| 56 | Book appointment at 25:00 | Invalid time error | Invalid time format |
| 57 | Book appointment with Dr. Vikram at 11:00 | Books if available, or shows alternatives | Slot check |
| 58 | Book appointment with Dr. Meena at 09:00 (already booked) | "Doctor already has an appointment at 09:00. Available slots: ..." | Conflict detection + alternatives |
| 59 | Book appointment with Dr. Priya at 13:30 | May process (not exactly 13:00) | Only 13:00 is blocked |
| 60 | Book appointment at 17:59 | Should be valid (hour=17 < 18) | Edge case: last valid minute |

---

### Scenario 6: Edge Cases / Error Handling — 10 Tests

Test the chatbot's behavior with unexpected or invalid inputs.

| # | Test Question | Expected Response | What to Verify |
|---|---------------|-------------------|----------------|
| 61 | abcdefgh | "I don't have that information." | Graceful handling of gibberish |
| 62 | !@#$%^&*() | Helpful response or FAQ fallback | Special characters handled |
| 63 | | (empty message) | Message not sent (UI prevents empty) | No empty messages |
| 64 | What's your name? | "MediQueue AI Assistant" or similar | Basic identity |
| 65 | Thank you | Polite acknowledgment | Handles gratitude |
| 66 | Can you help me? | "How can I help you today?" or FAQ | General help |
| 67 | I don't feel well | Symptom recommendation or FAQ | Health-related query |
| 68 | 12345 | "I don't have that information." | Pure numbers handled |
| 69 | book with dr priya at noon | Should ask for specific time | Informal time |
| 70 | Book appointment with Dr Meena at 11:00 (no dot) | Finds Dr. Meena Iyer | Name normalization |

---

### Scenario 7: Multi-turn Conversation Flows — 4 Complete Journeys

#### Journey A: Symptom → Recommendation → Booking → FAQ (4 turns)
| Turn | User Says | Bot Responds | What to Verify |
|------|-----------|--------------|----------------|
| 1 | I have fever | GENERAL MEDICINE → Dr. Meena Iyer | Correct symptom mapping |
| 2 | Book appointment with her | Shows slots (understands "her" = Dr. Meena) | Context maintained |
| 3 | 11:00 | Appointment Booked | Booking successful |
| 4 | What time is the hospital open? | FAQ answer | Context switch works |

#### Journey B: Doctor Search → Booking (3 turns)
| Turn | User Says | Bot Responds |
|------|-----------|--------------|
| 1 | Who treats heart problems? | Dr. Priya Sharma - Cardiology |
| 2 | Book appointment with her | Shows slots for Dr. Priya |
| 3 | 14:00 | Books appointment |

#### Journey C: Symptom → No Available Doctor → Alternative (2 turns)
| Turn | User Says | Bot Responds |
|------|-----------|--------------|
| 1 | I have tooth pain | DENTAL → "No doctors currently available" |
| 2 | Then who else can help me? | May suggest General Medicine or FAQ |

#### Journey D: Full Appointment with Conflict Resolution (3 turns)
| Turn | User Says | Bot Responds |
|------|-----------|--------------|
| 1 | Book with Dr. Meena at 09:00 | "Already booked at 09:00. Available: 10:00, 11:00..." |
| 2 | 10:00 | Books at 10:00 |
| 3 | What are the hospital hours? | FAQ answer |

---

### Scenario 8: Intent Detection Verification — 8 Tests

Test that the AI correctly classifies different query types.

| # | Test Question | Expected Intent | What to Verify |
|---|---------------|-----------------|----------------|
| 71 | What are your timings? | FAQ | General question |
| 72 | I have a headache | SYMPTOM | Symptom description |
| 73 | Book appointment | APPOINTMENT | Booking request |
| 74 | Who is Dr. Priya? | DOCTOR | Doctor inquiry |
| 75 | Show my queue | QUEUE | Queue request (stub) |
| 76 | What's my history? | HISTORY | History request (stub) |
| 77 | Schedule a visit tomorrow | APPOINTMENT | Scheduling = appointment |
| 78 | Is Dr. Meena available? | DOCTOR | Doctor availability inquiry |

**Note:** QUEUE and HISTORY return "coming next" placeholders.

---

### Scenario 9: Authentication & Role-Based Access — 4 Tests

Test that appointment booking respects authentication rules.

| # | Test Condition | Expected Response | What to Verify |
|---|----------------|-------------------|----------------|
| 79 | Try booking without login | "Please login to book an appointment." | Unauthenticated blocked |
| 80 | Login as Doctor, try booking | "Only patients can book appointments." | Role restriction |
| 81 | Login as Patient, try booking | Normal booking flow | Patients can book |
| 82 | Login as Admin, try booking | "Only patients can book appointments." | Admin restricted |

---

### Scenario 10: Conversation History & Context — 5 Tests

Test that the chatbot maintains context across multiple messages.

| # | Test Flow | What to Verify |
|---|-----------|----------------|
| 83 | 1) "Book with Dr. Meena" 2) "What about tomorrow?" 3) "11:00" | Doctor remembered, date changed to tomorrow, time set |
| 84 | 1) "I have chest pain" 2) "Book with that doctor" | "That doctor" = Dr. Priya Sharma from turn 1 |
| 85 | 1) "Book with Dr. Priya at 10:00" 2) "Actually, make it 14:00" | Time updated to 14:00 |
| 86 | 1) "What are hospital timings?" 2) "Book appointment" | FAQ answered, then switches to booking intent |
| 87 | 1) "Book with Dr. Meena" 2) "Cancel that" | Handles cancellation (may not be implemented, test graceful fallback) |

---

## Chatbot Test Checklist

### Core Functionality
- [ ] Greeting message appears on chat open
- [ ] FAQ questions return correct answers from knowledge base
- [ ] Symptom queries recommend correct department and doctor
- [ ] Doctor search lists available doctors
- [ ] Quick reply buttons send correct messages
- [ ] Bot answers only from knowledge base (no hallucinated info)
- [ ] "I don't have that information" for unknown queries

### Appointment Booking
- [ ] Full booking flow works (doctor → slot → confirmation)
- [ ] Slot availability checked against database in real-time
- [ ] Conflict detection prevents double-booking
- [ ] Working hours validation (9AM-6PM, 18:00 rejected)
- [ ] Lunch break validation (1:00 PM blocked)
- [ ] Past time validation for today
- [ ] Invalid doctor name returns "not found" error
- [ ] Invalid date returns error message
- [ ] Past date returns "future date" error
- [ ] No available slots returns "choose another date"
- [ ] Estimated wait time calculated correctly (15 min per patient ahead)
- [ ] Appointment ID returned in confirmation

### Multi-turn & Context
- [ ] Multi-turn context maintained across messages
- [ ] "Her" / "that doctor" refers to previously mentioned doctor
- [ ] Time-only message uses previously selected doctor
- [ ] Date change ("tomorrow") works while keeping doctor
- [ ] Intent detection classifies queries correctly
- [ ] Context switch from FAQ to Appointment works

### Name Matching (Fuzzy)
- [ ] "Dr Meena" matches "Dr. Meena Iyer"
- [ ] "Dr. Priya" matches "Dr. Priya Sharma"
- [ ] "Sharma" matches "Dr. Priya Sharma"
- [ ] "Patel" matches "Dr. Vikram Patel"
- [ ] "Rahul" matches "Dr. Rahul Verma"

### Error Handling
- [ ] Gibberish input returns helpful response
- [ ] Special characters handled gracefully
- [ ] Empty message prevented by UI
- [ ] Unauthenticated booking returns login message
- [ ] Non-patient role returns restriction message
- [ ] API error returns "Something went wrong"

### UI/UX
- [ ] Chat opens in slide-out panel from bottom-right
- [ ] Messages display in bubbles (user = right, bot = left)
- [ ] Loading state shows "Thinking..." while processing
- [ ] Input field clears after sending
- [ ] Send button disabled while loading or empty input
- [ ] Messages preserve whitespace and newlines
- [ ] Quick reply buttons populate input (don't auto-send)
- [ ] Chat panel responsive on mobile (full width)

---

## Step 4: Patient - My Appointments

1. Login as **Patient**
2. Click **My Appointments** in the sidebar
3. See all your booked appointments with:
   - Queue Number
   - Doctor Name & Department
   - Date & Time
   - Status (PENDING, CONFIRMED, CHECKED_IN, etc.)
4. Search by doctor name or department

---

## Step 5: Admin - Queue Management

1. Login as **Admin** (admin@gmail.com / Admain)
2. Click **Queue Management** in the sidebar
3. See today's patients filtered by doctor
4. Use **date picker** to view different days
5. Use **doctor filter** to see specific doctor's queue
6. Queue statuses:
   - CHECKED_IN (Blue)
   - WAITING (Violet)
   - IN_PROGRESS (Cyan)
   - COMPLETED (Green)

---

## Step 6: View Patient Details

1. Click the **user icon** on any queue row
2. Patient Detail page opens with:
   - **Hero Section:** Patient name, email, phone, join date
   - **Stats Row:** Total visits, medications, allergies, risk flags
   - **Clinical Summary:** Active problems, medications, allergies, observations
   - **Clinical Agent:** AI-powered document generation
   - **Saved Drafts:** Previously generated documents

---

## Step 7: Complete Appointment (Doctor Workspace)

1. Login as **Doctor** (doctor@gmail.com / Admain)
2. Click **My Queue** in sidebar
3. Click **Complete** on an IN_PROGRESS patient
4. **Doctor Workspace** modal opens:
   - Enter notes in the textarea
   - Click **Extract from Notes** to auto-fill clinical data
   - Add/edit conditions, medications, allergies, observations
   - Click **Generate AI Summary**
   - Click **Save & Complete**

---

## Step 8: Clinical Agent

1. Go to Patient Detail page
2. In the **Clinical Agent** panel, select a task:
   - **Handover Summary** — For shift changes
   - **Patient Summary** — For new clinicians
   - **Risk Flags** — Identify risk factors
   - **Missing Info** — Find gaps in records
3. Click **Run Agent**
4. View the AI-generated summary
5. Click **Save as Draft** to save it

---

## Step 9: My Patients (Doctor View)

1. Click **My Patients** in sidebar
2. See all patients you've treated
3. Click view icon to see patient details

---

## Step 10: Reports (Admin View)

1. Click **Report Analyzer** in sidebar
2. Upload a medical report (PDF/image)
3. AI analyzes the report
4. View analysis with:
   - Key Findings
   - Abnormal Results
   - Potential Risks
   - Recommendations

---

## Step 11: Doctor Management (Admin Only)

1. Click **Doctors** in sidebar (Admin only)
2. View list of all doctors
3. Add new doctors
4. Edit doctor details
5. Delete doctors

---

## Step 12: Appointments Management

1. Click **Appointments** in sidebar
2. View **All Appointments** — See all bookings
3. Click **Book Appointment** — Manual booking form
4. Filter by status, search by name

---

## Key Features to Highlight

### 1. AI Chatbot with RAG (85 Test Cases)
- **Intent Detection:** Auto-classifies queries into FAQ, Doctor, Symptom, Appointment
- **RAG Knowledge Base:** 10 FAQ entries with vector embeddings for semantic search
- **Natural Language Booking:** Multi-turn conversation to collect doctor, date, time
- **Symptom Triage:** Maps symptoms to specialization, recommends matching doctor
- **Smart Name Matching:** "Dr Meena" → "Dr. Meena Iyer" via fuzzy matching
- **Slot Management:** Real-time availability checking, conflict detection
- **Validation:** Working hours (9AM-6PM), lunch break (1-2PM), past dates
- **Quick Reply Buttons:** 4 pre-defined quick actions for common queries
- **Authentication:** Role-based access (only patients can book)

### 2. Real-Time Queue Management
- Auto queue number assignment
- Status tracking (CHECKED_IN → WAITING → IN_PROGRESS → COMPLETED)
- Date and doctor filtering
- Live queue position display

### 3. Doctor Workspace
- Structured clinical data entry
- AI-powered "Extract from Notes"
- Tag-style UI for clinical items
- AI summary generation

### 4. Patient Detail Page
- Comprehensive patient view
- Clinical summary from database
- AI-powered clinical agent
- Saved drafts management

### 5. Clinical Agent
- Handover Summary for shift changes
- Patient Summary for new clinicians
- Risk Flags assessment
- Missing Information analysis

### 6. Report Analysis
- Upload medical reports (PDF/image)
- AI-powered analysis
- Key findings and recommendations
- Abnormal value highlighting

### 7. Role-Based Access
- Admin: Full access to all features
- Doctor: Queue, My Patients, My Appointments
- Patient: Dashboard, My Appointments, Chatbot

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Backend | Next.js API Routes |
| Database | PostgreSQL (Neon) |
| AI | OpenRouter API (GPT-4.1-nano) |
| Auth | NextAuth.js with JWT |
| State | TanStack Query |
| Vector DB | pgvector (for RAG) |
| Deployment | Vercel |

---

## Database Schema

| Table | Purpose |
|-------|---------|
| users | Admin, Doctor, Patient accounts |
| doctors | Doctor profiles with specialization |
| appointments | Queue with status tracking |
| appointment_notes | Doctor notes + AI summaries |
| patient_conditions | Medical conditions |
| patient_medications | Current medications |
| patient_allergies | Known allergies |
| patient_observations | Clinical observations |
| patient_reports | Medical reports with AI analysis |
| patient_drafts | Saved clinical documents |
| knowledge_chunks | FAQ data for RAG chatbot |

---

## Test Data Seeded

### User Accounts
- **1 Admin** account (admin@gmail.com / Admain)
- **5 Doctors** with specializations
- **10 Patients** with clinical data

### Doctor Directory
| Doctor | Specialization |
|--------|---------------|
| Dr. Priya Sharma | Cardiology |
| Dr. Rahul Verma | Orthopedics |
| Dr. Anita Desai | Pediatrics |
| Dr. Vikram Patel | Dermatology |
| Dr. Meena Iyer | General Medicine |

### Chatbot Knowledge Base (10 FAQ Entries)
| Topic | Content |
|-------|---------|
| Hospital Timings | Mon-Sat 9AM-6PM, lunch 1-2PM, emergency 24/7 |
| Appointment Booking | How to book, available hours, lunch break |
| Emergency Contact | 108 (Ambulance), 102 (Medical Emergency) |
| Departments | Cardiology, Orthopedics, Pediatrics, Dermatology, General Medicine |
| Diet Advice | Fruits, vegetables, whole grains, lean proteins, hydration |
| Insurance | Major plans accepted, cash/cards/UPI |
| Patient Rights | Non-discrimination, privacy, informed consent |
| What to Bring | Photo ID, insurance card, medication list, arrive early |
| Follow-up Policy | Within 1-2 weeks, scheduled at visit or portal |
| Queue System | Digital queue, real-time tracking, served in order |

### Appointments & Clinical Data
- **10 Today's appointments** (various statuses: CHECKED_IN, WAITING, IN_PROGRESS, COMPLETED)
- **6 Past completed appointments**
- **12 conditions, 14 medications, 8 allergies, 18 observations** across patients

---

## API Endpoints

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/chat` | POST | AI Chatbot — intent detection + routing (FAQ/Doctor/Symptom/Appointment) | No (Appointment booking requires PATIENT role) |
| `/api/dashboard` | GET | Dashboard stats (appointments, patients, doctors, queue) | Yes |
| `/api/appointments` | GET/POST | List/Create appointments | Yes |
| `/api/my-appointments` | GET | Doctor's own appointments | Yes (Doctor) |
| `/api/my-appointments/patient` | GET | Patient's own appointments | Yes (Patient) |
| `/api/queue` | GET | Queue management with filters | Yes |
| `/api/doctors` | GET/POST | Doctor CRUD management | Yes (Admin) |
| `/api/patients/[id]/agent` | POST | Clinical agent (Handover, Summary, Risk, Missing Info) | Yes |
| `/api/ai/analyze-symptoms` | POST | Symptom analysis | Yes |
| `/api/ai/extract-clinical` | POST | Clinical data extraction from notes | Yes |
| `/api/ai/report-analysis` | POST | Medical report analysis (PDF/image) | Yes |
| `/api/ai/summary` | POST | Doctor notes AI summary | Yes |

### Chat API Details
```
POST /api/chat
Request:  { message: string, history: Array<{ role: string, content: string }> }
Response: { success: boolean, answer: string, intent: string }

Intents: FAQ | DOCTOR | SYMPTOM | APPOINTMENT | QUEUE | HISTORY
```

---

## Environment Variables Required

```
DATABASE_URL=postgresql://...
OPENROUTER_API_KEY=sk-or-v1-...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

---

## How to Run Locally

```bash
# Install dependencies
npm install

# Set up database
node database/run-seed.js

# Generate chatbot embeddings
npx tsx src/scripts/embed-knowledge.ts

# Start dev server
npm run dev
```

---

## Contact

For any questions about this project, please reach out.
