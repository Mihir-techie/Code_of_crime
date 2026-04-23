// Frontend-only data store backed by localStorage.
// Designed so a future Flask backend can swap each function for an API call.

export type Role = "admin" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // mock only — never do this with real backend
  role: Role;
  createdAt: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

export interface Evidence {
  id: string;
  type: "image" | "note" | "fingerprint";
  title: string;
  description: string;
  url?: string; // image URL
}

export interface CaseItem {
  id: string;
  title: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  summary: string;
  story: string;
  verdict: string;
  evidence: Evidence[];
  questions: Question[];
  createdAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  body: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number; // 0 = free
  thumbnail?: string;
  lessons: Lesson[];
  published: boolean;
  createdAt: string;
}

export interface ScoreRecord {
  id: string;
  userId: string;
  caseId: string;
  score: number; // %
  correct: number;
  total: number;
  takenAt: string;
}

export interface Purchase {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  status: "pending" | "paid";
  createdAt: string;
}

interface DB {
  users: User[];
  cases: CaseItem[];
  courses: Course[];
  scores: ScoreRecord[];
  purchases: Purchase[];
  sessionUserId: string | null;
}

const KEY = "coc.db.v1";

const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();

function seed(): DB {
  const adminId = "admin-1";
  const studentId = "student-1";
  return {
    users: [
      {
        id: adminId,
        name: "Chief Investigator",
        email: "admin@codeofcrime.io",
        password: "admin123",
        role: "admin",
        createdAt: now(),
      },
      {
        id: studentId,
        name: "Trainee Detective",
        email: "student@codeofcrime.io",
        password: "student123",
        role: "student",
        createdAt: now(),
      },
    ],
    cases: [
      {
        id: "case-1",
        title: "The Vault Heist",
        category: "Fingerprint",
        difficulty: "Easy",
        summary: "A bank vault was emptied overnight. Only one print remains.",
        story:
          "At 02:14 AM, the silent alarm at City Trust Bank tripped. Officers found the vault wide open, $4.2M missing, and a single latent fingerprint smudged on the dial. Three suspects were detained near the scene. Your job: identify the print pattern and pick the matching suspect.",
        verdict:
          "The print is a Whorl pattern. Suspect B's reference print matches — partial loop overlay confirmed.",
        evidence: [
          {
            id: uid(),
            type: "fingerprint",
            title: "Latent print from dial",
            description: "Lifted from the brass combination dial.",
          },
          {
            id: uid(),
            type: "note",
            title: "Witness statement",
            description: "Night guard saw a figure in dark coat exit the rear loading bay at 02:09 AM.",
          },
        ],
        questions: [
          {
            id: uid(),
            text: "What fingerprint pattern is shown on the dial?",
            options: ["Loop", "Whorl", "Arch", "Composite"],
            correctIndex: 1,
          },
          {
            id: uid(),
            text: "Which suspect should you prioritize?",
            options: ["Suspect A (Loop)", "Suspect B (Whorl)", "Suspect C (Arch)"],
            correctIndex: 1,
          },
          {
            id: uid(),
            text: "Best next investigative step?",
            options: [
              "Release all suspects",
              "Request CCTV from rear loading bay 02:00–02:15 AM",
              "Close the case",
            ],
            correctIndex: 1,
          },
        ],
        createdAt: now(),
      },
      {
        id: "case-2",
        title: "Midnight Hit-and-Run",
        category: "Blood Pattern",
        difficulty: "Medium",
        summary: "A pedestrian struck on Elm Street. Spatter tells the story.",
        story:
          "A jogger was struck by an SUV at 23:48. Tire marks suggest braking AFTER impact. Blood spatter on the windshield fragment is high-velocity, indicating speed > 60 km/h. The owner claims the car was parked all night.",
        verdict:
          "High-velocity spatter and post-impact braking contradict the owner's alibi. Vehicle was in motion at speed.",
        evidence: [
          { id: uid(), type: "note", title: "Skid marks", description: "12.4 m, post-impact." },
          { id: uid(), type: "note", title: "Spatter analysis", description: "High-velocity, fan distribution." },
        ],
        questions: [
          {
            id: uid(),
            text: "What does high-velocity spatter indicate?",
            options: ["Vehicle was stationary", "Impact at high speed", "Blunt-force assault only"],
            correctIndex: 1,
          },
          {
            id: uid(),
            text: "Skid marks beginning AFTER the body location suggest…",
            options: ["Driver braked before seeing victim", "Driver braked only after impact", "No braking occurred"],
            correctIndex: 1,
          },
        ],
        createdAt: now(),
      },
    ],
    courses: [
      {
        id: "course-1",
        title: "Forensic Fundamentals",
        description: "Crash-course in evidence handling, chain of custody, and lab basics.",
        price: 0,
        lessons: [
          { id: uid(), title: "Chain of custody", body: "Every piece of evidence must be logged from collection to court." },
          { id: uid(), title: "Contamination control", body: "Gloves, sealed bags, single-use tools." },
        ],
        published: true,
        createdAt: now(),
      },
      {
        id: "course-2",
        title: "Fingerprint Analysis",
        description: "Loops, whorls, arches, and the science of ridge detail.",
        price: 49,
        lessons: [
          { id: uid(), title: "Pattern types", body: "Loop, Whorl, Arch — and their sub-classes." },
          { id: uid(), title: "Minutiae matching", body: "Bifurcations, ridge endings, dots." },
        ],
        published: true,
        createdAt: now(),
      },
    ],
    scores: [],
    purchases: [],
    sessionUserId: null,
  };
}

