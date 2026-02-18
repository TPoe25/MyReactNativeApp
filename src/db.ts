import { Platform } from "react-native";

export type User = { id: number; name: string; created_at: string };
export type ActivityKind = "strength" | "conditioning";

export type Activity = {
  id: number;
  user_id: number;
  kind: ActivityKind;
  title: string;

  sets: number | null;
  reps: number | null;
  weight: number | null;

  duration_minutes: number | null;
  distance_miles: number | null;

  notes: string | null;
  created_at: string;
};

let db: any = null;

// WEB fallback (in-memory)
let webUsers: User[] = [];
let webActivities: Activity[] = [];
let webUserId = 1;
let webActivityId = 1;

function isWeb() {
  return Platform.OS === "web";
}

export function initDb() {
  if (isWeb()) return;
  if (db) return;

  // Prevent Metro from bundling expo-sqlite for web:
  const SQLite = eval("require")("expo-sqlite");
  db = SQLite.openDatabaseSync("sports_tracker.db");

  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      kind TEXT NOT NULL CHECK(kind IN ('strength','conditioning')),
      title TEXT NOT NULL,

      sets INTEGER,
      reps INTEGER,
      weight REAL,

      duration_minutes INTEGER,
      distance_miles REAL,

      notes TEXT,
      created_at TEXT NOT NULL
    );
  `);
}

/* ---------------- USERS ---------------- */

export function getUsers(): User[] {
  if (isWeb()) return [...webUsers].sort((a, b) => b.id - a.id);
  initDb();
  return db.getAllSync<User>(`SELECT * FROM users ORDER BY id DESC;`);
}

export function addUser(name: string) {
  const n = name.trim();
  if (!n) return;

  if (isWeb()) {
    webUsers.push({ id: webUserId++, name: n, created_at: new Date().toISOString() });
    return;
  }

  initDb();
  db.runSync(`INSERT INTO users (name, created_at) VALUES (?, datetime('now'));`, [n]);
}

export function deleteUser(userId: number) {
  if (isWeb()) {
    webActivities = webActivities.filter((a) => a.user_id !== userId);
    webUsers = webUsers.filter((u) => u.id !== userId);
    return;
  }

  initDb();
  db.runSync(`DELETE FROM activities WHERE user_id = ?;`, [userId]);
  db.runSync(`DELETE FROM users WHERE id = ?;`, [userId]);
}

/* -------------- ACTIVITIES -------------- */

export function getActivitiesForUser(userId: number): Activity[] {
  if (isWeb()) {
    return webActivities
      .filter((a) => a.user_id === userId)
      .sort((a, b) => b.id - a.id);
  }

  initDb();
  return db.getAllSync<Activity>(
    `SELECT * FROM activities WHERE user_id = ? ORDER BY id DESC;`,
    [userId]
  );
}

export function addStrengthActivity(args: {
  userId: number;
  title: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}) {
  const title = args.title.trim();
  if (!title) return;

  if (isWeb()) {
    webActivities.push({
      id: webActivityId++,
      user_id: args.userId,
      kind: "strength",
      title,
      sets: args.sets,
      reps: args.reps,
      weight: typeof args.weight === "number" ? args.weight : null,
      duration_minutes: null,
      distance_miles: null,
      notes: args.notes?.trim() || null,
      created_at: new Date().toISOString(),
    });
    return;
  }

  initDb();
  db.runSync(
    `INSERT INTO activities (
      user_id, kind, title, sets, reps, weight, duration_minutes, distance_miles, notes, created_at
    ) VALUES (?, 'strength', ?, ?, ?, ?, NULL, NULL, ?, datetime('now'));`,
    [
      args.userId,
      title,
      args.sets,
      args.reps,
      typeof args.weight === "number" ? args.weight : null,
      args.notes?.trim() || null,
    ]
  );
}

export function addConditioningActivity(args: {
  userId: number;
  title: string;
  durationMinutes: number;
  distanceMiles?: number;
  notes?: string;
}) {
  const title = args.title.trim();
  if (!title) return;

  if (isWeb()) {
    webActivities.push({
      id: webActivityId++,
      user_id: args.userId,
      kind: "conditioning",
      title,
      sets: null,
      reps: null,
      weight: null,
      duration_minutes: args.durationMinutes,
      distance_miles: typeof args.distanceMiles === "number" ? args.distanceMiles : null,
      notes: args.notes?.trim() || null,
      created_at: new Date().toISOString(),
    });
    return;
  }

  initDb();
  db.runSync(
    `INSERT INTO activities (
      user_id, kind, title, sets, reps, weight, duration_minutes, distance_miles, notes, created_at
    ) VALUES (?, 'conditioning', ?, NULL, NULL, NULL, ?, ?, ?, datetime('now'));`,
    [
      args.userId,
      title,
      args.durationMinutes,
      typeof args.distanceMiles === "number" ? args.distanceMiles : null,
      args.notes?.trim() || null,
    ]
  );
}

export function deleteActivity(activityId: number) {
  if (isWeb()) {
    webActivities = webActivities.filter((a) => a.id !== activityId);
    return;
  }

  initDb();
  db.runSync(`DELETE FROM activities WHERE id = ?;`, [activityId]);
}

export function deleteAllActivitiesForUser(userId: number) {
  if (isWeb()) {
    webActivities = webActivities.filter((a) => a.user_id !== userId);
    return;
  }

  initDb();
  db.runSync(`DELETE FROM activities WHERE user_id = ?;`, [userId]);
}
