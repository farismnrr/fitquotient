import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import DashboardProvider from "@/components/dashboard/providers/DashboardProvider";

export const metadata: Metadata = {
  title: "Dashboard - FitQuotient",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <div>
        <Navbar />
        {children}
      </div>
    </DashboardProvider>
  );
}
