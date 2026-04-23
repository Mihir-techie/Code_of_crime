const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  is_email_verified: boolean;
}

export interface ApiCaseQuestion {
  id: number;
  case_id: number;
  prompt: string;
  options_json: string;
  explanation?: string;
}

export interface ApiCase {
  id: number;
  title: string;
  slug: string;
  story: string;
  evidence: string;
  final_verdict_question?: string;
  is_paid: boolean;
  price_inr: number;
  is_published: boolean;
  unlocked?: boolean;
  questions?: ApiCaseQuestion[];
}

export interface ApiCourse {
  id: number;
  title: string;
  description: string;
  video_url?: string;
  notes?: string;
  is_paid: boolean;
  price_inr: number;
  is_published: boolean;
  unlocked?: boolean;
}

function authHeaders() {
  const token = localStorage.getItem("coc.token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
      ...authHeaders(),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data as T;
}

export const api = {
  baseUrl: API_BASE,
  setToken(token: string) {
    localStorage.setItem("coc.token", token);
  },
  clearToken() {
    localStorage.removeItem("coc.token");
  },
  getToken() {
    return localStorage.getItem("coc.token");
  },
  register(name: string, email: string, password: string) {
    return request<{ message: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },
  login(email: string, password: string) {
    return request<{ token: string; user: ApiUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  me() {
    return request<ApiUser>("/auth/me");
  },
  verifyEmail(token: string) {
    return request<{ message: string }>(`/auth/verify-email?token=${encodeURIComponent(token)}`);
  },
  listCases() {
    return request<ApiCase[]>("/cases");
  },
  getCase(caseId: string | number) {
    return request<ApiCase>(`/cases/${caseId}`);
  },
  submitCase(caseId: string | number, answers: Record<string, string>) {
    return request<{
      score: number;
      correct_answers: number;
      total_questions: number;
      passed: boolean;
      certificate?: { download_url: string; verification_code: string };
    }>(`/cases/${caseId}/submit`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    });
  },
  rateCase(caseId: string | number, rating: number, feedback: string) {
    return request<{ message: string }>(`/cases/${caseId}/rate`, {
      method: "POST",
      body: JSON.stringify({ rating, feedback }),
    });
  },
  listCourses() {
    return request<ApiCourse[]>("/cases/courses");
  },
  seed() {
    return request<{ message: string }>("/admin/seed", { method: "POST" });
  },
  createCase(payload: {
    title: string;
    slug: string;
    story: string;
    evidence: string;
    final_verdict_question?: string;
    is_paid: boolean;
    price_inr: number;
    is_published: boolean;
    questions?: { prompt: string; options: string[]; correct_answer: string; explanation?: string }[];
  }) {
    return request<ApiCase>("/admin/cases", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  addQuestion(
    caseId: number,
    payload: { prompt: string; options: string[]; correct_answer: string; explanation?: string },
  ) {
    return request<{ id: number }>(`/admin/cases/${caseId}/questions`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  createCourse(payload: {
    title: string;
    description: string;
    video_url?: string;
    notes?: string;
    is_paid: boolean;
    price_inr: number;
    is_published: boolean;
  }) {
    return request<ApiCourse>("/admin/courses", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async uploadVideo(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    
    const token = localStorage.getItem("coc.token");
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/admin/upload-video`, {
      method: "POST",
      headers,
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || "Upload failed");
    return data as { url: string };
  },
};
