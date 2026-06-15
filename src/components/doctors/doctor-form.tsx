"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  ArrowLeft,
  Loader2,
  BadgeCheck,
} from "lucide-react";

import {
  doctorSchema,
  type DoctorFormData,
} from "@/lib/validations";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    formState: { errors, isSubmitting },
  } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: initialData?.name || "",
      specialization: initialData?.specialization || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      password: "",
    },
  });

  const onSubmit = async (data: DoctorFormData) => {
    try {
      const response = await fetch(
        isEdit ? `/api/doctors/${doctorId}` : "/api/doctors",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Operation failed");
        return;
      }

      toast.success(
        isEdit ? "Doctor updated successfully" : "Doctor created successfully"
      );
      router.push("/doctors");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl space-y-5">
      {/* Actions - Back */}
      <div className="flex items-center justify-end animate-fade-in-up">
        {isEdit && (
          <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 gap-1.5">
            <BadgeCheck className="h-3 w-3" />
            Editing
          </Badge>
        )}
      </div>

      {/* Personal Info */}
      <div className="rounded-xl border bg-card p-5 shadow-sm animate-fade-in-up stagger-1">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <User className="h-4 w-4 text-emerald-400" />
          </div>
          <h3 className="text-sm font-semibold">Personal Information</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Full Name <span className="text-red-400">*</span>
            </label>
            <Input
              {...register("name")}
              placeholder="Dr. Patel"
              className="h-10 bg-background/50"
            />
            {errors.name && (
              <p className="text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Specialization <span className="text-red-400">*</span>
            </label>
            <Input
              {...register("specialization")}
              placeholder="Cardiology"
              className="h-10 bg-background/50"
            />
            {errors.specialization && (
              <p className="text-xs text-red-400">{errors.specialization.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="rounded-xl border bg-card p-5 shadow-sm animate-fade-in-up stagger-2">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10">
            <Mail className="h-4 w-4 text-teal-400" />
          </div>
          <h3 className="text-sm font-semibold">Contact Details</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Email Address <span className="text-red-400">*</span>
            </label>
            <Input
              type="email"
              {...register("email")}
              placeholder="doctor@hospital.com"
              className="h-10 bg-background/50"
            />
            {errors.email && (
              <p className="text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Phone Number
            </label>
            <Input
              {...register("phone")}
              placeholder="9876543210"
              className="h-10 bg-background/50"
            />
            {errors.phone && (
              <p className="text-xs text-red-400">{errors.phone.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Account Security */}
      <div className="rounded-xl border bg-card p-5 shadow-sm animate-fade-in-up stagger-3">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
            <Lock className="h-4 w-4 text-cyan-400" />
          </div>
          <h3 className="text-sm font-semibold">Account Security</h3>
        </div>

        <div className="max-w-sm space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Password {!isEdit && <span className="text-red-400">*</span>}
          </label>
          <Input
            type="password"
            {...register("password")}
            placeholder={isEdit ? "Leave blank to keep current" : "Enter password"}
            className="h-10 bg-background/50"
          />
          {errors.password && (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          )}
          {isEdit && (
            <p className="text-xs text-muted-foreground/60">
              Only fill if you want to change the password
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
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isEdit ? "Update Doctor" : "Create Doctor"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
