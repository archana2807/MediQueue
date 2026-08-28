# MediQueue — How to Test

> Live URL: https://medi-queue-beige.vercel.app

---

## Quick Login

| Who | Email | Password |
|-----|-------|----------|
| Patient | patient@gmail.com | Admain |
| Admin | admin@gmail.com | Admain |
| Doctor | doctor@gmail.com | Admain |

---

## How to Open the Chatbot

1. Login as **Patient**
2. Click the **blue chat bubble** (bottom-right corner)
3. You see: "Hello I'm MediQueue AI Assistant. How can I help you today?"
4. Type a question and press **Enter** or click **Send**

---

## PART A: Chatbot Testing (Copy-Paste These)

### A1. Ask These Questions — Bot Should Answer Correctly

Type each question one by one and check the answer:

| # | Type This | Should Answer About |
|---|-----------|---------------------|
| 1 | What are hospital timings? | Mon-Sat 9AM-6PM, lunch 1-2PM, emergency 24/7 |
| 2 | Is the hospital open on Sunday? | No, closed on Sunday |
| 3 | What departments are available? | Cardiology, Orthopedics, Pediatrics, Dermatology, General Medicine |
| 4 | Emergency contact number? | 108 and 102 |
| 5 | What diet is healthy? | Fruits, vegetables, whole grains, water |
| 6 | What insurance do you accept? | Major insurance, cash, cards, UPI |
| 7 | What should I bring? | Photo ID, insurance card, medication list, arrive 15 min early |
| 8 | How does the queue work? | Digital queue, real-time tracking |
| 9 | What time does the hospital open? | 9:00 AM |
| 10 | When is lunch break? | 1:00 PM to 2:00 PM |

**PASS:** Answer contains the expected keywords
**FAIL:** Bot says "I don't have that information"

---

### A2. Click These Buttons — Bot Should Send the Right Message

| # | Click This Button | Bot Sends |
|---|-------------------|-----------|
| 11 | Hospital Timings | "What are hospital timings?" |
| 12 | Appointments | "How can I book an appointment?" |
| 13 | Diet Advice | "What diet is healthy?" |
| 14 | Emergency | "Emergency contact number?" |

**PASS:** Button fills the input box with the correct message
**FAIL:** Button does nothing or sends wrong message

---

### A3. Type These Symptoms — Bot Should Recommend the Right Doctor

| # | Type This | Should Recommend |
|---|-----------|------------------|
| 15 | I have fever | Dr. Meena Iyer (General Medicine) |
| 16 | I have chest pain | Dr. Priya Sharma (Cardiology) |
| 17 | My knee hurts | Dr. Rahul Verma (Orthopedics) |
| 18 | I have a skin rash | Dr. Vikram Patel (Dermatology) |
| 19 | My child has a cough | Dr. Anita Desai (Pediatrics) |
| 20 | I have a headache | Dr. Meena Iyer (General Medicine) |
| 21 | I have tooth pain | "No doctors currently available" (Dental not in DB) |
| 22 | I have eye pain | "No doctors currently available" (Ophthalmology not in DB) |

**PASS:** Shows correct department name + doctor name
**FAIL:** Wrong doctor or no recommendation

---

### A4. Type These — Bot Should List Doctors

| # | Type This | Should Show |
|---|-----------|-------------|
| 23 | Who are the doctors? | All 5 doctors listed |
| 24 | Show me cardiologists | Dr. Priya Sharma |
| 25 | Do you have a dermatologist? | Dr. Vikram Patel |
| 26 | Which doctor treats children? | Dr. Anita Desai |

**PASS:** Correct doctor(s) shown
**FAIL:** Missing doctors or wrong specialty

---

### A5. Book an Appointment — Step by Step

**First, login as Patient (patient@gmail.com / Admain)**

| # | Step 1 — Type This | Step 2 — Then Type | What Happens |
|---|--------------------|--------------------|--------------|
| 27 | How can I book an appointment? | Dr. Meena Iyer | Bot asks for doctor name, then shows slots |
| 28 | Book appointment with Dr. Meena Iyer | 11:00 | Appointment booked with confirmation |
| 29 | Book appointment with Dr. Priya Sharma tomorrow | 14:00 | Books for tomorrow |
| 30 | I want to see Dr. Rahul at 2 PM | (nothing, auto-books) | Books directly at 14:00 |
| 31 | Book appointment with Dr Meena at 11:00 | (nothing, auto-books) | Finds Dr. Meena Iyer (no dot) |
| 32 | Book with Priya at 10:00 | (nothing, auto-books) | Finds Dr. Priya Sharma |
| 33 | Book appointment with Dr. Vikram Patel | (shows slots) | Pick a time, then type it |

**How the booking flow works:**

```
You:  How can I book an appointment?
Bot:  Please provide a doctor name.

You:  Dr. Meena Iyer
Bot:  Dr. Meena Iyer is available on [date].
      Available slots:
      ✓ 09:00
      ✓ 10:00
      ✓ 11:00
      ✓ 12:00
      ✓ 14:00
      ✓ 15:00
      ✓ 16:00
      ✓ 17:00
      Reply with your preferred time.

You:  11:00
Bot:  ✅ Appointment Booked
      Doctor: Dr. Meena Iyer
      Date: 2026-08-28
      Time: 11:00
      Estimated Wait: 0 min
      Appointment ID: [id]
      Status: Pending
```

**PASS:** Appointment Booked confirmation with Doctor, Date, Time, ID
**FAIL:** Error message or no booking

---

### A6. Try These — Bot Should Block or Show Error

