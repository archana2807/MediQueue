-- ============================================
-- RESET & SEED DATA
-- Run this against your Neon PostgreSQL database
-- ============================================

-- Create tables if not exists
CREATE TABLE IF NOT EXISTS patient_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  evidence_references JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delete in correct order (foreign keys)
DELETE FROM appointment_notes;
DELETE FROM patient_drafts;
DELETE FROM patient_reports;
DELETE FROM appointments;
DELETE FROM doctors;
DELETE FROM users;

-- ============================================
-- USERS
-- ============================================

-- Login accounts (password: Admain)
INSERT INTO users (id, name, email, phone, password, role, created_at) VALUES
('a0000000-0000-0000-0000-000000000001', 'Admin', 'admin@gmail.com', '9000000000', '$2b$10$OHDaNcGxo8gejKfmshQg6e3MIX7OmXH4RNzrmn7pVSYi1bsWnlDe6', 'ADMIN', NOW()),
('a0000000-0000-0000-0000-000000000010', 'Dr. Priya Sharma', 'doctor@gmail.com', '9100000001', '$2b$10$OHDaNcGxo8gejKfmshQg6e3MIX7OmXH4RNzrmn7pVSYi1bsWnlDe6', 'DOCTOR', NOW()),
('a0000000-0000-0000-0000-000000000020', 'Patient User', 'patient@gmail.com', '9200000000', '$2b$10$OHDaNcGxo8gejKfmshQg6e3MIX7OmXH4RNzrmn7pVSYi1bsWnlDe6', 'PATIENT', NOW());

-- More doctors
INSERT INTO users (id, name, email, phone, password, role, created_at) VALUES
('a0000000-0000-0000-0000-000000000011', 'Dr. Rahul Verma', 'rahul.verma@mediqueue.com', '9100000002', '$2b$10$OHDaNcGxo8gejKfmshQg6e3MIX7OmXH4RNzrmn7pVSYi1bsWnlDe6', 'DOCTOR', NOW()),
('a0000000-0000-0000-0000-000000000012', 'Dr. Anita Desai', 'anita.desai@mediqueue.com', '9100000003', '$2b$10$OHDaNcGxo8gejKfmshQg6e3MIX7OmXH4RNzrmn7pVSYi1bsWnlDe6', 'DOCTOR', NOW()),
('a0000000-0000-0000-0000-000000000013', 'Dr. Vikram Patel', 'vikram.patel@mediqueue.com', '9100000004', '$2b$10$OHDaNcGxo8gejKfmshQg6e3MIX7OmXH4RNzrmn7pVSYi1bsWnlDe6', 'DOCTOR', NOW()),
('a0000000-0000-0000-0000-000000000014', 'Dr. Meena Iyer', 'meena.iyer@mediqueue.com', '9100000005', '$2b$10$OHDaNcGxo8gejKfmshQg6e3MIX7OmXH4RNzrmn7pVSYi1bsWnlDe6', 'DOCTOR', NOW());

-- More patients
INSERT INTO users (id, name, email, phone, password, role, created_at) VALUES
('a0000000-0000-0000-0000-000000000021', 'Sneha Reddy', 'sneha.reddy@email.com', '9200000002', '', 'PATIENT', NOW()),
('a0000000-0000-0000-0000-000000000022', 'Karan Singh', 'karan.singh@email.com', '9200000003', '', 'PATIENT', NOW()),
('a0000000-0000-0000-0000-000000000023', 'Divya Nair', 'divya.nair@email.com', '9200000004', '', 'PATIENT', NOW()),
('a0000000-0000-0000-0000-000000000024', 'Rohan Gupta', 'rohan.gupta@email.com', '9200000005', '', 'PATIENT', NOW()),
('a0000000-0000-0000-0000-000000000025', 'Pooja Joshi', 'pooja.joshi@email.com', '9200000006', '', 'PATIENT', NOW()),
('a0000000-0000-0000-0000-000000000026', 'Amit Kumar', 'amit.kumar@email.com', '9200000007', '', 'PATIENT', NOW()),
('a0000000-0000-0000-0000-000000000027', 'Neha Agarwal', 'neha.agarwal@email.com', '9200000008', '', 'PATIENT', NOW()),
('a0000000-0000-0000-0000-000000000028', 'Vikash Yadav', 'vikash.yadav@email.com', '9200000009', '', 'PATIENT', NOW()),
('a0000000-0000-0000-0000-000000000029', 'Riya Das', 'riya.das@email.com', '9200000010', '', 'PATIENT', NOW());

-- ============================================
-- DOCTORS (profiles)
-- ============================================

INSERT INTO doctors (id, user_id, specialization) VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000010', 'Cardiology'),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000011', 'Orthopedics'),
('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000012', 'Pediatrics'),
('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000013', 'Dermatology'),
('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000014', 'General Medicine');

