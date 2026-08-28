require("dotenv").config({ path: ".env.local" });
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Password hash for "Admin" (same as existing)
const PWD = "$2b$10$OHDaNcGxo8gejKfmshQg6e3MIX7OmXH4RNzrmn7pVSYi1bsWnlDe6";

async function seed() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // ============================================
    // CLEAR EXISTING DATA
    // ============================================
    console.log("Clearing existing data...");
    await client.query("DELETE FROM appointment_notes");
    await client.query("DELETE FROM patient_drafts");
    await client.query("DELETE FROM patient_observations");
    await client.query("DELETE FROM patient_conditions");
    await client.query("DELETE FROM patient_medications");
    await client.query("DELETE FROM patient_allergies");
    await client.query("DELETE FROM patient_reports");
    await client.query("DELETE FROM appointments");
    await client.query("DELETE FROM doctors");
    await client.query("DELETE FROM users");

    // ============================================
    // USERS
    // ============================================
    console.log("Creating users...");
    await client.query(`
      INSERT INTO users (id, name, email, phone, password, role, created_at) VALUES
      ('a0000000-0000-0000-0000-000000000001', 'Admin', 'admin@gmail.com', '9000000001', '${PWD}', 'ADMIN', NOW()),
      ('a0000000-0000-0000-0000-000000000010', 'Dr. Priya Sharma', 'doctor@gmail.com', '9100000001', '${PWD}', 'DOCTOR', NOW()),
      ('a0000000-0000-0000-0000-000000000011', 'Dr. Rahul Verma', 'rahul.verma@mediqueue.com', '9100000002', '${PWD}', 'DOCTOR', NOW()),
      ('a0000000-0000-0000-0000-000000000012', 'Dr. Anita Desai', 'anita.desai@mediqueue.com', '9100000003', '${PWD}', 'DOCTOR', NOW()),
      ('a0000000-0000-0000-0000-000000000013', 'Dr. Vikram Patel', 'vikram.patel@mediqueue.com', '9100000004', '${PWD}', 'DOCTOR', NOW()),
      ('a0000000-0000-0000-0000-000000000014', 'Dr. Meena Iyer', 'meena.iyer@mediqueue.com', '9100000005', '${PWD}', 'DOCTOR', NOW()),
      ('a0000000-0000-0000-0000-000000000020', 'Patient User', 'patient@gmail.com', '9200000001', '${PWD}', 'PATIENT', NOW()),
      ('a0000000-0000-0000-0000-000000000021', 'Sneha Reddy', 'sneha.reddy@email.com', '9200000002', '', 'PATIENT', NOW()),
      ('a0000000-0000-0000-0000-000000000022', 'Karan Singh', 'karan.singh@email.com', '9200000003', '', 'PATIENT', NOW()),
      ('a0000000-0000-0000-0000-000000000023', 'Divya Nair', 'divya.nair@email.com', '9200000004', '', 'PATIENT', NOW()),
      ('a0000000-0000-0000-0000-000000000024', 'Rohan Gupta', 'rohan.gupta@email.com', '9200000005', '', 'PATIENT', NOW()),
      ('a0000000-0000-0000-0000-000000000025', 'Pooja Joshi', 'pooja.joshi@email.com', '9200000006', '', 'PATIENT', NOW()),
      ('a0000000-0000-0000-0000-000000000026', 'Arun Menon', 'arun.menon@email.com', '9200000007', '', 'PATIENT', NOW()),
      ('a0000000-0000-0000-0000-000000000027', 'Neha Agarwal', 'neha.agarwal@email.com', '9200000008', '', 'PATIENT', NOW()),
      ('a0000000-0000-0000-0000-000000000028', 'Vikash Yadav', 'vikash.yadav@email.com', '9200000009', '', 'PATIENT', NOW()),
      ('a0000000-0000-0000-0000-000000000029', 'Riya Das', 'riya.das@email.com', '9200000010', '', 'PATIENT', NOW()),
      ('a0000000-0000-0000-0000-000000000030', 'Sanjay Mishra', 'sanjay.mishra@email.com', '9200000011', '', 'PATIENT', NOW()),
      ('a0000000-0000-0000-0000-000000000031', 'Deepa Nair', 'deepa.nair@email.com', '9200000012', '', 'PATIENT', NOW())
    `);

    // ============================================
    // DOCTOR PROFILES
    // ============================================
    console.log("Creating doctor profiles...");
    await client.query(`
      INSERT INTO doctors (id, user_id, specialization) VALUES
      ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000010', 'Cardiology'),
      ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000011', 'Orthopedics'),
      ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000012', 'Pediatrics'),
      ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000013', 'Dermatology'),
      ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000014', 'General Medicine')
    `);

    // ============================================
    // TODAY'S APPOINTMENTS (Queue)
    // ============================================
    console.log("Creating today's appointments...");
    await client.query(`
      INSERT INTO appointments (id, patient_id, doctor_id, appointment_date, queue_number, status) VALUES
      -- Dr. Priya (Cardiology)
      ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000020', 'b0000000-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '9 hours', 1, 'CHECKED_IN'),
      ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000021', 'b0000000-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '9 hours 30 minutes', 2, 'WAITING'),
      ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000022', 'b0000000-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '10 hours', 3, 'IN_PROGRESS'),
      -- Dr. Rahul (Orthopedics)
      ('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000023', 'b0000000-0000-0000-0000-000000000002', CURRENT_DATE + INTERVAL '9 hours', 1, 'WAITING'),
      ('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000024', 'b0000000-0000-0000-0000-000000000002', CURRENT_DATE + INTERVAL '10 hours', 2, 'CHECKED_IN'),
      -- Dr. Anita (Pediatrics)
      ('c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000025', 'b0000000-0000-0000-0000-000000000003', CURRENT_DATE + INTERVAL '11 hours', 1, 'CHECKED_IN'),
      ('c0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000026', 'b0000000-0000-0000-0000-000000000003', CURRENT_DATE + INTERVAL '11 hours 30 minutes', 2, 'PENDING'),
      -- Dr. Vikram (Dermatology)
      ('c0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000027', 'b0000000-0000-0000-0000-000000000004', CURRENT_DATE + INTERVAL '10 hours', 1, 'WAITING'),
      -- Dr. Meena (General Medicine)
      ('c0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000028', 'b0000000-0000-0000-0000-000000000005', CURRENT_DATE + INTERVAL '9 hours', 1, 'IN_PROGRESS'),
      ('c0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000029', 'b0000000-0000-0000-0000-000000000005', CURRENT_DATE + INTERVAL '10 hours', 2, 'CONFIRMED')
    `);

    // ============================================
    // PAST APPOINTMENTS (Completed)
    // ============================================
    console.log("Creating past appointments...");
    await client.query(`
      INSERT INTO appointments (id, patient_id, doctor_id, appointment_date, queue_number, status) VALUES
      ('c0000000-0000-0000-0000-000000000020', 'a0000000-0000-0000-0000-000000000020', 'b0000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '7 days', 1, 'COMPLETED'),
      ('c0000000-0000-0000-0000-000000000021', 'a0000000-0000-0000-0000-000000000021', 'b0000000-0000-0000-0000-000000000002', CURRENT_DATE - INTERVAL '5 days', 1, 'COMPLETED'),
      ('c0000000-0000-0000-0000-000000000022', 'a0000000-0000-0000-0000-000000000023', 'b0000000-0000-0000-0000-000000000003', CURRENT_DATE - INTERVAL '3 days', 1, 'COMPLETED'),
      ('c0000000-0000-0000-0000-000000000023', 'a0000000-0000-0000-0000-000000000025', 'b0000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '2 days', 1, 'COMPLETED'),
      ('c0000000-0000-0000-0000-000000000024', 'a0000000-0000-0000-0000-000000000028', 'b0000000-0000-0000-0000-000000000005', CURRENT_DATE - INTERVAL '10 days', 1, 'COMPLETED'),
      ('c0000000-0000-0000-0000-000000000025', 'a0000000-0000-0000-0000-000000000030', 'b0000000-0000-0000-0000-000000000004', CURRENT_DATE - INTERVAL '4 days', 1, 'COMPLETED')
    `);

    // ============================================
    // APPOINTMENT NOTES
    // ============================================
    console.log("Creating appointment notes...");
    await client.query(`
      INSERT INTO appointment_notes (id, appointment_id, doctor_notes, ai_summary) VALUES
      ('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000020',
        'Chest pain and shortness of breath. ECG shows mild ST changes. BP 140/90. Prescribed Betaloc 25mg daily. Advised stress test.',
        'Patient presents with chest pain and dyspnea on exertion. ECG findings suggest possible ischemia. Started on beta-blocker. Follow-up stress test recommended.'),

      ('d0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000021',
        'Chronic right knee pain. X-ray: mild osteoarthritis. Weight 82kg. Prescribed Ibuprofen and physiotherapy.',
        'Chronic right knee pain with radiographic evidence of osteoarthritis. Weight management and physiotherapy initiated.'),

      ('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000022',
        'Fever 101F, dry cough, throat congestion for 3 days. Prescribed Paracetamol syrup and Azithromycin.',
        'Pediatric patient with acute upper respiratory infection. Fever and cough for 3 days. Antibiotic therapy initiated.'),

      ('d0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000023',
        'Recurring skin rash on forearms. Allergic dermatitis. Prescribed hydrocortisone cream and antihistamines.',
        'Allergic contact dermatitis on bilateral forearms. Topical steroid and oral antihistamine prescribed.'),

      ('d0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000025',
        'Follow-up for hypertension. BP 138/88. Continue current medication. Lifestyle counseling provided.',
        'Hypertension follow-up. Blood pressure near target. Continue Amlodipine 5mg. Reinforce dietary modifications.'),

      ('d0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000024',
        'Lower back pain for 2 weeks. No radiation. Neurological exam normal. Prescribed exercises and analgesics.',
        'Acute lower back pain without red flags. Conservative management with physiotherapy and pain relief.'),

      ('d0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000020',
        'Follow-up chest pain. Stress test normal. Continue Betaloc. BP improved to 130/85.',
        'Cardiac follow-up. Stress test negative for ischemia. Blood pressure improved on current regimen.'),

      ('d0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000009',
        'Acne vulgaris on face. Grade 3. Prescribed topical retinoid and oral antibiotics.',
        'Moderate to severe acne vulgaris. Multimodal therapy initiated with retinoid and antibiotic.')
    `);

    // ============================================
    // CLINICAL DATA - CONDITIONS
    // ============================================
    console.log("Creating clinical conditions...");
    await client.query(`
      INSERT INTO patient_conditions (patient_id, condition_name, status, visit_id) VALUES
      -- Amit Kumar (Cardiology patient)
      ('a0000000-0000-0000-0000-000000000020', 'Hypertension', 'active', 'c0000000-0000-0000-0000-000000000020'),
      ('a0000000-0000-0000-0000-000000000020', 'Hyperlipidemia', 'active', 'c0000000-0000-0000-0000-000000000020'),
      -- Sneha Reddy (Ortho patient)
      ('a0000000-0000-0000-0000-000000000021', 'Osteoarthritis - Right Knee', 'active', 'c0000000-0000-0000-0000-000000000021'),
      ('a0000000-0000-0000-0000-000000000021', 'Obesity', 'active', 'c0000000-0000-0000-0000-000000000021'),
      -- Karan Singh (Pediatric)
      ('a0000000-0000-0000-0000-000000000022', 'Upper Respiratory Infection', 'resolved', 'c0000000-0000-0000-0000-000000000022'),
      -- Divya Nair (Dermatology)
      ('a0000000-0000-0000-0000-000000000023', 'Allergic Contact Dermatitis', 'active', 'c0000000-0000-0000-0000-000000000022'),
      -- Pooja Joshi (Cardiology follow-up)
      ('a0000000-0000-0000-0000-000000000025', 'Hypertension', 'active', 'c0000000-0000-0000-0000-000000000025'),
      -- Vikash Yadav (General Medicine)
      ('a0000000-0000-0000-0000-000000000028', 'Type 2 Diabetes', 'active', 'c0000000-0000-0000-0000-000000000024'),
      ('a0000000-0000-0000-0000-000000000028', 'Lower Back Pain', 'active', 'c0000000-0000-0000-0000-000000000024'),
      -- Sanjay Mishra (Dermatology)
      ('a0000000-0000-0000-0000-000000000030', 'Acne Vulgaris', 'active', 'c0000000-0000-0000-0000-000000000008'),
      -- Deepa Nair
      ('a0000000-0000-0000-0000-000000000031', 'Migraine', 'active', NULL),
      ('a0000000-0000-0000-0000-000000000031', 'Iron Deficiency Anemia', 'active', NULL)
    `);

    // ============================================
    // CLINICAL DATA - MEDICATIONS
    // ============================================
    console.log("Creating clinical medications...");
    await client.query(`
      INSERT INTO patient_medications (patient_id, name, dosage, frequency, visit_id) VALUES
      -- Amit Kumar
      ('a0000000-0000-0000-0000-000000000020', 'Betaloc', '25mg', 'once daily', 'c0000000-0000-0000-0000-000000000020'),
      ('a0000000-0000-0000-0000-000000000020', 'Atorvastatin', '10mg', 'once daily at bedtime', 'c0000000-0000-0000-0000-000000000020'),
      -- Sneha Reddy
      ('a0000000-0000-0000-0000-000000000021', 'Ibuprofen', '400mg', 'twice daily after food', 'c0000000-0000-0000-0000-000000000021'),
      -- Karan Singh
      ('a0000000-0000-0000-0000-000000000022', 'Paracetamol Syrup', '5ml', 'every 6 hours', 'c0000000-0000-0000-0000-000000000022'),
      ('a0000000-0000-0000-0000-000000000022', 'Azithromycin', '200mg', 'once daily for 3 days', 'c0000000-0000-0000-0000-000000000022'),
      -- Divya Nair
      ('a0000000-0000-0000-0000-000000000023', 'Hydrocortisone Cream', '1%', 'apply twice daily', 'c0000000-0000-0000-0000-000000000022'),
      ('a0000000-0000-0000-0000-000000000023', 'Cetirizine', '10mg', 'once daily', 'c0000000-0000-0000-0000-000000000022'),
      -- Pooja Joshi
      ('a0000000-0000-0000-0000-000000000025', 'Amlodipine', '5mg', 'once daily', 'c0000000-0000-0000-0000-000000000025'),
      -- Vikash Yadav
      ('a0000000-0000-0000-0000-000000000028', 'Metformin', '500mg', 'twice daily with meals', 'c0000000-0000-0000-0000-000000000024'),
      ('a0000000-0000-0000-0000-000000000028', 'Diclofenac', '50mg', 'three times daily', 'c0000000-0000-0000-0000-000000000024'),
      -- Sanjay Mishra
      ('a0000000-0000-0000-0000-000000000030', 'Adapalene Gel', '0.1%', 'apply at bedtime', 'c0000000-0000-0000-0000-000000000008'),
      ('a0000000-0000-0000-0000-000000000030', 'Doxycycline', '100mg', 'once daily', 'c0000000-0000-0000-0000-000000000008'),
      -- Deepa Nair
      ('a0000000-0000-0000-0000-000000000031', 'Sumatriptan', '50mg', 'as needed for migraine', NULL),
      ('a0000000-0000-0000-0000-000000000031', 'Ferrous Sulphate', '325mg', 'once daily', NULL)
    `);

    // ============================================
    // CLINICAL DATA - ALLERGIES
    // ============================================
    console.log("Creating clinical allergies...");
    await client.query(`
      INSERT INTO patient_allergies (patient_id, allergen, severity, visit_id) VALUES
      ('a0000000-0000-0000-0000-000000000020', 'Penicillin', 'severe', 'c0000000-0000-0000-0000-000000000020'),
      ('a0000000-0000-0000-0000-000000000020', 'Shellfish', 'moderate', NULL),
      ('a0000000-0000-0000-0000-000000000021', 'Aspirin', 'mild', 'c0000000-0000-0000-0000-000000000021'),
      ('a0000000-0000-0000-0000-000000000023', 'Nickel', 'moderate', 'c0000000-0000-0000-0000-000000000022'),
      ('a0000000-0000-0000-0000-000000000025', 'Sulfa Drugs', 'severe', NULL),
      ('a0000000-0000-0000-0000-000000000028', 'Metformin', 'mild', 'c0000000-0000-0000-0000-000000000024'),
      ('a0000000-0000-0000-0000-000000000031', 'Ibuprofen', 'moderate', NULL),
      ('a0000000-0000-0000-0000-000000000031', 'Codeine', 'severe', NULL)
    `);

    // ============================================
    // CLINICAL DATA - OBSERVATIONS
    // ============================================
    console.log("Creating clinical observations...");
    await client.query(`
      INSERT INTO patient_observations (patient_id, observation, visit_id) VALUES
      -- Amit Kumar
      ('a0000000-0000-0000-0000-000000000020', 'Blood Pressure: 140/90 mmHg', 'c0000000-0000-0000-0000-000000000020'),
      ('a0000000-0000-0000-0000-000000000020', 'Heart Rate: 88 bpm', 'c0000000-0000-0000-0000-000000000020'),
      ('a0000000-0000-0000-0000-000000000020', 'ECG: Mild ST changes', 'c0000000-0000-0000-0000-000000000020'),
      ('a0000000-0000-0000-0000-000000000020', 'Cholesterol: 240 mg/dL', 'c0000000-0000-0000-0000-000000000020'),
      -- Sneha Reddy
      ('a0000000-0000-0000-0000-000000000021', 'Weight: 82 kg', 'c0000000-0000-0000-0000-000000000021'),
      ('a0000000-0000-0000-0000-000000000021', 'BMI: 31.2 (Obese)', 'c0000000-0000-0000-0000-000000000021'),
      ('a0000000-0000-0000-0000-000000000021', 'X-ray Right Knee: Mild OA changes', 'c0000000-0000-0000-0000-000000000021'),
      -- Karan Singh
      ('a0000000-0000-0000-0000-000000000022', 'Temperature: 101°F', 'c0000000-0000-0000-0000-000000000022'),
      ('a0000000-0000-0000-0000-000000000022', 'Throat: Congested, red', 'c0000000-0000-0000-0000-000000000022'),
      -- Divya Nair
      ('a0000000-0000-0000-0000-000000000023', 'Rash: Bilateral forearms, erythematous', 'c0000000-0000-0000-0000-000000000022'),
      -- Pooja Joshi
      ('a0000000-0000-0000-0000-000000000025', 'Blood Pressure: 138/88 mmHg', 'c0000000-0000-0000-0000-000000000025'),
      ('a0000000-0000-0000-0000-000000000025', 'Heart Rate: 76 bpm', 'c0000000-0000-0000-0000-000000000025'),
      -- Vikash Yadav
      ('a0000000-0000-0000-0000-000000000028', 'Fasting Blood Sugar: 180 mg/dL', 'c0000000-0000-0000-0000-000000000024'),
      ('a0000000-0000-0000-0000-000000000028', 'HbA1c: 8.2%', 'c0000000-0000-0000-0000-000000000024'),
      ('a0000000-0000-0000-0000-000000000028', 'Lumbar Spine: No disc herniation', 'c0000000-0000-0000-0000-000000000024'),
      -- Sanjay Mishra
      ('a0000000-0000-0000-0000-000000000030', 'Acne: Grade 3, face and back', 'c0000000-0000-0000-0000-000000000008'),
      -- Deepa Nair
      ('a0000000-0000-0000-0000-000000000031', 'Hemoglobin: 9.8 g/dL (Low)', NULL),
      ('a0000000-0000-0000-0000-000000000031', 'Migraine frequency: 3-4 episodes/month', NULL)
    `);

    await client.query("COMMIT");
    console.log("\n✅ Test data seeded successfully!");
    console.log("\n📊 Summary:");
    console.log("  - 1 Admin, 5 Doctors, 12 Patients");
    console.log("  - 10 today's appointments (various statuses)");
    console.log("  - 6 past completed appointments");
    console.log("  - 8 appointment notes with AI summaries");
    console.log("  - 12 conditions, 14 medications, 8 allergies, 18 observations");
    console.log("\n🔑 Login credentials (password: Admin):");
    console.log("  Admin:  admin@mediqueue.com");
    console.log("  Doctor: priya.sharma@mediqueue.com");
    console.log("  Patient: amit.kumar@email.com");
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("Error:", e);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
