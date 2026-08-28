# MediQueue — How to Test

> Live URL: https://medi-queue-beige.vercel.app

---

## Login

| Who | Email | Password |
|-----|-------|----------|
| Patient | patient@gmail.com | Admain |
| Admin | admin@gmail.com | Admain |
| Doctor | doctor@gmail.com | Admain |

---

## How to Open the Chatbot

1. Login as **Patient**
2. Click the **blue chat bubble** in the bottom-right corner
3. You'll see a greeting message from the AI assistant
4. Start typing your questions!

---

## PART A: Chatbot Questions to Try

### A1. General Hospital Questions

Ask these to see if the bot knows about the hospital:

| # | You Ask | What You Should See |
|---|---------|---------------------|
| 1 | What are hospital timings? | Mon-Sat 9AM-6PM, lunch 1-2PM, emergency 24/7 |
| 2 | Is the hospital open on Sunday? | No, closed on Sunday |
| 3 | What departments do you have? | Cardiology, Orthopedics, Pediatrics, Dermatology, General Medicine |
| 4 | What's the emergency number? | 108 and 102 |
| 5 | What should I eat to stay healthy? | Fruits, vegetables, whole grains, water |
| 6 | Do you accept insurance? | Yes, major insurance, cash, cards, UPI |
| 7 | What do I need to bring? | Photo ID, insurance card, medication list, arrive 15 min early |
| 8 | How does the queue work? | Digital queue, real-time tracking |
| 9 | What time do you open? | 9:00 AM |
| 10 | When is lunch time? | 1:00 PM to 2:00 PM |

If the bot answers correctly, move on. If it says "I don't have that information," that's a problem.

---

### A2. Quick Buttons

Try clicking the 4 buttons at the bottom of the chat:

| # | Click | What Happens |
|---|-------|--------------|
| 11 | Hospital Timings | Sends "What are hospital timings?" |
| 12 | Appointments | Sends "How can I book an appointment?" |
| 13 | Diet Advice | Sends "What diet is healthy?" |
| 14 | Emergency | Sends "Emergency contact number?" |

Each button should fill the text box with a question. You still need to click Send.

---

### A3. Describe Your Symptoms

Tell the bot what's wrong and see if it recommends the right doctor:

| # | You Say | Doctor You Should Get |
|---|---------|----------------------|
| 15 | I have fever | Dr. Meena Iyer |
| 16 | I have chest pain | Dr. Priya Sharma |
| 17 | My knee hurts | Dr. Rahul Verma |
| 18 | I have a skin rash | Dr. Vikram Patel |
| 19 | My child has a cough | Dr. Anita Desai |
| 20 | I have a headache | Dr. Meena Iyer |
| 21 | I have tooth pain | No dental doctor available |
| 22 | I have eye pain | No eye doctor available |

---

### A4. Ask About Doctors

| # | You Ask | You Should See |
|---|---------|----------------|
| 23 | Who are the doctors? | All 5 doctors listed |
| 24 | Show me the heart doctor | Dr. Priya Sharma |
| 25 | Do you have a skin doctor? | Dr. Vikram Patel |
| 26 | Who treats children? | Dr. Anita Desai |

---

### A5. Book an Appointment

**First, login as Patient (patient@gmail.com / Admain)**

#### Try This Conversation:

```
You:    How can I book an appointment?
Bot:    Please provide a doctor name.

You:    Dr. Meena Iyer
Bot:    Dr. Meena Iyer is available on [today's date].
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

You:    11:00
Bot:    ✅ Appointment Booked
        Doctor: Dr. Meena Iyer
        Date: 2026-08-28
        Time: 11:00
        Estimated Wait: 0 min
        Appointment ID: [id]
        Status: Pending
```

#### More Booking Examples:

| # | You Say | What Happens |
|---|---------|--------------|
| 27 | Book appointment with Dr. Meena Iyer | Shows available slots |
| 28 | Book appointment with Dr. Priya Sharma tomorrow | Shows slots for tomorrow |
| 29 | I want to see Dr. Rahul at 2 PM | Books directly |
| 30 | Book appointment with Dr Meena at 11:00 | Works without the dot |
| 31 | Book with Priya at 10:00 | Finds Dr. Priya Sharma |
| 32 | Book appointment with Dr. Vikram Patel | Shows slots, then you pick a time |

---

### A6. Try Bad Times — Bot Should Say No

| # | You Say | You Should Get |
|---|---------|----------------|
| 33 | Book appointment at 13:00 | "Lunch break: 01:00 PM - 02:00 PM" |
| 34 | Book appointment at 8:00 | "Available only between 09:00 AM - 06:00 PM" |
| 35 | Book appointment at 18:00 | "Available only between 09:00 AM - 06:00 PM" |
| 36 | Book appointment with Dr. Cancer | "Doctor not found" |
| 37 | Book appointment yesterday | "Please provide a future date" |

