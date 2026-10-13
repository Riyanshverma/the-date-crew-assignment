import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import type { DemoMatchmaker } from "./features/auth/demo-credentials";
import { LoginPage } from "./features/auth/LoginPage";
import { AppShell } from "./components/layout/AppShell";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { CustomersPage } from "./features/customers/CustomersPage";

export function App() {
  const [currentMatchmaker, setCurrentMatchmaker] = useState<DemoMatchmaker | null>(null);

  if (!currentMatchmaker) {
    return <LoginPage onLogin={(mm) => setCurrentMatchmaker(mm)} />;
  }

  return (
    <AppShell
      matchmaker={currentMatchmaker}
      onLogout={() => setCurrentMatchmaker(null)}
      title="Matchmaker Dashboard"
      subtitle="Operational client queue and pairing status tracking"
    >
      <Routes>
        <Route path="/dashboard" element={<DashboardPage matchmaker={currentMatchmaker} />} />
        <Route path="/customers" element={<CustomersPage matchmaker={currentMatchmaker} />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppShell>
  );
}
