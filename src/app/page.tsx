import { Suspense } from "react";
import Dashboard from "@/components/Dashboard";

export const metadata = {
  title: "GLP-1 Tracker",
  description: "Acompanhamento de evolução corporal durante tratamento com GLP-1",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">GLP-1 Tracker</h1>
            <p className="text-sm text-gray-400">Evolução corporal — Bioimpedância</p>
          </div>
          <span className="rounded-full bg-emerald-900/40 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-emerald-700">
            Em tratamento
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <Suspense fallback={<DashboardSkeleton />}>
          <Dashboard />
        </Suspense>
      </div>
    </main>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-800" />
      ))}
    </div>
  );
}
