"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  CalendarDays,
  User,
  Stethoscope,
  ClipboardCheck,
  Save,
  ArrowLeft,
  ChevronDown,
  CircleDot,
  CheckCircle2,
  Clock,
} from "lucide-react";

import {
  appointmentSchema,
  type AppointmentFormData,
} from "@/lib/validations";

import PatientLookup from "./patient-lookup";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SearchSelect from "@/components/common/search-select";
import { Badge } from "@/components/ui/badge";

type Doctor = {
  id: string;
  name: string;
};

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending", icon: Clock, color: "text-amber-400" },
  { value: "CONFIRMED", label: "Confirmed", icon: CircleDot, color: "text-teal-400" },
  { value: "COMPLETED", label: "Completed", icon: CheckCircle2, color: "text-emerald-400" },
];

function StatusSelect({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selected = STATUS_OPTIONS.find((s) => s.value === value);
  const Icon = selected?.icon || Clock;

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="flex h-10 w-full items-center justify-between rounded-lg border border-border/60 bg-background/50 px-3 text-sm transition-colors hover:bg-background/80 focus:border-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="flex items-center gap-2.5">
          {selected && <Icon className={`h-4 w-4 ${selected.color}`} />}
          <span>{selected?.label || "Select status"}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && !disabled && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-0 z-50 mb-1.5 w-full overflow-hidden rounded-lg border bg-popover p-1 shadow-lg animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2">
            {STATUS_OPTIONS.map((option) => {
              const OptionIcon = option.icon;
              const isSelected = value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent ${
                    isSelected ? "bg-emerald-500/10" : ""
                  }`}
                >
                  <OptionIcon className={`h-4 w-4 ${option.color}`} />
                  <span className={isSelected ? "text-emerald-400 font-medium" : ""}>
                    {option.label}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="ml-auto h-3.5 w-3.5 text-emerald-400" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

type AppointmentFormProps = {
  appointmentId?: string;
  initialData?: {
    patient_id?: string;
    patient_name?: string;
    patient_phone?: string;
    doctor_id: string;
    appointment_date: string;
    status: string;
  };
};

export default function AppointmentForm({
  appointmentId,
  initialData,
}: AppointmentFormProps) {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [slots, setSlots] =
  useState<string[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [patientId, setPatientId] = useState<string | undefined>(
    initialData?.patient_id
  );

  const { data: session } = useSession();
  const user = session?.user;
  const isPatient = (user as any)?.role === "PATIENT";
  const isEdit = !!appointmentId;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patient_name: "",
      patient_phone: "",
      doctor_id: "",
      appointment_date: "",
        appointment_time: "",

      status: "PENDING",
    },
  });

  const selectedDoctor =
  watch("doctor_id");

const selectedDate =
  watch("appointment_date");

  useEffect(() => {
    if (!initialData) return;
    const currentTime =
    new Date(
      initialData.appointment_date
    )
      .toTimeString()
      .slice(0, 5);
    reset({
      doctor_id: initialData.doctor_id,
      appointment_date: new Date(
  initialData.appointment_date
)
  .toISOString()
        .slice(0, 10),
      appointment_time: currentTime,
      status: initialData.status as "PENDING" | "CONFIRMED" | "COMPLETED",
    });
      setSlots([currentTime]);

    setPatientId(initialData.patient_id);
    setValue("patient_name", initialData.patient_name ?? "");
    setValue("patient_phone", initialData.patient_phone ?? "");
  }, [initialData, reset]);

  useEffect(() => {
    loadDoctors();
  }, []);
  useEffect(() => {
  if (
    !selectedDoctor ||
    !selectedDate
  ) {
    return;
  }

  loadSlots(
    selectedDoctor,
    selectedDate
  );
}, [
  selectedDoctor,
  selectedDate,
  ]);
  
  useEffect(() => {
  if (
    !selectedDoctor ||
    !selectedDate
  ) {
    return;
  }

  const interval =
    setInterval(() => {
      loadSlots(
        selectedDoctor,
        selectedDate
      );
    }, 15000);

  return () =>
    clearInterval(interval);
}, [
  selectedDoctor,
  selectedDate,
]);

  useEffect(() => {
    if (isPatient && user) {
      setPatientId((user as any).id);
      setValue("patient_name", user.name || "");
      setValue("patient_phone", (user as any).phone || "");
    }
  }, [isPatient, user]);

  useEffect(() => {
    if (isPatient && !appointmentId) {
      setValue("status", "PENDING");
    }
  }, [isPatient, appointmentId, setValue]);

  async function loadDoctors() {
    try {
      setLoadingDoctors(true);
      const response = await fetch("/api/doctors");
      const result = await response.json();
      setDoctors(result.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load doctors");
    } finally {
      setLoadingDoctors(false);
    }
  }
  const loadSlots = async (
  doctorId: string,
  date: string
) => {
  try {
    const response =
      await fetch(
        `/api/appointments/availability?doctorId=${doctorId}&date=${date}`
      );
const selectedTime =
  watch("appointment_time");
    const result =
  await response.json();

let available =
  result.availableSlots || [];

if (
  selectedTime &&
  !available.includes(selectedTime)
) {
  available.unshift(
    selectedTime
  );
}

setSlots(available);

   
  } catch (error) {
    console.error(
      "Slot Load Error:",
      error
    );
  }
};

  const onSubmit = async (data: AppointmentFormData) => {
    try {

      const appointmentDateTime =
        `${data.appointment_date} ${data.appointment_time}:00`;
      
      const payload = {
        patient_id: patientId ?? null,
        patient_name: data.patient_name,
        patient_phone: data.patient_phone,
        doctor_id: data.doctor_id,
       appointment_date:
  appointmentDateTime,
        status: data.status,
      };

      const response = await fetch(
        isEdit ? `/api/appointments/${appointmentId}` : "/api/appointments",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(
        isEdit ? "Appointment updated successfully" : "Appointment created successfully"
      );
      await loadSlots(
  data.doctor_id,
  data.appointment_date
);
      router.push("/appointments");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Patient Verification */}
      {!isPatient && (
        <div className="animate-fade-in-up">
          <PatientLookup
            onPatientSelect={(patient) => {
              setPatientId(patient.patientId);
              setValue("patient_name", patient.patientName);
              setValue("patient_phone", patient.patientPhone);
            }}
          />
        </div>
      )}

      {/* Patient Information */}
      <div className="rounded-xl border bg-card p-5 shadow-sm animate-fade-in-up stagger-1">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <User className="h-4 w-4 text-emerald-400" />
          </div>
          <h3 className="text-sm font-semibold">Patient Information</h3>
          {isEdit && (
            <Badge variant="outline" className="ml-auto border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px]">
              Editing
            </Badge>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Full Name
            </label>
            <Input
              {...register("patient_name")}
              readOnly={isEdit}
              placeholder="Patient full name"
              className="h-10 bg-background/50"
            />
            {errors.patient_name && (
              <p className="text-xs text-red-400">{errors.patient_name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Phone Number
            </label>
            <Input
              {...register("patient_phone")}
              readOnly={isEdit}
              placeholder="9876543210"
              className="h-10 bg-background/50"
            />
            {errors.patient_phone && (
              <p className="text-xs text-red-400">{errors.patient_phone.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="rounded-xl border bg-card p-5 shadow-sm animate-fade-in-up stagger-2">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <CalendarDays className="h-4 w-4 text-emerald-400" />
          </div>
          <h3 className="text-sm font-semibold">Appointment Details</h3>
        </div>

       <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Select Doctor
            </label>
            <SearchSelect
              value={watch("doctor_id")}
              onChange={(value) =>
                setValue("doctor_id", value, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
              placeholder="Choose a doctor"
              options={doctors.map((doctor) => ({
                value: doctor.id,
                label: doctor.name,
              }))}
            />
            {errors.doctor_id && (
              <p className="text-xs text-red-400">{errors.doctor_id.message}</p>
            )}
          </div>

         <div className="space-y-1.5">
  <label className="text-xs font-medium text-muted-foreground">
    Appointment Date
  </label>

  <Input
    type="date"
    {...register(
      "appointment_date"
    )}
    className="h-10 bg-background/50"
  />
          </div>

          <div className="space-y-1.5">
  <label className="text-xs font-medium text-muted-foreground">
    Available Slot
  </label>

 <select
  className="w-full h-10 rounded-md border bg-background px-3"
  {...register("appointment_time")}
>
  <option value="">
    Select Slot
  </option>

  {slots.map((slot) => (
    <option
      key={slot}
      value={slot}
    >
      {slot}
    </option>
  ))}
</select>

{errors.appointment_time && (
  <p className="text-xs text-red-400">
    {errors.appointment_time.message}
  </p>
)}
</div>
          
        </div>
      </div>

      {/* Status */}
      <div className="rounded-xl border bg-card p-5 shadow-sm animate-fade-in-up stagger-3">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <ClipboardCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <h3 className="text-sm font-semibold">Status</h3>
        </div>

        <div className="max-w-xs">
          <StatusSelect
            value={watch("status")}
            onChange={(val) => setValue("status", val as "PENDING" | "CONFIRMED" | "COMPLETED", { shouldValidate: true })}
            disabled={isPatient}
          />
          {errors.status && (
            <p className="mt-1.5 text-xs text-red-400">{errors.status.message}</p>
          )}
          {isPatient && (
            <p className="mt-1.5 text-xs text-muted-foreground/60">
              Status is managed by the hospital staff
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between animate-fade-in-up stagger-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          className="gap-1.5 text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 px-6"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isEdit ? "Update Appointment" : "Create Appointment"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
