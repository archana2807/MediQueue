"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import {
  useMemo,
} from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CalendarDays,
  User,
  ClipboardCheck,
  Save,
  ArrowLeft,
  ChevronDown,
  CircleDot,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  Loader2,
  Brain,
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
  specialization: string;
};

type DepartmentDoctor = {
  id: string;
  name: string;
  specialization: string;
  currentLoad: number;
  estimatedWait: number;
};

type AiRecommendation = {
  department: string;
  recommendedDoctor: {
    id: string;
    name: string;
    currentLoad: number;
    estimatedWait: number;
    reason: string;
  };
  departmentDoctors: DepartmentDoctor[];
};

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending", icon: Clock, color: "text-amber-400" },
  { value: "CONFIRMED", label: "Confirmed", icon: CircleDot, color: "text-teal-400" },
  { value: "CHECKED_IN", label: "Checked In", icon: ClipboardCheck, color: "text-blue-400" },
  { value: "WAITING", label: "Waiting", icon: Clock, color: "text-violet-400" },
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
      doctor_name?: string; // 👈 add

    appointment_date: string;
    status: string;
  };
};

export default function AppointmentForm({
  appointmentId,
  initialData,
}: AppointmentFormProps) {
  const router = useRouter();
 
  const today = new Date()
  .toISOString()
  .split("T")[0];
  
  const [patientId, setPatientId] = useState<string | undefined>(
    initialData?.patient_id
  );

  const [symptoms, setSymptoms] = useState("");
  const [aiRecommendation, setAiRecommendation] = useState<AiRecommendation | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const { data: session } = useSession();
  const user = session?.user as { id?: string; name?: string; phone?: string; role?: string } | undefined;
  const isPatient = user?.role === "PATIENT";
  const isEdit = !!appointmentId;
const queryClient =
  useQueryClient();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patient_name: "",
      patient_phone: "",
      doctor_id: "",
       appointment_date:
      initialData?.appointment_date
        ? new Date(
            initialData.appointment_date
          )
            .toISOString()
            .split("T")[0]
        : today,
      appointment_time: "",
      status: "PENDING",
    },
  });

  const selectedDoctor = watch("doctor_id");
  const selectedDate = watch("appointment_date");

  useEffect(() => {
  if (!initialData) return;
    console.log("initialData",initialData);
  const appointmentDate =
    new Date(initialData.appointment_date)
      .toISOString()
      .split("T")[0];

  const appointmentTime =
  new Date(initialData.appointment_date)
    .toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    console.log("initialData",initialData);

  reset({
    doctor_id: initialData.doctor_id,
    patient_name: initialData.patient_name ?? "",
    patient_phone: initialData.patient_phone ?? "",
    appointment_date: appointmentDate,
    appointment_time: appointmentTime,
    status: initialData.status as any,
  });

  setPatientId(initialData.patient_id);
}, [initialData, reset]);

  

  

  useEffect(() => {
    if (isPatient && user) {
      setPatientId(user.id);
      setValue("patient_name", user.name || "");
      setValue("patient_phone", user.phone || "");
    }
  }, [isPatient, user, setValue]);

  useEffect(() => {
    if (isPatient && !appointmentId) {
      setValue("status", "PENDING");
    }
  }, [isPatient, appointmentId, setValue]);
const {
  data: doctorsData,
  isLoading: loadingDoctors,
} = useQuery({
  queryKey: ["doctors"],

  queryFn: async () => {
    const response =
      await fetch("/api/doctors?limit=100");

    if (!response.ok) {
      throw new Error(
        "Failed to load doctors"
      );
    }

    return response.json();
  },

  staleTime:
    5 * 60 * 1000,
  placeholderData: (prev) => prev,
});
  
  const allDoctors: Doctor[] =
    doctorsData?.data ?? [];
  
  console.log("allDoctors", allDoctors);
console.log(
  "Cancer Doctors",
  allDoctors.filter(
    (doctor) =>
      doctor.specialization.toLowerCase() ===
      aiRecommendation?.department.toLowerCase()
  )
);

const filteredDoctors =
  aiRecommendation
    ? aiRecommendation.departmentDoctors
    : allDoctors;
  
 const doctorOptions = useMemo(() => {
  const options = filteredDoctors.map((doctor) => ({
    value: doctor.id,
    label:
      aiRecommendation?.recommendedDoctor.id === doctor.id
        ? `${doctor.name} (Recommended)`
        : doctor.name,
  }));

  const currentDoctorId =
    watch("doctor_id") || initialData?.doctor_id;

  if (
    currentDoctorId &&
    !options.some(
      (o) => o.value === currentDoctorId
    )
  ) {
    const currentDoctor = allDoctors.find(
      (d) => d.id === currentDoctorId
    );

    if (currentDoctor) {
      options.unshift({
        value: currentDoctor.id,
        label: `${currentDoctor.name} (Current)`,
      });
    }
  }

  return options;
}, [
  filteredDoctors,
  aiRecommendation,
  allDoctors,
  watch("doctor_id"),
  initialData?.doctor_id,
]);
  console.log(
  aiRecommendation?.departmentDoctors
);
  const currentTime = initialData?.appointment_date
  ? new Date(initialData.appointment_date)
      .toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
  : "";
  
  console.log("doctor_id", watch("doctor_id"));
