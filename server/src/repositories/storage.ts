import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { CustomerRecord, MatchRecord, MatchmakerRecord } from "../../../shared/contracts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root is two levels up from server/src/repositories
const ROOT_DIR = path.resolve(__dirname, "../../..");
const DATA_DIR = path.join(ROOT_DIR, "server/data");
const DUMMY_SEED_FILE = path.join(ROOT_DIR, "tdc_matchmaker_dummy_data.json");

const CUSTOMERS_FILE = path.join(DATA_DIR, "customers.json");
const MATCHES_FILE = path.join(DATA_DIR, "matches.json");
const MATCHMAKERS_FILE = path.join(DATA_DIR, "matchmakers.json");

/**
 * Safely writes data to a temporary file first, then atomically renames it.
 * This guarantees that files are never left in a truncated or corrupted state.
 */
export async function atomicWriteJson<T>(filePath: string, data: T): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.tmp.${Date.now()}.${Math.random().toString(36).slice(2, 8)}`;
  const content = JSON.stringify(data, null, 2);

  await fs.writeFile(tempPath, content, "utf-8");
  await fs.rename(tempPath, filePath);
}

/**
 * Initializes server/data/ files from tdc_matchmaker_dummy_data.json if they do not yet exist.
 */
export async function initializeDataStore(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });

  let seedData: {
    matchmakers: MatchmakerRecord[];
    customers: CustomerRecord[];
    matches: MatchRecord[];
  } | null = null;

  try {
    const rawSeed = await fs.readFile(DUMMY_SEED_FILE, "utf-8");
    seedData = JSON.parse(rawSeed);
  } catch (err) {
    console.error("[Storage] Could not read seed file:", err);
  }

  // Ensure matchmakers.json
  try {
    await fs.access(MATCHMAKERS_FILE);
  } catch {
    const matchmakers = seedData?.matchmakers ?? [];
    await atomicWriteJson(MATCHMAKERS_FILE, matchmakers);
  }

  // Ensure customers.json
  try {
    await fs.access(CUSTOMERS_FILE);
  } catch {
    const customers = seedData?.customers ?? [];
    await atomicWriteJson(CUSTOMERS_FILE, customers);
  }

  // Ensure matches.json
  try {
    await fs.access(MATCHES_FILE);
  } catch {
    const matches = seedData?.matches ?? [];
    await atomicWriteJson(MATCHES_FILE, matches);
  }
}

export async function readCustomers(): Promise<CustomerRecord[]> {
  await initializeDataStore();
  const raw = await fs.readFile(CUSTOMERS_FILE, "utf-8");
  return JSON.parse(raw);
}

export async function writeCustomers(customers: CustomerRecord[]): Promise<void> {
  await atomicWriteJson(CUSTOMERS_FILE, customers);
}

export async function readMatches(): Promise<MatchRecord[]> {
  await initializeDataStore();
  const raw = await fs.readFile(MATCHES_FILE, "utf-8");
  return JSON.parse(raw);
}

export async function writeMatches(matches: MatchRecord[]): Promise<void> {
  await atomicWriteJson(MATCHES_FILE, matches);
}

export async function readMatchmakers(): Promise<MatchmakerRecord[]> {
  await initializeDataStore();
  const raw = await fs.readFile(MATCHMAKERS_FILE, "utf-8");
  return JSON.parse(raw);
}
