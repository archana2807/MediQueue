"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";

import { toast } from "sonner";

import {
  appointmentSchema,
  type AppointmentFormData,
} from "@/lib/validations";

import PatientLookup from "./patient-lookup";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SearchSelect from "@/components/common/search-select";

type Doctor = {
  id: string;
  name: string;
};

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

  const [doctors, setDoctors] =
    useState<Doctor[]>([]);

  const [loadingDoctors, setLoadingDoctors] =
    useState(false);
  console.log("initialData",initialData);
 const [patientId, setPatientId] =
  useState<string | undefined>(
    initialData?.patient_id
  );


  const { data: session } =
  useSession();

const user =
    session?.user;
  const isPatient =
  (user as any)?.role ===
  "PATIENT";
  const isExistingPatient = !!patientId;
 
  
 

  const {
  register,
  handleSubmit,
  setValue,
  watch,
  reset,
  formState: {
    errors,
    isSubmitting,
  },
} = useForm<AppointmentFormData>({
  resolver: zodResolver(
    appointmentSchema
  ),
 defaultValues: {
  patient_name: "",
  patient_phone: "",
  doctor_id: "",
  appointment_date: "",
  status: "PENDING",
}
});
  
  useEffect(() => {
  if (!initialData) return;

  reset({
  doctor_id: initialData.doctor_id,

  appointment_date: new Date(
    initialData.appointment_date
  )
    .toISOString()
    .slice(0, 16),

  status:
    initialData.status as
      | "PENDING"
      | "CONFIRMED"
      | "COMPLETED",
});

  setPatientId(
    initialData.patient_id
  );

 setValue(
  "patient_name",
  initialData.patient_name ?? ""
);

setValue(
  "patient_phone",
  initialData.patient_phone ?? ""
);
}, [initialData, reset]);

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    if (isPatient && user) {
    
    setPatientId(
      (user as any).id
    );

   setValue(
  "patient_name",
  user.name || ""
);

setValue(
  "patient_phone",
  (user as any).phone || ""
);
  }
}, [isPatient, user]);

  async function loadDoctors() {
    try {
      setLoadingDoctors(true);

      const response =
        await fetch(
          "/api/doctors"
        );

      const result =
        await response.json();

      setDoctors(
        result.data || []
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load doctors"
      );
    } finally {
      setLoadingDoctors(false);
    }
  }

  const onSubmit = async (
    data: AppointmentFormData
  ) => {
    try {
     

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
    data.appointment_date,

  status:
    data.status,
};

     const response =
  await fetch(
    appointmentId
      ? `/api/appointments/${appointmentId}`
      : "/api/appointments",
          {
            method: appointmentId
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
        toast.error(
          result.message
        );
        return;
      }

      toast.success(
  appointmentId
    ? "Appointment updated successfully"
    : "Appointment created successfully"
);

      router.push(
        "/appointments"
      );

      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error(
        "Something went wrong"
      );
    }
  };


  useEffect(() => {
  if (isPatient && !appointmentId) {
    setValue("status", "PENDING");
  }
  }, [isPatient, appointmentId, setValue]);
  
return (
<form
onSubmit={handleSubmit(
onSubmit
)}
> <FieldGroup>


    {!isPatient && (
  <PatientLookup
    onPatientSelect={(
      patient
    ) => {
      setPatientId(
        patient.patientId
      );

     setValue(
  "patient_name",
  patient.patientName
);

setValue(
  "patient_phone",
  patient.patientPhone
);
    }}
  />
)}
   

<Field>
  <FieldLabel>
    Patient Name
  </FieldLabel>

  <Input
    {...register(
      "patient_name"
          )}
            readOnly={!!appointmentId}

    placeholder="Patient Name"
  />

  {errors.patient_name && (
    <FieldDescription className="text-red-500">
      {
        errors.patient_name
          .message
      }
    </FieldDescription>
  )}
      </Field>
      <Field>
  <FieldLabel>
    Phone Number
  </FieldLabel>

  <Input
    {...register(
      "patient_phone"
          )}
            readOnly={!!appointmentId}

    placeholder="Phone Number"
  />

  {errors.patient_phone && (
    <FieldDescription className="text-red-500">
      {
        errors.patient_phone
          .message
      }
    </FieldDescription>
  )}
</Field>

   <Field>
  <FieldLabel>
    Doctor
  </FieldLabel>

  <SearchSelect
    value={watch("doctor_id")}
    onChange={(value) =>
      setValue(
        "doctor_id",
        value,
        {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        }
      )
    }
    placeholder="Select Doctor"
    options={doctors.map(
      (doctor) => ({
        value: doctor.id,
        label: doctor.name,
      })
    )}
  />

  {errors.doctor_id && (
    <FieldDescription className="text-red-500">
      {errors.doctor_id.message}
    </FieldDescription>
  )}
</Field>

    <Field>
      <FieldLabel>
        Appointment Date
      </FieldLabel>

      <Input
        type="datetime-local"
        {...register(
          "appointment_date"
        )}
        />
        {errors.appointment_date && (
  <FieldDescription className="text-red-500">
    {errors.appointment_date.message}
  </FieldDescription>
)}
    </Field>

  

   <Field>
  <FieldLabel>
    Status
  </FieldLabel>

  <select
    {...register("status")}
    disabled={isPatient}
    className="h-10 w-full rounded-md border px-3"
  >
    <option value="PENDING">
      Pending
    </option>

    <option value="CONFIRMED">
      Confirmed
    </option>

    <option value="COMPLETED">
      Completed
    </option>
  </select>

  {errors.status && (
    <FieldDescription className="text-red-500">
      {errors.status.message}
    </FieldDescription>
  )}
</Field>

    <Button
  type="submit"
  disabled={isSubmitting}
>
  {isSubmitting
    ? "Saving..."
    : appointmentId
    ? "Update Appointment"
    : "Create Appointment"}
</Button>

  </FieldGroup>
</form>


);
}
