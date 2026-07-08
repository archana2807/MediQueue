-- ============================================
-- CLINICAL DATA TABLES
-- Structured storage for medications, allergies,
-- conditions, and observations
-- ============================================

CREATE TABLE IF NOT EXISTS patient_medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT,
  visit_id UUID REFERENCES appointments(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS patient_allergies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  allergen TEXT NOT NULL,
  severity TEXT,
  visit_id UUID REFERENCES appointments(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS patient_conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  condition_name TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  visit_id UUID REFERENCES appointments(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS patient_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  observation TEXT NOT NULL,
  visit_id UUID REFERENCES appointments(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
