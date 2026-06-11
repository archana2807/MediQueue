// lib/queries/dashboard.ts

import { pool } from "@/lib/db";

export async function getDashboardData() {
  const [
    appointments,
    todayAppointments,
    doctors,
    queue,
    recentAppointments,
  ] = await Promise.all([
    pool.query(`
      SELECT COUNT(*)::int AS count
      FROM appointments
    `),

    pool.query(`
      SELECT COUNT(*)::int AS count
      FROM appointments
      WHERE DATE(appointment_date) = CURRENT_DATE
    `),

    pool.query(`
      SELECT COUNT(*)::int AS count
      FROM doctors
    `),

    pool.query(`
      SELECT COUNT(*)::int AS count
      FROM appointments
      WHERE status IN ('CONFIRMED','IN_PROGRESS')
    `),

    pool.query(`
      SELECT
        a.id,
        a.status,
        a.queue_number,
        a.appointment_date,
        u.name AS patient_name,
        du.name AS doctor_name
      FROM appointments a
      LEFT JOIN users u
        ON u.id = a.patient_id
      LEFT JOIN doctors d
        ON d.id = a.doctor_id
      LEFT JOIN users du
        ON du.id = d.user_id
      ORDER BY a.appointment_date DESC
      LIMIT 10
    `),
  ]);

  return {
    stats: {
      totalAppointments:
        appointments.rows[0].count,

      todaysPatients:
        todayAppointments.rows[0].count,

      doctorsAvailable:
        doctors.rows[0].count,

      queueWaiting:
        queue.rows[0].count,
    },

    recentAppointments:
      recentAppointments.rows,
  };
}