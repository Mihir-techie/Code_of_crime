import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErr("");
    setOk("");
    if (password.length < 6) {
      setLoading(false);
      return setErr("Password must be at least 6 characters.");
    }
    const result = await register(name.trim(), email.trim(), password);
    if (result.ok) {
      setOk("Registered successfully. Check your email for verification, then login.");
      setTimeout(() => navigate({ to: "/login" }), 1000);
    } else {
      setErr(result.message || "Registration failed");
    }
    setLoading(false);
  }

  return (
    <Layout>
      <section className="mx-auto max-w-md px-4 py-16">
        <Card className="bg-card/70 border-border shadow-noir">
          <CardContent className="p-8">
            <ShieldCheck className="h-10 w-10 text-evidence mx-auto" />
            <h1 className="font-display text-4xl text-center mt-3">Join the Force</h1>
            <p className="text-center text-sm text-muted-foreground">Become a Code of Crime investigator</p>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <Label>Name</Label>
                <Input required value={name} onChange={(e) => setName(e.target.value)} maxLength={60} className="mt-1" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" />
              </div>
              {err && <p className="text-sm text-blood">{err}</p>}
              {ok && <p className="text-sm text-green-500">{ok}</p>}
              <Button type="submit" disabled={loading} className="w-full bg-gradient-blood shadow-blood">
                {loading ? "Creating..." : "Create badge"}
              </Button>
            </form>

            <p className="mt-4 text-sm text-center text-muted-foreground">
              Already enlisted? <Link to="/login" className="text-evidence underline">Login</Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
}