function load(): DB {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const s = seed();
      localStorage.setItem(KEY, JSON.stringify(s));
      return s;
    }
    return JSON.parse(raw) as DB;
  } catch {
    const s = seed();
    localStorage.setItem(KEY, JSON.stringify(s));
    return s;
  }
}

function save(db: DB) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(db));
  // notify listeners
  window.dispatchEvent(new CustomEvent("coc:update"));
}

export const store = {
  get: load,
  reset() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(KEY);
    save(seed());
  },
  // Auth
  login(email: string, password: string): User | null {
    const db = load();
    const u = db.users.find((x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
    if (!u) return null;
    db.sessionUserId = u.id;
    save(db);
    return u;
  },
  register(name: string, email: string, password: string): User | null {
    const db = load();
    if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) return null;
    const u: User = { id: uid(), name, email, password, role: "student", createdAt: now() };
    db.users.push(u);
    db.sessionUserId = u.id;
    save(db);
    return u;
  },
  logout() {
    const db = load();
    db.sessionUserId = null;
    save(db);
  },
  currentUser(): User | null {
    const db = load();
    if (!db.sessionUserId) return null;
    return db.users.find((u) => u.id === db.sessionUserId) ?? null;
  },
  // Cases
  listCases() {
    return load().cases;
  },
  getCase(id: string) {
    return load().cases.find((c) => c.id === id) ?? null;
  },
  upsertCase(c: CaseItem) {
    const db = load();
    const i = db.cases.findIndex((x) => x.id === c.id);
    if (i >= 0) db.cases[i] = c;
    else db.cases.push(c);
    save(db);
  },
  deleteCase(id: string) {
    const db = load();
    db.cases = db.cases.filter((c) => c.id !== id);
    save(db);
  },
  // Courses
  listCourses() {
    return load().courses;
  },
  getCourse(id: string) {
    return load().courses.find((c) => c.id === id) ?? null;
  },
  upsertCourse(c: Course) {
    const db = load();
    const i = db.courses.findIndex((x) => x.id === c.id);
    if (i >= 0) db.courses[i] = c;
    else db.courses.push(c);
    save(db);
  },
  deleteCourse(id: string) {
    const db = load();
    db.courses = db.courses.filter((c) => c.id !== id);
    save(db);
  },
  // Scores
  recordScore(userId: string, caseId: string, correct: number, total: number) {
    const db = load();
    const score = Math.round((correct / total) * 100);
    const rec: ScoreRecord = { id: uid(), userId, caseId, correct, total, score, takenAt: now() };
    db.scores.push(rec);
    save(db);
    return rec;
  },
  scoresFor(userId: string) {
    return load().scores.filter((s) => s.userId === userId);
  },
  allScores() {
    return load().scores;
  },
  listUsers() {
    return load().users;
  },
  deleteUser(id: string) {
    const db = load();
    db.users = db.users.filter((u) => u.id !== id);
    save(db);
  },
  newId: uid,
  newDate: now,
};
