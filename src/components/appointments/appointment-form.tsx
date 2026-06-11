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

const [patientName, setPatientName] =
  useState(
    initialData?.patient_name || ""
  );

const [patientPhone, setPatientPhone] =
  useState(
    initialData?.patient_phone || ""
  );
  const { data: session } =
  useSession();

const user =
    session?.user;
  const isPatient =
  (user as any)?.role ===
  "PATIENT";
  
 
  
 

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
    
    status: "PENDING",
  },
});
  
  useEffect(() => {
  if (!initialData) return;

  reset({
    doctor_id:
      initialData.doctor_id,

    appointment_date:
      new Date(
        initialData.appointment_date
      )
        .toISOString()
        .slice(0, 16),

    

    status:
      initialData.status,
  });

  setPatientId(
    initialData.patient_id
  );

  setPatientName(
    initialData.patient_name ?? ""
  );

  setPatientPhone(
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

    setPatientName(
      user.name || ""
    );

    setPatientPhone(
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
      if (!patientName) {
        toast.error(
          "Patient is required"
        );
        return;
      }

      const payload = {
        patient_id:
          patientId ?? null,

        patient_name:
          patientName,

        patient_phone:
          patientPhone,

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

      setPatientName(
        patient.patientName
      );

      setPatientPhone(
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
    value={patientName}
    onChange={(e) =>
      setPatientName(
        e.target.value
      )
    }
    disabled={isPatient}
    placeholder="Patient Name"
  />
</Field>

<Field>
  <FieldLabel>
    Phone Number
  </FieldLabel>

  <Input
    value={patientPhone}
    onChange={(e) =>
      setPatientPhone(
        e.target.value
      )
    }
    placeholder="Phone Number"
  />
</Field>

    <Field>
      <FieldLabel>
        Doctor
      </FieldLabel>

      <SearchSelect
        value={watch(
          "doctor_id"
        )}
        onChange={(
          value
        ) =>
          setValue(
            "doctor_id",
            value,
            {
              shouldValidate:
                true,
            }
          )
        }
        placeholder="Select Doctor"
        options={doctors.map(
          (
            doctor
          ) => ({
            value:
              doctor.id,
            label:
              doctor.name,
          })
        )}
      />

      {errors.doctor_id && (
        <FieldDescription className="text-red-500">
          {
            errors
              .doctor_id
              .message
          }
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
    </Field>

  

    <Field>
      <FieldLabel>
        Status
      </FieldLabel>

      <select
        className="h-10 w-full rounded-md border px-3"
        value={watch(
          "status"
        )}
        onChange={(
          e
        ) =>
          setValue(
            "status",
            e.target
              .value
          )
        }
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