console.log("appointment_date", watch("appointment_date"));
console.log("appointment_time", watch("appointment_time"));
  
  
  const {
  data: slotsData,
  isLoading: loadingSlots,
} = useQuery<{
  availableSlots: string[];
}>({
  queryKey: [
    "availability",
    selectedDoctor,
    selectedDate,
  ],

  enabled:
    !!selectedDoctor &&
    !!selectedDate,

  queryFn: async () => {
    const response = await fetch(
      `/api/appointments/availability?doctorId=${selectedDoctor}&date=${selectedDate}`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to load slots"
      );
    }

    return response.json();
  },

  refetchInterval: 15000,
  placeholderData: (prev) => prev,
});
  
 
const slots =
  slotsData?.availableSlots ?? [];

const availableSlots = [...slots];

if (
  isEdit &&
  currentTime &&
  !availableSlots.includes(currentTime)
) {
  availableSlots.unshift(currentTime);
}
 

  const analyzeSymptoms = useCallback(async () => {
    if (!symptoms.trim()) {
      toast.error("Please enter symptoms first");
      return;
    }

    setAnalyzing(true);
    setAiError(null);

    try {
      const response = await fetch("/api/ai/analyze-symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms }),
      });

      const result = await response.json();

      if (!response.ok) {
        setAiError(result.message || "Failed to analyze symptoms");
        toast.error(result.message || "Failed to analyze symptoms");
        return;
      }

      setAiRecommendation(result.data);
      setValue("doctor_id", result.data.recommendedDoctor.id, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      toast.success("AI recommendation ready");
    } catch (error) {
      console.error(error);
      setAiError("Failed to analyze symptoms");
      toast.error("Failed to analyze symptoms");
    } finally {
      setAnalyzing(false);
    }
  }, [symptoms, setValue]);

 const clearRecommendation =
  useCallback(() => {
    setAiRecommendation(null);
    setSymptoms("");
    setAiError(null);
  }, []);
useEffect(() => {
  if (!aiRecommendation) return;

  setValue(
    "doctor_id",
    aiRecommendation.recommendedDoctor.id,
    {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    }
  );
}, [aiRecommendation, setValue]);
  const getWorkloadComparison = useCallback(
    (currentDoctorId: string) => {
      if (!aiRecommendation) return null;

      const recommended = aiRecommendation.recommendedDoctor;
      if (recommended.id === currentDoctorId) return null;

      const currentDoctor = allDoctors.find((d) => d.id === currentDoctorId);
      const deptDoc = aiRecommendation.departmentDoctors.find(
        (d) => d.id === currentDoctorId
      );

      if (!currentDoctor) return null;

      return {
        selectedDoctor: {
          name: currentDoctor.name,
          currentLoad: deptDoc?.currentLoad ?? 0,
          estimatedWait: deptDoc?.estimatedWait ?? 0,
        },
        recommendedDoctor: {
          name: recommended.name,
          currentLoad: recommended.currentLoad,
          estimatedWait: recommended.estimatedWait,
          reason: recommended.reason,
        },
      };
    },
    [aiRecommendation, allDoctors]
  );

  const workloadComparison = getWorkloadComparison(selectedDoctor);

  


  const saveAppointment =
  useMutation({
    mutationKey: [
      isEdit
        ? "updateAppointment"
        : "createAppointment",
    ],

    mutationFn: async (
      data: AppointmentFormData
    ) => {
      const appointmentDateTime =
        `${data.appointment_date} ${data.appointment_time}:00`;

      const payload = {
        patient_id:
          patientId ?? null,
        patient_name:
          data.patient_name,
        patient_phone:
          data.patient_phone,
        doctor_id:
          data.doctor_id,
        appointment_date:
          appointmentDateTime,
        status:
          data.status,
      };

      const response =
        await fetch(
          isEdit
            ? `/api/appointments/${appointmentId}`
            : "/api/appointments",
          {
            method: isEdit
              ? "PUT"
              : "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              payload
            ),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to save appointment"
        );
      }

      return result;
    },

    onSuccess: async (
      _,
      variables
    ) => {
      toast.success(
        isEdit
          ? "Appointment updated successfully"
          : "Appointment created successfully"
      );

      // await loadSlots(
      //   variables.doctor_id,
      //   variables.appointment_date
      // );

      queryClient.invalidateQueries({
        queryKey: [
          "appointments",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "dashboard",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["queue"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "availability",
        ],
      });

      router.push(
        "/appointments"
      );
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    },
  });

  const onSubmit = (
  data: AppointmentFormData
) => {
  saveAppointment.mutate(
    data
  );
  };
  
  console.log("selectedDoctor", watch("doctor_id"));
