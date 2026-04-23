import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Activity } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) navigate({ to: "/login" });
  }, [user, navigate]);

  if (!user) return null;

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-5xl text-blood glow-blood">DETECTIVE HQ</h1>
            <p className="text-muted-foreground">Welcome back, {user.name}.</p>
          </div>
          <Badge variant="outline" className="border-evidence text-evidence uppercase tracking-widest">{user.role}</Badge>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <StatCard icon={<Activity className="h-5 w-5" />} label="Role" value={user.role.toUpperCase()} />
          <StatCard icon={<Trophy className="h-5 w-5" />} label="Email verified" value={user.is_email_verified ? "YES" : "PENDING"} />
          <StatCard icon={<Trophy className="h-5 w-5" />} label="Next step" value="Solve cases" />
        </div>

        <div className="mt-10">
          <h2 className="font-display text-3xl">Start investigation</h2>
          <Card className="mt-4 bg-card/60 border-border">
            <CardContent className="p-6">
              <p className="text-muted-foreground">Open cases, submit answers, and receive certificates when you pass.</p>
              <Link to="/cases">
                <Button className="mt-4 bg-gradient-blood shadow-blood">Browse Cases</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="bg-card/60 border-border">
      <CardContent className="p-5 flex items-center gap-4">
        <div className="h-12 w-12 rounded-lg bg-gradient-blood grid place-items-center shadow-blood text-primary-foreground">{icon}</div>
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-widest">{label}</div>
          <div className="font-display text-3xl">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}
