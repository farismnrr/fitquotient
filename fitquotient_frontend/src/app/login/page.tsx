"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/lib/api/login";
import { useApiForm } from "@/hooks/useApiForm";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { setAccessToken } = useAuthStore();

  // Use the reusable API form hook
  const { values, errors, isLoading, handleChange, handleSubmit } = useApiForm({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (formData) => {
      return await loginUser({
        username: formData.username,
        password: formData.password,
      });
    },
    onSuccess: (data) => {
      setAccessToken(data.access_token);
      router.push("/dashboard");
    },
    fieldMapping: {
      username: "username",
      password: "password",
    },
    successMessage: "User logged in successfully",
  });

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground">FitQuotient</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Talent Intelligence Engine
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-card-foreground mb-2">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <Input
                id="username"
                placeholder="your-username"
                className="mt-2"
                value={values.username}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-xs text-destructive mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Link
                  href="#"
                  className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="mt-0"
                value={values.password}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-xs text-destructive mt-1">{errors.password}</p>
              )}
            </div>

            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-foreground hover:text-muted-foreground transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in, you agree to our{" "}
          <Link href="#" className="hover:text-foreground underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="hover:text-foreground underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </main>
  );
}
