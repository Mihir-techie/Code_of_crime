import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Fingerprint } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErr("");
    const ok = await login(email.trim(), password);
    if (ok) {
      navigate({ to: "/dashboard" });
    } else {
      setErr("Invalid credentials or backend not running.");
    }
    setLoading(false);
  }

  return (
    <Layout>
      <section className="mx-auto max-w-md px-4 py-16">
        <Card className="bg-card/70 border-border shadow-noir">
          <CardContent className="p-8">
            <Fingerprint className="h-10 w-10 text-blood mx-auto" />
            <h1 className="font-display text-4xl text-center mt-3">Sign In</h1>
            <p className="text-center text-sm text-muted-foreground">Access your investigator profile</p>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <Label>Email</Label>
                <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" />
              </div>
              {err && <p className="text-sm text-blood">{err}</p>}
              <Button type="submit" disabled={loading} className="w-full bg-gradient-blood shadow-blood">
                {loading ? "Signing in..." : "Enter HQ"}
              </Button>
            </form>

            <p className="mt-4 text-sm text-center text-muted-foreground">
              No account? <Link to="/register" className="text-evidence underline">Register</Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
}
