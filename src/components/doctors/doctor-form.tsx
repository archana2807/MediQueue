"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  doctorSchema,
  type DoctorFormData,
} from "@/lib/validations";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";

type DoctorFormProps = {
  initialData?: {
    name: string;
    specialization: string;
    email: string;
    phone?: string;
  };
  doctorId?: string;
};

export default function DoctorForm({
  initialData,
  doctorId,
}: DoctorFormProps) {
  const router = useRouter();

  const isEdit = !!doctorId;

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<DoctorFormData>({
    resolver: zodResolver(
      doctorSchema
    ),
   defaultValues: {
  name:
    initialData?.name || "",
  specialization:
    initialData?.specialization ||
    "",
  email:
    initialData?.email || "",
  phone:
    initialData?.phone || "",
  password: "",
},
  });

  const onSubmit = async (
    data: DoctorFormData
  ) => {
    try {
      const response = await fetch(
        isEdit
          ? `/api/doctors/${doctorId}`
          : "/api/doctors",
        {
          method: isEdit
            ? "PUT"
            : "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        toast.error(
          result.message ||
            "Operation failed"
        );
        return;
      }

      toast.success(
        isEdit
          ? "Doctor updated successfully"
          : "Doctor created successfully"
      );

      router.push("/doctors");
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
    >
      <FieldGroup>
        <Field>
          <FieldLabel>
            Doctor Name
          </FieldLabel>

          <Input
            placeholder="Dr. Patel"
            {...register("name")}
          />

          {errors.name && (
            <FieldDescription className="text-red-500">
              {errors.name.message}
            </FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel>
            Specialization
          </FieldLabel>

          <Input
            placeholder="Cardiology"
            {...register(
              "specialization"
            )}
          />

          {errors.specialization && (
            <FieldDescription className="text-red-500">
              {
                errors
                  .specialization
                  .message
              }
            </FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel>
            Email
          </FieldLabel>

          <Input
            type="email"
            placeholder="doctor@hospital.com"
            {...register("email")}
          />

          {errors.email && (
            <FieldDescription className="text-red-500">
              {errors.email.message}
            </FieldDescription>
          )}
        </Field>
        <Field>
  <FieldLabel>
    Phone Number
  </FieldLabel>

  <Input
    placeholder="9876543210"
    {...register("phone")}
  />

  {errors.phone && (
    <FieldDescription className="text-red-500">
      {errors.phone.message}
    </FieldDescription>
  )}
        </Field>
       
  <Field>
    <FieldLabel>
      Password
    </FieldLabel>

    <Input
      type="password"
      placeholder="Enter password"
      {...register("password")}
    />

    {errors.password && (
      <FieldDescription className="text-red-500">
        {errors.password.message}
      </FieldDescription>
    )}
  </Field>


        <Button
          
          type="submit"
          disabled={isSubmitting}
          // className=""
        >
          {isSubmitting
            ? "Saving..."
            : isEdit
            ? "Update Doctor"
            : "Create Doctor"}
        </Button>
      </FieldGroup>
    </form>
  );
}