---

### A7. Try Weird Stuff — Bot Should Not Crash

| # | You Say | You Should Get |
|---|---------|----------------|
| 38 | abcdefgh | "I don't have that information" |
| 39 | !@#$%^&*() | Some helpful response |
| 40 | 12345 | "I don't have that information" |
| 41 | Thank you | Nice response |
| 42 | What's your name? | "MediQueue AI Assistant" |

---

### A8. Have a Conversation — Bot Should Remember

| Turn | You Say | Bot Should... |
|------|---------|---------------|
| 1 | I have fever | Recommend Dr. Meena Iyer |
| 2 | Book appointment with her | Show slots for Dr. Meena |
| 3 | 11:00 | Book the appointment |
| 4 | What time do you open? | Answer about hospital hours |

The bot should remember that "her" means Dr. Meena from the first message.

---

### A9. Try Without Login

1. **Logout** from the patient account
2. Open the chatbot
3. Type: **Book appointment with Dr. Meena at 11:00**
4. You should see: **"Please login to book an appointment."**

---

### A10. Try as Doctor

1. Login as **Doctor** (doctor@gmail.com / Admain)
2. Open the chatbot
3. Type: **Book appointment with Dr. Meena at 11:00**
4. You should see: **"Only patients can book appointments."**

---

## PART B: Other Features to Test

### B1. Dashboard

1. Login as any user
2. You should see **stats cards** showing numbers for Appointments, Patients, Doctors, Queue
3. You should see a list of **recent appointments**

---

### B2. My Appointments (Patient)

1. Login as **Patient**
2. Click **My Appointments** in the left menu
3. You should see your appointments with doctor name, date, time, and status
4. Try searching by doctor name

---

### B3. Queue Management (Admin)

1. Login as **Admin**
2. Click **Queue Management** in the left menu
3. You should see today's patients
4. Try picking a different date or filtering by doctor
5. Each patient has a color: Blue (Checked In), Violet (Waiting), Cyan (In Progress), Green (Completed)

---

### B4. Doctor Workspace (Doctor)

1. Login as **Doctor**
2. Click **My Queue** in the left menu
3. Click **Complete** on a patient
4. Type some notes about the visit
5. Click **Extract from Notes** — it fills in conditions, medications, etc.
6. Click **Generate AI Summary**
7. Click **Save & Complete**

---

### B5. Patient Details

1. Login as **Admin** or **Doctor**
2. Go to **Queue Management**
3. Click the **person icon** on any patient row
4. You should see patient info, medical history, and clinical notes
5. In the **Clinical Agent** section, pick a task and click **Run Agent**
6. Click **Save as Draft**

---

### B6. Report Analyzer (Admin)

1. Login as **Admin**
2. Click **Report Analyzer** in the left menu
3. Upload a medical report (PDF or image)
4. You should see: Key Findings, Abnormal Results, Recommendations

---

### B7. Doctor Management (Admin)

1. Login as **Admin**
2. Click **Doctors** in the left menu
3. You should see a list of 5 doctors
4. Try adding, editing, or removing a doctor

---

## Doctor List

| Doctor | Specialty |
|--------|-----------|
| Dr. Priya Sharma | Heart (Cardiology) |
| Dr. Rahul Verma | Bones & Joints (Orthopedics) |
| Dr. Anita Desai | Children (Pediatrics) |
| Dr. Vikram Patel | Skin (Dermatology) |
| Dr. Meena Iyer | General Medicine |

---

## All Ways to Book an Appointment

**Start simple — the bot will guide you:**
```
How can I book an appointment?
```
The bot will ask for a doctor name, then show available times.

**Or say everything at once:**
```
Book appointment with Dr. Meena Iyer at 11:00
Book with Priya at 10:00
I want to see Dr. Rahul at 2 PM
Schedule with Dr. Vikram at 9:00
Book appointment with Dr Meena tomorrow at 14:00
```

---

## What to Check

- [ ] Bot answers hospital questions correctly
- [ ] Bot recommends the right doctor for symptoms
- [ ] Bot lists all doctors when asked
- [ ] Booking an appointment works from start to finish
- [ ] Bot blocks bad times (lunch break, after hours)
- [ ] Bot remembers what you said earlier in the conversation
- [ ] Bot shows errors for invalid inputs
- [ ] You need to login before booking
- [ ] Only patients can book (not doctors or admins)
- [ ] Dashboard shows the right numbers
- [ ] Queue management works
- [ ] Doctor can complete appointments
- [ ] Clinical agent generates summaries
- [ ] Report analyzer works
