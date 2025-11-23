import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import DashboardProvider from "@/components/dashboard/DashboardProvider";

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
