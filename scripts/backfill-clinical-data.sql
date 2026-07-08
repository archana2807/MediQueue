-- ============================================
-- BACKFILL CLINICAL DATA
-- Based on seeded appointment_notes doctor_notes
-- ============================================

-- Visit 1: Patient 0020 — Chest pain, Betaloc
-- Appointment: c0000000-...0020

INSERT INTO patient_conditions (patient_id, condition_name, status, visit_id)
VALUES ('a0000000-0000-0000-0000-000000000020', 'Chest pain', 'active', 'c0000000-0000-0000-0000-000000000020');

INSERT INTO patient_medications (patient_id, name, dosage, frequency, visit_id)
VALUES ('a0000000-0000-0000-0000-000000000020', 'Betaloc', '25mg', 'once daily', 'c0000000-0000-0000-0000-000000000020');

INSERT INTO patient_observations (patient_id, observation, visit_id)
VALUES ('a0000000-0000-0000-0000-000000000020', 'ECG showed mild ST changes', 'c0000000-0000-0000-0000-000000000020');

INSERT INTO patient_observations (patient_id, observation, visit_id)
VALUES ('a0000000-0000-0000-0000-000000000020', 'Shortness of breath on exertion', 'c0000000-0000-0000-0000-000000000020');

-- Visit 2: Patient 0021 — Knee osteoarthritis, Ibuprofen
-- Appointment: c0000000-...0021

INSERT INTO patient_conditions (patient_id, condition_name, status, visit_id)
VALUES ('a0000000-0000-0000-0000-000000000021', 'Osteoarthritis (right knee)', 'active', 'c0000000-0000-0000-0000-000000000021');

INSERT INTO patient_medications (patient_id, name, dosage, frequency, visit_id)
VALUES ('a0000000-0000-0000-0000-000000000021', 'Ibuprofen', '400mg', 'twice daily', 'c0000000-0000-0000-0000-000000000021');

INSERT INTO patient_observations (patient_id, observation, visit_id)
VALUES ('a0000000-0000-0000-0000-000000000021', 'X-ray shows mild osteoarthritis', 'c0000000-0000-0000-0000-000000000021');

INSERT INTO patient_observations (patient_id, observation, visit_id)
VALUES ('a0000000-0000-0000-0000-000000000021', 'Stiffness in morning', 'c0000000-0000-0000-0000-000000000021');

-- Visit 3: Patient 0023 — Fever, Paracetamol, Azithromycin
-- Appointment: c0000000-...0022

INSERT INTO patient_conditions (patient_id, condition_name, status, visit_id)
VALUES ('a0000000-0000-0000-0000-000000000023', 'Fever with cough', 'active', 'c0000000-0000-0000-0000-000000000022');

INSERT INTO patient_medications (patient_id, name, dosage, frequency, visit_id)
VALUES ('a0000000-0000-0000-0000-000000000023', 'Paracetamol syrup', '5ml', 'every 6 hours', 'c0000000-0000-0000-0000-000000000022');

INSERT INTO patient_medications (patient_id, name, dosage, frequency, visit_id)
VALUES ('a0000000-0000-0000-0000-000000000023', 'Azithromycin', '200mg', 'for 3 days', 'c0000000-0000-0000-0000-000000000022');

INSERT INTO patient_observations (patient_id, observation, visit_id)
VALUES ('a0000000-0000-0000-0000-000000000023', 'Fever 101F, dry cough, throat congestion', 'c0000000-0000-0000-0000-000000000022');

-- Visit 4: Patient 0026 — Hypertension, Diabetes, Metformin, Amlodipine
-- Appointment: 06c7933e-...

INSERT INTO patient_conditions (patient_id, condition_name, status, visit_id)
VALUES ('a0000000-0000-0000-0000-000000000026', 'Hypertension', 'active', '06c7933e-30e8-4d2d-9784-34aea80e2aba');

INSERT INTO patient_conditions (patient_id, condition_name, status, visit_id)
VALUES ('a0000000-0000-0000-0000-000000000026', 'Type 2 Diabetes', 'active', '06c7933e-30e8-4d2d-9784-34aea80e2aba');

INSERT INTO patient_medications (patient_id, name, dosage, frequency, visit_id)
VALUES ('a0000000-0000-0000-0000-000000000026', 'Metformin', '500mg', 'twice daily', '06c7933e-30e8-4d2d-9784-34aea80e2aba');

INSERT INTO patient_medications (patient_id, name, dosage, frequency, visit_id)
VALUES ('a0000000-0000-0000-0000-000000000026', 'Amlodipine', '5mg', 'once daily', '06c7933e-30e8-4d2d-9784-34aea80e2aba');

-- Visit 5: Patient 0026 — Cancer (test note)
-- Appointment: f1cab3ee-...

INSERT INTO patient_conditions (patient_id, condition_name, status, visit_id)
VALUES ('a0000000-0000-0000-0000-000000000026', 'Cancer', 'active', 'f1cab3ee-0f75-4d0b-862b-5dc30932139e');
