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
  },
  {
    id: "mm-003",
    username: "demo-matchmaker-3",
    displayName: "Kabir Sharma",
    password: "password123",
    role: "Matchmaker",
    email: "kabir.sharma@example.test"
  },
  {
    id: "mm-004",
    username: "demo-matchmaker-4",
    displayName: "Ananya Rao",
    password: "password123",
    role: "Matchmaker",
    email: "ananya.rao@example.test"
  },
  {
    id: "mm-005",
    username: "demo-matchmaker-5",
    displayName: "Vihaan Sethi",
    password: "password123",
    role: "Matchmaker",
    email: "vihaan.sethi@example.test"
  },
  {
    id: "mm-006",
    username: "demo-matchmaker-6",
    displayName: "Ishita Nair",
    password: "password123",
    role: "Matchmaker",
    email: "ishita.nair@example.test"
  }
] as const;

export const DEFAULT_DEMO_MATCHMAKER = DEMO_MATCHMAKERS[0];
