import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 text-slate-900 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">FitQuotient</h2>
          <p className="text-sm text-slate-500 mt-1">
            Talent Intelligence Engine
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 mb-6">
          <div className="mb-12">
            <h1 className="text-2xl font-semibold text-slate-900 mb-3">
              Create your account
            </h1>
            <p className="text-sm text-slate-600">
              Get started with FitQuotient today
            </p>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First name
                </Label>
                <Input id="firstName" placeholder="John" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last name
                </Label>
                <Input id="lastName" placeholder="Doe" className="mt-2" />
              </div>
            </div>

            <div>
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <Input id="username" placeholder="your-handle" className="mt-2" />
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
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone <span className="text-slate-400">(optional)</span>
              </Label>
              <Input
                id="phone"
                placeholder="+62 812 3456 7890"
                className="mt-2"
              />
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
              />
            </div>

            <div>
              <Label htmlFor="confirm" className="text-sm font-medium">
                Confirm password
              </Label>
              <Input
                id="confirm"
                type="password"
                placeholder="••••••••"
                className="mt-2"
              />
            </div>

            <Button className="w-full">Create account</Button>
          </form>

          {/* Divider */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">Or</span>
            </div>
          </div>

          {/* Sign in link */}
          <p className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-slate-900 hover:text-slate-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          By signing up, you agree to our{" "}
          <Link href="#" className="hover:text-slate-700 underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="hover:text-slate-700 underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </main>
  );
}
