"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
registerSchema,
type RegisterFormData,
} from "@/lib/validations";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
Card,
CardContent,
CardDescription,
CardHeader,
CardTitle,
} from "@/components/ui/card";

import {
Field,
FieldDescription,
FieldGroup,
FieldLabel,
} from "@/components/ui/field";

export default function RegisterForm() {
const [loading, setLoading] = useState(false);
const router = useRouter();
const {
register,
handleSubmit,
reset,
formState: { errors },
} = useForm<RegisterFormData>({
resolver: zodResolver(registerSchema),
});

const onSubmit = async (data: RegisterFormData) => {
try {
setLoading(true);

const response = await fetch("/api/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
});

const result = await response.json();

if (!response.ok) {
  toast.error(
    result.message || "Failed to create account"
  );
  return;
}

toast.success(
  "Account created successfully 🎉"
);

reset();

setTimeout(() => {
  router.push("/login");
}, 1000);

} catch (error) {
console.error(error);

toast.error(
  "Something went wrong. Please try again."
);

} finally {
setLoading(false);
}
};

return ( <Card className="w-full max-w-md shadow-lg"> <CardHeader> <CardTitle>Create an account</CardTitle>


   <CardDescription>
  Enter your information below to create your account.
</CardDescription>

<FieldDescription className="mt-2 text-blue-600">
  Patient registration only. Doctors and administrators are created by the hospital administration.
</FieldDescription>
  </CardHeader>

  <CardContent>
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel>Full Name</FieldLabel>

          <Input
            placeholder="John Doe"
            autoComplete="name"
            {...register("name")}
          />

          {errors.name && (
            <FieldDescription className="text-red-500">
              {errors.name.message}
            </FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel>Email</FieldLabel>

          <Input
            type="email"
            placeholder="john@example.com"
            autoComplete="email"
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
    Mobile Number
  </FieldLabel>

  <Input
    {...register("phone")}
    placeholder="9876543210"
  />
</Field>

        <Field>
          <FieldLabel>Password</FieldLabel>

          <Input
            type="password"
            autoComplete="new-password"
            {...register("password")}
          />

          <FieldDescription>
            Must be at least 6 characters long.
          </FieldDescription>

          {errors.password && (
            <FieldDescription className="text-red-500">
              {errors.password.message}
            </FieldDescription>
          )}
        </Field>

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading
            ? "Creating Account..."
            : "Create Account"}
        </Button>

        {/* <Button
          type="button"
          variant="outline"
          className="w-full"
        >
          Continue with Google
        </Button> */}

        <FieldDescription className="text-center">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium underline"
          >
            Sign In
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  </CardContent>
</Card>

);
}
