"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/lib/api/register";
import { useApiForm } from "@/hooks/useApiForm";

export default function RegisterPage() {
  const router = useRouter();

  // Use the reusable API form hook
  const { values, errors, isLoading, handleChange, handleSubmit } = useApiForm({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async (formData) => {
      return await registerUser({
        full_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        role: "ADMIN",
      });
    },
    onSuccess: () => {
      setTimeout(() => router.push("/login"), 1000);
    },
    fieldMapping: {
      full_name: "firstName",
      email: "email",
      username: "username",
      password: "password",
      confirm_password: "confirmPassword",
      role: "role",
    },
    successMessage: "Account created successfully! Redirecting to login page...",
  });


  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground">FitQuotient</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Talent Intelligence Engine
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-12 mb-6">
          <div className="mb-12">
            <h1 className="text-2xl font-semibold text-card-foreground mb-3">
              Create your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Get started with FitQuotient today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First name
                </Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  className="mt-2"
                  value={values.firstName}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
                {errors.firstName && (
                  <p className="text-xs text-destructive mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  className="mt-2"
                  value={values.lastName}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
                {errors.lastName && (
                  <p className="text-xs text-destructive mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <Input
                id="username"
                placeholder="your-handle"
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
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="mt-2"
                value={values.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="mt-2"
                value={values.password}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-xs text-destructive mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="mt-2"
                value={values.confirmPassword}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Sign in link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-foreground hover:text-muted-foreground transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing up, you agree to our{" "}
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
