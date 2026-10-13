import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext";
import { RequireAuth, RedirectIfAuth } from "./features/auth/AuthGuard";
import { LoginPage } from "./features/auth/LoginPage";
import { AppShell } from "./components/layout/AppShell";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { CustomersPage } from "./features/customers/CustomersPage";

export function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public login route with redirect if already authenticated */}
        <Route
          path="/login"
          element={
            <RedirectIfAuth>
              <LoginPage />
            </RedirectIfAuth>
          }
        />

        {/* Protected Dashboard route */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <AppShell
                title="Matchmaker Dashboard"
                subtitle="Operational client queue and pairing status tracking"
              >
                <DashboardPage />
              </AppShell>
            </RequireAuth>
          }
        />

        {/* Protected Customer Directory route */}
        <Route
          path="/customers"
          element={
            <RequireAuth>
              <AppShell
                title="Customer Directory"
                subtitle="Assigned clients, profile status, and pairing records"
              >
                <CustomersPage />
              </AppShell>
            </RequireAuth>
          }
        />

        {/* Default route redirect to /dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
