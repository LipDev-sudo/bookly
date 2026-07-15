import type { Metadata } from "next";
import { DemoDashboard } from "@/components/demo-dashboard";

export const metadata: Metadata = {
  title: "Interactive demo | Bookly",
  description: "Explore Bookly with fictional local data and no account or credentials.",
};

export default function DemoPage() {
  return <DemoDashboard />;
}
