-- Migration: Create patient_drafts table for storing agent-generated draft outputs
-- Run this against your Neon PostgreSQL database

CREATE TABLE IF NOT EXISTS patient_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  evidence_references JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_patient_drafts_patient_id
  ON patient_drafts(patient_id);

CREATE INDEX IF NOT EXISTS idx_patient_drafts_created_at
  ON patient_drafts(created_at DESC);