console.log("doctorOptions", doctorOptions);

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

      {/* Symptoms & AI Recommendation */}
      <div className="rounded-xl border bg-card p-5 shadow-sm animate-fade-in-up stagger-2">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
            <Brain className="h-4 w-4 text-violet-400" />
          </div>
          <h3 className="text-sm font-semibold">Symptoms & AI Recommendation</h3>
          {aiRecommendation && (
            <Badge variant="outline" className="ml-auto border-violet-500/30 bg-violet-500/10 text-violet-400 text-[10px]">
              AI Analyzed
            </Badge>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Patient Symptoms
            </label>
            <div className="flex gap-2">
              <Input
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g., Ear pain, fever, headache..."
                className="h-10 bg-background/50"
                disabled={analyzing || isPatient}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    analyzeSymptoms();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={analyzeSymptoms}
                disabled={analyzing || !symptoms.trim() || isPatient}
                className="h-10 px-4 border-violet-500/30 hover:bg-violet-500/10"
              >
                {analyzing ? (
                  <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
                ) : (
                  <Sparkles className="h-4 w-4 text-violet-400" />
                )}
                <span className="ml-2 hidden sm:inline">Analyze</span>
              </Button>
              {aiRecommendation && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={clearRecommendation}
                  disabled={isPatient}
                  className="h-10 px-3 text-muted-foreground"
                >
                  Clear
                </Button>
              )}
            </div>
            {aiError && (
              <p className="text-xs text-red-400">{aiError}</p>
            )}
          </div>

          {/* AI Recommendation Card */}
          {aiRecommendation && (
            <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-semibold text-violet-400">
                  AI Recommendation
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Department</p>
                  <p className="text-sm font-medium">{aiRecommendation.department.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Recommended Doctor</p>
                  <p className="text-sm font-medium">
                  {aiRecommendation.recommendedDoctor.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Reason</p>
                  <p className="text-sm font-medium">{aiRecommendation.recommendedDoctor.reason}</p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span>Current Load: {aiRecommendation.recommendedDoctor.currentLoad} patients</span>
                <span>Est. Wait: {aiRecommendation.recommendedDoctor.estimatedWait} mins</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Appointment Details */}
      <div className="rounded-xl border bg-card p-5 shadow-sm animate-fade-in-up stagger-3">
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
              {aiRecommendation && (
              <span className="ml-1 text-violet-400">
                    ({aiRecommendation.department.toUpperCase()})
                  </span>
              )}
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
              placeholder={aiRecommendation ? `Choose from ${aiRecommendation.department.toUpperCase()}` : "Choose a doctor"}
              options={doctorOptions}
              loading={loadingDoctors}
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
              {...register("appointment_date")}
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
              <option value="">Select Slot</option>
              {availableSlots.map((slot) => (
  <option key={slot} value={slot}>
    {slot}
  </option>
))}
            </select>
            {errors.appointment_time && (
              <p className="text-xs text-red-400">{errors.appointment_time.message}</p>
            )}
          </div>
        </div>

        {/* Workload Comparison Warning */}
        {workloadComparison && (
          <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-semibold text-amber-400">
                Different Doctor Selected
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border border-amber-500/20 bg-background/50 p-3">
                <p className="text-xs text-muted-foreground mb-1">Selected Doctor</p>
                <p className="text-sm font-medium">{workloadComparison.selectedDoctor.name}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>Load: {workloadComparison.selectedDoctor.currentLoad} patients</span>
                  <span>Wait: ~{workloadComparison.selectedDoctor.estimatedWait} mins</span>
                </div>
              </div>

              <div className="rounded-md border border-violet-500/20 bg-violet-500/5 p-3">
                <p className="text-xs text-muted-foreground mb-1">AI Recommended</p>
                <p className="text-sm font-medium">\u2B50 {workloadComparison.recommendedDoctor.name}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>Load: {workloadComparison.recommendedDoctor.currentLoad} patients</span>
                  <span>Wait: ~{workloadComparison.recommendedDoctor.estimatedWait} mins</span>
                </div>
                <p className="mt-2 text-xs text-violet-400">
                  {workloadComparison.recommendedDoctor.reason}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status */}
      <div className="rounded-xl border bg-card p-5 shadow-sm animate-fade-in-up stagger-4">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <ClipboardCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <h3 className="text-sm font-semibold">Status</h3>
        </div>

        <div className="max-w-xs">
          <StatusSelect
            value={watch("status")}
            onChange={(val) => setValue("status", val as "PENDING" | "CONFIRMED" | "CHECKED_IN" | "WAITING" | "COMPLETED", { shouldValidate: true })}
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
      <div className="flex items-center justify-between animate-fade-in-up stagger-5">
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
          disabled={
  saveAppointment.isPending
}
          className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 px-6"
          size="lg"
        >
         {saveAppointment.isPending ? (
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