-- ============================================
-- APPOINTMENTS (with queue numbers per doctor)
-- ============================================

-- Dr. Priya (Cardiology) - today
INSERT INTO appointments (id, patient_id, doctor_id, appointment_date, queue_number, status) VALUES
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000020', 'b0000000-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '9 hours', 1, 'CHECKED_IN'),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000021', 'b0000000-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '9 hours 30 minutes', 2, 'WAITING'),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000022', 'b0000000-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '10 hours', 3, 'IN_PROGRESS');

-- Dr. Rahul (Orthopedics) - today
INSERT INTO appointments (id, patient_id, doctor_id, appointment_date, queue_number, status) VALUES
('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000023', 'b0000000-0000-0000-0000-000000000002', CURRENT_DATE + INTERVAL '9 hours', 1, 'WAITING'),
('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000024', 'b0000000-0000-0000-0000-000000000002', CURRENT_DATE + INTERVAL '10 hours', 2, 'CHECKED_IN');

-- Dr. Anita (Pediatrics) - today
INSERT INTO appointments (id, patient_id, doctor_id, appointment_date, queue_number, status) VALUES
('c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000025', 'b0000000-0000-0000-0000-000000000003', CURRENT_DATE + INTERVAL '11 hours', 1, 'CHECKED_IN'),
('c0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000026', 'b0000000-0000-0000-0000-000000000003', CURRENT_DATE + INTERVAL '11 hours 30 minutes', 2, 'PENDING');

-- Dr. Vikram (Dermatology) - today
INSERT INTO appointments (id, patient_id, doctor_id, appointment_date, queue_number, status) VALUES
('c0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000027', 'b0000000-0000-0000-0000-000000000004', CURRENT_DATE + INTERVAL '10 hours', 1, 'WAITING');

-- Dr. Meena (General Medicine) - today
INSERT INTO appointments (id, patient_id, doctor_id, appointment_date, queue_number, status) VALUES
('c0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000028', 'b0000000-0000-0000-0000-000000000005', CURRENT_DATE + INTERVAL '9 hours', 1, 'IN_PROGRESS'),
('c0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000029', 'b0000000-0000-0000-0000-000000000005', CURRENT_DATE + INTERVAL '10 hours', 2, 'CONFIRMED');

-- Past appointments (completed)
INSERT INTO appointments (id, patient_id, doctor_id, appointment_date, queue_number, status) VALUES
('c0000000-0000-0000-0000-000000000020', 'a0000000-0000-0000-0000-000000000020', 'b0000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '7 days', 1, 'COMPLETED'),
('c0000000-0000-0000-0000-000000000021', 'a0000000-0000-0000-0000-000000000021', 'b0000000-0000-0000-0000-000000000002', CURRENT_DATE - INTERVAL '5 days', 1, 'COMPLETED'),
('c0000000-0000-0000-0000-000000000022', 'a0000000-0000-0000-0000-000000000023', 'b0000000-0000-0000-0000-000000000003', CURRENT_DATE - INTERVAL '3 days', 1, 'COMPLETED'),
('c0000000-0000-0000-0000-000000000023', 'a0000000-0000-0000-0000-000000000025', 'b0000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '2 days', 1, 'COMPLETED');

-- ============================================
-- APPOINTMENT NOTES
-- ============================================

INSERT INTO appointment_notes (id, appointment_id, doctor_notes, ai_summary) VALUES
('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000020',
'Patient complained of chest pain and shortness of breath. ECG showed mild ST changes. Prescribed Betaloc 25mg daily. Advised stress test next week.',
'## Symptoms
- Chest pain (mild, intermittent)
- Shortness of breath on exertion

## Medication
- Betaloc 25mg once daily

## Advice
- Avoid strenuous activity
- Follow up in 1 week
- Stress test recommended

## Diet
- Low sodium, heart-healthy diet'),

('d0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000021',
'Knee pain in right knee. X-ray shows mild osteoarthritis. Prescribed Physiotherapy and Ibuprofen. Weight management advised.',
'## Symptoms
- Right knee pain (chronic)
- Stiffness in morning

## Medication
- Ibuprofen 400mg twice daily

## Advice
- Physiotherapy 3x/week
- Weight management
- Knee strengthening exercises

## Diet
- Anti-inflammatory foods, omega-3 rich'),

('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000022',
'Child with fever and cough for 3 days. Throat congestion. Prescribed Paracetamol syrup and antibiotics. Follow up if no improvement.',
'## Symptoms
- Fever (101F)
- Dry cough
- Throat congestion

## Medication
- Paracetamol syrup 5ml every 6 hours
- Azithromycin 200mg for 3 days

## Advice
- Plenty of fluids
- Rest for 3 days
- Return if fever persists

## Diet
- Soft, warm foods, clear soups');
