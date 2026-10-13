/**
 * Frontend-only hardcoded demo credentials.
 * 
 * NOTE: As specified in ARCHITECTURE.md and AGENTS.md, this is a frontend-only
 * demo gate for local testing with synthetic/fictional data. It is NOT real security
 * and must never be used with real customer data. No credentials are sent to Express.
 */

export interface DemoMatchmaker {
  id: string;
  username: string;
  displayName: string;
  password: string;
  role: "Matchmaker";
  email: string;
}

export const DEMO_MATCHMAKERS: readonly DemoMatchmaker[] = [
  {
    id: "mm-001",
    username: "demo-matchmaker-1",
    displayName: "Aarav Mehta",
    password: "password123",
    role: "Matchmaker",
    email: "aarav.mehta@example.test"
  },
  {
    id: "mm-002",
    username: "demo-matchmaker-2",
    displayName: "Mira Kapoor",
    password: "password123",
    role: "Matchmaker",
    email: "mira.kapoor@example.test"
  }
] as const;

export const DEFAULT_DEMO_MATCHMAKER = DEMO_MATCHMAKERS[0];
