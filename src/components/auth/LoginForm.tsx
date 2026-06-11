"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

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

export function LoginForm({
className,
...props
}: React.ComponentProps<"div">) {
const router = useRouter();

const [loading, setLoading] = useState(false);

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleLogin = async (
e: React.FormEvent<HTMLFormElement>
) => {
e.preventDefault();


try {
  setLoading(true);

  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (result?.error) {
    toast.error("Invalid email or password");
    return;
  }

  toast.success("Login successful");

  router.push("/dashboard");
  router.refresh();
} catch (error) {
  console.error(error);

  toast.error("Something went wrong");
} finally {
  setLoading(false);
}


};

return (
<div
className={cn("flex flex-col gap-6", className)}
    {...props}
    

  >
    
    <Card>
      
      
      <CardHeader> <CardTitle>
Login to your account </CardTitle>


      <CardDescription>
  Login using your Patient, Doctor, or Administrator account.
</CardDescription>
    </CardHeader>

    <CardContent>
      <form onSubmit={handleLogin}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">
              Email
            </FieldLabel>

            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              autoComplete="email"
              disabled={loading}
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </Field>

          <Field>
            <div className="flex items-center">
              <FieldLabel htmlFor="password">
                Password
              </FieldLabel>

              {/* <Link
                href="/forgot-password"
                className="ml-auto text-sm hover:underline"
              >
                Forgot Password?
              </Link> */}
            </div>

            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              disabled={loading}
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </Field>

          <Field>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Signing In..."
                : "Login"}
            </Button>

            {/* <Button
              variant="outline"
              type="button"
              className="w-full"
              disabled={loading}
            >
              Login with Google
            </Button> */}

            <FieldDescription className="text-center">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-medium underline"
              >
                Sign up
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </CardContent>
  </Card>
</div>


);
}
