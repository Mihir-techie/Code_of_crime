import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, type ApiUser } from "./api";

interface AuthCtx {
  user: ApiUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; message: string }>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);

  useEffect(() => {
    if (!api.getToken()) return;
    api.me().then(setUser).catch(() => {
      api.clearToken();
      setUser(null);
    });
  }, []);

  const value: AuthCtx = {
    user,
    login: async (email, password) => {
      try {
        const res = await api.login(email, password);
        api.setToken(res.token);
        setUser(res.user);
        return true;
      } catch {
        return false;
      }
    },
    register: async (name, email, password) => {
      try {
        const res = await api.register(name, email, password);
        return { ok: true, message: res.message };
      } catch (error) {
        const message = error instanceof Error ? error.message : "Registration failed";
        return { ok: false, message };
      }
    },
    logout: () => {
      api.clearToken();
      setUser(null);
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be inside AuthProvider");
  return c;
}
