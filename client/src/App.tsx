import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import type { DemoMatchmaker } from "./features/auth/demo-credentials";
import { LoginPage } from "./features/auth/LoginPage";
import { AppShell } from "./components/layout/AppShell";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { CustomersPage } from "./features/customers/CustomersPage";
import { CustomerDetailPage } from "./features/customers/CustomerDetailPage";

export function App() {
  const [currentMatchmaker, setCurrentMatchmaker] = useState<DemoMatchmaker | null>(null);

  if (!currentMatchmaker) {
    return <LoginPage onLogin={(mm) => setCurrentMatchmaker(mm)} />;
  }

  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <AppShell
            matchmaker={currentMatchmaker}
            onLogout={() => setCurrentMatchmaker(null)}
            title="Matchmaker Dashboard"
            subtitle="Operational client queue and pairing status tracking"
          >
            <DashboardPage matchmaker={currentMatchmaker} />
          </AppShell>
        }
      />
      <Route
        path="/customers"
        element={
          <AppShell
            matchmaker={currentMatchmaker}
            onLogout={() => setCurrentMatchmaker(null)}
            title="Customer Directory"
            subtitle="Assigned clients, profile status, and pairing records"
          >
            <CustomersPage matchmaker={currentMatchmaker} />
          </AppShell>
        }
      />
      <Route
        path="/customers/:id"
        element={
          <AppShell
            matchmaker={currentMatchmaker}
            onLogout={() => setCurrentMatchmaker(null)}
            title="Customer Profile"
            subtitle="Detailed biodata, partner preferences, and pairing history"
          >
            <CustomerDetailPage matchmaker={currentMatchmaker} />
          </AppShell>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
