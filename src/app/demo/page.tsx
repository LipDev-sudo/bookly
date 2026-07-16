import type { Metadata } from "next";
import { DemoDashboard } from "@/components/demo/demo-dashboard";

export const metadata: Metadata = {
  title: "Demonstração interativa",
  description:
    "Explore a Horavia com dados fictícios locais, sem cadastro ou credenciais externas.",
  alternates: { canonical: "/demo" },
};

export default function DemoPage() {
  return <DemoDashboard />;
}