| # | Type This | Should Get |
|---|-----------|------------|
| 33 | Book appointment at 13:00 | "Lunch break: 01:00 PM - 02:00 PM" |
| 34 | Book appointment at 8:00 | "Available only between 09:00 AM - 06:00 PM" |
| 35 | Book appointment at 18:00 | "Available only between 09:00 AM - 06:00 PM" |
| 36 | Book appointment with Dr. Cancer | "Doctor not found" |
| 37 | Book appointment yesterday | "Please provide a future date" |

**PASS:** Correct error message shown
**FAIL:** Booking goes through or wrong error

---

### A7. Try These Weird Inputs — Bot Should Handle Gracefully

| # | Type This | Should Get |
|---|-----------|------------|
| 38 | abcdefgh | "I don't have that information" |
| 39 | !@#$%^&*() | Helpful response or FAQ fallback |
| 40 | 12345 | "I don't have that information" |
| 41 | Thank you | Polite response |
| 42 | What's your name? | "MediQueue AI Assistant" |

**PASS:** Bot responds politely, no crash
**FAIL:** Bot crashes or shows technical error

---

### A8. Multi-Turn Conversation — Bot Should Remember Context

| Turn | Type This | Bot Should... |
|------|-----------|---------------|
| 1 | I have fever | Recommend Dr. Meena Iyer |
| 2 | Book appointment with her | Show slots for Dr. Meena |
| 3 | 11:00 | Book appointment |
| 4 | What time is the hospital open? | Answer FAQ (switch context) |

**PASS:** Bot remembers "her" = Dr. Meena from turn 1
**FAIL:** Bot forgets context

---

### A9. Test Without Login

1. **Logout** from the patient account
2. Open the chatbot
3. Type: `Book appointment with Dr. Meena at 11:00`
4. Should get: **"Please login to book an appointment."**

**PASS:** Login required message shown
**FAIL:** Booking goes through without login

---

### A10. Test as Doctor (Cannot Book)

1. Login as **Doctor** (doctor@gmail.com / Admain)
2. Open chatbot
3. Type: `Book appointment with Dr. Meena at 11:00`
4. Should get: **"Only patients can book appointments."**

**PASS:** Role restriction message shown
**FAIL:** Booking goes through as doctor

---

## PART B: App Feature Testing

### B1. Dashboard (All Roles)

1. Login and check the Dashboard
2. Should see: **Stats Cards** (Appointments, Patients, Doctors, Queue)
3. Should see: **Recent Appointments** list

---

### B2. My Appointments (Patient)

1. Login as **Patient**
2. Click **My Appointments** in sidebar
3. Should see: Queue Number, Doctor, Date, Time, Status
4. Try searching by doctor name

---

### B3. Queue Management (Admin)

1. Login as **Admin**
2. Click **Queue Management** in sidebar
3. Should see today's patients
4. Try the **date picker** and **doctor filter**
5. Check status colors: CHECKED_IN (Blue), WAITING (Violet), IN_PROGRESS (Cyan), COMPLETED (Green)

---

### B4. Doctor Workspace (Doctor)

1. Login as **Doctor**
2. Click **My Queue** in sidebar
3. Click **Complete** on a patient
4. Type notes in the textarea
5. Click **Extract from Notes** — should auto-fill clinical data
6. Click **Generate AI Summary**
7. Click **Save & Complete**

---

### B5. Patient Details (Admin/Doctor)

1. Go to Queue Management
2. Click the **user icon** on any patient row
3. Should see: Patient info, stats, clinical summary
4. In **Clinical Agent** panel, select a task and click **Run Agent**
5. Click **Save as Draft**

---

### B6. Reports (Admin)

1. Login as **Admin**
2. Click **Report Analyzer** in sidebar
3. Upload a PDF or image of a medical report
4. Should see: Key Findings, Abnormal Results, Recommendations

---

### B7. Doctor Management (Admin)

1. Login as **Admin**
2. Click **Doctors** in sidebar
3. Should see list of 5 doctors
4. Try adding, editing, or deleting a doctor

---

## Doctor Reference

| Doctor | Specialty | Email |
|--------|-----------|-------|
| Dr. Priya Sharma | Cardiology | doctor@gmail.com |
| Dr. Rahul Verma | Orthopedics | rahul.verma@mediqueue.com |
| Dr. Anita Desai | Pediatrics | anita.desai@mediqueue.com |
| Dr. Vikram Patel | Dermatology | vikram.patel@mediqueue.com |
| Dr. Meena Iyer | General Medicine | meena.iyer@mediqueue.com |

---

## How to Book an Appointment (All Phrases That Work)

**Start with a general question — bot will guide you:**
```
How can I book an appointment?
```
Bot responds: **"Please provide a doctor name."** → Then you give the doctor name → Then you pick a time.

**Or give all details at once:**
```
Book appointment with Dr. Meena Iyer at 11:00
Book with Priya at 10:00
I want to see Dr. Rahul at 2 PM
Schedule with Dr. Vikram at 9:00
Book appointment with Dr Meena tomorrow at 14:00
```

**Time formats that work:** 11:00, 2 PM, 09:00, 3:30 PM
**Doctor names that work:** Full name, first name, last name, with or without "Dr."

---

## Checklist

- [ ] FAQ questions get correct answers
- [ ] Symptom questions recommend correct doctor
- [ ] Doctor search lists all 5 doctors
- [ ] Appointment booking works end-to-end
- [ ] Booking validation blocks bad times (lunch, after hours)
- [ ] Multi-turn context is maintained
- [ ] Error messages are shown for invalid inputs
- [ ] Login required for booking
- [ ] Only patients can book
- [ ] Dashboard shows stats
- [ ] Queue management works
- [ ] Doctor workspace works
- [ ] Clinical agent generates summaries
- [ ] Report analyzer works
